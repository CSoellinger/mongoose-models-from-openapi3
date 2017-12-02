/// <reference path="./../typings/index.d.ts" />
/// <reference path="./../typings/mongoose.d.ts" />

import { Mockgoose } from 'mockgoose';
import * as mongoose from 'mongoose';
import * as q from 'q';
import 'mocha';

import { expect } from './expect';
import '../src';

const mockgoose = new Mockgoose(mongoose);

global.Promise = q;
(<any>mongoose).Promise = global.Promise;

export type HtmlModel = mongoose.Document & {
  content?: string
};

const HtmlDefault = mongoose.model('HtmlDefault', new mongoose.Schema({
  content: mongoose.SchemaTypes.Html
}));

describe('mongoose-type-html', () => {
  before((done: Function) => {
    mockgoose
      .prepareStorage()
      .then(() => {
        mongoose
          .connect('mongodb://example.com/TestingDB')
          .then(() => done())
          .catch((reason: any) => done(reason));
      });

    mongoose.connection
      .on('error', (err: any) => {
        console.log('mongo conn on err...', err);
      });
  });

  after(() => {
    mongoose.connection
      .close();
  });

  it('should enable basic html field-type in schema', (done: Function) => {
    const html: HtmlModel = new HtmlDefault();

    html
      .save()
      .then((val: mongoose.Document) => done())
      .catch((reason: any) => done(reason));

    expect(html.schema.obj.content.schemaName.toLowerCase()).equals('html');
  });

  it('should remove content "<script>Hello</script>"', (done: Function) => {
    const html: HtmlModel = new HtmlDefault();
    html.content = '<script>Hello</script>';

    html
      .save()
      .then((val: HtmlModel) => {
        expect(val.content).to.be.an('undefined');
        done();
      })
      .catch((reason: any) => done(reason));
  });
});
