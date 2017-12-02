import * as mongoose from 'mongoose';

import "mongoose-type-email";
import "mongoose-type-html";

export class SchemaClass {

  static async getStringSchema(property: any) {
    const schema: any = {};
    if (property.format) {
      switch (property.format) {
        case 'date':
        case 'date-time':
          schema.type = Date;
          break;
        case 'object-id':
        case '^[0-9a-fA-F]{24}$':
          schema.type = mongoose.SchemaTypes.ObjectId;
          break;
        case 'email':
          schema.type = mongoose.SchemaTypes.Email;
          break;
        case 'html':
          schema.type = mongoose.SchemaTypes.Html;
          break;
        default:
          schema.type = String;
          break;
      }
    } else {
      schema.type = String;
    }

    if (property.enum) {
      schema.enum = property.enum;
    }

    if (property.minLength || property.maxLength) {
      const regexPattern = `.{${property.minLength || ''},${property.maxLength || ''}}`;
      schema.match = new RegExp(regexPattern, 'g');
    }

    return schema;
  }

  static async getNumberSchema(property: any) {
    const schema: any = {};
    schema.type = Number;

    if (property.minimum) {
      schema.min = property.minimum;
    }

    if (property.maximum) {
      schema.max = property.maximum;
    }

    return schema;
  }

  static async getMongooseSchema(properties: any, requiredSchemaFields?: string[]) {
    let mongooseSchema: any = {};

    if (properties['_id']) {
      delete properties['_id'];
    }

    if (properties['_v']) {
      delete properties['_v'];
    }

    if (properties['createdAt']) {
      delete properties['createdAt'];
    }

    if (properties['updatedAt']) {
      delete properties['updatedAt'];
    }

    for (let propertyName in properties) {
      if (properties[propertyName]) {
        let mongooseFieldSchema: any = {};

        const property = properties[propertyName];

        switch (property.type) {
          case 'number':
          case 'integer':
            mongooseFieldSchema = Object.assign(
              mongooseFieldSchema,
              await SchemaClass.getNumberSchema(property).catch((err: any) => { console.error(err); })
            );
            break;
          case 'string':
            mongooseFieldSchema = Object.assign(
              mongooseFieldSchema,
              await SchemaClass.getStringSchema(property).catch((err: any) => { console.error(err); })
            );
            break;
          case 'boolean':
            mongooseFieldSchema.type = Boolean;
            break;
          case 'object':
            mongooseFieldSchema = await SchemaClass.getMongooseSchema(property.properties).catch((err: any) => { console.error(err); });
            break;
          case 'array':
            if (property.items.type === 'object') {
              if (Object.keys(property.items.properties).indexOf('_id') !== -1) {
                mongooseFieldSchema.type = [
                  new mongoose.Schema(
                    await SchemaClass.getMongooseSchema(property.items.properties).catch((err: any) => { console.error(err); })
                  )
                ];
              } else {
                mongooseFieldSchema.type = [
                  await SchemaClass.getMongooseSchema(property.items.properties).catch((err: any) => { console.error(err); })
                ];
              }
            }

            if (property.items.type !== 'array' && property.items.type !== 'object') {
              mongooseFieldSchema.type = [];
            }

            break;
          default:
            throw new Error('Unrecognized schema type: ' + property.type);
        }

        if (property.type !== 'array') {
          if (requiredSchemaFields && requiredSchemaFields.length > 0 && requiredSchemaFields.indexOf(propertyName) !== -1) {
            mongooseFieldSchema.required = true;
          }

          if (property.default) {
            mongooseFieldSchema.default = property.default;
          }
        }
        
        if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
          mongooseFieldSchema.ref = property['x-openapi-mongoose']['reference-to-one'];
        }

        mongooseSchema[propertyName] = mongooseFieldSchema;
      }
    }

    return mongooseSchema;
  }
}
