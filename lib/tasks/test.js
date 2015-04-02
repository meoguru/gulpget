'use strict';

var fs = require('fs');
var path = require('path');

var Promise = require('bluebird');
var replace = require('gulp-replace');

var gulp = require('../gulp');
var $ = require('../plugins');
var pipe = require('../helpers/pipe');
var requirePeer = require('../helpers/require-peer');

module.exports = function (opts) {
  var istanbulOpts = { includeUntested: true };

  if (opts.esnext) {
    var isparta = requirePeer('isparta');
    istanbulOpts.instrumenter = isparta.Instrumenter;
    istanbulOpts.babel = { experimental: true };
  }

  var serverPath = (opts.server && path.join(process.cwd(), opts.server));

  gulp.task('test', 'Test the application.', function () {
    var tests = opts.tests;

    if (!gulp.isWatching && opts.slowTests) {
      tests = tests.concat(opts.slowTests);
    }

    if (opts.esnext) {
      requirePeer('babel/register')({ experimental: true });
    }

    var server;

    var startServerIfExists = Promise.method(function () {
      if (serverPath && !gulp.isWatching) {
        server = require(serverPath);
        return server.start();
      }
    });

    var stopServerIfExists = Promise.method(function () {
      if (serverPath && !gulp.isWatching) {
        return server.stop({ timeout: 0 });
      }
    });

    return startServerIfExists()
      .then(function () {
        opts.setup.forEach(function (setupRelPath) {
          var setupPath = path.join(process.cwd(), setupRelPath);

          if (fs.existsSync(setupPath)) {
            require(setupPath);
          }
        });

        return Promise.fromNode(function (cb) {
          pipe(
            gulp.src(opts.source),
            replace(/^#/, '// #'),
            $.istanbul(istanbulOpts),
            $.istanbul.hookRequire(),
            function () {
              pipe(
                gulp.src(tests, { read: false }),
                $.mocha({ reporter: 'dot' }),
                $.istanbul.writeReports(),
                cb
              );
            }
          );
        });
      })
      .then(stopServerIfExists);
  });
};
