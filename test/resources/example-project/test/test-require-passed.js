'use strict';

describe('test-require-passed', function () {
  it('should require needed modules and pass', function () {
    expect(global).to.have.property('__hello', 'hello');
  });
});
