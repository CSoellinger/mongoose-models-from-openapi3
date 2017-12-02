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
exports.default = (openapiSpec) => __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let spec;
        if (openapiSpec instanceof openapi3_util_1.OpenApi3Util) {
            if (openapi3_util_1.default.validSpec()) {
                spec = openapi3_util_1.default.specification;
                resolve(RegisterClass_1.RegisterClass.registerModels(spec));
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
                resolve(RegisterClass_1.RegisterClass.registerModels(spec));
            }).catch((e) => reject(e));
        }
    });
});
//# sourceMappingURL=index.js.map