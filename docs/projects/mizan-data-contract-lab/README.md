# Mizan Data Contract Lab

**Know if your data is ready for the next step.**

Mizan is a local-first CSV profiler and contract lab. It surfaces shape, schema, missing values, duplicates, basic format signals, and potential sensitive fields before a dataset enters analysis or an AI workflow.

## Why it exists

AI readiness depends on data foundations. Mizan turns preparation into a visible decision instead of a hidden assumption.

## MVP scope

The browser demo parses a small CSV locally and renders pass/warning findings. It is not a full data observability platform, privacy classifier, or statistical outlier detector. Production adoption would add connectors, lineage, policy packs, scalable profiling, and team workflows.

## Demo

- [Watch the six-second product tour](assets/demo.mp4)
- [Open the browser preview image](assets/preview.webp)

## Run locally

```bash
python3 -m http.server 4172
```

Open `http://127.0.0.1:4172`.

## Author

Majid Al-Sakani — ماجد السكني
