import { OpenApi3Util, OpenApi3UtilClass } from 'openapi3-util';
import { MongooseOpenApi3Class } from './../src/index';
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
import { SchemaClass } from '../src/SchemaClass';

const mockgoose = new Mockgoose(mongoose);

const specContent = fs.readFileSync(path.resolve(__dirname, 'uber.yaml')).toString();
const specSecContent = fs.readFileSync(path.resolve(__dirname, 'uber.1.yaml')).toString();
const specThirdContent = fs.readFileSync(path.resolve(__dirname, 'uber.2.yaml')).toString();
const specFourthContent = fs.readFileSync(path.resolve(__dirname, 'uber.3.yaml')).toString();

let moa: MongooseOpenApi3Class;

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

  beforeEach((done: Function) => {
    moa = new MongooseOpenApi3Class();
    delete moa.schemas;
    delete moa.models;
    done();
  });

  after((done: Function) => {
    mongoose.connection.close((err: any) => {
      if (err) done(err);
      mongoose.disconnect();
      done();
    });
  });

  it('Try to load openapi spec and register some models sync mode', (done: Function) => {
    const x = moa.setOpenApiSpecSync(specContent);
    expect(x).is.instanceof(MongooseOpenApi3Class);

    moa.generateMongooseSchemasSync();
    expect(moa).to.have.property('schemas');

    moa.registerModelsSync();
    expect(moa).to.have.property('models');

    done();
  });

  it('Try to load openapi spec and register some models async mode', (done: Function) => {
    moa.setOpenApiSpec(specContent).then((x: any) => {
      expect(x).is.instanceof(MongooseOpenApi3Class);

      moa.generateMongooseSchemas().then(() => {
        expect(moa).to.have.property('schemas');
      }).then(() => {
        moa.registerModels().then(() => {
          expect(moa).to.have.property('models');
          done();
        }).catch((err: any) => done(err));
      }).catch((err: any) => done(err));
    });
  });

  it('Try to load generate schema without spec', (done: Function) => {
    moa.generateMongooseSchemasSync();

    expect(moa).not.to.have.property('schemas');

    moa.registerModelsSync();
    expect(moa).not.to.have.property('models');

    done();
  });

  it('Try loading spec with util class', (done: Function) => {
    const util = new OpenApi3UtilClass();

    const x = moa.setOpenApiSpecSync(util);
    expect(x).is.instanceof(MongooseOpenApi3Class);

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    const y = moa.setOpenApiSpecSync(util);
    expect(y).is.instanceof(MongooseOpenApi3Class);

    done();
  });

  it('Try only schema class getMongooseSchema', (done: Function) => {
    const util = new OpenApi3UtilClass();

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    if (util.specification.components && util.specification.components.schemas && util.specification.components.schemas['Image']) {
      SchemaClass.getMongooseSchema(
        util.specification.components.schemas['Image'].properties,
        util.specification.components.schemas['Image'].required
      ).then((mongooseSchema) => {
        expect(mongooseSchema).to.have.property('obj');
        expect(mongooseSchema.obj).to.have.property('desc');
        done();
      }).catch(e => done(e));
    } else {
      done('Error at spec');
    }
  });

  it('Try only schema class getPropertiesSchema', (done: Function) => {
    const util = new OpenApi3UtilClass();

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    if (util.specification.components && util.specification.components.schemas && util.specification.components.schemas['Image']) {
      SchemaClass.getPropertiesSchema(
        util.specification.components.schemas['Image'].properties,
        util.specification.components.schemas['Image'].required
      ).then((val: any) => {
        expect(val).has.property('size');
        done();
      }).catch(e => done(e));
    } else {
      done('Error at spec');
    }
  });

  it('Try only schema class getPropertySchema', (done: Function) => {
    const util = new OpenApi3UtilClass();

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    if (
      util.specification.components && util.specification.components.schemas &&
      util.specification.components.schemas['Image'] && util.specification.components.schemas['Image'].properties &&
      util.specification.components.schemas['Image'].properties['desc']
    ) {

      SchemaClass.getPropertySchema(
        util.specification.components.schemas['Image'].properties['desc'],
        'desc',
        util.specification.components.schemas['Image'].required
      ).then((val: any) => {
        expect(val).has.property('required').is.true;
        done();
      }).catch(e => done(e));

    } else {
      done('Error at spec');
    }
  });

  it('Try only schema class getStringSchema', (done: Function) => {
    const util = new OpenApi3UtilClass();

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    if (
      util.specification.components && util.specification.components.schemas &&
      util.specification.components.schemas['Image'] && util.specification.components.schemas['Image'].properties &&
      util.specification.components.schemas['Image'].properties['desc']
    ) {

      SchemaClass.getStringSchema(
        util.specification.components.schemas['Image'].properties['desc']
      ).then((val: any) => {
        expect(val).has.property('type');
        done();
      }).catch(e => done(e));

    } else {
      done('Error at spec');
    }
  });

  it('Try only schema class getNumberSchema', (done: Function) => {
    const util = new OpenApi3UtilClass();

    util.loadFromContentSync(specContent);
    util.dereferenceSync();

    if (
      util.specification.components && util.specification.components.schemas &&
      util.specification.components.schemas['Image'] && util.specification.components.schemas['Image'].properties &&
      util.specification.components.schemas['Image'].properties['size']
    ) {

      SchemaClass.getNumberSchema(
        util.specification.components.schemas['Image'].properties['size']
      ).then((val: any) => {
        expect(val).has.property('type');
        done();
      }).catch(e => done(e));

    } else {
      done('Error at spec');
    }
  });

  it('Try to load openapi second spec and register some models sync mode', (done: Function) => {
    const x = moa.setOpenApiSpecSync(specSecContent);
    expect(x).is.instanceof(MongooseOpenApi3Class);

    moa.generateMongooseSchemasSync();
    expect(moa).to.have.property('schemas');

    done();
  });

  it('Try to load openapi third spec and register some models sync mode', (done: Function) => {
    const x = moa.setOpenApiSpecSync(specThirdContent);
    expect(x).is.instanceof(MongooseOpenApi3Class);

    moa.generateMongooseSchemasSync();
    expect(moa).not.to.have.property('schemas');

    done();
  });

  it('Try to load openapi fourth spec and register some models sync mode', (done: Function) => {
    const x = moa.setOpenApiSpecSync(specFourthContent);
    expect(x).is.instanceof(MongooseOpenApi3Class);

    moa.generateMongooseSchemasSync();
    expect(moa).not.to.have.property('schemas');

    done();
  });

});
