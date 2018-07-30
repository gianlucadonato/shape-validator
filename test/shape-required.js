const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Check Required', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be return error. FIELD_REQUIRED', (done) => {
    const shape1 = new Shape({
      first_name: {
        type: 'string',
        required: true
      },
      last_name: 'string',
    });
    const shape2 = new Shape({ is_admin: 'boolean' });
    try {
      shape1({ last_name: 'donato' });
    } catch (e) {
      const expectedMsg = format(LOCALE.FIELD_REQUIRED, { path: 'first_name' });
      if (e.message === expectedMsg) {
        try {
          shape2({ last_name: 'donato' });
        } catch (e) {
          const expMsg = format(LOCALE.FIELD_REQUIRED, { path: 'is_admin' });
          e.message === expMsg ? done() : done(e);
        }
      } else {
        done(e);
      }
    }
  });

  it('should be return ok. field is not required', (done) => {
    const shape1 = new Shape({
      first_name: {
        type: 'string',
        required: false
      }
    });
    const shape2 = new Shape({ first_name: 'string?' });
    const shape3 = new Shape({ is_admin: 'boolean?' });
    try {
      shape1({ last_name: 'donato' });
      shape2({ last_name: 'donato' });
      shape3({ last_name: 'donato' });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should be return error. FIELD_REQUIRED (value: undefined)', function (done) {
    const shape = new Shape({
      last_name: 'string'
    });
    try {
      shape({ last_name: undefined });
    } catch (e) {
      const expectedMsg = format(LOCALE.FIELD_REQUIRED, { path: 'last_name' });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should be return error. FIELD_REQUIRED (value: null)', function (done) {
    const shape = new Shape({
      last_name: 'string'
    });
    try {
      shape({ last_name: null });
    } catch (e) {
      const expectedMsg = format(LOCALE.FIELD_NULL, { path: 'last_name' });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should be return ok. !FIELD_REQUIRED (value: undefined)', function (done) {
    const shape = new Shape({
      last_name: 'string?'
    });
    try {
      const data = shape({ last_name: undefined });
      data.last_name === undefined ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return ok. !FIELD_REQUIRED (value: null)', function (done) {
    const shape = new Shape({
      last_name: 'string?'
    });
    try {
      const data = shape({ last_name: null });
      data.last_name === undefined ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return ok. !FIELD_REQUIRED (value: undefined, allowNull: true)', function (done) {
    const shape = new Shape({
      last_name: 'string?',
      allowEmpty: true
    });
    try {
      const data = shape({ last_name: undefined });
      data.last_name === undefined ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return ok. !FIELD_REQUIRED (value: null, allowNull: true)', function (done) {
    const shape = new Shape({
      last_name: 'string?'
    }, { allowNull: true });
    try {
      const data = shape({ last_name: null });
      data.last_name === null ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });


  it('should be return ok, with array', function (done) {
    const shape = new Shape({
      num: 'int',
      last_name: ['string?']
    });
    try {
      shape({ num: 42 });
      done();
    } catch (e) {
      done(e.message);
    }
  });

  it('should be return error, with array', function (done) {
    const shape = new Shape({
      num: 'int',
      last_name: ['string']
    });
    try {
      shape({ num: 42 });
      done('nope');
    } catch (e) {
      done();
    }
  });
});
