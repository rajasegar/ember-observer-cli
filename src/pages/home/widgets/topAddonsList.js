'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

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
        const {
          name,
          description,
          'latest-version-date': updatedAt,
        } = a.attributes;

        const categories = a.relationships.categories.data.map((c) => c.id);

        let str = '{magenta-fg}#' + (index + 1) + '{/} ';
        str += '{yellow-fg}{bold}' + name + '{/} ';
        str += description;
        const category = json.included
          .filter((c) => categories.includes(c.id))
          .map((c) => c.attributes.name)
          .join(',');
        str += ` {cyan-fg}{bold}${category}{/} `;
        str += 'Last Updated ' + dayjs(updatedAt).fromNow();
        return str;
      });
      topAddonsList.setItems(items);
      screen.render();
    });

  return topAddonsList;
};
