const { isEmpty } = require('../dist/utils.js');

describe.skip('isEmpty', () => {

  it('Should be return true if empty string', (done) => {
    isEmpty('') ? done() : done(new Error('Not Empty'));
  });

  it('Should be return true if undefined', (done) => {
    isEmpty(undefined) ? done() : done(new Error('Not Empty'));
  });

  it('Should be return true if null', (done) => {
    isEmpty(null) ? done() : done(new Error('Not Empty'));
  });

  it('Should be return true if empty obj', (done) => {
    isEmpty({}) ? done() : done(new Error('Not Empty'));
  });

  it('Should be return true if empty array', (done) => {
    isEmpty([]) ? done() : done(new Error('Not Empty'));
  });
  
  it('Should be return false if 0', (done) => {
    isEmpty(0) ? done(new Error('Not Empty')) : done();
  });

  it('Should be return false if 1', (done) => {
    isEmpty(1) ? done(new Error('Not Empty')) : done();
  });

  it('Should be return false if string', (done) => {
    isEmpty('hello') ? done(new Error('Not Empty')): done();
  });

  it('Should be return false if obj', (done) => {
    isEmpty({ hello: 'world' }) ? done(new Error('Not Empty')) : done();
  });

  it('Should be return false if array', (done) => {
    isEmpty([{ hello: 'world' }]) ? done(new Error('Not Empty')) : done();
  });

  it('Should be return false if date', (done) => {
    isEmpty(new Date()) ? done(new Error('Not Empty')) : done();
  });
});