'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const devdepsWidget = blessed.box({
    parent: screen,
    label: ' Dev Dependencies ',
    top: '70%+1',
    left: '0',
    width: '35%',
    height: '30%-3',
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

  return devdepsWidget;
};
