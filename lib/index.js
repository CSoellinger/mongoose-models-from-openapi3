"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RegisterClass_1 = require("./RegisterClass");
const openapi3_util_1 = require("openapi3-util");
class MongooseOpenApi3 {
    static loadSpecification(openapiSpec) {
        return new Promise((resolve, reject) => {
            let spec;
            if (openapiSpec instanceof openapi3_util_1.OpenApi3Util) {
                if (openapi3_util_1.default.validSpec()) {
                    spec = openapi3_util_1.default.specification;
                    RegisterClass_1.RegisterClass
                        .registerModels(spec)
                        .then((val) => {
                        MongooseOpenApi3.models = val.models;
                        MongooseOpenApi3.schemas = val.schemas;
                        resolve({
                            models: MongooseOpenApi3.models,
                            schemas: MongooseOpenApi3.schemas
                        });
                    })
                        .catch((e) => reject(e));
                }
                else {
                    reject();
                }
            }
            else {
                openapi3_util_1.default
                    .loadFromContent(openapiSpec)
                    .then((val) => openapi3_util_1.default.loadJsonSchema()).catch((e) => reject(e))
                    .then((val) => openapi3_util_1.default.dereference()).catch((e) => reject(e))
                    .then((val) => openapi3_util_1.default.resolveAllOf()).catch((e) => reject(e))
                    .then((valPromise) => {
                    spec = openapi3_util_1.default.specification;
                    RegisterClass_1.RegisterClass
                        .registerModels(spec)
                        .then((val) => {
                        MongooseOpenApi3.models = val.models;
                        MongooseOpenApi3.schemas = val.schemas;
                        resolve({
                            models: MongooseOpenApi3.models,
                            schemas: MongooseOpenApi3.schemas
                        });
                    })
                        .catch((e) => reject(e));
                }).catch((e) => reject(e));
            }
        });
    }
}
exports.MongooseOpenApi3 = MongooseOpenApi3;
exports.default = MongooseOpenApi3.loadSpecification;
//# sourceMappingURL=index.js.map