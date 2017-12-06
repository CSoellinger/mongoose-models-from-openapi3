import { OpenAPI3Spec } from 'openapi3-util/lib/interface-specification';

export interface XOpenAPI3Spec extends OpenAPI3Spec {
  'x-openapi-mongoose'?: XOpenAPI3Spec.XOpenApiMongoose;
}

export namespace XOpenAPI3Spec {
  export interface XOpenApiMongoose {
    'exclude-schemas'?: string[];
  }
  
  export namespace Components {
    export interface Schema extends OpenAPI3Spec.Components.Schema {
      'x-openapi-mongoose'?: Schema.XOpenApiMongoose;
    }
    
    export namespace Schema {
      export interface XOpenApiMongoose {
        exclude?: boolean;
        'reference-to-many'?: string[];
      }

      export interface Property extends OpenAPI3Spec.Components.Schema.Property {
        'x-openapi-mongoose'?: Property.XOpenApiMongoose;
      }

      export namespace Property {
        export interface XOpenApiMongoose {
          'reference-to-one'?: string;
          'bcrypt-plugin-rounds-rounds'?: number;
          'no-bcrypt-plugin'?: boolean;
        }
      }
    }
  }
}
