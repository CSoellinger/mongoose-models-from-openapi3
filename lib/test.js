"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path = require("path");
const fs = require("fs");
index_1.default(fs.readFileSync(path.resolve(__dirname, 'openapi.yaml')).toString())
    .then((val) => {
    console.log('models loaded..', val);
    const { models, schemas } = val;
    console.log('models', models);
    console.log('schemas', schemas);
});
//# sourceMappingURL=test.js.map