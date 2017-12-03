import { RegisterClass } from './RegisterClass';
import * as mongoose from 'mongoose';
import * as deepmerge from 'deepmerge';
import { default as OA3Util, OpenApi3Util } from 'openapi3-util';

export type MongooseOpenApi3Return = {
  models: mongoose.Model<mongoose.Document>[];
  schemas: mongoose.Schema[];
};

export class MongooseOpenApi3 {

  static models: mongoose.Model<mongoose.Document>[];

  static schemas: mongoose.Schema[];

  private static loaded: Promise<MongooseOpenApi3Return>;

  static async loadSpecification(openapiSpec: string | OpenApi3Util): Promise<MongooseOpenApi3Return> {
    if (!MongooseOpenApi3.loaded) {
      MongooseOpenApi3.loaded = new Promise(async (resolve, reject) => {
        let spec: any;

        if (openapiSpec instanceof OpenApi3Util) {
          if (OA3Util.validSpec()) {
            spec = OA3Util.specification;
            RegisterClass
              .registerModels(spec)
              .then((val: any) => {
                MongooseOpenApi3.models = val.models;
                MongooseOpenApi3.schemas = val.schemas;

                resolve(<MongooseOpenApi3Return>{
                  models: MongooseOpenApi3.models,
                  schemas: MongooseOpenApi3.schemas
                });
              })
              .catch((e: any) => reject(e));
          } else {
            reject();
          }
        } else {
          await OA3Util.loadFromContent(openapiSpec).catch((e: any) => reject(e));
          await OA3Util.loadJsonSchema().catch((e: any) => reject(e));
          await OA3Util.dereference().catch((e: any) => reject(e));
          await OA3Util.resolveAllOf().catch((e: any) => reject(e));

          if (OA3Util.validSpec()) {
            spec = OA3Util.specification;
            RegisterClass
              .registerModels(spec)
              .then((val: any) => {
                MongooseOpenApi3.models = val.models;
                MongooseOpenApi3.schemas = val.schemas;

                resolve({
                  models: MongooseOpenApi3.models,
                  schemas: MongooseOpenApi3.schemas
                });
              })
              .catch((e: any) => reject(e));
          }
        }
      });
    }

    return MongooseOpenApi3.loaded;
  }
}

export default MongooseOpenApi3.loadSpecification;
