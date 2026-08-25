# LockWatch Supply Chain Desk

**Make dependency risk reviewable.** LockWatch is a local-first manifest review workbench for developers who need a fast preflight before merging dependency changes.

## Why it exists

AI-assisted development can suggest plausible package names and versions, while the repository still needs verified ownership, version intent, lockfile evidence, and a safe upgrade path. LockWatch surfaces those review questions without pretending to query live advisories.

## What the MVP does

The browser demo reads a compact package manifest, checks floating ranges and suspicious placeholder names, and records whether a lockfile state was supplied. It never installs packages or sends the manifest to a server.

## Run and validate

Open `index.html` or serve the directory with a static HTTP server. Run `python3 validate.py` and `node --check app.js`.

## Architecture

See [`docs/architecture.md`](docs/architecture.md), [`architecture.mmd`](architecture.mmd), and the rendered [`assets/architecture.png`](assets/architecture.png).

## Roadmap and boundaries

The next step is lockfile parsing, SBOM export, provenance, signed release evidence, and verified advisory feeds. The current MVP is not a CVE scanner, malware detector, or registry replacement.

## Portfolio

- [Live demo](https://majid-alsakani.github.io/majid-alsakani-portfolio/projects/lockwatch-supply-chain-desk/)
- [Case study](https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/lockwatch-supply-chain-desk.html)
- [Majid Systems Suite](https://majid-alsakani.github.io/majid-alsakani-portfolio/systems-suite.html)

Released under the MIT License.

## Demo media

- [Preview image](assets/preview.webp)
- [Product-tour video](assets/demo.mp4)
- [Architecture diagram](assets/architecture.png)
