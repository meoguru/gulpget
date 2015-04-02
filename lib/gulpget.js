'use strict';

var codependency = require('codependency');
var assign = require('object-assign');

codependency.register(module, {
  index: [
    'neededPeerDependencies',
    'optionalPeerDependencies'
  ]
});

var optsHelper = require('./helpers/options');

exports = module.exports = function (name, opts) {
  opts = opts || {};

  var preset = require('./presets/' + name + '.json');
  var commonOpts = optsHelper.common(opts);
  var presetCommonOpts = optsHelper.common(preset);

  for (var taskName in preset) {
    if (!preset.hasOwnProperty(taskName) ||
      (taskName in presetCommonOpts)) {
      continue;
    }

    if (opts[taskName] === false) {
      continue;
    }

    // Avoid mutating task options
    var taskOpts = assign(
      {},
      presetCommonOpts,
      preset[taskName],
      commonOpts,
      opts[taskName]
    );

    exports.task(taskName, taskOpts);
  }
};

exports.preset = exports;

exports.task = function (name, opts) {
  var loadTask = require('./tasks/' + name);
  loadTask(optsHelper.parse(opts));
};
