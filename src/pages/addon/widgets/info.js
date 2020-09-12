'use strict';

const blessed = require('blessed');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen, addon) {
  const theme = getTheme();
  const { border, style } = theme.box;
  const info = blessed.box({
    parent: screen,
    label: ` {bold}${addon}{/} `,
    top: '10%+1',
    left: '0',
    width: '30%',
    height: '20%',
    border,
    style,
    keys: true,
    tags: true,
  });

  return info;
};
