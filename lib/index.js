"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegisterClass_1 = require("./RegisterClass");
const openapi3_util_1 = require("openapi3-util");
class MongooseOpenApi3 {
    static loadSpecification(openapiSpec) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!MongooseOpenApi3.loaded) {
                MongooseOpenApi3.loaded = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
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
                        yield openapi3_util_1.default.loadFromContent(openapiSpec).catch((e) => reject(e));
                        yield openapi3_util_1.default.loadJsonSchema().catch((e) => reject(e));
                        yield openapi3_util_1.default.dereference().catch((e) => reject(e));
                        yield openapi3_util_1.default.resolveAllOf().catch((e) => reject(e));
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
                    }
                }));
            }
            return MongooseOpenApi3.loaded;
        });
    }
}
exports.MongooseOpenApi3 = MongooseOpenApi3;
exports.default = MongooseOpenApi3.loadSpecification;
//# sourceMappingURL=index.js.map