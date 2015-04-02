'use strict';

var path = require('path');

var loadGulpPlugins = require('gulp-load-plugins');
var assign = require('object-assign');

var pkg = require('../package.json');
var requirePeer = require('./helpers/require-peer');

var parentPkgPath = path.join(process.cwd(), 'package.json');
var parentPkg = require(parentPkgPath);

var dummyScope = Math.random().toString(36).substring(-5);

parentPkg[dummyScope] = assign(
  {},
  pkg.neededPeerDependencies,
  pkg.optionalPeerDependencies
);

module.exports = loadGulpPlugins({
  config: parentPkg,
  scope: [
    'dependencies',
    'devDependencies',
    'peerDependencies'
  ].concat(dummyScope),
  requireFn: requirePeer
});
