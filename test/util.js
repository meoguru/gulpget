'use strict';

var path = require('path');

var through = require('through2');
var mockery = require('mockery');
var gulp = require('gulp');

var gulpget = require('..');

exports.enableMockery = function () {
  mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
  });
};

exports.disableMockery = function () {
  mockery.disable();
};

exports.mockGulp = function () {
  gulp.reset();
  gulpget.regulp();

  mockery.registerMock('gulp', gulp);
  mockery.registerMock('gulpget', gulpget);

  var root = path.join(__dirname, 'resources/example-project');
  var gulpfileJsPath = path.join(root, 'gulpfile.js');

  process.chdir(root);

  delete require.cache[gulpfileJsPath];
  require(gulpfileJsPath);
};

exports.interceptOutput = function () {
  var writeOut = process.stdout.write;
  var writeErr = process.stderr.write;

  process.stdout.write = function () {};
  process.stderr.write = function () {};

  process.stdout.write.original = writeOut;
  process.stderr.write.original = writeErr;
};

exports.uninterceptOutput = function () {
  process.stdout.write = process.stdout.write.original;
  process.stderr.write = process.stderr.write.original;
};

exports.echo = function () {
  return through.obj(function (obj, encoding, cb) {
    this.push(obj);
    cb();
  });
};

exports.noop = function () {};
