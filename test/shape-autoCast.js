const format = require('string-template');
const { LOCALE } = require('../dist/locale.js');
const { Shape } = require('../dist/index.js');

describe('Auto Cast', () => {

  before('reset locale', () => {
    Shape.setLocale(LOCALE);
  });

  it('should be ok', function (done) {
    const shape = new Shape({
      any: 'any?',
      bool1: 'boolean',
      bool2: 'boolean',
      aString: 'string',
      aNumber: 'number',
      aNumber2: 'number?',
      aUndefined: 'undefined?',
      aNull: 'null',
      email: 'email',
      strArray: ['string'],
      numArray: ['number'],
      numString: 'string'
    }, { 
      autoCast: true,
      allowEmpty: true,
      allowNull: true,
      usePromise: true
    });
    shape({
      aString: 42,
      aNumber: '3',
      aNumber2: '0',
      bool1: 'false',
      bool2: 1,
      strArray: [1, 2],
      numArray: ['1', '2'],
      aUndefined: 'undefined',
      aNull: 'null',
      email: 'test@test.net',
      numString: '23'
    }).then(data => {
      if (
        data.aString === '42' &&
        data.aNumber === 3 &&
        data.aNumber2 === 0 &&
        data.bool1 === false &&
        data.bool2 === true &&
        data.aUndefined === undefined &&
        data.aNull === null &&
        data.email === 'test@test.net' &&
        data.numString === '23' &&
        data.strArray[0] === '1' && data.strArray[1] === '2' &&
        data.numArray[0] === 1 && data.numArray[1] === 2
      ) {
        return done();
      }
      console.log(data);
      done('none');
    }).catch(e => {
      done(e);
    });
  });

  it('should be failed', function (done) {
    const shape = new Shape({
      str: 'string',
      num: 'number',
      bool1: 'boolean',
      bool2: 'boolean',
      bool3: 'boolean',
      any: 'any?',
      email: 'email',
      aUndefined: 'undefined',
      aNull: 'null',
      strArray: ['string'],
      numArray: ['number']
    }, {
        autoCast: false,
        allowEmpty: true,
        allowNull: true,
        usePromise: true
      });
    shape({
      str: 42,
      num: '3',
      bool1: 'true',
      bool2: 1,
      bool3: {},
      strArray: [1, 2],
      numArray: ['1', '2'],
      aUndefined: 'undefined',
      aNull: 'null',
      email: 'test@test.net',
    }).then(data => {
      done('none');
    }).catch(e => {
      // console.log(e.message);
      done();
    });
  });

  it('should be return ok. undefined values', (done) => {
    const shape = new Shape({
      user_id: 'objectId?',
      other_id: 'objectId?',
      name: 'string?',
      null: 'string?',
    }, { autoCast: true });
    try {
      const data = shape({ 
        user_id: 'undefined', 
        other_id: '',
        null: null
      });
      if (
        data.user_id === undefined && 
        data.other_id === undefined && 
        data.name === undefined && 
        data.null === undefined
      ) {
        done();
      } else {
        done('nope');
      }
    } catch (e) {
      done(e);
    }
  });

  it('should not autocast a string number', (done) => {
    const shape = new Shape({
      code: 'string',
      age: 'number',
    }, { autoCast: true });
    try {
      const data = shape({
        code: '0002',
        age: '42'
      });
      if (data.code === '0002' && data.age === 42) {
        done();
      } else {
        console.log('data', data);
        done('nope');
      }
    } catch (e) {
      done(e);
    }
  });

  it('should not autocast', (done) => {
    const shape = new Shape({
      age: {
        type: 'number',
        autoCast: false
      },
    }, { autoCast: true });
    try {
      const data = shape({
        age: '42'
      });
      done('nope');
    } catch (e) {
      const expectedMsg = format(LOCALE.TYPE_FAIL, {
        path: 'age',
        type: '"number"',
        value: '"42"'
      });
      e.message === expectedMsg ? done() : done(e);
    }
  });
});