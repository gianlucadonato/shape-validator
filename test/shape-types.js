const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const Shape = require('../dist/shape.js');

describe('Check Types', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be return error. TYPE_UNKNOWN', (done) => {
    const shape = new Shape({
      first_name: 'footype'
    });
    try {
      shape({ first_name: 'gian' });
    } catch (e) {
      if (!(e.fields || []).length) done(e);
      if (e.fields[0].message !== format(LOCALE.TYPE_UNKNOWN, { type: 'footype' })) {
        done(e);
      }
      done();
    }
  });

  it('should be return error. TYPE_FAIL', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string'
    });
    try {
      shape({
        first_name: 'gian',
        last_name: false
      });
      done(new Error('yolo'))
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { 
        path: 'last_name', 
        type: JSON.stringify('string'), 
        value: JSON.stringify(false)
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return ok. string -> string', function (done) {
    const shape = new Shape({
      first_name: 'string'
    });
    try {
      const data = shape({ first_name: 'gian' });
      data.first_name === 'gian' ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should return error. TYPE_FAIL [string] -> string', function (done) {
    const shape = new Shape({
      cars: 'string'
    });
    try {
      shape({ cars: ['ferrari'] });
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { 
        path: 'cars', 
        type: JSON.stringify('string'), 
        value: JSON.stringify(['ferrari']) 
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return ok. [string] -> [string]', function (done) {
    const shape = new Shape({
      cars: ['string']
    });
    try {
      shape({ cars: ['ferrari'] });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should return error. TYPE_FAIL number -> string', function (done) {
    const shape = new Shape({
      first_name: 'string'
    });
    try {
      shape({ first_name: 2 });
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { path: 'first_name', type: '"string"', value: 2 });
      e.message === expectedMsg ? done() : done(e);
    }
  });


  it('should return error. TYPE_FAIL [number] -> [string]', function (done) {
    const shape = new Shape({
      cars: ['string']
    });
    try {
      const data = shape({ cars: [2] });
      done(e);
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { 
        path: 'cars',
        type: 'string', 
        value: 2
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return error. TYPE_FAIL obj -> string', function (done) {
    const shape = new Shape({
      first_name: 'string'
    });
    try {
      shape({ first_name: { x: 0 } });
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, { 
        path: 'first_name',
        type: JSON.stringify('string'),
        value: JSON.stringify({ x: 0 })
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return error. TYPE_FAIL wrong array item', function (done) {
    const shape = new Shape({
      colors: ['string']
    });
    try {
      shape({ colors: ['Red', 'Gray', 42] });
      done('error');
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'colors',
        type: 'string',
        value: 42
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should return error. TYPE_FAIL obj -> string', function (done) {
    const shape = new Shape({
      created_at: 'date'
    });
    try {
      shape({ created_at: '01/01/1970' });
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'created_at',
        type: JSON.stringify('date'),
        value: JSON.stringify('01/01/1970')
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });


  // CUSTOM TYPE FUCTION

  it('should return ok. validate custom fn', function (done) {

    const shape = new Shape({
      first_name: (val) => {
        return val === 'foo'
      },
    }, { usePromise: true });

    shape({ first_name: 'foo' })
      .then(data => {
        data.first_name === 'foo' ? done() : done('nope');
      })
      .catch(e => done(e));
  });

  it('should return ok. multi validate fn', function (done) {

    const shape = new Shape({
      first_name: {
        type: (value, data, valid8) => {
          if (!valid8.isString(value))
            return 'must be a string';
          if (value.length <= 5)
            return 'must be 5 chars'
          return true
        }
      },
    }, { usePromise: true });

    shape({ first_name: 'foo' })
      .then(data => done('nope'))
      .catch(e => {
        e.message === 'must be 5 chars' ? done() : done(e);
      });
  });

  it('should return error. validate custom fn failed', function (done) {

    const shape = new Shape({
      first_name: (val) => {
        return val === 'foo'
      },
    }, { usePromise: true });

    shape({ first_name: 'baz' })
      .then(data => done('nope'))
      .catch(e => {
        const expectedMsg = format(LOCALE.TYPE_FUNCTION_FAIL, {
          path: 'first_name',
          value: 'baz'
        });
        e.message === expectedMsg ? done() : done(e);
      });
  });
});