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
require("mongoose-type-email");
require("mongoose-type-html");
class SchemaClass {
    static getStringSchema(property) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = {};
            if (property.format) {
                switch (property.format) {
                    case 'date':
                    case 'date-time':
                        schema.type = Date;
                        break;
                    case 'object-id':
                    case '^[0-9a-fA-F]{24}$':
                        schema.type = mongoose.SchemaTypes.ObjectId;
                        break;
                    case 'email':
                        schema.type = mongoose.SchemaTypes.Email;
                        break;
                    case 'html':
                        schema.type = mongoose.SchemaTypes.Html;
                        break;
                    default:
                        schema.type = String;
                        break;
                }
            }
            else {
                schema.type = String;
            }
            if (property.enum) {
                schema.enum = property.enum;
            }
            if (property.minLength || property.maxLength) {
                const regexPattern = `.{${property.minLength || ''},${property.maxLength || ''}}`;
                schema.match = new RegExp(regexPattern, 'g');
            }
            return schema;
        });
    }
    static getNumberSchema(property) {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = {};
            schema.type = Number;
            if (property.minimum) {
                schema.min = property.minimum;
            }
            if (property.maximum) {
                schema.max = property.maximum;
            }
            return schema;
        });
    }
    static getMongooseSchema(properties, requiredSchemaFields) {
        return __awaiter(this, void 0, void 0, function* () {
            let mongooseSchema = {};
            if (properties['_id']) {
                delete properties['_id'];
            }
            if (properties['_v']) {
                delete properties['_v'];
            }
            if (properties['createdAt']) {
                delete properties['createdAt'];
            }
            if (properties['updatedAt']) {
                delete properties['updatedAt'];
            }
            for (let propertyName in properties) {
                if (properties[propertyName]) {
                    let mongooseFieldSchema = {};
                    const property = properties[propertyName];
                    switch (property.type) {
                        case 'number':
                        case 'integer':
                            mongooseFieldSchema = Object.assign(mongooseFieldSchema, yield SchemaClass.getNumberSchema(property).catch((err) => { console.error(err); }));
                            break;
                        case 'string':
                            mongooseFieldSchema = Object.assign(mongooseFieldSchema, yield SchemaClass.getStringSchema(property).catch((err) => { console.error(err); }));
                            break;
                        case 'boolean':
                            mongooseFieldSchema.type = Boolean;
                            break;
                        case 'object':
                            mongooseFieldSchema = yield SchemaClass.getMongooseSchema(property.properties).catch((err) => { console.error(err); });
                            break;
                        case 'array':
                            if (property.items.type === 'object') {
                                if (Object.keys(property.items.properties).indexOf('_id') !== -1) {
                                    mongooseFieldSchema.type = [
                                        new mongoose.Schema(yield SchemaClass.getMongooseSchema(property.items.properties).catch((err) => { console.error(err); }))
                                    ];
                                }
                                else {
                                    mongooseFieldSchema.type = [
                                        yield SchemaClass.getMongooseSchema(property.items.properties).catch((err) => { console.error(err); })
                                    ];
                                }
                            }
                            if (property.items.type !== 'array' && property.items.type !== 'object') {
                                mongooseFieldSchema.type = [];
                            }
                            break;
                        default:
                            throw new Error('Unrecognized schema type: ' + property.type);
                    }
                    if (property.type !== 'array') {
                        if (requiredSchemaFields && requiredSchemaFields.length > 0 && requiredSchemaFields.indexOf(propertyName) !== -1) {
                            mongooseFieldSchema.required = true;
                        }
                        if (property.default) {
                            mongooseFieldSchema.default = property.default;
                        }
                    }
                    if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
                        mongooseFieldSchema.ref = property['x-openapi-mongoose']['reference-to-one'];
                    }
                    mongooseSchema[propertyName] = mongooseFieldSchema;
                }
            }
            return mongooseSchema;
        });
    }
}
exports.SchemaClass = SchemaClass;
//# sourceMappingURL=SchemaClass.js.map