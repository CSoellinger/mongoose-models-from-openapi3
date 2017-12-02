declare namespace MMFO {
  type Options = {
  };
}

declare interface OpenAPI3Spec {
  openapi: string;
  info?: OpenAPI3SpecInfo;
  externalDocs?: OpenAPI3SpecExternalDocs | OpenAPI3SpecExternalDocs[];
  servers: OpenAPI3SpecServers | OpenAPI3SpecServers[];
  tags?: OpenAPI3SpecTags | OpenAPI3SpecTags[];
  components: OpenAPI3SpecComponents;
  paths: OpenAPI3SpecPaths;
  'x-openapi-mongoose'?: OpenAPI3MongooseGlobalOptions;
}

declare interface OpenAPI3SpecInfo {
  title: string;
  description: string;
  version: string;
  contact: any;
}

declare interface OpenAPI3SpecExternalDocs {
  url: string;
  description: string;
}

declare interface OpenAPI3SpecServers {
  url: string;
  description: string;
}

declare interface OpenAPI3SpecTags {
  name: string;
  description: string;
}

declare interface OpenAPI3SpecComponents {
  schemas: any;
  securitySchemes: any;
  parameters: any;
  responses: any;
  requestBodies: any;
}

declare interface OpenAPI3SpecPaths {
  [index: string]: OpenAPI3SpecMethods;
}

declare interface OpenAPI3SpecMethods {
  [index: string]: OpenAPI3SpecMethodOptions;
}

declare interface OpenAPI3SpecMethodOptions {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: any;
  requestBody?: any;
  responses: any;
  security?: any;
  'x-handle-mongoose-model'?: string;
  'x-middleware-handle-request'?: string;
  'x-middleware-send-response'?: string;
}

declare interface OpenAPI3MongooseGlobalOptions {
  'schema-options': {
    'exclude-schemas': any[];
  };
}
