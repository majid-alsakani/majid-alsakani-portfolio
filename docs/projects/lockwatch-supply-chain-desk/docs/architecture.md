# LockWatch Architecture Note

LockWatch separates manifest parsing from policy. It reads package names, ranges, and a supplied lockfile state locally; then applies rules for floating versions, missing lock evidence, and ownership/provenance questions. The result is a review queue rather than a vulnerability score.

A production-shaped version should parse lockfiles, produce an SBOM, verify provenance and signatures, and consume trusted advisory feeds with clear freshness and ownership. The static MVP does not claim live CVE or malware intelligence.
