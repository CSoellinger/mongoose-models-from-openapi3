/// <reference path="./../typings/mongoose.d.ts" />

import 'mocha';

import * as bluebird from 'bluebird';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';

import { Mockgoose } from 'mockgoose';

import { default as mongooseModelsFromOpenApi3 } from '../src/index';

global.Promise = bluebird;
(<any>mongoose).Promise = bluebird;

import { expect } from './chai';

const mockgoose = new Mockgoose(mongoose);

const specContent = fs.readFileSync(path.resolve(__dirname, 'uber.yaml')).toString();

describe('mongoose-type-html', () => {
  before((done: Function) => {
    mongoose.connection.on('error', () => { });
    mockgoose.prepareStorage().then(() => {
      mongoose.connect('mongodb://example.com/TestingDB', function (err) {
        if (err) done(err);
        done();
      });
    });
  });

  after((done: Function) => {
    mongoose.connection.close((err: any) => {
      if (err) done(err);
      done();
    });
  });

  it('Try to load openapi spec and register some models', (done: Function) => {
    mongooseModelsFromOpenApi3(specContent)
      .then((val: any) => {
        const { models, schemas } = val;
        console.log('models', models);
        console.log('schemas', schemas);
        done();
      }).catch((err: any) => done(err));
  });
});
