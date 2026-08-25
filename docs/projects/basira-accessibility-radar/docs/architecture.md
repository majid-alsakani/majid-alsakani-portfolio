# Basira architecture

Basira keeps the first accessibility review close to the interface. The user provides a small HTML sample, a deterministic rules engine parses it in the browser, and the report renders findings with a severity, evidence, and fix recommendation.

## Boundaries

The MVP does not call an external API, upload HTML, or claim full WCAG conformance. A production version would add tested browser automation, a traceable rules catalog, CI output, and human accessibility review.

## Decision record

| Decision | Reason |
| --- | --- |
| Client-side parser | Keeps sample content private and makes the demo instantly usable |
| Small explicit ruleset | Makes each finding explainable instead of hiding behavior behind a score |
| HTML report first | Frontend teams can act on a finding before adopting a larger platform |
| Severity plus fix | Converts detection into a next step |

## Flow

`HTML sample → local parser → rules → evidence finding → prioritized report`
