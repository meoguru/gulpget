'use strict';

var gulp = require('../gulp');
var $ = require('../plugins');
var pipe = require('../helpers/pipe');

module.exports = function (opts) {
  opts = opts || {};

  gulp.task('lint', 'Lint source code.', function () {
    return pipe(
      gulp.src(opts.files),
      (gulp.isWatching && $.cached && $.cached('linting')),
      $.eslint(),
      $.eslint.format(),
      $.eslint.failAfterError()
    );
  });
};
