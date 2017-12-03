import { OpenApi3Util } from 'openapi3-util';
export declare class MongooseOpenApi3 {
    static models: any;
    static schemas: any;
    static loadSpecification(openapiSpec: string | OpenApi3Util): Promise<{}>;
}
declare const _default: typeof MongooseOpenApi3.loadSpecification;
export default _default;
