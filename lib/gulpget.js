'use strict';

/* Module dependencies */

var path = require('path');
var fs = require('fs');

var findup = require('findup-sync');
var codependency = require('codependency');
var gulpLoadPlugins = require('gulp-load-plugins');

/* Get peer-requiring method */

exports.require = codependency.register(module);

/* Load gulp */

var gulp = exports.gulp = exports.require('gulp');

/* Load gulp plugins */

var parentModuleDir = path.dirname(module.parent.filename);
var packageJsonPath = findup('package.json', { cwd: parentModuleDir });

exports.$ = gulpLoadPlugins({
  config: packageJsonPath,
  requireFn: exports.require,
  lazy: false
});

/* "watching" mode */

exports.watching = false;

/* Load utilities */

exports.util = require('./util');

exports.regulp = function () {
  gulp.doneCallback = function (err) {
    /* istanbul ignore else */
    if (!exports.watching) {
      process.exit(err ? 1 : 0);
    }
  };
};

exports.regulp();

/* Load pre-defined gulp tasks */

var tasks = fs.readdirSync(__dirname + '/task');

tasks.forEach(function (task) {
  var extname = path.extname(task);
  var name = path.basename(task, extname);
  var runTask = require('./task/' + name);

  exports[name] = function () {
    var deps = runTask.dependencies;

    /* istanbul ignore else */
    if (Array.isArray(deps)) {
      deps.forEach(exports.require);
    }

    return runTask.apply(null, arguments);
  };

  for (var prop in runTask) {
    /* istanbul ignore else */
    if (runTask.hasOwnProperty(prop)) {
      exports[name][prop] = runTask[prop];
    }
  }
});
