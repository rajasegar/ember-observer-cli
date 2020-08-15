'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');

module.exports = function (screen) {
  const categoriesUrl =
    'https://emberobserver.com/api/v2/categories?include=subcategories,parent';

  const navbar = blessed.list({
    parent: screen,
    top: '10%+1',
    left: 0,
    width: '30%',
    height: '90%',
    border: {
      type: 'line',
      fg: 'white',
    },
    label: 'Categories',
    keys: true,
    vi: true,
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
    tags: true,
  });

  fetch(categoriesUrl)
    .then((res) => res.json())
    .then((json) => {
      const items = json.data.map((j) => {
        const { name, 'addon-count': addonCount } = j.attributes;
        return `${name} (${addonCount})`;
      });
      navbar.setItems(items);
      screen.render();
    });

  return navbar;
};
