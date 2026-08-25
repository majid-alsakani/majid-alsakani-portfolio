# Mizan architecture

Mizan keeps dataset inspection local. A CSV is parsed into headers and rows, deterministic checks produce a profile, and the UI turns results into pass/warn findings.

## Contract fields

A production contract can declare required columns, expected types, nullable status, freshness, sensitivity, and ownership. The MVP presents the decision surface without connecting to a warehouse.

## Boundary

No file leaves the browser in the public demo. Basic email and sensitivity checks are signals, not a complete privacy or quality assessment.
