'use strict';

const blessed = require('blessed');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const theme = getTheme();
  const { border, style } = theme.box;
  const sidebar = blessed.box({
    parent: screen,
    top: '10%+1',
    left: '70%+1',
    width: '30%',
    height: '90%-3',
    border,
    style,
    keys: true,
    vi: true,
    tags: true,
    scrollable: true,
    alwaysScroll: true,
  });

  return sidebar;
};
