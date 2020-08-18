'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
//const dayjs = require('dayjs');
//const relativeTime = require('dayjs/plugin/relativeTime');
const getScoreColor = require('../../utils/getScoreColor');
const gotoAddonPage = require('../../utils/gotoAddonPage');

module.exports = function (screen, query) {
  const searchUrl = `https://emberobserver.com/api/v2/autocomplete_data?query=${query}`;

  const searchResults = blessed.list({
    parent: screen,
    top: '10%+1',
    left: '0',
    width: '100%',
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
    label: 'Search Results',
    keys: true,
    vi: true,
    tags: true,
  });

  fetch(searchUrl)
    .then((res) => res.json())
    .then((json) => {
      const items = json.addons
        .filter((a) => a.name.includes(query))
        .map((a) => {
          const { name, description, score } = a;
          const scoreColor = getScoreColor(score);
          let str = '';
          if (score) {
            str += `{${scoreColor}-fg}${score}{/} `;
          } else {
            str += '[?] ';
          }
          str += '{yellow-fg}{bold}' + name + '{/} ';
          str += description;
          return str;
        });
      searchResults.setItems(items);
      searchResults.setLabel(`Search Results (${items.length})`);

      searchResults.on('select', (node) => {
        searchResults.detach();
        gotoAddonPage(node, screen);
        screen.render();
      });
      screen.render();
    });

  return searchResults;
};
