'use strict';

var gulpget = require('../gulpget');
var $ = gulpget.$;

var util = require('../util');

exports = module.exports = function (src) {
  return util.readify(src)
    .pipe($.coveralls());
};

exports.dependencies = [
  'gulp-coveralls'
];
