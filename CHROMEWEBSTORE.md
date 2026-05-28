# Chrome Web Store Listing — Snakey - DOM Eating Snake

> Last Updated: 2026-05-28

## Store Listing

**Extension Name**
Snakey - DOM Eating Snake

**Short Description**
Release a hungry snake to slither around and devour the text, images, and layout blocks of any webpage with a single click!

**Detailed Description**
Ever wanted to literally chew through a boring webpage? 

Meet Snakey, the modern web-breaking spin on the classic arcade game. With a single click in your browser toolbar, a hungry snake is released directly onto your current webpage. Use your Arrow Keys or WASD to guide the snake as it eats through text paragraphs, headings, lists, images, buttons, and layout cards in real time!

Key Features:
- Instant slithering: Click the icon and play immediately.
- Proximity-based lazy splitting: High-performance text parsing splits paragraphs only as the snake approaches, keeping even text-heavy sites like Wikipedia running at a smooth 60 FPS.
- Interactive element animations: Watch dropdown menus expand, progress bars drain, checkboxes click frantically, and video/audio elements fast-forward and fade out as the snake devours them.
- Crumbling cards: Layout sections and cards disintegrate on screen while preserving their inner contents.
- Dynamic web folding: Slither off the page boundaries to collapse the entire website into a pitch-black void before it resets.

How to Use:
1. Navigate to any website you want to clear.
2. Click the Snakey extension icon in your browser toolbar to activate.
3. Control the snake using Arrow Keys or WASD.
4. Eat elements to grow and gain points.
5. If you crash into yourself or exit the page borders, press SPACE to restart!

Note: Snakey is a local visual sandbox extension. It runs entirely inside your browser tab and never transmits webpage content or personal data off your device.

**Category**
Fun

**Single Purpose**
Injects a playable overlay game where a snake crawls around and consumes HTML elements on the current webpage.

**Primary Language**
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | 🟡 Needs update | `public/favicon.svg` (needs PNG export) |
| Screenshot 1 | 1280×800 | ⬜ Not created | |
| Screenshot 2 | 1280×800 | ⬜ Not created | |
| Small Promo Tile | 440×280 | ⬜ Not created | |

### Screenshot Notes
- **Screenshot 1**: The snake crawling on a popular website (e.g. Wikipedia), showing half-eaten text paragraphs split into words and letters.
- **Screenshot 2**: The snake chomping an interactive widget (e.g. input fields or progress bars) showing visual shake or drain animations.

---

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `activeTab` | permissions | Allows the extension to interact with the active page. Specifically, it enables the extension to read the structure of the webpage and inject the game overlays when the user explicitly triggers it by clicking the extension icon. |
| `scripting` | permissions | Needed to dynamically inject the Phaser game engine canvas rendering logic (`assets/index.js`) and the custom CSS style rules (`assets/index.css`) into the active browser page upon user click. |

---

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

*(All computations, DOM scans, and animations run 100% locally inside the active browser tab. No layout structures, page URLs, or text contents are ever collected, stored, or transmitted off-device).*

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL**
https://github.com/andreyyste/snakey/blob/snakey-extension/PRIVACY.md

---

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

---

## Developer Info

**Publisher Name**
andreyyste

**Contact Email**
andreyyste@example.com

**Support URL / Email**
https://github.com/andreyyste/snakey/issues

---

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-05-28 | Initial Release of Snakey Chrome Extension. Features direct viewport spawning and lazy word splitting. | Draft |

---

## Review Notes

### Known Issues / Limitations
- Webpages built with strict Content Security Policies (CSP) that block external script injections might prevent the extension from loading.
