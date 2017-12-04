import { OpenAPI3Spec } from './interface';
export declare class RegisterClass {
    static registerModels(spec: OpenAPI3Spec): Promise<{
        models: any;
        schemas: any;
    } | undefined>;
}
