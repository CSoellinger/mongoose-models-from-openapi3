/// <reference types="mongoose" />
import { OpenApi3UtilClass } from 'openapi3-util';
import * as mongoose from 'mongoose';
export declare type MongooseOpenApi3Models = {
    [index: string]: mongoose.Model<mongoose.Document>;
};
export declare type MongooseOpenApi3Schemas = {
    [index: string]: mongoose.Schema;
};
export declare class MongooseOpenApi3ClassSync {
    private specification;
    models: MongooseOpenApi3Models;
    schemas: MongooseOpenApi3Schemas;
    setOpenApiSpecSync(openapiSpec: string | OpenApi3UtilClass): MongooseOpenApi3ClassSync;
    generateMongooseSchemasSync(): MongooseOpenApi3ClassSync;
    registerModelsSync(): MongooseOpenApi3ClassSync;
}
export declare class MongooseOpenApi3Class extends MongooseOpenApi3ClassSync {
    setOpenApiSpec(openapiSpec: string | OpenApi3UtilClass): Promise<any>;
    generateMongooseSchemas(): Promise<any>;
    registerModels(): Promise<any>;
}
declare const MongooseOpenApi3: MongooseOpenApi3Class;
export default MongooseOpenApi3;
