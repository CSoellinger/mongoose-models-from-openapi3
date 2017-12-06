/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import "mongoose-type-email";
import "mongoose-type-html";
export declare class SchemaClassSync {
    static getStringSchemaSync(property: any): any;
    static getNumberSchemaSync(property: any): any;
    static getPropertySchemaSync(property: any, propertyName?: string, requiredSchemaFields?: string[]): any;
    static getPropertiesSchemaSync(properties: any, requiredSchemaFields?: string[]): any;
    static getMongooseSchemaSync(properties: any, requiredSchemaFields?: string[]): mongoose.Schema;
}
export declare class SchemaClass extends SchemaClassSync {
    static getStringSchema(property: any): Promise<any>;
    static getNumberSchema(property: any): Promise<any>;
    static getPropertySchema(property: any, propertyName?: string, requiredSchemaFields?: string[]): Promise<any>;
    static getPropertiesSchema(properties: any, requiredSchemaFields?: string[]): Promise<any>;
    static getMongooseSchema(properties: any, requiredSchemaFields?: string[]): Promise<mongoose.Schema>;
}
