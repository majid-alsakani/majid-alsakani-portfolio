# TraceBench Agent Evaluation Lab

**Reliability needs a replay loop.** TraceBench is a local-first evaluation workbench for AI agent traces. It turns a small JSONL run into comparable evidence: outcome, steps, duration, and tool-policy signals.

## Why it exists

A final answer can look correct while the agent took an unsafe or needlessly expensive path. AI does not remove the need for golden cases, regression replay, and human-owned policies. TraceBench makes those questions visible without calling a model.

## What the MVP does

Paste one JSON object per line with `type`, `name`, and optional `duration_ms`. The demo checks for a final answer, counts steps, sums fixture duration, and applies a small tool allowlist. The trace remains in the browser.

## Run and validate

Open `index.html` or serve the directory with a static server. Run `python3 validate.py` and `node --check app.js`.

## Architecture

See [`docs/architecture.md`](docs/architecture.md), [`architecture.mmd`](architecture.mmd), and [`assets/architecture.png`](assets/architecture.png).

## Roadmap and boundaries

The next build adds golden datasets, trace storage, model adapters, comparisons, and CI gates. The current MVP is not a tracing backend, model judge, or reliability guarantee.

## Portfolio

- [Live demo](https://majid-alsakani.github.io/majid-alsakani-portfolio/projects/tracebench-agent-evaluation-lab/)
- [Case study](https://majid-alsakani.github.io/majid-alsakani-portfolio/case-studies/tracebench-agent-evaluation-lab.html)
- [Majid Systems Suite](https://majid-alsakani.github.io/majid-alsakani-portfolio/systems-suite.html)

Released under the MIT License.

## Demo media

- [Preview image](assets/preview.webp)
- [Product-tour video](assets/demo.mp4)
- [Architecture diagram](assets/architecture.png)
