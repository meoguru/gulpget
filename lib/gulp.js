'use strict';

var helpGulp = require('gulp-help');
var requirePeer = require('./helpers/require-peer');

var gulp = module.exports = requirePeer('gulp');

gulp.isProduction = (process.env.NODE_ENV === 'production');
gulp.isWatching = false;

helpGulp(gulp);
