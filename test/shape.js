const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Shape', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be return error, wrong model', function (done) {
    try {
      const shape = new Shape([]);
      shape({ aNumber: '' });
      done('error');
    } catch (e) {
      e.message === 'Model must be an object' ? done() : done(e);
    }
  });

  it('should be return error, wrong options', function (done) {
    try {
      const shape = new Shape({}, []);
      shape({ aNumber: '' });
      done('error');
    } catch (e) {
      e.message === 'Options must be an object' ? done() : done(e);
    }
  });

  it('should return error, data required', (done) => {
    const shape = new Shape({ 
      first_name: 'string' 
    });
    try {
      shape();
    } catch (e) {
      e.message === LOCALE.DATA_REQUIRED ? done() : done(e);
    }
  });

  it('should return error. data without proto', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string'
    });
    try {
      const data = Object.create(null);
      data.first_name = 'gian';
      data.last_name = 'donato';
      shape(data);
      done('error');
    } catch (e) {
      e.message === LOCALE.DATA_INVALID ? done() : done(e);
    }
  });

  it('should be return ok. passing function as a type', (done) => {
    const shape = new Shape({
      first_name: (value) => {
        return value === 'gian';
      }
    });
    try {
      shape({ first_name: 'gian' });
      done();
    } catch (e) {
      done(e);
    }
  });

  it('should be return error. passing function as a type', (done) => {
    const shape = new Shape({
      first_name: (value) => {
        return value === 'gray';
      }
    });
    try {
      shape({ first_name: 'gian' });
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FUNCTION_FAIL, { path: 'first_name', value: 'gian' });
      if (e.message === expectedMsg && e.fields[0].message === expectedMsg) {
        done();
      } else {
        done(e);
      }
    }
  });


  it('should return custom error message', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: {
        type: 'string',
        locale: {
          TYPE_FAIL: 'Bomb Error!'
        }
      }
    });
    try {
      shape({
        first_name: 'gian',
        last_name: false
      });
    } catch (e) {
      // console.log(e.message, e.fields);
      if (e.message === 'Bomb Error!') {
        done();
      } else {
        done(e);
      }
    }
  });

  it('should be return ok, executing onError callback', (done) => {
    let isExecuted = 0;
    const shape = new Shape({
      first_name: 'string',
      last_name: {
        type: 'string',
        onError: (err) => {
          isExecuted += 1;
        }
      }
    });
    try {
      shape({ first_name: 'gian', last_name: false });
    } catch (e) {
      if (isExecuted === 1) done();
      else done(e);
    }
  });

  it('should be return ok using promise', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string',
      created_at: {
        type: 'date',
        default: new Date()
      }
    }, { usePromise: true });
    
    shape({
      first_name: 'gian',
      last_name: 'donato'
    })
    .then(data => done())
    .catch(err => done(err));
  });

  it('should be return error using promise', (done) => {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string',
      created_at: {
        type: 'date',
        default: new Date()
      }
    }, { usePromise: true });

    shape({ first_name: 'gian' })
      .then(data => done(data))
      .catch(e => {
        const expectedMsg = format(LOCALE.FIELD_REQUIRED, { path: 'last_name' });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('should be return error, using required "any" as type', function (done) {
    const shape = new Shape({
      first_name: 'any',
      last_name: 'any'
    }, { usePromise: true });

    shape({
      first_name: 'gian',
      last_name: null
    })
    .then(data => done(data))
    .catch(err => done());
  });

  it('should be return ok, using "any?" as type', function (done) {
    const shape = new Shape({
      first_name: 'any?',
      last_name: { type: 'any?' },
    }, { usePromise: true });

    shape({
      first_name: 'gian',
      last_name: 0
    })
    .then(data => done())
    .catch(err => done(err));
  });

  it('should be return ok. data is filtered', function (done) {
    const shape = new Shape({
      first_name: 'string',
      last_name: 'string?',
    }, { usePromise: true });

    shape({
      first_name: 'gian',
      is_admin: true
    })
    .then(data => {
      data.is_admin === undefined ? done() : done('nope');
    })
    .catch(err => done(err));
  });

});