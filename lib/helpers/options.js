'use strict';

var only = require('only');
var defaults = require('defaults');

exports.parse = function (opts) {
  return defaults(opts, { esnext: true });
};

exports.common = function (opts) {
  return only(opts, [
    'esnext',
    'server',
    'url'
  ]);
};
