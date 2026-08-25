# CodeProof AI Review

**Evidence over confidence.**

CodeProof is a dependency-free local review surface for AI-generated code. Paste a small JavaScript or Python sample, detect a limited set of obvious risk patterns, and connect each finding to a line, explanation, and next action.

## Why it exists

AI-assisted development is widely used while trust in generated output remains uneven. CodeProof demonstrates a review-first workflow rather than another code generator.

## MVP scope

The browser rules detect credential-like strings, dynamic `eval`, risky query construction, and external network boundaries. It never executes or uploads code. It is not a SAST replacement. Production adoption would add parsers, dependency intelligence, SARIF, CI gates, sandboxing, and expert rule review.

## Demo

- [Watch the six-second product tour](assets/demo.mp4)
- [Open the browser preview image](assets/preview.webp)

## Run locally

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Author

Majid Al-Sakani — ماجد السكني
