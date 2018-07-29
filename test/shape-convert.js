const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const Shape = require('../dist/shape.js');

describe('Convert Function', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be return ok. value converted', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        convert: (val) => 'pippo'
      }
    });
    try {
      const data = shape({ first_name: 'gian' })
      data.first_name = 'pippo' ? done() : done(e);
    } catch (e) {
      done(e);
    }
  });

  it('should be return ok. value null', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        allowNull: true,
        convert: (val) => null
      }
    });
    try {
      const data = shape({ first_name: 'gian' })
      data.first_name === null ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return error, CONVERSION_FAILED void returned', (done) => {
    const shape = new Shape({ 
      first_name: {
        type: 'string',
        convert: (val) => {}
      }
    });
    try {
      shape({ first_name: 'gian' })
    } catch (e) {
      e.message === LOCALE.CONVERSION_FAILED ? done() : done(e);
    }
  });

  it('should be return error, CONVERSION_FAILED err throwed', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        convert: (val) => { throw Error() }
      }
    });
    try {
      shape({ first_name: 'gian' })
    } catch (e) {
      e.message === LOCALE.CONVERSION_FAILED ? done() : done(e);
    }
  });

  it('should be return error, custom error', (done) => {
    const shape = new Shape({
      first_name: {
        type: 'string',
        convert: (val) => { throw Error('error!') }
      }
    });
    try {
      shape({ first_name: 'gian' })
    } catch (e) {
      e.message === 'error!' ? done() : done(e);
    }
  });

  it('should be returns ok. convert value same type', (done) => {
    const shape = new Shape({
      first_name: 'string',
      age: {
        type: 'int',
        convert: (value) => {
          return 10 + value;
        }
      },
    });
    try {
      const data = shape({ first_name: 'gian', age: 28 });
      data.age === 38 ? done() : done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return error. convert changes type', (done) => {
    const shape = new Shape({
      first_name: 'string',
      created_at: {
        type: 'date',
        convert: (value) => {
          return 10;
        }
      },
    });
    try {
      shape({
        first_name: 'gian',
        created_at: new Date()
      });
      done('nope');
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'created_at',
        type: JSON.stringify('date'),
        value: JSON.stringify(10)
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });
});