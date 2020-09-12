'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const getTheme = require('../../../utils/getTheme');

module.exports = function (screen) {
  const categoriesUrl =
    'https://emberobserver.com/api/v2/categories?include=subcategories,parent';
  const theme = getTheme();

  const { border, style } = theme.navbar;

  const navbar = blessed.list({
    parent: screen,
    top: '10%+1',
    left: 0,
    width: '30%',
    height: '90%-3',
    border,
    label: 'Categories',
    keys: true,
    vi: true,
    style,
    tags: true,
  });

  fetch(categoriesUrl)
    .then((res) => res.json())
    .then((json) => {
      navbar.categories = json.data;
      const items = json.data.map((j) => {
        const { name, 'addon-count': addonCount } = j.attributes;
        return `${name} (${addonCount})`;
      });
      navbar.setItems(items);
      screen.render();
    });

  return navbar;
};
