'use strict';

module.exports = function (score) {
  // Color values taken from here
  // https://github.com/emberobserver/client/blob/0764b6b055a1efe314862bae1ae957f6a6281a01/app/styles/_scores.scss
  const scoreColors = {
    '0': '#999',
    '1': '#ff7e63',
    '2': '#ff7e63',
    '3': '#fbab61',
    '4': '#fbab61',
    '5': '#EDE217',
    '6': '#EDE217',
    '7': '#7ECF27',
    '8': '#7ECF27',
    '9': '#28b36d',
    '10': '#28b36d',
  };

  const _score = Math.round(Number(score));
  return scoreColors[_score];
};
