import { OpenAPI3Spec } from 'openapi3-util/lib/interface-specification';
export interface XOpenAPI3Spec extends OpenAPI3Spec {
    'x-openapi-mongoose'?: XOpenAPI3Spec.XOpenApiMongoose;
}
export declare namespace XOpenAPI3Spec {
    interface XOpenApiMongoose {
        'exclude-schemas'?: string[];
    }
    namespace Components {
        interface Schema extends OpenAPI3Spec.Components.Schema {
            'x-openapi-mongoose'?: Schema.XOpenApiMongoose;
        }
        namespace Schema {
            interface XOpenApiMongoose {
                exclude?: boolean;
                'reference-to-many'?: string[];
            }
            interface Property extends OpenAPI3Spec.Components.Schema.Property {
                'x-openapi-mongoose'?: Property.XOpenApiMongoose;
            }
            namespace Property {
                interface XOpenApiMongoose {
                    'reference-to-one'?: string;
                    'bcrypt-plugin-rounds-rounds'?: number;
                    'no-bcrypt-plugin'?: boolean;
                }
            }
        }
    }
}
