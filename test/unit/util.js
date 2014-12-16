'use strict';

var gulpget = require('../..');
var $ = gulpget.$;
var util = gulpget.util;

describe('gulpget', function () {
  describe('util', function () {
    describe('arrayify', function () {
      it('should return empty array for null or undefined value', function () {
        expect(util.arrayify(undefined)).to.deep.equal([]);
        expect(util.arrayify(null)).to.deep.equal([]);
      });

      it('should convert single item to array', function () {
        expect(util.arrayify('a')).to.deep.equal([ 'a' ]);
        expect(util.arrayify(0)).to.deep.equal([ 0 ]);
        expect(util.arrayify(false)).to.deep.equal([ false ]);
      });

      it('should keep array untouched', function () {
        expect(util.arrayify([])).to.deep.equal([]);
        expect(util.arrayify([ 'a' ])).to.deep.equal([ 'a' ]);
        expect(util.arrayify([ null ])).to.deep.equal([ null ]);
      });
    });

    describe('readify', function () {
      it('should convert files to vinyl stream', function () {
        expect(util.readify('hello.js')).to.respondTo('pipe');
      });

      it('should keep vinyl stream untouched', function () {
        var fakeStream = { pipe: 1 };
        expect(util.readify(fakeStream)).to.equal(fakeStream);
      });
    });

    describe('writify', function () {
      it('should convert files to vinyl stream', function () {
        expect(util.writify('hello.js')).to.respondTo('pipe');
      });

      it('should keep vinyl stream untouched', function () {
        var fakeStream = { pipe: 1 };
        expect(util.writify(fakeStream)).to.equal(fakeStream);
      });
    });

    describe('notifyOnError', function () {
      beforeEach(function () {
        sinon.stub($.notify, 'onError', function () {});
      });

      afterEach(function () {
        $.notify.onError.restore();
      });

      it('should notify when error occurred with correct title', function () {
        util.notifyOnError('Hello');
        expect($.notify.onError).to.have.been.calledOnce;
        expect($.notify.onError).to.have.been.calledWithMatch(function (noti) {
          expect(noti).to.have.property('title', 'Hello');
          return true;
        });
      });
    });

    describe('onError', function () {
      beforeEach(function () {
        sinon.stub($.util, 'log', function () {});
        sinon.stub(process, 'exit', function () {});
      });

      afterEach(function () {
        $.util.log.restore();
        process.exit.restore();
      });

      it('should log error stack', function () {
        var fakeErr = { stack: 'fake stack' };

        util.onError(fakeErr);

        expect($.util.log).to.have.been.calledOnce;
        expect($.util.log).to.have.been.calledWithMatch(function (msg) {
          expect(msg).to.match(/fake stack/);
          return true;
        });
      });

      describe('in "watching" mode', function () {
        beforeEach(function () {
          this.watching = gulpget.watching;
          gulpget.watching = true;
        });

        afterEach(function () {
          gulpget.watching = this.watching;
        });

        it('should emit "end" on current stream', function () {
          var fakeErr = { stack: 'fake stack' };
          var fakeStream = { emit: sinon.spy() };

          util.onError.call(fakeStream, fakeErr);

          expect(fakeStream.emit).to.have.been.calledOnce;
          expect(fakeStream.emit).to.have.been.calledWith('end');
        });
      });

      it('should exit when not in "watching" mode', function () {
        var fakeErr = { stack: 'fake stack' };

        util.onError(fakeErr);

        expect(process.exit).to.have.been.calledOnce;
        expect(process.exit).to.have.been.calledWithMatch(function (exitStatus) {
          expect(exitStatus).to.not.equal(0);
          return true;
        });
      });
    });
  });
});
