'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const getScoreColor = require('../../../utils/getScoreColor');

module.exports = function (screen) {
  const rsaUrl =
    'https://emberobserver.com/api/v2/addons?filter[recentlyReviewed]=true&include=categories&page[limit]=10';

  // Recently Scored Addons List
  const rsaList = blessed.list({
    parent: screen,
    top: '40%+1',
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
    label: 'Recently Scored Addons',
    keys: true,
    vi: true,
    tags: true,
  });

  fetch(rsaUrl)
    .then((res) => res.json())
    .then((json) => {
      const items = json.data.map((a) => {
        const {
          name,
          description,
          score,
          'updated-at': updatedAt,
        } = a.attributes;
        const scoreColor = getScoreColor(score);
        let str = `{${scoreColor}-fg}${score}{/} `;
        str += '{yellow-fg}{bold}' + name + '{/} ';
        str += description;
        str += 'unknown' + ' ' + 'Last Updated ' + updatedAt;
        return str;
      });
      rsaList.setItems(items);
      screen.render();
    });

  return rsaList;
};
