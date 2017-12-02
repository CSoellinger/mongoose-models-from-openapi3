import "mongoose-type-email";
import "mongoose-type-html";
export declare class SchemaClass {
    static getStringSchema(property: any): Promise<any>;
    static getNumberSchema(property: any): Promise<any>;
    static getMongooseSchema(properties: any, requiredSchemaFields?: string[]): Promise<any>;
}
