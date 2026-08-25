# SignalRoom architecture

## Principle

SignalRoom treats a software change as a decision object. The decision must carry the evidence that a reviewer would need to release it, hold it, or turn it into a learning item.

## Data flow

The MVP accepts four evidence channels: test results, trace events, alert timelines, and an API contract signal. `engine.js` normalizes these inputs and applies deterministic checks. Findings keep a category, severity, evidence text, and action so the report is inspectable rather than a single opaque score.

## Safety boundary

All input stays in the browser. The MVP does not execute imported code, call a model, ingest production telemetry, or print secret values. An absent signal is reported as absent evidence, never as proof that the system is safe.

## Decision semantics

`Release` means no blocking signal was found in the supplied bundle. `Hold` means a blocking signal requires human review. `Learn` means the bundle is not blocked but warnings or incident evidence should become a regression or follow-up item.

## Production-shaped evolution

A production implementation should add signed evidence bundles, redaction, identity and permissions, adapters for CI and OpenTelemetry, durable trace storage, versioned policies, incident timeline imports, and auditable overrides. It should preserve the same explicit decision semantics and never turn a missing signal into a green light.
