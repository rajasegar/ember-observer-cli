'use strict';

const blessed = require('blessed');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const theme = getTheme();
  const { border, style } = theme.box;
  const githubWidget = blessed.box({
    parent: screen,
    label: ' {bold}Github{/} ',
    top: '10%+1',
    left: '30%+1',
    width: '20%',
    height: '20%',
    border,
    style,
    keys: true,
    tags: true,
  });

  return githubWidget;
};
