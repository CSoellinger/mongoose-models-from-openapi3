/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import { OpenApi3Util } from 'openapi3-util';
export declare type MongooseOpenApi3Return = {
    models: mongoose.Model<mongoose.Document>[];
    schemas: mongoose.Schema[];
};
export declare class MongooseOpenApi3 {
    static models: mongoose.Model<mongoose.Document>[];
    static schemas: mongoose.Schema[];
    private static loaded;
    static loadSpecification(openapiSpec: string | OpenApi3Util): Promise<MongooseOpenApi3Return>;
}
declare const _default: typeof MongooseOpenApi3.loadSpecification;
export default _default;
