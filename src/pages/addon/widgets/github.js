'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const githubWidget = blessed.box({
    parent: screen,
    label: ' {bold}Github{/} ',
    top: '40%+1',
    left: '0',
    width: '70%',
    height: '30%',
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

  return githubWidget;
};
