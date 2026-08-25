# EnvDoctor Architecture Note

EnvDoctor turns runtime configuration into a contract. A safe env example and a schema are normalized locally; key, type, and required checks run behind a masking boundary; the report exposes keys and fixes but never prints values.

A production-shaped version should add schema versions, `.env` parsing, redaction tests, CI output, deployment adapters, and explicit ownership. The static MVP is not a secret manager or vault and cannot guarantee that a service will start.
