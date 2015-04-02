'use strict';

var path = require('path');

var Promise = require('bluebird');
var minimatch = require('minimatch-all');

var gulp = require('../gulp');
var requirePeer = require('../helpers/require-peer');

module.exports = function (opts) {
  opts = opts || {};

  if (!opts.server) {
    throw new Error('Server file path is required.');
  }

  var open = requirePeer('open');
  var serverPath = path.join(process.cwd(), opts.server);

  gulp.task('serve', 'Serve the application.', function () {
    var server;
    var isFirstTime = true;

    return Promise.try(function () {
        if (server) {
          return server.stop({ timeout: 0 });
        }
      })
      .then(function () {
        if (server && opts.clearCache) {
          for (var filePath in require.cache) {
            if (filePath.indexOf(process.cwd())) {
              continue;
            }

            var relPath = path.relative(process.cwd(), filePath);

            if (minimatch(relPath, opts.clearCache)) {
              delete require.cache[filePath];
            }
          }

        } else {
          if (opts.esnext) {
            requirePeer('babel/register')({ experimental: true });
          }
        }

        server = require(serverPath);
        return server.start();
      })
      .then(function () {
        if (isFirstTime) {
          if (open && opts.url) {
            open(opts.url);
          }
          isFirstTime = false;
        }
      });
  });
};
