'use strict';

var score = 0;

exports.hit = function () {
  score += 1 + ~~Math.random(11);

  if (score > 21) {
    throw new Error('Busted!');
  }
} // no semicolon
