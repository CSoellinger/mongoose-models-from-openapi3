/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import "mongoose-type-email";
import "mongoose-type-html";
import { XOpenAPI3Spec } from './interface';
export declare class SchemaClassSync {
    static getStringSchemaSync(property: XOpenAPI3Spec.Components.Schema.Property): any;
    static getNumberSchemaSync(property: XOpenAPI3Spec.Components.Schema.Property): any;
    static getPropertySchemaSync(property: XOpenAPI3Spec.Components.Schema.Property, propertyName?: string, requiredSchemaFields?: string[]): any;
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
