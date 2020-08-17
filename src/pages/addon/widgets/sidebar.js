'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const sidebar = blessed.box({
    parent: screen,
    top: '10%+1',
    left: '70%+1',
    width: '30%',
    height: '90%-3',
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
    tags: true,
  });

  return sidebar;
};
