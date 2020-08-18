'use strict';

const blessed = require('blessed');

module.exports = function (screen) {
  const githubWidget = blessed.box({
    parent: screen,
    label: ' {bold}Github{/} ',
    top: '10%+1',
    left: '35%+1',
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

  return githubWidget;
};
