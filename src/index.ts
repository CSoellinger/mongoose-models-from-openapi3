import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as deepmerge from 'deepmerge';
import { OpenApi3Util, OpenApi3UtilClass } from 'openapi3-util';
import { OpenAPI3Spec } from './interface';
import { SchemaClass } from './SchemaClass';

export type MongooseOpenApi3Models = {
  [index: string]: mongoose.Model<mongoose.Document>;
};

export type MongooseOpenApi3Schemas = {
  [index: string]: mongoose.Schema;
};

export class MongooseOpenApi3ClassSync {

  private specification: OpenAPI3Spec;

  models: MongooseOpenApi3Models;

  schemas: MongooseOpenApi3Schemas;

  setOpenApiSpecSync(openapiSpec: string | OpenApi3UtilClass): MongooseOpenApi3ClassSync {
    if (openapiSpec instanceof OpenApi3UtilClass) {
      const util = <OpenApi3UtilClass>openapiSpec;
      if (util.isValidSpecSync()) {
        this.specification = <OpenAPI3Spec>util.specification;
      }
    } else {
      const util = new OpenApi3UtilClass();
      util.loadFromContentSync(<string>openapiSpec);
      util.dereferenceSync();
      util.resolveAllOfSync();
      this.specification = <OpenAPI3Spec>util.specification;
    }
    return this;
  }

  generateMongooseSchemasSync(): MongooseOpenApi3ClassSync {
    if (!this.specification) {
      return this;
    }

    if (!this.specification.components) {
      return this;
    }

    let schemas = this.specification.components.schemas;

    const globalOpenApiMongoose: any | undefined = this.specification['x-openapi-mongoose'];

    let excludeSchemas = [];

    if (globalOpenApiMongoose && globalOpenApiMongoose['schema-options'] &&
      globalOpenApiMongoose['schema-options']['exclude-schemas']) {
      excludeSchemas = globalOpenApiMongoose['schema-options']['exclude-schemas'];
    }

    excludeSchemas.map((excludeSchema: any) => {
      if (Object.keys(schemas).indexOf(excludeSchema) !== -1) {
        delete schemas[excludeSchema];
      }
    });

    const mongooseSchemas: any = {};

    for (let schemaName in schemas) {
      if (schemas[schemaName]) {
        const schema = schemas[schemaName];
        const properties = schema.properties;

        const mgSchema: any = new mongoose.Schema(
          SchemaClass.getMongooseSchemaSync(properties, schema.required || undefined)
        );

        if (schema['x-openapi-mongoose'] && schema['x-openapi-mongoose']['reference-to-many']) {
          schema['x-openapi-mongoose']['reference-to-many'].map((refToMany: string) => {
            mgSchema.virtual(`${refToMany}s`, {
              ref: refToMany,
              localField: '_id',
              foreignField: schemaName.toLowerCase(),
              justOne: false
            });
          });
        }

        const readProps = (propertyName: string) => {
          if (properties[propertyName] && properties[propertyName]['x-openapi-mongoose'] &&
            properties[propertyName]['x-openapi-mongoose']['reference-to-one']) {
            const refToOne = properties[propertyName]['x-openapi-mongoose']['reference-to-one'];

            mgSchema.virtual(`${refToOne}`, {
              ref: refToOne,
              localField: refToOne.toLowerCase(),
              foreignField: '_id',
              justOne: true
            });
          }
        };
        Object.keys(properties).map(readProps);

        mongooseSchemas[schemaName] = mgSchema;
      }
    }

    this.schemas = mongooseSchemas;

    return this;
  }

  registerModelsSync(): MongooseOpenApi3ClassSync {
    if (!this.schemas) {
      return this;
    }

    const models: any = {};

    for (let schemaName in this.schemas) {
      if (this.schemas[schemaName]) {
        const schema = this.schemas[schemaName];
        models[schemaName] = mongoose.model(schemaName, schema);
      }
    }

    this.models = models;

    return this;
  }

}

export class MongooseOpenApi3Class extends MongooseOpenApi3ClassSync {

  async setOpenApiSpec(openapiSpec: string | OpenApi3UtilClass): Promise<any> {
    return super.setOpenApiSpecSync(openapiSpec);
  }

  async generateMongooseSchemas(): Promise<any> {
    return super.generateMongooseSchemasSync();
  }

  async registerModels(): Promise<any> {
    return super.registerModelsSync();
  }

}

const MongooseOpenApi3 = new MongooseOpenApi3Class();

export default MongooseOpenApi3;
