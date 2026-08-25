# TraceBench Architecture Note

TraceBench models an evaluation as a replayable artifact. JSONL events are parsed and normalized; outcome, step, duration, and tool-policy checks run independently; then an evidence report supports a regression decision.

A production-shaped version should add golden datasets, versioned trace storage, model adapters, redaction, comparison history, and CI gates. The static MVP does not call a model or claim to measure reliability in production.
