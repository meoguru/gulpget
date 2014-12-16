'use strict';

var path = require('path');
var Promise = require('bluebird'); // jshint ignore: line

var gulpget = require('../gulpget');
var $ = gulpget.$;

var util = require('../util');

var cwd = process.cwd();

exports = module.exports = function (src, opts) {
  opts = opts || {};

  opts.require = util.arrayify(opts.require);
  opts.require.forEach(function (file) {
    require(path.resolve(cwd, file));
  });

  return util.readify(src)
    .pipe($.mocha(opts.mocha))
    .on('error', util.notifyOnError('Test'))
    .on('error', util.onError);
};

util.optionify(exports);

exports.cover = function (src, instrument, opts) {
  /* istanbul ignore next */
  opts = opts || {};

  return new Promise(function (resolve) {
    util.readify(instrument)
      .pipe($.istanbul(opts.istanbul))
      .on('error', util.notifyOnError('Test'))
      .on('error', util.onError)
      .on('finish', function () {
        exports(src, opts)
          .pipe($.istanbul.writeReports())
          .on('end', resolve);
      });
  });
};

util.optionify(exports.cover);

exports.dependencies = [
  'gulp-istanbul',
  'gulp-mocha',
  'gulp-notify',
  'istanbul',
  'mocha'
];
