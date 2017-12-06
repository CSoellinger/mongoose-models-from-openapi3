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
class SchemaClassSync {
    static getStringSchemaSync(property) {
        const schema = {};
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
        if (property.enum) {
            schema.enum = property.enum;
        }
        if (property.minLength || property.maxLength) {
            const regexPattern = `.{${property.minLength || ''},${property.maxLength || ''}}`;
            schema.match = new RegExp(regexPattern, 'g');
        }
        return schema;
    }
    static getNumberSchemaSync(property) {
        const schema = {};
        schema.type = Number;
        if (property.minimum) {
            schema.min = property.minimum;
        }
        if (property.maximum) {
            schema.max = property.maximum;
        }
        return schema;
    }
    static getPropertySchemaSync(property, propertyName, requiredSchemaFields) {
        let mongooseFieldSchema = {};
        switch (property.type) {
            case 'number':
            case 'integer':
                mongooseFieldSchema = Object.assign(mongooseFieldSchema, SchemaClass.getNumberSchemaSync(property));
                break;
            case 'string':
                mongooseFieldSchema = Object.assign(mongooseFieldSchema, SchemaClass.getStringSchemaSync(property));
                break;
            case 'boolean':
                mongooseFieldSchema.type = Boolean;
                break;
            case 'object':
                mongooseFieldSchema = SchemaClass.getPropertiesSchemaSync(property.properties);
                break;
            case 'array':
                if (property.items.type === 'object') {
                    if (Object.keys(property.items.properties).indexOf('_id') !== -1) {
                        mongooseFieldSchema.type = [
                            SchemaClass.getMongooseSchemaSync(property.items.properties)
                        ];
                    }
                    else {
                        mongooseFieldSchema.type = [
                            SchemaClass.getPropertiesSchemaSync(property.items.properties)
                        ];
                    }
                }
                if (property.items.type !== 'array' && property.items.type !== 'object') {
                    mongooseFieldSchema.type = [this.getPropertySchemaSync(property.items)];
                }
                break;
            default:
                throw new Error('Unrecognized schema type: ' + property.type);
        }
        if (property.type !== 'array') {
            if (propertyName && requiredSchemaFields && requiredSchemaFields.length > 0 && requiredSchemaFields.indexOf(propertyName) !== -1) {
                mongooseFieldSchema.required = true;
            }
            if (property.default) {
                mongooseFieldSchema.default = property.default;
            }
        }
        if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
            const refToOne = property['x-openapi-mongoose']['reference-to-one'];
            mongooseFieldSchema.ref = refToOne;
        }
        return mongooseFieldSchema;
    }
    static getPropertiesSchemaSync(properties, requiredSchemaFields) {
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
                const property = properties[propertyName];
                mongooseSchema[propertyName] = this.getPropertySchemaSync(property, propertyName, requiredSchemaFields);
            }
        }
        return mongooseSchema;
    }
    static getMongooseSchemaSync(properties, requiredSchemaFields) {
        let refToOneArr = [];
        for (let propertyName in properties) {
            if (properties[propertyName]) {
                const property = properties[propertyName];
                if (property['x-openapi-mongoose'] && property['x-openapi-mongoose']['reference-to-one']) {
                    const refToOne = property['x-openapi-mongoose']['reference-to-one'];
                    refToOneArr.push(refToOne);
                }
            }
        }
        const mongooseSchema = this.getPropertiesSchemaSync(properties, requiredSchemaFields);
        const mgSchema = new mongoose.Schema(mongooseSchema);
        refToOneArr.map((refToOne) => {
            mgSchema.virtual(`${refToOne}`, {
                ref: refToOne,
                localField: refToOne.toLowerCase(),
                foreignField: '_id',
                justOne: true
            });
        });
        return mgSchema;
    }
}
exports.SchemaClassSync = SchemaClassSync;
class SchemaClass extends SchemaClassSync {
    static getStringSchema(property) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getStringSchemaSync").call(this, property);
        });
    }
    static getNumberSchema(property) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getNumberSchemaSync").call(this, property);
        });
    }
    static getPropertySchema(property, propertyName, requiredSchemaFields) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getPropertySchemaSync").call(this, property, propertyName, requiredSchemaFields);
        });
    }
    static getPropertiesSchema(properties, requiredSchemaFields) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getPropertiesSchemaSync").call(this, properties, requiredSchemaFields);
        });
    }
    static getMongooseSchema(properties, requiredSchemaFields) {
        const _super = name => super[name];
        return __awaiter(this, void 0, void 0, function* () {
            return _super("getMongooseSchemaSync").call(this, properties, requiredSchemaFields);
        });
    }
}
exports.SchemaClass = SchemaClass;
//# sourceMappingURL=SchemaClass.js.map