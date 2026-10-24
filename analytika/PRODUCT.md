# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Delegated to Claude: Next.js (App Router, TypeScript, Tailwind), statically generated. It matches the current Analytika repo (Next.js, Tailwind, shadcn/ui, `messages/` for copy), so the result can be ported there, and it ships every page as server-rendered HTML for search engines and AI answer engines.

## Users
Primary: experienced professionals (actuaries, pricing and analytics people, data and software engineers, insurance consultants, business-minded senior profiles) who are considering working at, or becoming a partner in, Analytika. Recruiting is the most important job of the site.

Secondary: people at insurance companies, Norway first and some abroad, who have not heard of Analytika and check it out before engaging.

Both groups only browse. They are judging whether Analytika is credible and senior, not being sold to.

## Product Purpose
Analytika is a consulting firm for the insurance industry. Four service areas: pricing and analytics, data platforms, actuarial / risk / compliance, and business consulting / project management. Analytika Ventures covers business development and investments, and funds employees' own ideas.

The site lets a visitor judge, by browsing, that Analytika is a firm they want to work with or trust. Nothing is sold on the site: no prices, no funnel, no sales pitch. A Products section may describe what Analytika has built. Success (inferred from the brief, confirm): a candidate wants to talk to a partner, and a client contact concludes Analytika is credible.

## Positioning
Facts from the firm's earlier copy (the wording itself is not reused): a unique combination of senior people with deep industry experience and a "doer mindset"; "no-nonsense, no fancy jargon, no fluff"; a place for smart people to develop, deliver great services, create new business and have fun, with a path to partnership.

The site should demonstrate quality rather than assert it ("show, don't tell"). It should not say "we are the best".

## Operating Context
Visitors browse; they do not buy. Recruiting also happens in person at events (for example Næringslivsdagene in Trondheim) and the site is checked afterwards. Office: Parkveien 41B, Oslo. The current site is English with a language switcher.

## Capabilities and Constraints
- Complete rebuild, not a redesign. The existing site's text is a source of facts only: do not copy or reuse its wording. All copy is new.
- Landing page (the user's vision; a working direction, still being iterated: a mountain photograph fading into an empty white field): one very short slogan; the key areas Actuary, Pricing, Data platforms, Consulting and Business development in one quiet horizontal line below. Further down, four words alone with no other text (People, Insights, Products, About us), alternating right and left of one vertical centre line, each reached by a 90-degree branch from it; the line draws itself while scrolling. Each word is a real link, reachable by keyboard, to its own page; hovering gives a visual reaction only, no text.
- Insights: five area symbols at the top, each drawn from a real mathematical figure for that area, in one consistent technical line style, with the area name and a line of text (Actuary: survival curve; Pricing: Lorenz curve; Data platforms: star graph; Consulting: decision tree; Business development: logistic curve). Clicking an area opens its sub-areas (Actuary: Risk actuary, Compliance, Reserving, Life and pension); each sub-area opens a page of descriptions of what Analytika does there, generated with AI from the firm's own files, mainly so Analytika is found in search and in AI answers. Only Actuary is drawn so far. Products: four, named Indie, N Models, Triangles and AI (descriptions to come); the products page opens white with logo placeholders, fades into the mountain photograph and back to white for each description. People: everyone equal, with no partner designation, titles or groups, shown as the arrival line: a horizontal line with one dot per person in order of arrival and open dots for open roles. About us: a text-only page. The vision says who Analytika is, with a little small print (founding year, number of people, Oslo). Customers are not named: the page only says that Analytika works for all of them. Chosen structure: museum-style wall labels (who we are, how we work, who we work for) on an otherwise empty page, with Join us and Contact as two more labels below.
- Additional pages with SEO / AI-search content are planned so Analytika appears in ChatGPT and Claude answers. Not yet specified. All content must be real text in server-rendered HTML, not inside images or canvas.
- Undecided: names and descriptions of the four products; founding year and headcount wording; the vision text for About us (example wording is used in sketches); the slogan (a placeholder is used in sketches); whether AI-produced Insights are reviewed and signed by a named person and exclude client material; the hero image (existing photo for now); Norwegian version; whether to keep the contact form.

## Brand Commitments
- Name: Analytika. Logo: dot-cluster triangle mark plus wordmark, file `analytika/assets/logo/Analytika_Logo.pdf`. Logo colours: navy `#1E3363`, blue `#1B92D0`, deep blue `#036194`. Whether the site palette must derive from them is undecided.
- Sub-brand: Analytika Ventures (own lockup on the current site).
- Voice: plain, direct, no jargon, with dry humour. New wording only.

## Evidence on Hand
- People: 21 team members and 4 collaboration partners, each with a written background (employers named in the bios include Gjensidige, DNB, Codan, Storebrand, If, EY, Accenture). The text lives in the current site's `messages` files and is not yet saved in this repo.
- Customers: stated by the user, Analytika serves the insurers of Norway and some abroad, and they will not be named anywhere on the site; the site only says "all". The claim must stay literally true. Do not invent any names.
- Statements: not planned for now. The earlier idea of customer quotes next to logos is dropped, since customers are not named.
- Not on hand, do not fabricate: case studies, numbers, awards.

## Product Principles
1. Proof over assertion: show customers, people and work instead of claiming to be the best.
2. People are the proof: named senior people with real backgrounds.
3. Browse, don't buy: no funnel, no sales pressure.
4. Plain voice: no jargon, no fluff, in the firm's own words.
5. Findable: readable by search engines and AI answer engines.
