'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');

module.exports = function (screen) {
  const topAddonsUrl =
    'https://emberobserver.com/api/v2/addons?filter[top]=true&include=categories&page[limit]=10&sort=ranking';

  const topAddonsList = blessed.list({
    parent: screen,
    top: '10%+1',
    left: '30%+1',
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
    label: 'Top Addons',
    keys: true,
    vi: true,
    tags: true,
  });

  fetch(topAddonsUrl)
    .then((res) => res.json())
    .then((json) => {
      const items = json.data.map((a, index) => {
        const { name, description, 'updated-at': updatedAt } = a.attributes;
        let str = '{red-fg}#' + (index + 1) + '{/red-fg} ';
        str += '{yellow-fg}{bold}' + name + '{/} ';
        str += description;
        str += 'unknown' + ' ' + 'Last Updated ' + updatedAt;
        return str;
      });
      topAddonsList.setItems(items);
      screen.render();
    });

  return topAddonsList;
};
