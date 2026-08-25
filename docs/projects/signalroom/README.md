# SignalRoom

**AI Change Evidence & Incident Replay** — a local-first MVP for turning software changes into reviewable evidence and human-owned release decisions.

SignalRoom does not try to out-generate an AI coding assistant. It addresses the durable work around AI-assisted changes: linking a change to tests, traces, alerts, and contract evidence, then explaining whether the team should **Release**, **Hold**, or **Learn**.

## What it does

The browser-only MVP accepts a bounded evidence bundle. It normalizes a change manifest, test results, trace events, an alert timeline, and an API contract signal. A deterministic policy engine produces a score, findings, evidence map, and a decision. The user can replay the same bundle, import a JSON file, and export a JSON or Markdown review bundle.

The three included fixtures demonstrate a release with complete evidence, a release held by a critical test failure and blocked tool, and an incident-learning scenario where a prior warning becomes regression evidence.

## Run locally

No package installation is required. Serve the directory with any static server, for example:

```bash
python3 -m http.server 4190
```

Then open `http://127.0.0.1:4190/`. All evaluation happens in the browser. The project does not send fixtures or imported bundles to a server.

## Core files

| Path | Responsibility |
|---|---|
| `index.html` | Workbench, scenario controls, evidence map, decision surface, and state contract |
| `engine.js` | Normalization, policy checks, decision logic, JSON and Markdown export helpers |
| `app.js` | Browser wiring, fixture loading, import, replay, rendering, and downloads |
| `schemas/` | JSON Schema contracts for manifests, evidence bundles, and decision reports |
| `fixtures/` | Safe local scenarios for Release, Hold, and Learn |
| `docs/architecture.md` | Architecture decision record and production-shaped evolution |
| `architecture.mmd` | Editable Mermaid source |

## Decision model

A **Release** result means no blocking signal was found in the supplied bundle. A **Hold** result means at least one blocking signal needs human review. A **Learn** result means the change is not blocked, but warnings or timeline evidence should become a regression, follow-up, or incident-learning item. The result is not a guarantee of production safety.

## Scope boundary

This repository is a deterministic showcase. It is not a production telemetry collector, incident-management system, causal-diagnosis engine, rollback service, or security certification. It does not call an LLM, connect to a CI provider, or ingest live OpenTelemetry data. A production-shaped version would add adapters, authentication, redaction, durable storage, versioned policies, signed evidence, CI annotations, and explicit ownership.

## License

MIT. See `LICENSE`.

## Demo media

The repository includes a real browser preview at `assets/preview.webp`, a six-second silent product-tour at `assets/demo.mp4`, and a rendered architecture diagram at `assets/architecture.png`. The video is a UI preview, not a recording of production telemetry or an automated rollback.

## Public links

- Live demo: https://majid-alsakani.github.io/majid-alsakani-portfolio/projects/signalroom/
- Case study: https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/signalroom.html
- Portfolio suite: https://majid-alsakani.github.io/majid-alsakani-portfolio/systems-suite.html
