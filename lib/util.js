'use strict';

var gulpget = require('./gulpget');
var gulp = gulpget.gulp;
var $ = gulpget.$;

var slice = [].slice;

exports.arrayify = function (arr) {
  if (arr == null) {
    return [];
  }

  return (Array.isArray(arr) ? arr : [ arr ]);
};

exports.readify = function (src, opts) {
  return (src && src.pipe ? src : gulp.src(src, opts));
};

exports.writify = function (dest, opts) {
  return (dest && dest.pipe ? dest : gulp.dest(dest, opts));
};

exports.notifyOnError = function (title) {
  return $.notify.onError({
    title: title,
    message: '<%= error.message %>'
  });
};

exports.onError = function (err) {
  /* istanbul ignore next */
  var msg = (err && err.stack ? err.stack : err);

  $.util.log(
    $.util.colors.red(msg)
  );

  if (gulpget.watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
};

exports.optionify = function (fn) {
  fn.withOptions = function (opts) {
    return function () {
      var args = slice.call(arguments);
      args.push(opts);
      return fn.apply(null, args);
    };
  };
};
