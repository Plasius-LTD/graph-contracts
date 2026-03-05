import { describe, expect, it } from "vitest";

import { isDomainEvent, isGraphQuery, isResolverRequest } from "../src/validation.js";

describe("validation guards", () => {
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
});
