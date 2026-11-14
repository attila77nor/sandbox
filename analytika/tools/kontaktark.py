#!/usr/bin/env python3
"""Contact sheets of every page and sketch made so far (concepts/utsnitt/kontaktark-*.jpg).

Reads the thumbnails of the overview (concepts/thumbs/, made by oversikt-thumbs.cjs) and lays them out
numbered, grouped, small. Families of near-identical variants (the same page with another title or another
picture) are shown by a few examples only; SKIPPED says which are left out and why.
Run: python3 tools/kontaktark.py   (needs Pillow)"""
import json
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
TH = os.path.join(ROOT, 'concepts/thumbs')
OUT = os.path.join(ROOT, 'concepts/utsnitt')
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FONTB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
concepts = json.load(open(os.path.join(TH, 'concepts.json')))
fav = {(f, c['i']) for f, l in concepts.items() for c in l if c.get('fav')}

# (thumbnail id, label, note) in the order they are shown; a sheet is a (title, [entries])
SHEETS = [
    ('Forsider 1 av 2: de nyeste (runde 6 til 11)', [
        ('forside-sort', 'Studio: stort merke, to ord', 'r11'),
        ('forside-kort', 'Kortstokken: tre ord, spiller', 'r11'),
        ('forside-rutenett', 'Rutenettet: fem blå ruter', 'r11'),
        ('forside-papir', 'Papir: presset inn og hevet ut', 'r10'),
        ('forside-studio', 'Studio: kontoret bak slør, lysspill', 'r9'),
        ('forside-pixel', 'Pikselsiden: aktuargraf', 'r8'),
        ('forside-korridor-bilde', 'Hallen med bildet ditt, full skjerm', 'r7'),
        ('forside-korridor', 'Hallen (tegnet), gruppen', 'r7 tidligere'),
        ('forside-tittel-logotype', 'A Logotypen over hele bredden', 'r6'),
        ('forside-tittel-logo', 'C Bare logoen, liten', 'r6'),
        ('forside-tittel-vindu-midt', 'E Ordet som vindu åpner seg', 'r6 (midt i åpningen)'),
        ('forside-vindu-skroll', 'F Vinduet følger scroll', 'r6'),
    ]),
    ('Forsider 2 av 2: eldre (runde 1 til 5)', [
        ('forside-utsnitt-arbeidsbord', 'Arbeidsbord 1,2×', 'r5'),
        ('forside-utsnitt-spisebord', 'Spisebordet 1,4× i fokus', 'r5'),
        ('forside-liv-skilt', 'Tittel som skilt over tavlene', 'r4'),
        ('forside-liv-venstre', 'Tittel nede til venstre', 'r4'),
        ('forside-rom', 'Rommet med tavler', 'r3 valgt'),
        ('forside-ekte', 'Det virkelige kontoret', 'r3'),
        ('forside-kontor', 'Kontoret', 'r3 avvist'),
        ('vegg-hvit', 'Vegg, hvit', 'r2'),
        ('vegg-marine', 'Vegg, marine', 'r2'),
        ('oslo', 'Oslo-lys', 'r1'),
        ('tabell', 'Tabell', 'r1'),
        ('trekant', 'Trekanten', 'r1'),
        ('tetthet', 'Tetthet', 'r1'),
        ('old-landing', 'Skisse med fjell', 'tidligere'),
    ]),
    ('Tidlige designretninger og designtyper', [
        ('index5-0', '1 Policy', 'fem retninger'), ('index5-1', '2 Dossier', 'fem retninger'), ('index5-2', '3 Paper', 'fem retninger'),
        ('index5-3', '4 Contour', 'fem retninger'), ('index5-4', '5 Statements', 'fem retninger'),
        ('variants-0', 'A Natt', 'seks typer'), ('variants-1', 'B Dyp blå, tung', 'seks typer'), ('variants-2', 'C Brun, lag', 'seks typer'),
        ('variants-3', 'D Fotoserif', 'seks typer'), ('variants-4', 'E Fargeblokker', 'seks typer'), ('variants-5', 'F Lys kaskade', 'seks typer'),
        ('vision-0', 'Visjon A: forsiden med foto', 'visjon'), ('vision-2', 'Visjon C: dørene lenger ned', 'visjon'), ('vision-3', 'Visjon D: mobil', 'visjon'),
        ('photo-0', 'Galton-brettet', 'fotokonsept'), ('photo-1', 'Lys på fjorden', 'fotokonsept'),
        ('lib-index', 'Biblioteksvegg med fem tavler', 'tidligere'),
    ]),
    ('People', [
        ('oslo-people', 'People i Oslo-lys', 'r1'), ('tabell-people', 'People i Tabell', 'r1'),
        ('trekant-people', 'People i Trekanten', 'r1'), ('tetthet-people', 'People i Tetthet', 'r1'),
        ('people1-0', 'Spørsmålene', 'fire strukturer'), ('people1-1', 'Prosa', 'fire strukturer'),
        ('people1-2', 'Kontaktark', 'fire strukturer'), ('people1-3', 'Klyngen', 'fire strukturer'),
        ('people2-0', 'Litteraturlisten', 'ny runde'), ('people2-1', 'I egne ord', 'ny runde'), ('people2-2', 'Ankomstlinjen', 'ny runde'),
        ('site-people', 'People, siste versjon', 'siden'),
    ]),
    ('About us, Insights, Products og selve siden', [
        ('about1-0', 'Grunnleggingslinjen', 'About'), ('about1-1', 'Brevet', 'About'), ('about1-2', 'Faktaarket', 'About'),
        ('about2-0', 'Fortalen', 'About'), ('about2-1', 'Tesene', 'About'), ('about2-2', 'Veggteksten', 'About'),
        ('site-about', 'About us, siste versjon', 'siden'),
        ('site-insights', 'Insights, siste versjon', 'siden'), ('site-insights-actuary-risk', 'Risk actuary (underside)', 'siden'),
        ('site-products', 'Products, siste versjon', 'siden'),
        ('h1-index', 'Forside, versjon 1', 'siden'), ('h4-index', 'Forside, versjon 4', 'siden'), ('site-index', 'Forside, siste versjon', 'siden'),
        ('forside-fokus', 'Tittelen som skilt (første forsøk)', 'avvist'),
        ('taste-1', 'Taste 1: det stille instrumentet', 'avvist'), ('taste-3', 'Taste 3: det trykte årsskriftet', 'avvist'),
    ]),
]
SKIPPED = ('r6 B (serif) og D (liten serif): samme side som A og C med annen skrift. r5 og r4: flere utsnitt og titler av samme side. r3: samme oppsett med andre bilder. '
           'r2 Vegg, zoom. Visjon B. Forside-versjon 2 og 3 (nesten lik 1 og 4). Eldre versjoner av People, Insights, Products og About. Tre underområder under Actuary.')

