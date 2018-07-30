const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Check Default', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });


  it('should return ok', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string',
      created_at: {
        type: 'date',
        default: new Date()
      }
    });
    try {
      shape({
        first_name: 'gian',
        last_name: 'donato'
      });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should return ok. set default', function (done) {
    const shape = new Shape({
      age: 'int',
      first_name: {
        type: 'string',
        default: 'gian',
        required: true
      }
    });
    try {
      const data = shape({ age: 28 });
      data.first_name === 'gian' ? done() : done('nope');
    } catch (e) {
      done(e.message);
    }
  });


  it('should return ok. overwrites default', function (done) {
    const shape = new Shape({
      age: 'int',
      first_name: {
        type: 'string',
        default: 'gian',
        required: true
      }
    });
    try {
      const data = shape({ age: 28, first_name: 'walter' });
      data.first_name === 'walter' ? done() : done('nope');
    } catch (e) {
      done(e.message);
    }
  });

  it('should return error. FIELD_EMPTY', function (done) {
    const shape = new Shape({
      cars: {
        type: ['string'],
        default: []
      }
    });
    try {
      shape({ });
    } catch (e) {
      const expectedMsg = format(LOCALE.FIELD_EMPTY, { path: 'cars' });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return ok. default array removed', function (done) {
    const shape = new Shape({
      cars: {
        type: ['string?'],
        default: []
      }
    });
    try {
      const data = shape({});
      data.cars === undefined ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should return ok. default array is present', function (done) {
    const shape = new Shape({
      cars: {
        type: ['string?'],
        default: [],
        allowEmpty: true
      }
    });
    try {
      const data = shape({});
      Array.isArray(data.cars) ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should return ok. default obj is present', function (done) {
    const shape = new Shape({
      obj: {
        type: 'object?',
        default: {},
        allowEmpty: true
      }
    });
    try {
      const data = shape({});
      typeof data.obj === 'object' ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should return error. default type mismatch', function (done) {
    const shape = new Shape({
      first_name: {
        type: 'string',
        default: 2,
        allowEmpty: true
      }
    });
    try {
      shape({});
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { 
        path: 'first_name', 
        type: JSON.stringify('string'), 
        value: JSON.stringify(2) 
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return ok. default type empty with allowEmpty:true', function (done) {
    const shape = new Shape({
      first_name: {
        type: 'string?',
        default: '',
        allowEmpty: true
      }
    });
    try {
      const data = shape({});
      data.first_name === '' ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

});