/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import { OpenApi3UtilClass } from 'openapi3-util';
export declare type MongooseOpenApi3Return = {
    models: MongooseOpenApi3Models;
    schemas: MongooseOpenApi3Schemas;
};
export declare type MongooseOpenApi3Models = {
    [index: string]: mongoose.Model<mongoose.Document>;
};
export declare type MongooseOpenApi3Schemas = {
    [index: string]: mongoose.Schema;
};
export declare class MongooseOpenApi3 {
    static models: MongooseOpenApi3Models;
    static schemas: MongooseOpenApi3Schemas;
    static loaded: Promise<MongooseOpenApi3Return>;
    static loadSpecification(openapiSpec: string | OpenApi3UtilClass): Promise<MongooseOpenApi3Return>;
}
declare const _default: typeof MongooseOpenApi3.loadSpecification;
export default _default;
