'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const depsWidget = blessed.box({
    parent: screen,
    label: ' Dependencies ',
    top: '70%+1',
    left: '35%+1',
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

  return depsWidget;
};
