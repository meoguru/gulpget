'use strict';

var gulpget = require('../gulpget');
var $ = gulpget.$;

var util = require('../util');

exports = module.exports = function (src) {
  return util.readify(src)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      title: 'Lint',
      message: /* istanbul ignore next */ function (file) {
        if (!file.jshint || file.jshint.success) {
          return false;
        }

        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return $.util.template(
              '(<%= line %>:<%= character %>) <%= reason %>',
              {
                file: file,
                line: data.error.line,
                character: data.error.character,
                reason: data.error.reason
              }
            );
          }
        }).join('\n');

        return '<%= file.relative %> ' +
          '(<%= file.jshint.results.length %> ' +
          'error<% if (file.jshint.results.length > 1) { %>s<% } %>).\n' +
          errors;
      }
    }))
    .pipe($.jshint.reporter('fail'))
    .on('error', util.onError);
};

exports.dependencies = [
  'gulp-jshint',
  'gulp-notify',
  'gulp-util',
  'jshint-stylish'
];
