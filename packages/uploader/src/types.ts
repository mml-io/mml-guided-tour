// Types for MSquared API based on OpenAPI spec

import { ComponentTypeFromName } from "@marcuslongmuir/openapi-typescript-helpers";

import { apiSchema } from "./api-schema";

export interface UploadConfig {
  apiKey: string;
  projectId: string;
  worldId: string;
  bucketId: string;
  buildDir: string;
  apiUrl?: string;
  dryRun?: boolean;
}

export type MMLObjectInstance = ComponentTypeFromName<
  typeof apiSchema,
  "v1_mmlObjects_MMLObjectInstance"
>;

export type World = ComponentTypeFromName<typeof apiSchema, "v1_worlds_World">;
export type CreateWorldBody = ComponentTypeFromName<typeof apiSchema, "v1_worlds_CreateWorldBody">;
export type UpdateWorldBody = ComponentTypeFromName<typeof apiSchema, "v1_worlds_UpdateWorldBody">;
export type MMLDocument = ComponentTypeFromName<typeof apiSchema, "v1_worlds_MMLDocument">;
export type Position = ComponentTypeFromName<typeof apiSchema, "v1_worlds_Position">;
export type Rotation = ComponentTypeFromName<typeof apiSchema, "v1_worlds_Rotation">;
export type Scale = ComponentTypeFromName<typeof apiSchema, "v1_worlds_Scale">;
export type WorldMMLDocumentsConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldMMLDocumentsConfiguration"
>;
export type WorldChatConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldChatConfiguration"
>;
export type WorldAuthConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldAuthConfiguration"
>;

export type AuthConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldAuthConfiguration"
>;

export type WorldEnvironmentConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldEnvironmentConfiguration"
>;

export type WorldDisplayNameConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldDisplayNameConfiguration"
>;

export type WorldAvatarConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldAvatarConfiguration"
>;

export type WorldGeneralConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldGeneralConfiguration"
>;

export type WorldLoadingConfiguration = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldLoadingConfiguration"
>;

export type WorldAvatar = ComponentTypeFromName<typeof apiSchema, "v1_worlds_WorldAvatar">;

export type WorldsAPIError = ComponentTypeFromName<typeof apiSchema, "Error">;

export type WorldAuthWebHookResponse = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WorldAuthWebHookResponse"
>;

export type WebWorldInstanceUsageInterval = ComponentTypeFromName<
  typeof apiSchema,
  "v1_worlds_WebWorldInstanceUsageInterval"
>;

export type WorldQuota = ComponentTypeFromName<typeof apiSchema, "v1_worlds_WorldQuota">;

export type CreateMMLObjectInstanceBody = ComponentTypeFromName<
  typeof apiSchema,
  "v1_mmlObjects_CreateMMLObjectInstanceBody"
>;

export type UpdateMMLObjectInstanceBody = ComponentTypeFromName<
  typeof apiSchema,
  "v1_mmlObjects_UpdateMMLObjectInstanceBody"
>;

export type PublicBucketFile = ComponentTypeFromName<
  typeof apiSchema,
  "v1_storageService_PublicBucketFile"
>;

export interface Manifest {
  worlds: string[];
  documentNameToPath: Record<string, string>;
  assetNameToPath: Record<string, string>;
  documentPrefix: string;
  assetPrefix: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
