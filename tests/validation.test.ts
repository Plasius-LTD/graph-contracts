import { describe, expect, it } from "vitest";

import {
  DEFAULT_HARD_TTL_SECONDS,
  DEFAULT_SCHEMA_VERSION,
  DEFAULT_SOFT_TTL_SECONDS,
} from "../src/constants.js";
import { isDomainEvent, isGraphQuery, isResolverRequest, isWriteCommand } from "../src/validation.js";

describe("validation guards", () => {
  it("exports default cache constants", () => {
    expect(DEFAULT_SOFT_TTL_SECONDS).toBe(30);
    expect(DEFAULT_HARD_TTL_SECONDS).toBe(300);
    expect(DEFAULT_SCHEMA_VERSION).toBe("1");
  });

  it("accepts a valid resolver request", () => {
    expect(
      isResolverRequest({
        resolver: "user.profile",
        key: "user:1",
        params: { include: "roles" },
        tags: ["user", "profile"],
      }),
    ).toBe(true);
  });

  it("rejects a resolver request with missing key", () => {
    expect(
      isResolverRequest({
        resolver: "user.profile",
      }),
    ).toBe(false);
  });

  it("rejects resolver requests when tags or params are invalid", () => {
    expect(
      isResolverRequest({
        resolver: "user.profile",
        key: "user:1",
        tags: ["ok", 123],
      }),
    ).toBe(false);

    expect(
      isResolverRequest({
        resolver: "user.profile",
        key: "user:1",
        params: "bad",
      }),
    ).toBe(false);
  });

  it("rejects resolver requests with non-string identifiers", () => {
    expect(isResolverRequest(null)).toBe(false);
    expect(isResolverRequest([])).toBe(false);
    expect(
      isResolverRequest({
        resolver: "",
        key: "user:1",
      }),
    ).toBe(false);
    expect(
      isResolverRequest({
        resolver: "user.profile",
        key: "",
      }),
    ).toBe(false);
  });

  it("accepts a valid graph query", () => {
    expect(
      isGraphQuery({
        id: "q1",
        requests: [
          {
            resolver: "user.profile",
            key: "user:1",
          },
        ],
      }),
    ).toBe(true);
  });

  it("rejects a graph query with invalid requests", () => {
    expect(
      isGraphQuery({
        requests: [
          {
            resolver: "user.profile",
          },
        ],
      }),
    ).toBe(false);
  });

  it("rejects graph queries with invalid request container shape", () => {
    expect(isGraphQuery(null)).toBe(false);
    expect(
      isGraphQuery({
        requests: "invalid",
      }),
    ).toBe(false);
  });

  it("accepts a valid domain event", () => {
    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        entityKey: "entity:1",
        version: 2,
        payload: { value: 1 },
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(true);
  });

  it("rejects event with invalid payload shape", () => {
    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        version: 2,
        payload: "invalid",
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);
  });

  it("rejects events with invalid primitive fields", () => {
    expect(isDomainEvent(null)).toBe(false);
    expect(
      isDomainEvent({
        id: 7,
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        version: 2,
        payload: {},
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);

    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: "1",
        aggregateKey: "agg:1",
        version: 2,
        payload: {},
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);

    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: 9,
        version: 2,
        payload: {},
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);
  });

  it("rejects events with invalid optional fields and metadata", () => {
    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        entityKey: 42,
        version: 2,
        payload: {},
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);

    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        version: true,
        payload: {},
        tags: ["entity"],
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);

    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        version: 2,
        payload: {},
        tags: "entity",
        schemaVersion: "1",
        source: "graph-service",
      }),
    ).toBe(false);

    expect(
      isDomainEvent({
        id: "evt_1",
        type: "graph.entity.updated",
        occurredAtEpochMs: 1,
        aggregateKey: "agg:1",
        version: 2,
        payload: {},
        tags: ["entity"],
        schemaVersion: 1,
        source: "graph-service",
      }),
    ).toBe(false);
  });

  it("accepts a valid write command", () => {
    expect(
      isWriteCommand({
        idempotencyKey: "idk_1",
        partitionKey: "user",
        aggregateKey: "user_1",
        payload: { enabled: true },
        submittedAtEpochMs: 1,
        actorId: "actor_1",
      }),
    ).toBe(true);
  });

  it("rejects write commands with invalid key formats and lengths", () => {
    expect(
      isWriteCommand({
        idempotencyKey: "bad key",
        partitionKey: "user",
        aggregateKey: "user_1",
        payload: { enabled: true },
        submittedAtEpochMs: 1,
      }),
    ).toBe(false);

    expect(
      isWriteCommand({
        idempotencyKey: "idk_1",
        partitionKey: "user",
        aggregateKey: "x".repeat(257),
        payload: { enabled: true },
        submittedAtEpochMs: 1,
      }),
    ).toBe(false);
  });

  it("rejects write commands with invalid payload/metadata fields", () => {
    expect(
      isWriteCommand({
        idempotencyKey: "idk_1",
        partitionKey: "user",
        aggregateKey: "user_1",
        payload: [],
        submittedAtEpochMs: 1,
      }),
    ).toBe(false);

    expect(
      isWriteCommand({
        idempotencyKey: "idk_1",
        partitionKey: "user",
        aggregateKey: "user_1",
        payload: { enabled: true },
        submittedAtEpochMs: -1,
      }),
    ).toBe(false);
  });
});
