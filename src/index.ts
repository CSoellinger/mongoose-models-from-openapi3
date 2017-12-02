import { RegisterClass } from './RegisterClass';
import * as mongoose from 'mongoose';
import * as deepmerge from 'deepmerge';
import { default as OA3Util, OpenApi3Util } from 'openapi3-util';

export default async (openapiSpec: string | OpenApi3Util) => {
  return new Promise((resolve, reject) => {
    let spec: any;

    if (openapiSpec instanceof OpenApi3Util) {
      if (OA3Util.validSpec()) {
        spec = OA3Util.specification;
        resolve(RegisterClass.registerModels(spec).catch((e: any) => console.error(e)));
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
          resolve(RegisterClass.registerModels(spec));
        }).catch((e: any) => reject(e));
    }
  });
}
