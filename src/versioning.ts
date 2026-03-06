import { DEPRECATED_SCHEMA_VERSIONS, SUPPORTED_SCHEMA_VERSIONS } from "./constants.js";

export type SchemaSupportLevel = "current" | "supported" | "deprecated" | "unsupported";

export const getSchemaSupportLevel = (schemaVersion: string): SchemaSupportLevel => {
  if (SUPPORTED_SCHEMA_VERSIONS[0] === schemaVersion) {
    return "current";
  }

  if (SUPPORTED_SCHEMA_VERSIONS.includes(schemaVersion as (typeof SUPPORTED_SCHEMA_VERSIONS)[number])) {
    return "supported";
  }

  if (DEPRECATED_SCHEMA_VERSIONS.includes(schemaVersion)) {
    return "deprecated";
  }

  return "unsupported";
};

export const isSchemaVersionSupported = (schemaVersion: string): boolean => {
  const level = getSchemaSupportLevel(schemaVersion);
  return level === "current" || level === "supported";
};
