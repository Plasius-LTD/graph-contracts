# Contract Versioning and Deprecation Policy

## Schema Versioning Rules

- `schemaVersion` is a string and follows semver-major compatibility for contract payloads.
- The current version is exported as `DEFAULT_SCHEMA_VERSION`.
- Supported versions are exported as `SUPPORTED_SCHEMA_VERSIONS`.
- Deprecated versions are exported as `DEPRECATED_SCHEMA_VERSIONS`.

## Compatibility Expectations

- Producers must emit payloads using a supported schema version.
- Consumers must treat unsupported schema versions as incompatible input and fail fast at the boundary.
- Breaking contract changes require a new schema major and a migration plan before release.

## Deprecation Window

- A schema version can be marked deprecated only after the replacement version is published.
- Deprecated versions stay in the compatibility window for at least one full release cycle.
- Removal of a deprecated version requires:
  - ADR update documenting the cutoff.
  - Changelog entry in the removal release.
  - Road-map issue tracking downstream package updates.

## Validation and CI

- Compatibility checks run in CI via `tests/compatibility.test.ts`.
- The compatibility suite verifies:
  - baseline graph query and domain event guard behavior,
  - schema support classification,
  - required port type exports used by sibling packages.
