# ContractPilot API Guardian

**Compatibility before confidence.** ContractPilot is a local-first API contract diff workbench for developers who need to review interface changes before a pull request, SDK regeneration, or agent integration.

## Why it exists

AI can draft an endpoint quickly, but it cannot safely infer every existing caller, response expectation, or rollout policy from a short prompt. ContractPilot makes the contract delta visible: removed paths, removed operations, removed parameters, and removed response codes become reviewable evidence.

## What the MVP does

The browser demo compares two bounded JSON snapshots with a `paths` shape. It reports breaking and additive changes, keeps the sample local, and shows a human-readable decision. The current MVP intentionally avoids pretending to be a full OpenAPI parser or live gateway.

## Run locally

Open `index.html` directly or serve the directory with any static HTTP server. No package installation, account, API key, or backend is required.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) and the editable [`architecture.mmd`](architecture.mmd). The rendered diagram is [`assets/architecture.png`](assets/architecture.png).

## Validation

Run `python3 validate.py` and `node --check app.js`. The check verifies the expected files and the basic interactive markers.

## Roadmap

The next production-shaped step is an OpenAPI 3 parser with YAML support, schema compatibility rules, CI/SARIF output, and explicit policies for deprecated paths and rollout windows. These are planned capabilities, not claims about the current static demo.

## Portfolio

- [Live demo](https://majid-alsakani.github.io/majid-alsakani-portfolio/projects/contractpilot-api-guardian/)
- [Case study](https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/contractpilot-api-guardian.html)
- [Majid Systems Suite](https://majid-alsakani.github.io/majid-alsakani-portfolio/systems-suite.html)

Released under the MIT License.

## Demo media

- [Preview image](assets/preview.webp)
- [Product-tour video](assets/demo.mp4)
- [Architecture diagram](assets/architecture.png)
