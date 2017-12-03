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
const SchemaClass_1 = require("./SchemaClass");
const mongoose = require("mongoose");
class RegisterClass {
    static registerModels(spec) {
        return __awaiter(this, void 0, void 0, function* () {
            const schemas = spec.components.schemas;
            const globalOpenApiMongoose = spec['x-openapi-mongoose'];
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
            const schemes = {};
            const models = {};
            for (let schemaName in schemas) {
                if (schemas[schemaName]) {
                    const schema = schemas[schemaName];
                    const properties = schema.properties;
                    const mgSchema = new mongoose.Schema(yield SchemaClass_1.SchemaClass.getMongooseSchema(properties, schema.required || undefined).catch((err) => { console.error(err); }));
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
                    models[schemaName] = mongoose.model(schemaName, mgSchema);
                    schemas[schemaName] = mgSchema;
                }
            }
            return {
                models: models,
                schemas: schemas
            };
        });
    }
}
exports.RegisterClass = RegisterClass;
//# sourceMappingURL=RegisterClass.js.map