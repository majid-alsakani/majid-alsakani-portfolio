# EnvDoctor Configuration Contract

**Fail before runtime.** EnvDoctor is a local-first environment contract checker. It compares a safe `.env.example`-style input with a small schema and reports missing, unscoped, malformed, or secret-like keys without printing values.

## Why it exists

A project can compile while its deployment configuration is incomplete. AI can generate configuration names, but only the repository and deployment contract know which keys are required, what shape they have, and which values must remain secret.

## What the MVP does

The browser demo reads key names and safe placeholder shapes locally. It validates required keys, simple URL and number shapes, undocumented keys, and short secret-like values. It never sends or displays secret values.

## Run and validate

Open `index.html` or serve the directory with a static server. Run `python3 validate.py` and `node --check app.js`.

## Architecture

See [`docs/architecture.md`](docs/architecture.md), [`architecture.mmd`](architecture.mmd), and [`assets/architecture.png`](assets/architecture.png).

## Roadmap and boundaries

The next build adds typed schema versions, `.env` parsing, redaction policy, CI output, and deployment adapters. The current MVP is not a vault, secret manager, or guarantee that a service will start.

## Portfolio

- [Live demo](https://majid-alsakani.github.io/majid-alsakani-portfolio/projects/envdoctor-configuration-contract/)
- [Case study](https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/envdoctor-configuration-contract.html)
- [Majid Systems Suite](https://majid-alsakani.github.io/majid-alsakani-portfolio/systems-suite.html)

Released under the MIT License.

## Demo media

- [Preview image](assets/preview.webp)
- [Product-tour video](assets/demo.mp4)
- [Architecture diagram](assets/architecture.png)
