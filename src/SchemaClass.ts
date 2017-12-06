import * as mongoose from 'mongoose';

import "mongoose-type-email";
import "mongoose-type-html";

export class SchemaClassSync {

  static getStringSchemaSync(property: any) {
    const schema: any = {};

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

    if (property.enum) {
      schema.enum = property.enum;
    }

    if (property.minLength || property.maxLength) {
      const regexPattern = `.{${property.minLength || ''},${property.maxLength || ''}}`;
      schema.match = new RegExp(regexPattern, 'g');
    }

    return schema;
  }

  static getNumberSchemaSync(property: any) {
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

  static getPropertySchemaSync(property: any, propertyName?: string, requiredSchemaFields?: string[]) {
    let mongooseFieldSchema: any = {};
    switch (property.type) {
      case 'number':
      case 'integer':
        mongooseFieldSchema = Object.assign(
          mongooseFieldSchema,
          SchemaClass.getNumberSchemaSync(property)
        );
        break;
      case 'string':
        mongooseFieldSchema = Object.assign(
          mongooseFieldSchema,
          SchemaClass.getStringSchemaSync(property)
        );
        break;
      case 'boolean':
        mongooseFieldSchema.type = Boolean;
        break;
      case 'object':
        mongooseFieldSchema = SchemaClass.getPropertiesSchemaSync(property.properties);
        break;
      case 'array':
        if (property.items.type === 'object') {
          if (Object.keys(property.items.properties).indexOf('_id') !== -1) {
            mongooseFieldSchema.type = [
              SchemaClass.getMongooseSchemaSync(property.items.properties)
            ];
          } else {
            mongooseFieldSchema.type = [
              SchemaClass.getPropertiesSchemaSync(property.items.properties)
            ];
          }
        }

        if (property.items.type !== 'array' && property.items.type !== 'object') {
          mongooseFieldSchema.type = [this.getPropertySchemaSync(property.items)];
        }

        break;
      
      /* istanbul ignore next */
      default:
        throw new Error('Unrecognized schema type: ' + property.type);
    }

    if (property.type !== 'array') {
      if (propertyName && requiredSchemaFields && requiredSchemaFields.length > 0 && requiredSchemaFields.indexOf(propertyName) !== -1) {
        mongooseFieldSchema.required = true;
      }

      if (property.default) {
        mongooseFieldSchema.default = property.default;
      }
    }

    if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
      const refToOne = property['x-openapi-mongoose']['reference-to-one'];
      mongooseFieldSchema.ref = refToOne;
    }

    return mongooseFieldSchema;
  }

  static getPropertiesSchemaSync(properties: any, requiredSchemaFields?: string[]) {
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
      /* istanbul ignore else */
      if (properties[propertyName]) {
        const property = properties[propertyName];
        mongooseSchema[propertyName] = this.getPropertySchemaSync(property, propertyName, requiredSchemaFields);
      }
    }

    return mongooseSchema;
  }

  static getMongooseSchemaSync(properties: any, requiredSchemaFields?: string[]) {
    let refToOneArr: any = [];

    for (let propertyName in properties) {
      /* istanbul ignore else */
      if (properties[propertyName]) {
        const property = properties[propertyName];

        if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
          const refToOne = property['x-openapi-mongoose']['reference-to-one'];
          refToOneArr.push(refToOne);
        }
      }
    }

    const mongooseSchema = this.getPropertiesSchemaSync(properties, requiredSchemaFields);
    const mgSchema = new mongoose.Schema(mongooseSchema);

    refToOneArr.map((refToOne: string) => {
      mgSchema.virtual(`${refToOne}`, {
        ref: refToOne,
        localField: refToOne.toLowerCase(),
        foreignField: '_id',
        justOne: true
      });
    });

    return mgSchema;
  }

}

export class SchemaClass extends SchemaClassSync {

  static async getStringSchema(property: any) {
    return super.getStringSchemaSync(property);
  }

  static async getNumberSchema(property: any) {
    return super.getNumberSchemaSync(property);
  }

  static async getPropertySchema(property: any, propertyName?: string, requiredSchemaFields?: string[]) {
    return super.getPropertySchemaSync(property, propertyName, requiredSchemaFields);
  }
  
  static async getPropertiesSchema(properties: any, requiredSchemaFields?: string[]) {
    return super.getPropertiesSchemaSync(properties, requiredSchemaFields);
  }

  static async getMongooseSchema(properties: any, requiredSchemaFields?: string[]) {
    return super.getMongooseSchemaSync(properties, requiredSchemaFields);
  }

}
