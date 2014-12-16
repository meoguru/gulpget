'use strict';

var gulp = require('gulp');

var gulpget = require('../..');
var $ = gulpget.$;

var util = require('../util');

describe('gulpget', function () {
  before(util.enableMockery);
  after(util.disableMockery);

  before(util.mockGulp);

  beforeEach(function () {
    sinon.stub($, 'notify', util.echo);
    sinon.stub(gulpget.util, 'onError', util.noop);
  });

  afterEach(function () {
    gulpget.util.onError.restore();
    $.notify.restore();
  });

  describe('.lint', function () {
    it('should accept well-formed code', function (cb) {
      gulp.start('lint-passed', cb);
    });

    it('should reject code which has lint error', function (cb) {
      util.interceptOutput();

      gulp.start('lint-failed', function () {
        util.uninterceptOutput();

        expect($.notify).to.have.been.calledOnce;
        expect(gulpget.util.onError).to.have.been.calledOnce;
        expect(gulpget.util.onError).to.have.been.calledWithMatch(function (err) {
          expect(err).to.be.instanceOf(Error);
          expect(err).to.have.property('message').that.match(/JSHint failed for/);
          return true;
        });

        cb();
      });
    });
  });
});
