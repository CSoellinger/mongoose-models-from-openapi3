import { OpenAPI3Spec as OpenAPI3SpecOrig } from 'openapi3-util/lib/interface-specification';
export interface OpenAPI3Spec extends OpenAPI3SpecOrig {
    'x-openapi-mongoose': string;
}
