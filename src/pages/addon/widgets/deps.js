'use strict';

const blessed = require('blessed');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const theme = getTheme();
  const { border, style } = theme.deps;
  const depsWidget = blessed.box({
    parent: screen,
    label: ' Dependencies ',
    top: '30%+1',
    left: '30%+1',
    width: '40%',
    height: '20%',
    border,
    style,
    keys: true,
    tags: true,
  });

  return depsWidget;
};
