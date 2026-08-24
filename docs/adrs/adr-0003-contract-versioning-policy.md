# ADR-0003: Contract Versioning and Deprecation Policy

## Status

- Accepted
- Date: 2026-03-06
- Version: 1.0

## Context

Graph packages depend on shared contracts for cache envelopes, query payloads, and event envelopes. Without explicit compatibility policy, consumers can accidentally break during rolling upgrades or staggered package adoption.

## Decision

- Define and publish explicit schema compatibility metadata in `@plasius/graph-contracts`.
- Maintain a current/supported/deprecated/unsupported classification model for schema versions.
- Keep compatibility checks in the package CI suite and treat them as release gates.
- Document deprecation windows and required release artifacts for removing schema support.

## Consequences

- Consumers can make deterministic allow/deny decisions at their boundaries.
- Rolling upgrades are safer because schema support is explicit and test-covered.
- Breaking changes require stronger release discipline and migration tracking.

## Additive queued-operation identity

The queue contract adds an optional `WriteCommand.operationId` field. Queue
implementations preserve that value on dequeued commands so the operation
returned to a caller remains the operation updated through processing. The
existing `DequeuedWriteCommand.queueReceiptId` remains an independent
acknowledgement identity and is never used for operation-status lookups.

This additive field preserves compatibility with receipt-only and in-memory
queue implementations. Consumers retain a legacy fallback while upgraded
queue implementations are released and adopted.
