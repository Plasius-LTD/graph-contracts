import { describe, expect, it } from "vitest";

import {
  SUPPORTED_SCHEMA_VERSIONS,
  getSchemaSupportLevel,
  isDomainEvent,
  isGraphQuery,
  isSchemaVersionSupported,
  type CacheStore,
  type Clock,
  type EventConsumer,
  type EventPublisher,
  type IdGenerator,
  type OperationStore,
  type ServiceResolver,
  type TelemetrySink,
  type WriteQueue,
} from "../src/index.js";

describe("contract compatibility", () => {
  it("keeps core contract guards stable", () => {
    const query = {
      traceId: "trace_1",
      requests: [{ resolver: "user.profile", key: "user:1" }],
    };
    expect(isGraphQuery(query)).toBe(true);

    const event = {
      id: "evt_1",
      type: "graph.entity.updated",
      occurredAtEpochMs: 1,
      aggregateKey: "agg:1",
      entityKey: "entity:1",
      version: 1,
      payload: { data: { id: 1 } },
      tags: ["entity"],
      schemaVersion: SUPPORTED_SCHEMA_VERSIONS[0],
      source: "contracts-test",
    };

    expect(isDomainEvent(event)).toBe(true);
  });

  it("classifies schema support level for compatibility checks", () => {
    const currentVersion = SUPPORTED_SCHEMA_VERSIONS[0];
    expect(getSchemaSupportLevel(currentVersion)).toBe("current");
    expect(isSchemaVersionSupported(currentVersion)).toBe(true);

    expect(getSchemaSupportLevel("999")).toBe("unsupported");
    expect(isSchemaVersionSupported("999")).toBe(false);
  });

  it("retains the exported port types required by sibling packages", () => {
    type PortSurface = [
      CacheStore,
      ServiceResolver,
      EventPublisher,
      EventConsumer,
      WriteQueue,
      OperationStore,
      TelemetrySink,
      Clock,
      IdGenerator,
    ];

    const marker: PortSurface | null = null;
    expect(marker).toBeNull();
  });
});
