'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const devdepsWidget = blessed.box({
    parent: screen,
    label: ' Dev Dependencies ',
    top: '30%+1',
    left: '0',
    width: '35%',
    height: '20%',
    border: {
      type: 'line',
      fg: 'white',
    },
    style: {
      selected: {
        fg: 'black',
        bg: 'white',
      },
      focus: {
        border: {
          fg: 'yellow',
        },
      },
    },
    keys: true,
    vi: true,
    scrollable: true,
    alwaysScroll: true,
    tags: true,
  });

  return devdepsWidget;
};
