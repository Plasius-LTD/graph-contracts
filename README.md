# @plasius/graph-contracts

[![npm version](https://img.shields.io/npm/v/@plasius/graph-contracts.svg)](https://www.npmjs.com/package/@plasius/graph-contracts)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/graph-contracts/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/graph-contracts)](https://codecov.io/gh/Plasius-LTD/graph-contracts)
[![License](https://img.shields.io/github/license/Plasius-LTD/graph-contracts)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

[![CI](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/ci.yml/badge.svg)](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/ci.yml)
[![CD](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/cd.yml/badge.svg)](https://github.com/Plasius-LTD/graph-contracts/actions/workflows/cd.yml)

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
  isGraphQuery,
  isDomainEvent,
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

## Architecture

- Package ADRs: [`docs/adrs`](./docs/adrs)
- Cross-package ADRs: `plasius-ltd-site/docs/adrs/adr-0020` to `adr-0024`

---

## License

Licensed under the [Apache-2.0 License](./LICENSE).
