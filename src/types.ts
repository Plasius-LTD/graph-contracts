export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type Version = string | number;

export interface CachePolicy {
  softTtlSeconds: number;
  hardTtlSeconds: number;
}

export interface CacheEnvelope<T> {
  key: string;
  value: T;
  fetchedAtEpochMs: number;
  policy: CachePolicy;
  version: Version;
  schemaVersion: string;
  source: string;
  tags: string[];
}

export interface ResolverRequest<TParams extends Record<string, JsonValue> = Record<string, JsonValue>> {
  resolver: string;
  key: string;
  params?: TParams;
  tags?: string[];
}

export interface GraphQuery {
  id?: string;
  traceId?: string;
  requests: ResolverRequest[];
}

export interface GraphNodeError {
  code: string;
  message: string;
  retryable: boolean;
  details?: Record<string, JsonValue>;
}

export interface GraphNodeResult {
  key: string;
  data: JsonValue | null;
  error?: GraphNodeError;
  stale: boolean;
  version?: Version;
  fetchedAtEpochMs?: number;
  tags: string[];
}

export interface GraphQueryResult {
  queryId?: string;
  partial: boolean;
  stale: boolean;
  generatedAtEpochMs: number;
  results: Record<string, GraphNodeResult>;
  errors: GraphNodeError[];
}

export type DomainEventType =
  | "graph.entity.updated"
  | "graph.entity.deleted"
  | "graph.aggregate.updated"
  | "graph.aggregate.deleted";

export interface DomainEvent {
  id: string;
  type: DomainEventType;
  occurredAtEpochMs: number;
  aggregateKey: string;
  entityKey?: string;
  version: Version;
  payload: Record<string, JsonValue>;
  tags: string[];
  schemaVersion: string;
  source: string;
}

export type WriteOperationState =
  | "accepted"
  | "queued"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface WriteCommand<TPayload extends Record<string, JsonValue> = Record<string, JsonValue>> {
  idempotencyKey: string;
  partitionKey: string;
  aggregateKey: string;
  payload: TPayload;
  submittedAtEpochMs: number;
  actorId?: string;
}

export interface WriteOperation {
  operationId: string;
  state: WriteOperationState;
  partitionKey: string;
  aggregateKey: string;
  acceptedAtEpochMs: number;
  updatedAtEpochMs: number;
  resultVersion?: Version;
  error?: string;
  queueDepthAtAccept?: number;
}

export interface GraphResponseMeta {
  traceId?: string;
  fromCache: boolean;
  staleServed: boolean;
}
