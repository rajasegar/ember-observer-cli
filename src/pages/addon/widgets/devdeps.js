'use strict';

const blessed = require('blessed');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const theme = getTheme();
  const { border, style } = theme.box;
  const devdepsWidget = blessed.box({
    parent: screen,
    label: ' Dev Dependencies ',
    top: '30%+1',
    left: '0',
    width: '30%',
    height: '20%',
    border,
    style,
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    tags: true,
  });

  return devdepsWidget;
};
