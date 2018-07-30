const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Add Type', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should validate custom type', (done) => {

    Shape.addType('myType', (value, validation) => {
      return value === 'foo';
    });

    const shape = new Shape({
      first_name: 'myType',
      last_name: (value) => {
        return value === 'bar';
      }
    }, { usePromise: true });

    const data = {
      first_name: 'foo',
      last_name: 'bar',
    };

    shape(data).then(data => {
      if (data.first_name === 'foo' && data.last_name === 'bar') {
        done();
      } else {
        done('error')
      }
    }).catch(e => done(e));
  });

  it('should return error. custom validation failed', (done) => {
    
    Shape.addType('fooType', (value, validation) => {
      return value === 'foo';
    });

    const shape = new Shape({
      first_name: 'fooType',
    }, { usePromise: true });

    shape({ first_name: 'gian' })
      .then(data => done('error'))
      .catch(e => {
        const expectedMsg = format(LOCALE.TYPE_FAIL, { 
          path: 'first_name',
          type: JSON.stringify('fooType'),
          value: JSON.stringify('gian')
        });
        e.message === expectedMsg ? done() : done(e);
      });
  });

  it('should return error. custom error', (done) => {
    
    Shape.addType('boomType', (value) => {
      if (value !== 'boom')
        return 'it must be boom';
      else
        return true;
    });

    const shape = new Shape({
      first_name: 'boomType',
    }, { usePromise: true });

    shape({ first_name: 'gian' })
      .then(data => done('nope'))
      .catch(e => {
        e.message === 'it must be boom' ? done() : done(e);
      });
  });

  it('should return error. throw error', (done) => {

    Shape.addType('boomType2', (value) => {
      if (value !== 'boom')
        throw new Error('it must be boom');
      return true;
    });

    const shape = new Shape({
      first_name: 'boomType2',
    }, { usePromise: true });

    shape({ first_name: 'gian' })
      .then(data => done('nope'))
      .catch(e => {
        e.message === 'it must be boom' ? done() : done(e);
      });
  });

  it('add multiple types', (done) => {
    Shape.addTypes([
      {
        name: 'myType10',
        fn: value => value === 'hello'
      },
      {
        name: 'myType20',
        fn: value => value === 'world'
      }
    ]);
    if (Shape.typeExists('myType10') || Shape.typeExists('myType20')) {
      done();
    } else {
      done('error');
    }
  });
});