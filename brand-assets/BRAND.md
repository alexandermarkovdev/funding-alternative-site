# Funding Alternative (FAUK) — Website Brand Kit

Source: `SharePoint › FundingAlt - Marketing & Branding › 2024-09 Rebranding Exercise` (Brand Guide 2025, `OUTPUTS 20241120/WEBSITE MATERIALS`).
Full guide: `reference/FAUK BRAND GUIDE.pdf`, with each page rendered as `reference/brand-guide-pNN.png`. The website mockup is page 18.

## Brand in one line
**"We're More Than Money."** Mission: *Give British businesses what they need to survive and thrive.*
Customers: British business owners who are in a financial pinch. Products: **Tradeflow Finance** and **Cashflow Finance**.
Values: solution-focused, meticulous, straight-talking, flexible, supportive.
Emotion to evoke: *"I feel relieved, supported, and confident knowing that FA has my back."*
Tone: plain, direct, empathetic copy. The guide positions the brand against "the crowd of blue faux-finance brands", so keep blue as a minor accent only.

## Colour (see `tokens.css`)
| Role | Token | Hex |
|---|---|---|
| Primary: brand red (CTAs, wordmark, accents) | `--fa-red` | `#ea4628` |
| Primary: beige/tan (main light background) | `--fa-beige` | `#f7ead2` |
| Primary: charcoal (dark sections, text) | `--fa-charcoal` | `#404040` |
| Primary: light grey (neutral panels) | `--fa-grey-light` | `#efeff0` |
| Secondary: deep red (hover/pressed) | `--fa-red-deep` | `#d2232a`* |
| Secondary: near-black | `--fa-black` | `#030303` |
| Secondary: sky blue (secondary CTA) | `--fa-sky` | `#9adbf5` |
| Secondary: teal (secondary CTA hover) | `--fa-teal` | `#70a0b4` |
| Logo/icon plus-pattern grey | `--fa-logo-grey` | `#4d4d4d` |

\*The guide has a typo and prints this colour as `#efeff0`. Its RGB values (210/35/42) work out to `#d2232a`.

**Buttons ("APPLY NOW")**, from guide page 12. All buttons use Barlow Bold uppercase with a radius of about 6px.
| State | Primary | Secondary |
|---|---|---|
| Default | beige bg `#f7ead2`, red text `#ea4628` | sky bg `#9adbf5`, charcoal text |
| Hover | red bg `#ea4628`, beige text | charcoal bg `#404040`, sky text |
| Pressed | deep red bg `#d2232a`, beige text | teal bg `#70a0b4`, charcoal text |
| Disabled | ~40% faded beige/red | ~40% faded grey-blue |

## Typography
- **Barlow**, a slightly rounded, low-contrast grotesk. It's free and open source (OFL); the licence is in `fonts/barlow/`.
- Headlines: **Barlow Black, UPPERCASE**, set tight. Sub-headlines: **Barlow Medium, UPPERCASE**, often red. Body: Barlow Regular.
- Self-hosted `.woff2` files for every weight are in `fonts/barlow/`, and `@font-face` rules are in `tokens.css`. Barlow is also on Google Fonts.

## Logo (`logo/`)
Lockup is **FUNDING** (red, bold) + **ALT** (light), with a field of grey "plus" marks.
File names follow `fa-logo-{shape}-{colourway}.svg|png`:
- shapes: `stacked` (primary: plus field over wordmark), `horizontal` (compact, best for the nav bar), `two-line`, `mark` (plus field only), `vertical`, `vertical-rotated`
- colourways: `on-light` (grey+red, for beige/white backgrounds), `on-dark` (beige+red, for charcoal backgrounds), `mono-black`, `mono-white`
- `favicon/`: the round and square "+F" marks, six variants
- `tagline/`: "+WE'RE MORE THAN MONEY+" as boxed and single-line versions
- `animated/`: animated logo MP4s for the header or loader. The guide says to use these sparingly.

Logo rules: keep the original proportions and colours. Don't distort, rotate or recolour the logo, give it clear space, and never place it on a busy background.

## Plus Patterns (`patterns/`)
Halftone grids and globes built from "+" marks. Use them subtly as section backgrounds and textures, in brand colours.

## Icons (`icons/`)
There are 71 line icons. `on-light` versions use grey #4d4d4d with red #ea4628, and `on-dark` versions are the matching icons for dark backgrounds.

## Hero images (`heroes/`)
These are the "entrepreneurial hero" collages: a real business owner cut out and surrounded by their tools, team and product. They're desaturated with key colours pushed forward. The PNG/WebP files are **transparent**, so place them over beige or charcoal.
Sectors: `accounting`, `automotive`, `automotive-2`, `transport`, `pharmacy`, `recruitment`, `bakery`, `carpenter`, `construction`, `factory`.
Each sector has `hero-{name}.webp` (2000px), `hero-{name}-sm.webp` (1000px) and `hero-{name}.png` (1600px fallback).

## Photography (`photography/`)
Six treated portraits (desaturated, tan overlay, plus pattern worked in). Each comes as `portrait-N.webp/.jpg` (2400px) and `-sm.webp` (1200px). Use them for testimonials, "about" sections and content blocks.

## Company details (from the letterhead)
Funding Alternative Group Limited · Reg. No. 11501528 · 104 Roebuck Road, Chessington, KT9 1EU
Tel 0800 652 1977 · applications@fundingalternative.co.uk · fundingalternative.co.uk
Award: *Best SME Business Cash Advance Solution Provider – South East* (SME Finance Awards)

## Not copied (still on SharePoint)
- Full-res masters: portraits are 8192px PNGs of 30–50MB, and heroes are 3000–5000px.
- Design source files: `.ai`, `.psd`, `.indd`, `.aep` and the 185MB Adobe XD brand file (`WEBSITE MATERIALS/FAUK XD file`).
- Brochures, business cards, letterhead and PowerPoint templates.
