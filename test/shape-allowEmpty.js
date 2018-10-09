const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Allow Empty', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('Should return ok. (field:empty; allowEmpty:true; required:true)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        allowEmpty: true
      },
    }, { usePromise: true });

    shape({ first_name: '' })
      .then(data => {
        data.first_name === '' ? done() : done(e);
      })
      .catch(e => done(e));
  });

  it('Should return data with the empty field. (field:empty; allowEmpty:true; required:false)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string?',
        allowEmpty: true
      },
    }, { usePromise: true });

    shape({ first_name: '' })
      .then(data => {
        data.first_name === '' ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should return error required. (type:string; field:empty; allowEmpty:false; required:true)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        allowEmpty: false
      },
    }, { usePromise: true });

    shape({ first_name: '' })
      .then(data => done('nope'))
      .catch(e => {
        const expectedMsg = format(LOCALE.FIELD_EMPTY, { path: 'first_name' });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('Should return data w/o empty field. (field:empty; allowEmpty:false; required:false)', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string?',
        allowEmpty: false
      },
    }, { usePromise: true });

    shape({ first_name: '' })
      .then(data => {
        data.first_name === undefined ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should be return error required. (type:array; field:[]; allowEmpty:false; required:true)', (done) => {
    const shape = new Shape({
      arry: {
        type: 'array',
        allowEmpty: false
      },
    }, { usePromise: true });

    shape({ arry: [] })
      .then(data => done('nope'))
      .catch(e => {
        const expectedMsg = format(LOCALE.FIELD_EMPTY, { path: 'arry' });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('Should return error required. (type:object; field:{}; allowEmpty:false; required:true)', (done) => {
    const shape = new Shape({
      obj: {
        type: 'object',
        allowEmpty: false
      },
    }, { usePromise: true });

    shape({ obj: {} })
      .then(data => done('nope'))
      .catch(e => {
        const expectedMsg = format(LOCALE.FIELD_EMPTY, { path: 'obj' });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('Should return empty array. (type:array; field:[]; allowEmpty:true; required:true)', (done) => {
    const shape = new Shape({
      array: 'array',
    }, { 
      allowEmpty: true,
      usePromise: true 
    });

    shape({ array: [] })
      .then(data => {
        data.array && data.array.length === 0 ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should return empty object. (type:object; field:{}; allowEmpty:true; required:true)', (done) => {
    const shape = new Shape({
      obj: 'object',
    }, {
      allowEmpty: true,
      usePromise: true
    });

    shape({ obj: {} })
      .then(data => {
        data.obj && typeof data.obj === 'object' ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should return empty object. (type:object; field:{}; allowEmpty:true; required:true)', (done) => {
    const shape = new Shape({
      user_id: 'objectId?',
    }, {
      allowEmpty: true,
      usePromise: true
    });

    shape({ user_id: '' })
      .then(data => {
        data.user_id === '' ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('Should return data with empty fields. (allowEmpty for each shape field)', (done) => {
    const shape = new Shape({
      first_name: 'string?',
      last_name: 'string?',
    }, { 
      allowEmpty: true,
      usePromise: true 
    });

    shape({ 
      first_name: '',
      last_name: ''
    })
    .then(data => {
      if (data.first_name === '' && data.last_name === '') {
        done();
      } else {
        done('nope');
      }
    })
    .catch(e => done(e));
  });

});