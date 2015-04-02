'use strict';

var codependency = require('codependency');
var pkg = require('../../package.json');

var optionalPeerDependencies = pkg.optionalPeerDependencies || {};
var realRequirePeer = codependency.get(pkg.name);

module.exports = function (name, opts) {
  opts = opts || {};

  if (typeof opts.optional === 'undefined') {
    opts.optional = (name in optionalPeerDependencies);
  }

  return realRequirePeer(name, opts);
};
