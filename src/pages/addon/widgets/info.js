'use strict';

const blessed = require('blessed');

module.exports = function (screen, addon) {
  const info = blessed.box({
    parent: screen,
    label: ` ${addon} `,
    top: '10%+1',
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
    tags: true,
  });

  return info;
};
