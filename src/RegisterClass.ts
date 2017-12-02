import { SchemaClass } from './SchemaClass';
import * as mongoose from 'mongoose';

export class RegisterClass {

  static async registerModels(spec: OpenAPI3Spec) {
      const schemas = spec.components.schemas;

      const globalOpenApiMongoose: OpenAPI3MongooseGlobalOptions | undefined = spec['x-openapi-mongoose'];
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

      const schemes: any = {};
      const models: any = {};

      for (let schemaName in schemas) {
        if (schemas[schemaName]) {
          const schema = schemas[schemaName];
          const properties = schema.properties;

          const mgSchema: any = new mongoose.Schema(
            await SchemaClass.getMongooseSchema(properties, schema.required || undefined).catch((err: any) => { console.error(err); })
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

          models[schemaName] = mongoose.model(schemaName, mgSchema);
          schemas[schemaName] = mgSchema;
        }
      }

      return {
        models: models,
        schemas: schemas
      };
  }
}
