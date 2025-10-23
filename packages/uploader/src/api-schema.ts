/**
 * M-Squared API OpenAPI Schema
 * Generated from: http://api.msquared.io/openapi.json
 */

export const apiSchema = {
  openapi: "3.0.0",
  servers: [
    {
      url: "https://api.msquared.io",
    },
  ],
  info: {
    title: "M-Serve",
    version: "0.1.0",
  },
  paths: {
    "/v1/mml-objects/{projectId}/object-instances/": {
      get: {
        summary: "List MML Object Instances",
        operationId: "v1_mmlObjects_listMMLObjectInstances",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "offset",
            in: "query",
            description: "The offset into queried items to return",
            required: false,
            schema: {
              type: "integer",
              minimum: 0,
              format: "int32",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
          {
            name: "search",
            in: "query",
            description: "Search query",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "A paged array of MML Object Instances",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["objects", "totalResults", "offset", "limit", "canWrite"],
                  properties: {
                    objects: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstance",
                      },
                    },
                    totalResults: {
                      type: "integer",
                    },
                    offset: {
                      type: "integer",
                    },
                    limit: {
                      type: "integer",
                    },
                    canWrite: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Create an MML Object Instance",
        operationId: "v1_mmlObjects_createObjectInstance",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "MML Object Instance to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_mmlObjects_CreateMMLObjectInstanceBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstance",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances/{instanceId}": {
      get: {
        summary: "Retrieve an MML Object Instance",
        operationId: "v1_mmlObjects_getMMLObjectInstance",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The id of the MML Object Instance to retrieve",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstance",
                    },
                    {
                      required: ["canWrite"],
                      properties: {
                        canWrite: {
                          type: "boolean",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Edit an MML Object Instance",
        operationId: "v1_mmlObjects_updateMMLObjectInstance",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The id of the MML Object Instance to edit",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "MML Object Instance updates",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_mmlObjects_UpdateMMLObjectInstanceBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstance",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      delete: {
        summary: "Delete an MML Object Instance",
        operationId: "v1_mmlObjects_deleteMMLObjectInstance",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The id of the MML Object Instance to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "204": {
            description: "The MML Object Instance was deleted",
          },
          default: {
            description: "An error occurred",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances/{instanceId}/runs": {
      get: {
        summary: "List MML Object Instance run history",
        operationId: "v1_mmlObjects_listMMLObjectInstanceRuns",
        tags: ["runs"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The ID of the MML Object Instance",
            schema: {
              type: "string",
            },
          },
          {
            name: "offset",
            in: "query",
            description: "The offset into queried items to return",
            required: false,
            schema: {
              type: "integer",
              minimum: 0,
              format: "int32",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
        ],
        responses: {
          "200": {
            description: "A paged array of MML Object Instance runs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["runs", "totalResults", "offset", "limit"],
                  properties: {
                    runs: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstanceRun",
                      },
                    },
                    totalResults: {
                      type: "integer",
                    },
                    offset: {
                      type: "integer",
                    },
                    limit: {
                      type: "integer",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances/{instanceId}/runs/{runId}/logs": {
      get: {
        summary: "Retrieve logs for a run",
        operationId: "v1_mmlObjects_getMMLObjectInstanceRunLogs",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The ID of the MML Object Instance",
            schema: {
              type: "string",
            },
          },
          {
            name: "runId",
            in: "path",
            required: true,
            description: "The ID of the run history entry for which to fetch logs",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Returns the logs directly",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                },
              },
            },
          },
          "302": {
            description: "Redirect to Logs URL",
            headers: {
              location: {
                schema: {
                  type: "string",
                  description: "A signed URL to access the logs",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances/{instanceId}/log-access": {
      get: {
        summary: "Retrieve log access information for an MML Object Instance",
        operationId: "v1_mmlObjects_getMMLObjectInstanceLogAccess",
        tags: ["objects"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the MML Object Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            in: "path",
            required: true,
            description: "The id of the MML Object Instance to retrieve",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstanceLogAccess",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances/{instanceId}/usage": {
      get: {
        summary: "List usage for an MML Object Instance",
        operationId: "v1_mmlObjects_listMMLObjectInstanceUsage",
        tags: ["objects", "usage"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project",
            schema: {
              type: "string",
            },
          },
          {
            name: "instanceId",
            description: "The id of the MML Object Instance",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startTime",
            description: "The starting ISO 8601 timestamp of the usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "endTime",
            description: "The ending ISO 8601 timestamp for this usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "interval",
            description: "An ISO 8601 duration for the interval",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: ["P1D", "PT1H", "PT1M"],
            },
          },
        ],
        responses: {
          "200": {
            description: "The MML Object Instance's usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["intervals"],
                  properties: {
                    intervals: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstanceUsageInterval",
                      },
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances-quota": {
      get: {
        summary: "Retrieve quota for MML Object Instances",
        operationId: "v1_mmlObjects_getProjectQuota",
        tags: ["objects", "quota"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "MML Object Instance quota limit and current usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quota"],
                  properties: {
                    quota: {
                      $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstanceQuota",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/mml-objects/{projectId}/object-instances-usage": {
      get: {
        summary: "List usage for MML Object Instances",
        operationId: "v1_mmlObjects_listProjectUsage",
        tags: ["objects", "usage"],
        parameters: [
          {
            name: "projectId",
            description: "The id of the Project",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startTime",
            description: "The starting ISO 8601 timestamp of the usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "endTime",
            description: "The ending ISO 8601 timestamp for this usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "interval",
            description: "An ISO 8601 duration for the interval",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: ["P1D", "PT1H", "PT1M"],
            },
          },
        ],
        responses: {
          "200": {
            description: "MML Object Instance usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["intervals"],
                  properties: {
                    intervals: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_mmlObjects_MMLObjectInstanceUsageInterval",
                      },
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/worlds/{projectId}/web-world-instances/": {
      get: {
        summary: "List Web World Instances",
        operationId: "v1_worlds_listWorlds",
        tags: ["worlds"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Web World belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "offset",
            in: "query",
            description: "The offset into queried items to return",
            required: false,
            schema: {
              type: "integer",
              minimum: 0,
              format: "int32",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
          {
            name: "search",
            in: "query",
            description: "Search query",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "A paged array of Web World Instances",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["worlds", "totalResults", "offset", "limit", "canWrite", "tier"],
                  properties: {
                    worlds: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_worlds_World",
                      },
                    },
                    totalResults: {
                      type: "integer",
                    },
                    offset: {
                      type: "integer",
                    },
                    limit: {
                      type: "integer",
                    },
                    canWrite: {
                      type: "boolean",
                    },
                    tier: {
                      $ref: "#/components/schemas/v1_worlds_WebWorldsTier",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Create a Web World Instance",
        operationId: "v1_worlds_createWorld",
        tags: ["worlds"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Web World Instance belongs to",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "Web World Instance to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_worlds_CreateWorldBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_worlds_World",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/worlds/{projectId}/web-world-instances/{worldId}": {
      get: {
        summary: "Retrieve a Web World Instance",
        operationId: "v1_worlds_getWorld",
        tags: ["worlds"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Web World Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            in: "path",
            required: true,
            description: "The id of the Web World Instance to retrieve",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/v1_worlds_World",
                    },
                    {
                      required: ["canWrite", "tier"],
                      properties: {
                        canWrite: {
                          type: "boolean",
                        },
                        tier: {
                          $ref: "#/components/schemas/v1_worlds_WebWorldsTier",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Edit a Web World Instance",
        operationId: "v1_worlds_updateWorld",
        tags: ["worlds"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Web World Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            in: "path",
            required: true,
            description: "The id of the Web World Instance to edit",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "Web World Instance updates",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_worlds_UpdateWorldBody",
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_worlds_World",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      delete: {
        summary: "Delete a Web World Instance",
        operationId: "v1_worlds_deleteWorld",
        tags: ["worlds"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Web World Instance belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            in: "path",
            required: true,
            description: "The id of the Web World Instance to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "204": {
            description: "The Web World Instance was deleted",
          },
          default: {
            description: "An error occurred",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/v1/worlds/{projectId}/web-world-instances/{worldId}/usage": {
      get: {
        summary: "List usage for a Web World Instance",
        operationId: "v1_worlds_listWorldUsage",
        tags: ["worlds", "usage"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project",
            schema: {
              type: "string",
            },
          },
          {
            name: "worldId",
            description: "The id of the Web World Instance",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startTime",
            description: "The starting ISO 8601 timestamp of the usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "endTime",
            description: "The ending ISO 8601 timestamp for this usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "interval",
            description: "An ISO 8601 duration for the interval",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: ["P1D", "PT1H", "PT1M"],
            },
          },
        ],
        responses: {
          "200": {
            description: "The Web World Instance's usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["intervals"],
                  properties: {
                    intervals: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_worlds_WebWorldInstanceUsageInterval",
                      },
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/worlds/{projectId}/web-world-instances-quota": {
      get: {
        summary: "Retrieve quota for Web World Instances",
        operationId: "v1_worlds_getProjectQuota",
        tags: ["worlds", "quota"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Web World Instance quota limit and current usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quota"],
                  properties: {
                    quota: {
                      $ref: "#/components/schemas/v1_worlds_WorldQuota",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/worlds/{projectId}/web-world-instances-usage": {
      get: {
        summary: "List usage for Web World Instances",
        operationId: "v1_worlds_listProjectUsage",
        tags: ["worlds", "usage"],
        parameters: [
          {
            name: "projectId",
            description: "The id of the Project",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
          {
            name: "startTime",
            description: "The starting ISO 8601 timestamp of the usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "endTime",
            description: "The ending ISO 8601 timestamp for this usage period",
            in: "query",
            required: true,
            schema: {
              type: "string",
              format: "date-time",
            },
          },
          {
            name: "interval",
            description: "An ISO 8601 duration for the interval",
            in: "query",
            required: true,
            schema: {
              type: "string",
              enum: ["P1D", "PT1H", "PT1M"],
            },
          },
        ],
        responses: {
          "200": {
            description: "Web World Instance usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["intervals"],
                  properties: {
                    intervals: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_worlds_WebWorldInstanceUsageInterval",
                      },
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/": {
      get: {
        summary: "List Public Buckets",
        operationId: "v1_storageService_listPublicBuckets",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "offset",
            in: "query",
            description: "The offset into queried items to return",
            required: false,
            schema: {
              type: "integer",
              minimum: 0,
              format: "int32",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
          {
            name: "search",
            in: "query",
            description: "Search query",
            required: false,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "A paged array of Public Buckets",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["publicBuckets", "totalResults", "offset", "limit", "canWrite"],
                  properties: {
                    publicBuckets: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/v1_storageService_PublicBucket",
                      },
                    },
                    totalResults: {
                      type: "integer",
                    },
                    offset: {
                      type: "integer",
                    },
                    limit: {
                      type: "integer",
                    },
                    canWrite: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Create a Public Bucket",
        operationId: "v1_storageService_createPublicBucket",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "Public Bucket to create",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_storageService_CreatePublicBucketBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_storageService_PublicBucket",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/{publicBucketId}": {
      get: {
        summary: "Retrieve a Public Bucket",
        operationId: "v1_storageService_getPublicBucket",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to retrieve",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    {
                      $ref: "#/components/schemas/v1_storageService_PublicBucket",
                    },
                    {
                      required: ["canWrite"],
                      properties: {
                        canWrite: {
                          type: "boolean",
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      post: {
        summary: "Edit a Public Bucket",
        operationId: "v1_storageService_updatePublicBucket",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to edit",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "Public Bucket updates",
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/v1_storageService_UpdatePublicBucketBody",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Expected response to a valid request",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_storageService_PublicBucket",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
      delete: {
        summary: "Delete a Public Bucket",
        operationId: "v1_storageService_deletePublicBucket",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          204: {
            description: "The Public Bucket was deleted",
          },
          default: {
            description: "An error occurred",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/{publicBucketId}/files": {
      get: {
        summary: "List files in a Public Bucket",
        operationId: "v1_storageService_listPublicBucketFiles",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to list files for",
            schema: {
              type: "string",
            },
          },
          {
            name: "continuationToken",
            in: "query",
            description: "Token to continue listing from a previous request",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "limit",
            in: "query",
            description: "How many items to return at one time (max 100)",
            required: false,
            schema: {
              type: "integer",
              maximum: 100,
              format: "int32",
            },
          },
          {
            name: "prefix",
            in: "query",
            description: "Prefix to filter files by",
            required: false,
            schema: {
              type: "string",
            },
          },
          {
            name: "directories",
            in: "query",
            description:
              "Whether to include directories in the response or show files as flat list",
            required: false,
            schema: {
              type: "boolean",
            },
          },
        ],
        responses: {
          200: {
            description: "A paged array of Public Bucket files",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["files", "limit"],
                  properties: {
                    files: {
                      type: "array",
                      items: {
                        discriminator: {
                          propertyName: "kind",
                        },
                        oneOf: [
                          {
                            $ref: "#/components/schemas/v1_storageService_PublicBucketFile",
                          },
                          {
                            $ref: "#/components/schemas/v1_storageService_PublicBucketDirectory",
                          },
                        ],
                      },
                    },
                    limit: {
                      type: "integer",
                    },
                    nextContinuationToken: {
                      type: "string",
                      description:
                        "Token to pass to get the next set of results, null if no more results",
                      nullable: true,
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/{publicBucketId}/upload-file": {
      post: {
        summary: "Upload a file to a Public Bucket",
        operationId: "v1_storageService_uploadPublicBucketFile",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to upload to",
            schema: {
              type: "string",
            },
          },
          {
            name: "fullPath",
            in: "query",
            required: false,
            description: "The full path of the file to upload",
            schema: {
              type: "string",
            },
          },
          {
            name: "filename",
            in: "query",
            required: false,
            description: "The name of the file to upload",
            schema: {
              type: "string",
            },
          },
          {
            name: "directory",
            in: "query",
            required: false,
            description: "The directory in which the file will be uploaded",
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "The file content to upload",
          required: true,
          content: {
            "application/json": {
              // TODO - should be multipart/form-data
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "The file to upload",
                  },
                  contentType: {
                    type: "string",
                    description: "Optional content type to override the file's detected MIME type",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "File uploaded successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_storageService_PublicBucketFile",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/{publicBucketId}/file-metadata": {
      get: {
        summary: "Get metadata for a file in a Public Bucket",
        operationId: "v1_storageService_getPublicBucketFileMetadata",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket the file belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "fullPath",
            in: "query",
            required: true,
            description: "The full path of the file to get metadata for",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "File metadata retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/v1_storageService_PublicBucketFile",
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets/{publicBucketId}/delete-file": {
      delete: {
        summary: "Delete a file from a Public Bucket",
        operationId: "v1_storageService_deletePublicBucketFile",
        tags: ["storage", "public_buckets"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project the Public Bucket belongs to",
            schema: {
              type: "string",
            },
          },
          {
            name: "publicBucketId",
            in: "path",
            required: true,
            description: "The id of the Public Bucket to delete the file from",
            schema: {
              type: "string",
            },
          },
          {
            name: "fullPath",
            in: "query",
            required: true,
            description: "The full path of the file to delete",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "File deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
    "/v1/storage/{projectId}/public-buckets-quota": {
      get: {
        summary: "Retrieve quota for Public Buckets",
        operationId: "v1_storageService_getPublicBucketsQuota",
        tags: ["storage", "public_buckets", "quota"],
        parameters: [
          {
            name: "projectId",
            in: "path",
            required: true,
            description: "The id of the Project",
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Bucket quota limit and current usage",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["quota"],
                  properties: {
                    quota: {
                      $ref: "#/components/schemas/v1_storageService_PublicBucketQuota",
                    },
                  },
                },
              },
            },
          },
          default: {
            $ref: "#/components/responses/Error",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      UserIdOrAPIKeyId: {
        oneOf: [
          {
            type: "object",
            required: ["userId", "type"],
            properties: {
              userId: {
                type: "string",
              },
              type: {
                type: "string",
                enum: ["user"],
              },
            },
          },
          {
            type: "object",
            required: ["apiKeyId", "type"],
            properties: {
              apiKeyId: {
                type: "string",
              },
              type: {
                type: "string",
                enum: ["apiKey"],
              },
            },
          },
        ],
      },
      Error: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
          },
        },
      },
      v1_mmlObjects_CreateMMLObjectInstanceBody: {
        type: "object",
        required: ["name", "source"],
        properties: {
          id: {
            type: "string",
            pattern: "^[a-z0-9-]{1,32}$",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          enabled: {
            type: "boolean",
          },
          source: {
            $ref: "#/components/schemas/v1_mmlObjects_MMLObjectSource",
          },
        },
      },
      v1_mmlObjects_UpdateMMLObjectInstanceBody: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          enabled: {
            type: "boolean",
          },
          parameters: {
            type: "object",
            additionalProperties: true,
          },
          source: {
            $ref: "#/components/schemas/v1_mmlObjects_MMLObjectSource",
          },
        },
      },
      v1_mmlObjects_MMLObjectInstance: {
        type: "object",
        required: ["id", "name", "enabled", "source", "url", "createdAt", "createdBy"],
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          url: {
            type: "string",
          },
          enabled: {
            type: "boolean",
          },
          source: {
            $ref: "#/components/schemas/v1_mmlObjects_MMLObjectSource",
          },
          parameters: {
            type: "object",
            additionalProperties: true,
          },
          createdAt: {
            type: "string",
          },
          createdBy: {
            $ref: "#/components/schemas/UserIdOrAPIKeyId",
          },
        },
      },
      v1_mmlObjects_MMLObjectSource: {
        oneOf: [
          {
            type: "object",
            required: ["type", "source"],
            properties: {
              type: {
                type: "string",
                enum: ["source"],
              },
              source: {
                type: "string",
              },
              parametersSchema: {
                type: "object",
                additionalProperties: true,
              },
            },
          },
        ],
      },
      v1_mmlObjects_MMLObjectInstanceLogAccess: {
        type: "object",
        required: ["url", "token"],
        properties: {
          url: {
            type: "string",
          },
          token: {
            type: "string",
          },
        },
      },
      v1_mmlObjects_MMLObjectInstanceUsageInterval: {
        type: "object",
        required: ["startTime", "endTime", "connectedClients", "connectedClientMicroseconds"],
        properties: {
          startTime: {
            type: "string",
            format: "date-time",
          },
          endTime: {
            type: "string",
            format: "date-time",
          },
          connectedClients: {
            type: "integer",
          },
          connectedClientMicroseconds: {
            type: "integer",
          },
        },
      },
      v1_mmlObjects_MMLObjectInstanceQuota: {
        type: "object",
        required: ["limit", "current"],
        properties: {
          limit: {
            type: "integer",
          },
          current: {
            type: "integer",
          },
        },
      },
      v1_mmlObjects_MMLObjectInstanceRun: {
        type: "object",
        required: ["id", "status", "startTime"],
        properties: {
          id: {
            type: "string",
            description: "The unique ID for this run",
          },
          status: {
            type: "string",
            enum: ["running", "ended", "errored"],
            description: "Current status of the run",
          },
          startTime: {
            type: "string",
            format: "date-time",
            description: "The ISO 8601 timestamp for when this run started",
          },
          endTime: {
            type: "string",
            format: "date-time",
            description: "The ISO 8601 timestamp for when this run ended",
          },
          message: {
            type: "string",
            description: "An additional message in the case of an error",
          },
          logFile: {
            type: "string",
            description: "The GCS object where logs for this run are stored",
          },
        },
      },
      v1_worlds_CreateWorldBody: {
        type: "object",
        required: ["name"],
        properties: {
          id: {
            type: "string",
            pattern: "^[a-z0-9-]{1,32}$",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          generalConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldGeneralConfiguration",
          },
          chatConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldChatConfiguration",
          },
          authConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAuthConfiguration",
          },
          displayNameConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldDisplayNameConfiguration",
          },
          mmlDocumentsConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldMMLDocumentsConfiguration",
          },
          environmentConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldEnvironmentConfiguration",
          },
          avatarConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAvatarConfiguration",
          },
          loadingConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldLoadingConfiguration",
          },
          enableTweakPane: {
            type: "boolean",
          },
          allowOrbitalCamera: {
            type: "boolean",
          },
        },
      },
      v1_worlds_UpdateWorldBody: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          generalConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldGeneralConfiguration",
          },
          chatConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldChatConfiguration",
          },
          authConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAuthConfiguration",
          },
          displayNameConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldDisplayNameConfiguration",
          },
          mmlDocumentsConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldMMLDocumentsConfiguration",
          },
          environmentConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldEnvironmentConfiguration",
          },
          avatarConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAvatarConfiguration",
          },
          loadingConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldLoadingConfiguration",
          },
          enableTweakPane: {
            type: "boolean",
          },
          allowOrbitalCamera: {
            type: "boolean",
          },
        },
      },
      v1_worlds_World: {
        type: "object",
        required: [
          "id",
          "name",
          "authConfiguration",
          "chatConfiguration",
          "mmlDocumentsConfiguration",
          "environmentConfiguration",
          "avatarConfiguration",
          "loadingConfiguration",
          "createdAt",
          "createdBy",
          "url",
        ],
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
          },
          description: {
            type: "string",
          },
          generalConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldGeneralConfiguration",
          },
          chatConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldChatConfiguration",
          },
          authConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAuthConfiguration",
          },
          displayNameConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldDisplayNameConfiguration",
          },
          mmlDocumentsConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldMMLDocumentsConfiguration",
          },
          environmentConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldEnvironmentConfiguration",
          },
          avatarConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldAvatarConfiguration",
          },
          loadingConfiguration: {
            $ref: "#/components/schemas/v1_worlds_WorldLoadingConfiguration",
          },
          createdAt: {
            type: "string",
          },
          createdBy: {
            $ref: "#/components/schemas/UserIdOrAPIKeyId",
          },
          url: {
            type: "string",
          },
          enableTweakPane: {
            type: "boolean",
          },
          allowOrbitalCamera: {
            type: "boolean",
          },
        },
      },
      v1_worlds_WorldGeneralConfiguration: {
        type: "object",
        properties: {
          maxUserConnections: {
            type: "number",
          },
        },
      },
      v1_worlds_WorldAuthConfiguration: {
        type: "object",
        required: ["allowAnonymous"],
        properties: {
          allowAnonymous: {
            type: "boolean",
          },
          password: {
            type: "string",
          },
          authProviders: {
            type: "object",
            properties: {
              webhook: {
                type: "object",
                required: ["webhookUrl"],
                properties: {
                  webhookUrl: {
                    type: "string",
                  },
                },
              },
              google: {
                type: "object",
                properties: {
                  allowedOrganizations: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  allowedUsers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
              discord: {
                type: "object",
                properties: {
                  allowedUsers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
      v1_worlds_WorldDisplayNameConfiguration: {
        type: "object",
        properties: {
          allowCustomDisplayNames: {
            type: "boolean",
          },
        },
      },
      v1_worlds_WorldMMLDocumentsConfiguration: {
        type: "object",
        required: ["mmlDocuments"],
        properties: {
          mmlDocuments: {
            type: "object",
            additionalProperties: {
              $ref: "#/components/schemas/v1_worlds_MMLDocument",
            },
          },
        },
      },
      v1_worlds_WorldChatConfiguration: {
        type: "object",
        required: ["enabled"],
        properties: {
          enabled: {
            type: "boolean",
          },
        },
      },
      v1_worlds_WebWorldInstanceUsageInterval: {
        type: "object",
        required: ["startTime", "endTime", "connectedClients", "connectedClientMicroseconds"],
        properties: {
          startTime: {
            type: "string",
            format: "date-time",
          },
          endTime: {
            type: "string",
            format: "date-time",
          },
          connectedClients: {
            type: "integer",
          },
          connectedClientMicroseconds: {
            type: "integer",
          },
        },
      },
      v1_worlds_WorldQuota: {
        type: "object",
        required: ["limit", "current"],
        properties: {
          limit: {
            type: "integer",
          },
          current: {
            type: "integer",
          },
        },
      },
      v1_worlds_MMLDocument: {
        type: "object",
        required: ["url"],
        properties: {
          url: {
            type: "string",
          },
          position: {
            $ref: "#/components/schemas/v1_worlds_Position",
          },
          rotation: {
            $ref: "#/components/schemas/v1_worlds_Rotation",
          },
          scale: {
            $ref: "#/components/schemas/v1_worlds_Scale",
          },
        },
      },
      v1_worlds_Position: {
        type: "object",
        required: ["x", "y", "z"],
        properties: {
          x: {
            type: "number",
          },
          y: {
            type: "number",
          },
          z: {
            type: "number",
          },
        },
      },
      v1_worlds_Rotation: {
        type: "object",
        required: ["x", "y", "z"],
        properties: {
          x: {
            type: "number",
          },
          y: {
            type: "number",
          },
          z: {
            type: "number",
          },
        },
      },
      v1_worlds_Scale: {
        type: "object",
        required: ["x", "y", "z"],
        properties: {
          x: {
            type: "number",
          },
          y: {
            type: "number",
          },
          z: {
            type: "number",
          },
        },
      },
      v1_worlds_WorldEnvironmentConfiguration: {
        type: "object",
        properties: {
          groundPlane: {
            type: "boolean",
          },
          skybox: {
            $ref: "#/components/schemas/v1_worlds_Skybox",
          },
          envMap: {
            $ref: "#/components/schemas/v1_worlds_EnvMap",
          },
          sun: {
            $ref: "#/components/schemas/v1_worlds_Sun",
          },
          fog: {
            $ref: "#/components/schemas/v1_worlds_Fog",
          },
          postProcessing: {
            $ref: "#/components/schemas/v1_worlds_PostProcessing",
          },
          ambientLight: {
            $ref: "#/components/schemas/v1_worlds_AmbientLight",
          },
        },
      },
      v1_worlds_Skybox: {
        type: "object",
        properties: {
          intensity: {
            type: "number",
          },
          blurriness: {
            type: "number",
          },
          azimuthalAngle: {
            type: "number",
          },
          polarAngle: {
            type: "number",
          },
          hdrJpgUrl: {
            type: "string",
            description:
              "URL to a skybox image in HDR JPG format. Only one of hdrJpgUrl or hdrUrl should be provided.",
          },
          hdrUrl: {
            type: "string",
            description:
              "URL to a skybox image in HDR format. Only one of hdrJpgUrl or hdrUrl should be provided.",
          },
        },
      },
      v1_worlds_EnvMap: {
        type: "object",
        properties: {
          intensity: {
            type: "number",
          },
        },
      },
      v1_worlds_Sun: {
        type: "object",
        properties: {
          intensity: {
            type: "number",
          },
          polarAngle: {
            type: "number",
          },
          azimuthalAngle: {
            type: "number",
          },
        },
      },
      v1_worlds_Fog: {
        type: "object",
        properties: {
          fogNear: {
            type: "number",
          },
          fogFar: {
            type: "number",
          },
        },
      },
      v1_worlds_PostProcessing: {
        type: "object",
        properties: {
          bloomIntensity: {
            type: "number",
          },
        },
      },
      v1_worlds_AmbientLight: {
        type: "object",
        properties: {
          intensity: {
            type: "number",
          },
        },
      },
      v1_worlds_WorldAuthWebHookResponse: {
        type: "object",
        required: ["username", "characterDescription"],
        properties: {
          username: {
            type: "string",
          },
          characterDescription: {
            $ref: "#/components/schemas/v1_worlds_CharacterDescription",
          },
        },
      },
      v1_worlds_CharacterDescription: {
        oneOf: [
          {
            type: "object",
            required: ["meshFileUrl"],
            properties: {
              meshFileUrl: {
                type: "string",
              },
              mmlCharacterString: {
                type: "null",
              },
              mmlCharacterUrl: {
                type: "null",
              },
            },
          },
          {
            type: "object",
            required: ["mmlCharacterString"],
            properties: {
              meshFileUrl: {
                type: "null",
              },
              mmlCharacterString: {
                type: "string",
              },
              mmlCharacterUrl: {
                type: "null",
              },
            },
          },
          {
            type: "object",
            required: ["mmlCharacterUrl"],
            properties: {
              meshFileUrl: {
                type: "null",
              },
              mmlCharacterString: {
                type: "null",
              },
              mmlCharacterUrl: {
                type: "string",
              },
            },
          },
        ],
      },
      v1_worlds_WorldAvatarConfiguration: {
        type: "object",
        properties: {
          availableAvatars: {
            type: "array",
            items: {
              $ref: "#/components/schemas/v1_worlds_WorldAvatar",
            },
          },
          allowCustomAvatars: {
            type: "boolean",
          },
          customAvatarWebhookUrl: {
            type: "string",
          },
        },
      },
      v1_worlds_WorldAvatar: {
        oneOf: [
          {
            type: "object",
            required: ["meshFileUrl"],
            properties: {
              isDefaultAvatar: {
                type: "boolean",
              },
              meshFileUrl: {
                type: "string",
              },
              mmlCharacterString: {
                type: "null",
              },
              mmlCharacterUrl: {
                type: "null",
              },
              thumbnailUrl: {
                type: "string",
              },
              name: {
                type: "string",
              },
            },
          },
          {
            type: "object",
            required: ["mmlCharacterString"],
            properties: {
              isDefaultAvatar: {
                type: "boolean",
              },
              meshFileUrl: {
                type: "null",
              },
              mmlCharacterString: {
                type: "string",
              },
              mmlCharacterUrl: {
                type: "null",
              },
              thumbnailUrl: {
                type: "string",
              },
              name: {
                type: "string",
              },
            },
          },
          {
            type: "object",
            required: ["mmlCharacterUrl"],
            properties: {
              isDefaultAvatar: {
                type: "boolean",
              },
              meshFileUrl: {
                type: "null",
              },
              mmlCharacterString: {
                type: "null",
              },
              mmlCharacterUrl: {
                type: "string",
              },
              thumbnailUrl: {
                type: "string",
              },
              name: {
                type: "string",
              },
            },
          },
        ],
      },
      v1_worlds_WorldLoadingConfiguration: {
        type: "object",
        properties: {
          overlayLayers: {
            type: "array",
            items: {
              type: "object",
              properties: {
                overlayImageUrl: {
                  type: "string",
                },
                overlayAnchor: {
                  type: "string",
                  enum: ["top-left", "top-right", "bottom-left", "bottom-right"],
                },
                name: {
                  type: "string",
                },
                overlayOffset: {
                  type: "object",
                  properties: {
                    x: {
                      type: "number",
                    },
                    y: {
                      type: "number",
                    },
                  },
                },
              },
            },
          },
          background: {
            type: "string",
          },
          color: {
            type: "string",
          },
          backgroundImageUrl: {
            type: "string",
          },
          backgroundBlurAmount: {
            type: "number",
          },
          title: {
            type: "string",
          },
          subtitle: {
            type: "string",
          },
          enableCustomLoadingScreen: {
            type: "boolean",
          },
        },
      },
      v1_worlds_WebWorldsTier: {
        type: "string",
        enum: ["web-worlds-free-tier", "web-worlds-standard-tier", "web-worlds-premium-tier"],
      },
      v1_storageService_CreatePublicBucketBody: {
        type: "object",
        required: ["name"],
        properties: {
          id: {
            type: "string",
            pattern: "^(?=.{3,63}$)[a-z0-9]([a-z0-9]|-(?!-))*[a-z0-9]$",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
        },
      },
      v1_storageService_UpdatePublicBucketBody: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
        },
      },
      v1_storageService_PublicBucket: {
        type: "object",
        required: ["id", "name", "description", "storedSizeBytes", "createdAt", "createdBy", "url"],
        properties: {
          id: {
            type: "string",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 32,
          },
          description: {
            type: "string",
          },
          storedSizeBytes: {
            type: "integer",
          },
          createdAt: {
            type: "string",
          },
          createdBy: {
            $ref: "#/components/schemas/UserIdOrAPIKeyId",
          },
          url: {
            type: "string",
          },
        },
      },
      v1_storageService_PublicBucketFile: {
        type: "object",
        required: ["kind", "fullPath", "name", "url", "size", "createdAt", "eTag"],
        properties: {
          kind: {
            type: "string",
            enum: ["file"],
          },
          fullPath: {
            type: "string",
          },
          name: {
            type: "string",
          },
          eTag: {
            type: "string",
          },
          url: {
            type: "string",
          },
          size: {
            type: "integer",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      v1_storageService_PublicBucketDirectory: {
        type: "object",
        required: ["kind", "name", "fullPath"],
        properties: {
          kind: {
            type: "string",
            enum: ["directory"],
          },
          fullPath: {
            type: "string",
          },
        },
      },
      v1_storageService_PublicBucketQuota: {
        type: "object",
        required: ["bucketCount", "storedBytes"],
        properties: {
          bucketCount: {
            type: "object",
            required: ["limit", "current"],
            properties: {
              limit: {
                type: "integer",
              },
              current: {
                type: "integer",
              },
            },
          },
          storedBytes: {
            type: "object",
            required: ["limit", "current"],
            properties: {
              limit: {
                type: "integer",
              },
              current: {
                type: "integer",
              },
            },
          },
        },
      },
    },
    responses: {
      Error: {
        description: "An error occurred",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
} as const;

export type ApiSchema = typeof apiSchema;
