'use strict';

var gulp = require('gulp');

var gulpget = require('../..');
var util = require('../util');

describe('gulp', function () {
  before(util.enableMockery);
  after(util.disableMockery);

  before(util.mockGulp);

  afterEach(function () {
    if (typeof gulp.doneCallback.restore === 'function') {
      gulp.doneCallback.restore();
    }

    if (typeof process.exit.restore === 'function') {
      process.exit.restore();
    }
  });

  describe('doneCallback', function () {
    it('should be called after gulp finished', function (cb) {
      sinon.stub(gulp, 'doneCallback', function () {
        expect(gulp.doneCallback).to.have.been.calledOnce;
        cb();
      });

      gulp.start('nothing-passed');
    });

    describe('in "watching" mode', function () {
      beforeEach(function () {
        this.watching = gulpget.watching;
        gulpget.watching = true;
      });

      afterEach(function () {
        gulpget.watching = this.watching;
      });

      it('should not exit', function (cb) {
        sinon.stub(gulp, 'doneCallback', function () {
          expect(gulp.doneCallback).to.have.been.calledOnce;
          expect(process.exit).to.not.have.been.called;
          cb();
        });

        sinon.stub(process, 'exit', function () {});

        gulp.start('nothing-passed');
      });
    });

    it('should exit with status of zero when no error occurred', function (cb) {
      var doneCallback = gulp.doneCallback;

      sinon.stub(gulp, 'doneCallback', function (err) {
        doneCallback.call(gulp, err);

        expect(gulp.doneCallback).to.have.been.calledOnce;
        expect(process.exit).to.have.been.calledOnce;
        expect(process.exit).to.have.been.calledWith(0);

        cb();
      });

      sinon.stub(process, 'exit', function () {});

      gulp.start('nothing-passed');
    });

    it('should exit with non-zero status when error occurred', function (cb) {
      var doneCallback = gulp.doneCallback;

      sinon.stub(gulp, 'doneCallback', function (err) {
        doneCallback.call(gulp, err);

        expect(gulp.doneCallback).to.have.been.calledOnce;
        expect(process.exit).to.have.been.calledOnce;
        expect(process.exit).to.have.been.calledWithMatch(function (status) {
          expect(status).to.not.equal(0);
          return true;
        });

        cb();
      });

      sinon.stub(process, 'exit', function () {});

      gulp.start('nothing-failed');
    });
  });
});
