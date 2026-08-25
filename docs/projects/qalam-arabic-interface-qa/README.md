# Qalam Arabic Interface QA

**Make Arabic interfaces behave like Arabic.**

Qalam is a dependency-free local lab for inspecting RTL, Unicode bidirectional text, numbers, and mixed Arabic/Latin runs in bilingual interfaces.

## Why it exists

Arabic is not a translation toggle. Direction, numbers, links, wrapping, and device typography affect whether a localized interface is understandable.

## MVP scope

The demo detects Arabic and Latin runs, numeric characters, URL-like content, and empty input, then suggests explicit direction and testing boundaries. It does not perform deep linguistic analysis, translation, or full browser rendering conformance.

## Demo

- [Watch the six-second product tour](assets/demo.mp4)
- [Open the browser preview image](assets/preview.webp)
- [Open the architecture diagram](assets/architecture.png)
- [Read the portfolio case study](https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/qalam-arabic-interface-qa.html)

## Run locally

```bash
python3 -m http.server 4175
```

Open `http://127.0.0.1:4175`.

## Author

Majid Al-Sakani — ماجد السكني
