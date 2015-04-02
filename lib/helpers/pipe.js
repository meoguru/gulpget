'use strict';

var multipipe = require('multipipe');

var compact = require('./compact');
var onError = require('./on-error');

exports = module.exports = function () {
  var args = [].slice.call(arguments);
  args = compact(args);

  return multipipe.apply(multipipe, args)
    .on('error', onError);
};
