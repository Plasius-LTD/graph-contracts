import { describe, expect, it } from "vitest";

import {
  SUPPORTED_SCHEMA_VERSIONS,
  getSchemaSupportLevel,
  isDomainEvent,
  isGraphQuery,
  isSchemaVersionSupported,
  type CacheStore,
  type Clock,
  type DequeuedWriteCommand,
  type EventConsumer,
  type EventPublisher,
  type IdGenerator,
  type OperationStore,
  type ServiceResolver,
  type TelemetrySink,
  type WriteCommand,
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
      DequeuedWriteCommand,
      WriteQueue,
      OperationStore,
      TelemetrySink,
      Clock,
      IdGenerator,
    ];

    const marker: PortSurface | null = null;
    expect(marker).toBeNull();
  });

  it("separates external operation identity from queue receipt identity", async () => {
    const command: WriteCommand = {
      idempotencyKey: "idk_queue_identity",
      partitionKey: "pk_queue_identity",
      aggregateKey: "agg_queue_identity",
      payload: { value: 1 },
      submittedAtEpochMs: 1,
    };

    const modernDequeued: DequeuedWriteCommand = {
      ...command,
      operationId: "operation_1",
      queueReceiptId: "receipt_1",
    };
    const legacyDequeued: DequeuedWriteCommand = {
      ...command,
      queueReceiptId: "legacy_receipt",
    };

    expect(modernDequeued.operationId).toBe("operation_1");
    expect(modernDequeued.queueReceiptId).toBe("receipt_1");
    expect(modernDequeued.operationId).not.toBe(modernDequeued.queueReceiptId);
    expect(legacyDequeued.operationId).toBeUndefined();

    const legacyQueue: WriteQueue = {
      async enqueue(input) {
        return {
          operationId: "operation_legacy",
          state: "queued",
          partitionKey: input.partitionKey,
          aggregateKey: input.aggregateKey,
          acceptedAtEpochMs: input.submittedAtEpochMs,
          updatedAtEpochMs: input.submittedAtEpochMs,
        };
      },
      async dequeue() {
        return [legacyDequeued];
      },
      async ack() {},
      async nack() {},
    };

    expect(await legacyQueue.dequeue("pk_queue_identity", 1)).toEqual([legacyDequeued]);
  });
});
