# @plasius/graph-contracts

[![npm version](https://img.shields.io/npm/v/@plasius/graph-contracts.svg)](https://www.npmjs.com/package/@plasius/graph-contracts)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/graph-contracts/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/graph-contracts)](https://codecov.io/gh/Plasius-LTD/graph-contracts)
[![License](https://img.shields.io/github/license/Plasius-LTD/graph-contracts)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

Shared contracts, constants, ports, and runtime validators for the Plasius cached graph platform.

Apache-2.0. ESM + CJS builds. TypeScript types included.

---

## Requirements

- Node.js 24+ (matches `.nvmrc` and CI/CD)

---

## Installation

```bash
npm install @plasius/graph-contracts
```

---

## Exports

```ts
import {
  DEFAULT_SOFT_TTL_SECONDS,
  DEFAULT_HARD_TTL_SECONDS,
  SUPPORTED_SCHEMA_VERSIONS,
  isGraphQuery,
  isDomainEvent,
  isWriteCommand,
  getSchemaSupportLevel,
  isSchemaVersionSupported,
  type DequeuedWriteCommand,
  type GraphQuery,
  type CacheStore,
  type WriteCommand,
} from "@plasius/graph-contracts";
```

---

## Quick Start

```ts
import {
  isGraphQuery,
  type GraphQuery,
  DEFAULT_SOFT_TTL_SECONDS,
} from "@plasius/graph-contracts";

const query: GraphQuery = {
  traceId: "trace-1",
  requests: [{ resolver: "user.profile", key: "user:1" }],
};

if (!isGraphQuery(query)) {
  throw new Error("Invalid graph query payload");
}

console.log("softTtlSeconds", DEFAULT_SOFT_TTL_SECONDS);
```

---

## Development

```bash
npm run clean
npm install
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

---

## Contract Compatibility

- Versioning policy: [`docs/contract-versioning.md`](./docs/contract-versioning.md)
- Compatibility helpers:
  - `SUPPORTED_SCHEMA_VERSIONS`
  - `getSchemaSupportLevel`
  - `isSchemaVersionSupported`
- Queue dequeue contract:
  - `WriteCommand.operationId` is the coordinator-assigned, externally
    pollable operation identity. Queued commands preserve it through dequeue
    and processing.
  - `DequeuedWriteCommand.queueReceiptId` carries the queue receipt or dequeued
    message identity only; pass it to `WriteQueue.ack()` and
    `WriteQueue.nack()` when a durable queue provides one. It must not be used
    as the operation status identity.
- CI compatibility suite: `tests/compatibility.test.ts`

---

## Architecture

- Package ADRs: [`docs/adrs`](./docs/adrs)
- Cross-package ADRs: `plasius-ltd-site/docs/adrs/adr-0020` to `adr-0024`

---

## License

Licensed under the [Apache-2.0 License](./LICENSE).

<!-- BEGIN PLASIUS RELEASE INTEGRITY -->
## Release integrity

CI keeps the administrative contributor registry outside Git and npm package
artifacts using exact, case-normalised path checks. Both CI jobs run only for
trusted repository pushes on the literal `Public CI - Quarantined` group with
`[self-hosted, Linux, X64]` labels; there is no hosted fallback, PR event, callable
workflow or caller-selected runner. Jobs have 15/10-minute limits, checkout
credentials are not persisted, and package-manager cache finalization stays
disabled. Clean `npm ci`, lint, types, audit, build, >=80% coverage and final
package-manifest checks remain mandatory. Maintainer branch pushes need explicit
reviewed workflow admission; remove temporary admissions after delivery.
Publication uses the GitHub-hosted `production` job with Node 24 and a pinned
npm 11.6.2 client. It is token-free and proceeds only while the prepared SHA
is the exact `main` head after successful push-triggered CI. Do not dispatch CD
until the npm trusted-publisher binding is verified.

The stored `platform.public-artifact-integrity.enabled` flag controls staged
public restoration, not mandatory admission. Enabled, disabled and rollback
states all retain source/index/final-manifest and publication checks. No new
capability or runtime/API contract is introduced. Rollback disables the affected
workflow/channel or removes its workflow admission; it never restores the
administrative path or changes runner class. See [ADR-0005](docs/adrs/adr-0005-quarantined-push-ci.md).
<!-- END PLASIUS RELEASE INTEGRITY -->
