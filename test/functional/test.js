'use strict';

var path = require('path');
var gulp = require('gulp');

var gulpget = require('../..');
var $ = gulpget.$;

var util = require('../util');

describe('gulpget', function () {
  before(util.enableMockery);
  after(util.disableMockery);

  before(util.mockGulp);

  beforeEach(function () {
    sinon.stub($.notify, 'onError', function () { return util.noop; });
    sinon.stub(gulpget.util, 'onError', util.noop);
  });

  afterEach(function () {
    gulpget.util.onError.restore();
    $.notify.onError.restore();
  });

  describe('.test', function () {
    it('should accept passed test', function (cb) {
      util.interceptOutput();

      gulp.start('test-passed', function (err) {
        util.uninterceptOutput();
        cb(err);
      });
    });

    it('should reject failed test', function (cb) {
      util.interceptOutput();

      gulp.start('test-failed', function () {
        util.uninterceptOutput();

        expect($.notify.onError).to.have.been.calledOnce;
        expect(gulpget.util.onError).to.have.been.calledOnce;
        expect(gulpget.util.onError).to.have.been.calledWithMatch(function (err) {
          expect(err).to.be.instanceOf(Error);
          expect(err).to.have.property('message').that.match(/1 test failed/);
          return true;
        });

        cb();
      });
    });

    it('should require needed modules', function (cb) {
      util.interceptOutput();

      global.__hello = 'no hello';

      var helloJsPath = path.join(__dirname, '../resources/example-project/lib/hello.js');
      delete require.cache[helloJsPath];

      console.log('here');

      gulp.start('test-require-passed', function (err) {
        util.uninterceptOutput();
        delete global.__hello;
        cb(err);
      });
    });

    describe('.cover', function () {
      it('should run successfully', function (cb) {
        util.interceptOutput();

        gulp.start('cover-passed', function (err) {
          util.uninterceptOutput();
          cb(err);
        });
      });
    });
  });
});
