'use strict';

function identity(x) {
  return x;
}

module.exports = function (arr) {
  return (Array.isArray(arr) ? arr.filter(identity) : arr);
};
