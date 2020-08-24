'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const depsWidget = blessed.box({
    parent: screen,
    label: ' Dependencies ',
    top: '30%+1',
    left: '30%+1',
    width: '40%',
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

  return depsWidget;
};
