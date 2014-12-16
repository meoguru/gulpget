'use strict';

var path = require('path');

var gulp = require('gulp');
var gulpget = require('gulpget');

gulp.task('nothing-passed', function () {
});

gulp.task('nothing-failed', function () {
  throw new Error('Failed!');
});

gulp.task('lint-passed', function () {
  return gulpget.lint('lib/lint-passed.js');
});

gulp.task('lint-failed', function () {
  return gulpget.lint('lib/lint-failed.js');
});

gulp.task('test-passed', function () {
  return gulpget.test('test/test-passed.js');
});

gulp.task('test-failed', function () {
  return gulpget.test('test/test-failed.js');
});

gulp.task('test-require-passed', function () {
  return gulpget.test('test/test-require-passed.js', {
    require: path.join(__dirname, 'lib/hello')
  });
});

gulp.task('cover-passed', function () {
  return gulpget.test.cover('test/test-passed.js', 'lib/hello.js');
});
