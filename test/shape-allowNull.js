const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Allow Null', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('Should return data with the null field. (field:null; allowNull:true; required:true)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        required: true,
        allowNull: true
      },
    }, { usePromise: true });

    shape({ first_name: null })
      .then(data => {
        data.first_name === null ? done() : done(e);
      })
      .catch(e => done(e));
  });

  it('Should return data with the null field. (field:null; allowNull:true; required:false)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string?',
        allowNull: true
      },
    }, { usePromise: true });

    shape({ first_name: null })
      .then(data => {
        data.first_name === null ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should return data without the field. (field:undefined; allowNull:true; required:false)', (done) => {
    const shape = new Shape({
      yolo: 'string?'
    }, {
      allowNull: true, 
      usePromise: true 
    });

    shape({ })
      .then(data => {
        data.yolo === undefined ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should be return error. (field:null; allowNull:false; required:true)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        allowNull: false
      },
    }, { usePromise: true });

    shape({ first_name: null })
      .then(data => done('nope'))
      .catch(e => {
        const expectedMsg = format(LOCALE.FIELD_NULL, { path: 'first_name' });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('Should be return data w/o null field. (field:null; allowNull:false; required:false)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string?',
        allowNull: false
      },
    }, { usePromise: true });

    shape({ first_name: null })
      .then(data => {
        data.first_name === undefined ? done() : done('nope');
      })
      .catch(e => done(e));
  });

});