# Wasl Offline Knowledge Kit

**Knowledge that keeps going.**

Wasl is a small local-first PWA for saving, searching, reading, and exporting bounded knowledge packs when connectivity is limited.

## Why it exists

Many digital experiences assume a stable connection. Wasl treats offline mode as a deliberate product state rather than an error screen.

## MVP scope

The demo provides a starter pack, local search, tag filters, connection state, JSON export, and a small Service Worker cache. It has no accounts, sync, or sensitive content. Production adoption would add signed packs, encryption, conflict-aware sync, and content governance.

## Demo

- [Watch the six-second product tour](assets/demo.mp4)
- [Open the browser preview image](assets/preview.webp)

## Run locally

```bash
python3 -m http.server 4174
```

Open `http://127.0.0.1:4174`.

## Author

Majid Al-Sakani — ماجد السكني
