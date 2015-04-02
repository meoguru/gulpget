'use strict';

var util = require('gulp-util');
var colors = util.colors;

var gulp = require('../gulp');

module.exports = function (err) {
  var msg;

  if (err instanceof util.PluginError) {
    msg = err.toString();
  } else {
    msg = (err && err.stack ? err.stack : err);
  }

  util.log(colors.red(msg));
  util.beep();

  if (gulp.isWatching) {
    this.emit('end');

  } else {
    throw err;
  }
};
