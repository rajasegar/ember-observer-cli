'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const getScoreColor = require('../../../utils/getScoreColor');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

module.exports = function (screen, category) {
  const url = `https://emberobserver.com/api/v2/addons?filter[inCategory]=${category}&include=categories`;

  const addonsList = blessed.list({
    parent: screen,
    top: '10%+1',
    left: '30%+1',
    width: '70%',
    height: '90%-3',
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
    label: 'Addons',
    keys: true,
    vi: true,
    tags: true,
  });

  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      const items = json.data.map((a) => {
        const {
          name,
          description,
          'latest-version-date': updatedAt,
          score,
        } = a.attributes;

        const categories = a.relationships.categories.data.map((c) => c.id);

        const scoreColor = getScoreColor(score);
        let str = `{${scoreColor}-fg}${score}{/} `;
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
      addonsList.setItems(items);
      screen.render();
    });

  return addonsList;
};
