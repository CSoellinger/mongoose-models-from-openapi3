import { default as mongooseModelsFromOpenApi3 } from './index';
import * as path from 'path';
import * as fs from 'fs';
// const { models, schemas } = mongooseModelsFromOpenApi3();

mongooseModelsFromOpenApi3(fs.readFileSync(path.resolve(__dirname, 'openapi.yaml')).toString())
  .then((val: any) => {
    // console.log('models loaded..', val);
    const { models, schemas } = val;
    console.log('models', models);
    console.log('schemas', schemas);
  }).catch((err: any) => { console.error(err); });

