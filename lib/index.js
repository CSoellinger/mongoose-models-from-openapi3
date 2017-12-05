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
const mongoose = require("mongoose");
const openapi3_util_1 = require("openapi3-util");
const SchemaClass_1 = require("./SchemaClass");
class MongooseOpenApi3ClassSync {
    setOpenApiSpecSync(openapiSpec) {
        if (openapiSpec instanceof openapi3_util_1.OpenApi3UtilClass) {
            const util = openapiSpec;
            if (util.isValidSpecSync()) {
                this.specification = util.specification;
            }
        }
        else {
            const util = new openapi3_util_1.OpenApi3UtilClass();
            util.loadFromContentSync(openapiSpec);
            util.dereferenceSync();
            util.resolveAllOfSync();
            this.specification = util.specification;
        }
        return this;
    }
    generateMongooseSchemasSync() {
        if (!this.specification) {
            return this;
        }
        if (!this.specification.components) {
            return this;
        }
        let schemas = this.specification.components.schemas;
        const globalOpenApiMongoose = this.specification['x-openapi-mongoose'];
        let excludeSchemas = [];
        if (globalOpenApiMongoose && globalOpenApiMongoose['schema-options'] &&
            globalOpenApiMongoose['schema-options']['exclude-schemas']) {
            excludeSchemas = globalOpenApiMongoose['schema-options']['exclude-schemas'];
        }
        excludeSchemas.map((excludeSchema) => {
            if (Object.keys(schemas).indexOf(excludeSchema) !== -1) {
                delete schemas[excludeSchema];
            }
        });
        const mongooseSchemas = {};
        for (let schemaName in schemas) {
            if (schemas[schemaName]) {
                const schema = schemas[schemaName];
                const properties = schema.properties;
                const mgSchema = new mongoose.Schema(SchemaClass_1.SchemaClass.getMongooseSchemaSync(properties, schema.required || undefined));
                if (schema['x-openapi-mongoose'] && schema['x-openapi-mongoose']['reference-to-many']) {
                    schema['x-openapi-mongoose']['reference-to-many'].map((refToMany) => {
                        mgSchema.virtual(`${refToMany}s`, {
                            ref: refToMany,
                            localField: '_id',
                            foreignField: schemaName.toLowerCase(),
                            justOne: false
                        });
                    });
                }
                const readProps = (propertyName) => {
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
    registerModelsSync() {
        if (!this.schemas) {
            return this;
        }
        const models = {};
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
exports.MongooseOpenApi3ClassSync = MongooseOpenApi3ClassSync;
class MongooseOpenApi3Class extends MongooseOpenApi3ClassSync {
    setOpenApiSpec(openapiSpec) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("setOpenApiSpecSync").call(this, openapiSpec);
        });
    }
    generateMongooseSchemas() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("generateMongooseSchemasSync").call(this);
        });
    }
    registerModels() {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("registerModelsSync").call(this);
        });
    }
}
exports.MongooseOpenApi3Class = MongooseOpenApi3Class;
const MongooseOpenApi3 = new MongooseOpenApi3Class();
exports.default = MongooseOpenApi3;
//# sourceMappingURL=index.js.map