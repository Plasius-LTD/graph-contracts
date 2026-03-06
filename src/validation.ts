import type { DomainEvent, GraphQuery, ResolverRequest, WriteCommand } from "./types.js";

const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === "string");
const isSafeKey = (value: string): boolean => /^[A-Za-z0-9:_-]+$/.test(value);

export const isResolverRequest = (value: unknown): value is ResolverRequest => {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.resolver !== "string" || value.resolver.length === 0) {
    return false;
  }

  if (typeof value.key !== "string" || value.key.length === 0) {
    return false;
  }

  if (value.tags !== undefined && !isStringArray(value.tags)) {
    return false;
  }

  if (value.params !== undefined && !isObject(value.params)) {
    return false;
  }

  return true;
};

export const isGraphQuery = (value: unknown): value is GraphQuery => {
  if (!isObject(value)) {
    return false;
  }

  if (!Array.isArray(value.requests)) {
    return false;
  }

  return value.requests.every((request) => isResolverRequest(request));
};

export const isDomainEvent = (value: unknown): value is DomainEvent => {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string" || typeof value.type !== "string") {
    return false;
  }

  if (typeof value.occurredAtEpochMs !== "number") {
    return false;
  }

  if (typeof value.aggregateKey !== "string") {
    return false;
  }

  if (value.entityKey !== undefined && typeof value.entityKey !== "string") {
    return false;
  }

  if (typeof value.version !== "string" && typeof value.version !== "number") {
    return false;
  }

  if (!isObject(value.payload)) {
    return false;
  }

  if (!isStringArray(value.tags)) {
    return false;
  }

  if (typeof value.schemaVersion !== "string" || typeof value.source !== "string") {
    return false;
  }

  return true;
};

export const isWriteCommand = (value: unknown): value is WriteCommand => {
  if (!isObject(value)) {
    return false;
  }

  if (
    typeof value.idempotencyKey !== "string"
    || value.idempotencyKey.length === 0
    || value.idempotencyKey.length > 128
    || !isSafeKey(value.idempotencyKey)
  ) {
    return false;
  }

  if (
    typeof value.partitionKey !== "string"
    || value.partitionKey.length === 0
    || value.partitionKey.length > 128
    || !isSafeKey(value.partitionKey)
  ) {
    return false;
  }

  if (
    typeof value.aggregateKey !== "string"
    || value.aggregateKey.length === 0
    || value.aggregateKey.length > 256
    || !isSafeKey(value.aggregateKey)
  ) {
    return false;
  }

  if (!isObject(value.payload)) {
    return false;
  }

  if (typeof value.submittedAtEpochMs !== "number" || !Number.isFinite(value.submittedAtEpochMs) || value.submittedAtEpochMs < 0) {
    return false;
  }

  if (value.actorId !== undefined && (typeof value.actorId !== "string" || value.actorId.length === 0 || value.actorId.length > 128)) {
    return false;
  }

  return true;
};
