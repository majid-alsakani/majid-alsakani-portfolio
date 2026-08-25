# ContractPilot Architecture Note

ContractPilot treats an API contract as a review boundary. Two snapshots are parsed locally, normalized into path and operation records, and compared by explicit compatibility rules. Findings retain the operation and change so a reviewer can decide whether to deprecate, migrate, or block.

The MVP uses JSON snapshots with a bounded `paths` shape. A production implementation should use a tested OpenAPI 3 parser, support YAML and schemas, and publish SARIF or CI annotations. The static demo intentionally performs no registry, gateway, or backend operation.
