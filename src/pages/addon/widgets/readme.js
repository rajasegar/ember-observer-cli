'use strict';

const contrib = require('blessed-contrib');

module.exports = function (screen) {
  const readme = contrib.markdown({
    parent: screen,
    label: ' README ',
    top: '50%+1',
    left: '0',
    width: '70%',
    height: '50%-4',
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

  return readme;
};
