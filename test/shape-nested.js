const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Nested Fields', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be return ok. validation success', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: new Shape({
        id: 'int',
        name: 'string'
      })
    });
    try {
      const data = shape({ 
        first_name: 'gian',
        record: {
          id: 1,
          name: 'foo'
        }
      })
      if (data.record.id === 1 && data.record.name === 'foo') done();
      else done('nope');
    } catch (e) {
      done(e);
    }
  });

  it('should be return error. validation failed', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: new Shape({
        id: 'int',
        name: 'string'
      })
    });
    try {
      const data = shape({
        first_name: 'gian',
        record: {
          id: 1,
          name: 2
        }
      })
      done('nope');
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'record.name',
        type: JSON.stringify('string'),
        value: JSON.stringify(2)
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should be return error. error in child of child', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: new Shape({
        id: 'int',
        name: 'string',
        other: new Shape({
          color: 'string'
        })
      })
    });
    try {
      const data = shape({
        first_name: 'gian',
        record: {
          id: 1,
          name: 2,
          other: {
            color: 25
          }
        }
      })
      done('nope');
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'record.other.color',
        type: JSON.stringify('string'),
        value: JSON.stringify(25)
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });

  it('should be return error. error in child of child using promise', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: new Shape({
        id: 'int',
        name: 'string',
        other: new Shape({
          color: 'string'
        })
      })
    }, { usePromise: true });
    
    shape({
      first_name: 'gian',
      record: {
        id: 1,
        name: 2,
        other: {
          color: 25
        }
      }
    })
    .then(data => done('nope'))
    .catch(err => {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'record.other.color',
        type: JSON.stringify('string'),
        value: JSON.stringify(25)
      });
      err.message === expectedMsg ? done() : done(e);
    });
  });

  it('should be return error. error in child of child using promise', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: new Shape({
        id: 'int',
        name: 'string',
        other: new Shape({
          color: 'string'
        }, { usePromise: true }) //this will be ignored
      })
    });

    try {
      shape({
        first_name: 'gian',
        record: {
          id: 1,
          name: 2,
          other: {
            color: 25
          }
        }
      });
      done('nope');
    } catch(err) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'record.other.color',
        type: JSON.stringify('string'),
        value: JSON.stringify(25)
      });
      err.message === expectedMsg ? done() : done(e);
    }
  });


  it('should be return ok. nested is not required', (done) => {
    const shape = new Shape({
      first_name: 'string',
      record: {
        type: new Shape({
          id: 'int',
          name: 'string',
        }),
        required: false
      }
    }, { usePromise: true });

    shape({ first_name: 'gian' })
      .then(data => done())
      .catch(err => done(err));
  });

});