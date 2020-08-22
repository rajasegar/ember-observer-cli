'use strict';

const contrib = require('blessed-contrib');

module.exports = function (screen) {
  const score = contrib.lcd({
    parent: screen,
    label: ' {bold}Score{/} ',
    top: '10%+1',
    left: '50%+1',
    width: '20%',
    height: '20%',
    border: {
      type: 'line',
      fg: 'white',
    },
    tags: true,
    segmentWidth: 0.06, // how wide are the segments in % so 50% = 0.5
    segmentInterval: 0.11, // spacing between the segments in % so 50% = 0.550% = 0.5
    strokeWidth: 0.11, // spacing between the segments in % so 50% = 0.5
    elements: 4, // how many elements in the display. or how many characters can be displayed.
    display: 0.0, // what should be displayed before first call to setDisplay
    elementSpacing: 4, // spacing between each element
    elementPadding: 2, // how far away from the edges to put the elements
  });

  return score;
};
