const format = require('string-template');
const Shape = require('../dist/shape.js');

describe.skip('Test Locale', () => {

  before('reset locale', () => {
    Shape.setLocale({
      DATA_REQUIRED: 'data is required',
      DATA_INVALID: 'data must have proto',
      CONVERSION_FAILED: 'conversion failed',
      
      TYPE_FAIL: 'this type has failed',
      TYPE_UNKNOWN: 'Invalid bim bum type',
      TYPE_ARRAY_FAIL: '"{field}" expects array of {type} type but receives: {value}',
      TYPE_FUNCTION_FAIL: '"{field}" receives: {value}',
      TYPE_UNDEFINED: 'type is not defined',
      FIELD_REQUIRED: '"{field}" is required',
      FIELD_EMPTY: '"{field}" cannot be empty',
      FIELD_NULL: '"{field}" cannot be null',
      UNKNOWN_DETECTED: 'Unknown fields were detected: {unknownFields}',
    });
  });

  it('should be return error, DATA_REQUIRED', (done) => {
    const shape = new Shape({ last_name: 'string' });
    try {
      shape()
    } catch (e) {
      e.message === 'data is required' ? done() : done(e);
    }
  });

  it('should be return error, DATA_INVALID', (done) => {
    const shape = new Shape({ first_name: 'string' });
    const data = Object.create(null);
    data.first_name = 'gian';
    try {
      shape(data)
    } catch (e) {
      e.message === 'data must have proto' ? done() : done(e);
    }
  });

  it('should be return error, CONVERSION_FAILED', (done) => {
    const shape = new Shape({ 
      first_name: {
        type: 'string',
        convert: (val) => { throw Error() }
      }
    });
    try {
      shape({ first_name: 'gian' })
    } catch (e) {
      e.message === 'conversion failed' ? done() : done(e);
    }
  });

  it('should be return error, TYPE_UNKNOWN', (done) => {
    const shape = new Shape({ last_name: 'footype' });
    try {
      shape({ last_name: 'smith' })
    } catch (e) {
      e.message === 'Invalid bim bum type' ? done() : done(e);
    }
  });

  it('should be return error, TYPE_FAIL', (done) => {
    const shape = new Shape({ last_name: 'string' });
    try {
      shape({ last_name: 42 })
    } catch (e) {
      e.message === 'this type has failed' ? done() : done(e);
    }
  });

});