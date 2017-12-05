import "mongoose-type-email";
import "mongoose-type-html";
export declare class SchemaClassSync {
    static getStringSchemaSync(property: any): any;
    static getNumberSchemaSync(property: any): any;
    static getMongooseSchemaSync(properties: any, requiredSchemaFields?: string[]): any;
}
export declare class SchemaClass extends SchemaClassSync {
    static getStringSchema(property: any): Promise<any>;
    static getNumberSchema(property: any): Promise<any>;
    static getMongooseSchema(properties: any, requiredSchemaFields?: string[]): Promise<any>;
}
