import { RegisterClass } from './RegisterClass';
import * as mongoose from 'mongoose';
import * as deepmerge from 'deepmerge';
import { default as OA3Util, OpenApi3Util } from 'openapi3-util';

export class MongooseOpenApi3 {

  static models: any;

  static schemas: any;

  static loadSpecification(openapiSpec: string | OpenApi3Util) {
    return new Promise((resolve, reject) => {
      let spec: any;

      if (openapiSpec instanceof OpenApi3Util) {
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
        } else {
          reject();
        }
      } else {
        OA3Util
          .loadFromContent(openapiSpec)
          .then((val) => OA3Util.loadJsonSchema()).catch((e: any) => reject(e))
          .then((val) => OA3Util.dereference()).catch((e: any) => reject(e))
          .then((val) => OA3Util.resolveAllOf()).catch((e: any) => reject(e))
          .then((valPromise: any) => {
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
          }).catch((e: any) => reject(e));
      }
    });
  }
}

export default MongooseOpenApi3.loadSpecification;
