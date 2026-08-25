# Basira Accessibility Radar

**Find the barrier. Fix the experience.**

Basira is a dependency-free, local-first accessibility triage surface for Arabic and English interfaces. Paste a small HTML sample, run explainable rules, and receive prioritized findings with evidence and suggested fixes.

## Why it exists

Digital accessibility is becoming a product, legal, and market concern across MENA. Basira makes the first review concrete for frontend teams and agencies without pretending to be a compliance certificate.

## MVP scope

The browser demo checks language metadata, text direction, heading structure, image alternative text, form labels, vague link text, and accessible names for icon buttons. Input remains in the browser. Production adoption would add browser automation, WCAG mapping, expert review, CI integration, and tested language coverage.

## Demo

- [Watch the six-second product tour](assets/demo.mp4)
- [Open the browser preview image](assets/preview.webp)

## Run locally

```bash
python3 -m http.server 4171
```

Open `http://127.0.0.1:4171` and run the sample scan.

## Project map

| File | Purpose |
| --- | --- |
| `index.html` | Product landing page and scanner UI |
| `styles.css` | Basira visual system and responsive layout |
| `app.js` | Deterministic local scanner and report renderer |
| `docs/architecture.md` | Product and technical decisions |
| `architecture.mmd` | Editable flow diagram |

## Honest boundary

Basira is a triage tool for education and early review. It cannot prove full WCAG conformance, understand every dynamic interaction, or replace disabled-user testing and professional audits.

## Author

Majid Al-Sakani — ماجد السكني
