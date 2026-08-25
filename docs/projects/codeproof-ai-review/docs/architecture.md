# CodeProof architecture

CodeProof treats AI-generated code as an artifact to inspect, not as something to execute. The browser splits text into lines, applies a small explicit ruleset, and renders an evidence ledger with severity and suggested next action.

## Safety boundary

The MVP never executes code, calls a network target, or uploads the sample. A production version would need language-aware parsing, dependency analysis, sandboxing, CI policy, and human security review.

## Evidence record

`{ rule, line, severity, explanation, suggested_fix, reviewer_status }`