COLS, TW, TH_, GAP, PAD = 4, 420, 262, 16, 22
LAB = 40
ff, fb = ImageFont.truetype(FONT, 13), ImageFont.truetype(FONTB, 13)
fh = ImageFont.truetype(FONTB, 20)
BG, INK, MUTE = (246, 247, 249), (20, 24, 40), (110, 118, 138)

n = 0
paths = []
for si, (title, entries) in enumerate(SHEETS, 1):
    rows = (len(entries) + COLS - 1) // COLS
    W = PAD * 2 + COLS * TW + (COLS - 1) * GAP
    H = PAD + 34 + rows * (TH_ + LAB + GAP) + 6
    sh = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(sh)
    d.text((PAD, PAD - 4), title, fill=INK, font=fh)
    for k, (tid, label, note) in enumerate(entries):
        n += 1
        r, c = divmod(k, COLS)
        x = PAD + c * (TW + GAP)
        y = PAD + 34 + r * (TH_ + LAB + GAP)
        p = os.path.join(TH, tid + '.jpg')
        if not os.path.exists(p):
            raise SystemExit('missing thumbnail ' + p)
        im = Image.open(p).convert('RGB')
        s = min(TW / im.size[0], TH_ / im.size[1])
        im = im.resize((max(1, round(im.size[0] * s)), max(1, round(im.size[1] * s))), Image.LANCZOS)
        d.rectangle([x, y, x + TW, y + TH_], fill=(228, 231, 237))
        sh.paste(im, (x + (TW - im.size[0]) // 2, y + (TH_ - im.size[1]) // 2))
        d.rectangle([x, y, x + TW - 1, y + TH_ - 1], outline=(206, 211, 221))
        d.text((x, y + TH_ + 5), f'{n}', fill=(27, 146, 208), font=fb)
        d.text((x + (22 if n > 9 else 14), y + TH_ + 5), label, fill=INK, font=fb)
        star = ' · favoritt den gang' if tid.rsplit('-', 1)[-1].isdigit() and any(tid.startswith(k) for k in ('index5-1', 'people1-3')) else ''
        d.text((x + (22 if n > 9 else 14), y + TH_ + 22), note + star, fill=MUTE, font=ff)
    out = os.path.join(OUT, f'kontaktark-{si}.jpg')
    sh.save(out, quality=88)
    paths.append(out)
    print(out, sh.size, len(entries))
print('total', n)
open(os.path.join(OUT, 'kontaktark-utelatt.txt'), 'w').write(SKIPPED + '\n')
