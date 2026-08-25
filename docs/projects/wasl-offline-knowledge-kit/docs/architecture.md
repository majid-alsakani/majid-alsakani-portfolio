# Wasl architecture

Wasl is a local-first PWA. A bounded knowledge pack is loaded into the browser, indexed by simple filters, and kept available through a Service Worker cache. Export is explicit so the user retains a portable copy.

## Boundary

The MVP does not sync, encrypt, authenticate, or guarantee freshness. Production adoption would need signed content packs, secure storage, conflict handling, and a governance process for updates.
