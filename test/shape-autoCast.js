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
      bool3: 'boolean',
      aString: 'string',
      aNumber: 'number',
      aUndefined: 'undefined',
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
      bool1: 'true',
      bool2: 1,
      bool3: {},
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
        data.bool1 === true &&
        data.bool2 === true &&
        data.bool3 === true &&
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
      done();
    });
  });
});