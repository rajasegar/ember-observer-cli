'use strict';

const contrib = require('blessed-contrib');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const theme = getTheme();
  const { border, style } = theme.box;
  const readme = contrib.markdown({
    parent: screen,
    label: ' README ',
    top: '50%+1',
    left: '0',
    width: '70%',
    height: '50%-4',
    border,
    style,
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    tags: true,
  });

  return readme;
};
