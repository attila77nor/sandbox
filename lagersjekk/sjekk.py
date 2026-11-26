#!/usr/bin/env python3
"""Lagersjekk for SkatePro.

Henter produktsiden for Ethic Pandemonium V2 Sparkesykkel Deck og leser
lagerstatus per variant fra dataene siden har i sitt script (php2js).
Skriver status.txt og status.json til mappen som er gitt som argument.

Skriptet avslutter alltid med kode 0, slik at arbeidsflyten lagrer status
også når noe feiler. Feil står i filene.
"""

import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

PRODUCT_NAME = "Ethic Pandemonium V2 Sparkesykkel Deck"
PRODUCT_URL = "https://www.skatepro.no/243-50650.htm"
CODES = ["ETHDEC-PA/V2/460/CHB", "ETHDEC-PA/V2/500/CHB"]
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/131.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "nb-NO,nb;q=0.9,no;q=0.8,en;q=0.5",
}

# En JSON-verdi: streng, null, true, false eller tall.
VALUE = r'("(?:[^"\\]|\\.)*"|null|true|false|-?\d+(?:\.\d+)?)'
STOCK_CODE = re.compile(r'"stock_code"\s*:')


def field(html, name, start, end):
    """Første "name":<verdi> mellom start og end, eller None."""
    m = re.compile(r'"%s"\s*:\s*%s' % (re.escape(name), VALUE)).search(html, start, end)
    if not m:
        return None
    try:
        value = json.loads(m.group(1))
    except ValueError:
        return m.group(1)
    return "" if value is None else str(value)


def find_variant(html, code):
    """Lagerstatus for én variant fra php2js-dataene, eller None."""
    code_re = re.escape(code).replace("/", r"\\?/")
    for m in re.finditer(r'"stock_code"\s*:\s*"%s"' % code_re, html):
        i = m.end()
        nxt = STOCK_CODE.search(html, i)
        end = nxt.start() if nxt else min(len(html), i + 20000)
        status = field(html, "text_postfix", i, end)
        if status is None:
            continue
        t = html.rfind('"text"', max(0, m.start() - 2000), m.start())
        text = field(html, "text", t, m.start()) if t >= 0 else None
        return {
            "code": code,
            "variant": text or code,
            "status": " ".join(status.split()),
            "level": field(html, "stock_level", i, end) or "",
            "amount": field(html, "stock_level_amount", i, end) or "",
        }
    return None


def schema_availability(html, code):
    """Tilgjengelighet fra sidens schema.org-data (JSON-LD), eller ''."""
    code_re = re.escape(code).replace("/", r"\\?/")
    m = re.search(r'"mpn"\s*:\s*"%s"' % code_re, html)
    if m:
        value = field(html, "availability", m.end(), m.end() + 4000)
        if value:
            return value.rstrip("/").rsplit("/", 1)[-1]
    return ""


def buyable(v):
    return v["level"] == "green" or v["status"].lower().startswith("på lager")


def check():
    now = datetime.now(timezone.utc)
    result = {
        "product": PRODUCT_NAME,
        "url": PRODUCT_URL,
        "checked_utc": now.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "checked_oslo": now.astimezone(ZoneInfo("Europe/Oslo")).strftime("%Y-%m-%d %H:%M"),
        "ok": False,
        "error": "",
        "variants": [],
        "buyable_now": [],
    }
    try:
        req = urllib.request.Request(f"{PRODUCT_URL}?stockcode={CODES[0]}", headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as r:
            charset = r.headers.get_content_charset() or "utf-8"
            html = r.read().decode(charset, "replace")
    except Exception as e:  # noqa: BLE001 – alle feil skal havne i statusfilen
        result["error"] = f"Kunne ikke hente siden: {e}"
        return result

    missing = []
    for code in CODES:
        v = find_variant(html, code)
        if v is None:
            missing.append(code)
            continue
        v["schema"] = schema_availability(html, code)
        v["buyable"] = buyable(v)
        result["variants"].append(v)
        if v["buyable"]:
            result["buyable_now"].append(v["variant"])

    if missing:
        result["error"] = (
            "Fant ikke disse variantene på siden: " + ", ".join(missing)
            + ". Siden kan ha endret oppbygning."
        )
    result["ok"] = not missing
    return result


def as_text(result):
    lines = [
        f"Lagerstatus SkatePro – {result['product']}",
        f"Sjekket: {result['checked_oslo']} (Oslo-tid)",
    ]
    for v in result["variants"]:
        amount = f" {v['amount']}" if v["amount"] else ""
        schema = f", schema.org: {v['schema']}" if v["schema"] else ""
        lines.append(f"{v['variant']}: {v['status']}{amount} (nivå: {v['level'] or 'ukjent'}{schema})")
    if result["error"]:
        lines.append(f"FEIL: {result['error']}")
    if result["buyable_now"]:
        lines.append("Kan kjøpes nå: " + ", ".join(result["buyable_now"]))
    elif result["variants"]:
        lines.append("Kan kjøpes nå: ingen av variantene")
    return "\n".join(lines) + "\n"


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    os.makedirs(out, exist_ok=True)
    result = check()
    with open(os.path.join(out, "status.json"), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        f.write("\n")
    text = as_text(result)
    with open(os.path.join(out, "status.txt"), "w", encoding="utf-8") as f:
        f.write(text)
    print(text, end="")


if __name__ == "__main__":
    main()
