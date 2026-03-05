import type {
  CacheEnvelope,
  DomainEvent,
  GraphNodeResult,
  GraphQuery,
  GraphQueryResult,
  JsonValue,
  Version,
  WriteCommand,
  WriteOperation,
} from "./types.js";

export interface CacheSetOptions {
  ttlSeconds?: number;
}

export interface CacheStore {
  get<T>(key: string): Promise<CacheEnvelope<T> | null>;
  mget<T>(keys: string[]): Promise<Array<CacheEnvelope<T> | null>>;
  set<T>(key: string, envelope: CacheEnvelope<T>, options?: CacheSetOptions): Promise<void>;
  mset<T>(entries: Array<{ key: string; envelope: CacheEnvelope<T> }>, options?: CacheSetOptions): Promise<void>;
  invalidate(keys: string[]): Promise<number>;
  compareAndSet<T>(
    key: string,
    nextEnvelope: CacheEnvelope<T>,
    expectedVersion?: Version,
    options?: CacheSetOptions,
  ): Promise<boolean>;
}

export interface ResolverContext {
  traceId?: string;
  timeoutMs: number;
  attempts: number;
}

export interface ServiceResolver {
  resolve(request: GraphQuery["requests"][number], context: ResolverContext): Promise<GraphNodeResult>;
}

export interface EventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}

export interface EventConsumer {
  subscribe(handler: (event: DomainEvent) => Promise<void>): Promise<void>;
}

export interface WriteQueue {
  enqueue(command: WriteCommand): Promise<WriteOperation>;
  dequeue(partitionKey: string, limit: number): Promise<WriteCommand[]>;
  ack(operationId: string): Promise<void>;
  nack(operationId: string, reason: string): Promise<void>;
}

export interface OperationStore {
  put(operation: WriteOperation): Promise<void>;
  get(operationId: string): Promise<WriteOperation | null>;
  update(operation: WriteOperation): Promise<void>;
}

export interface TelemetryMetric {
  name: string;
  value: number;
  unit?: "count" | "ms" | "ratio";
  tags?: Record<string, string>;
}

export interface TelemetryError {
  message: string;
  source: string;
  code?: string;
  tags?: Record<string, string>;
}

export interface TelemetrySink {
  metric(metric: TelemetryMetric): void;
  error(error: TelemetryError): void;
  trace(name: string, payload: Record<string, JsonValue>): void;
}

export interface Clock {
  now(): number;
}

export interface IdGenerator {
  next(): string;
}

export interface QueryExecutor {
  execute(query: GraphQuery): Promise<GraphQueryResult>;
}
