'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const getScoreColor = require('../../../utils/getScoreColor');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const getTheme = require('../../../utils/getTheme');

dayjs.extend(relativeTime);
module.exports = function (screen) {
  const rsaUrl =
    'https://emberobserver.com/api/v2/addons?filter[recentlyReviewed]=true&include=categories&page[limit]=10';

  const theme = getTheme();
  const { style, border } = theme.rsaList;
  // Recently Scored Addons List
  const rsaList = blessed.list({
    parent: screen,
    top: '40%+1',
    left: '30%+1',
    width: '70%',
    height: '30%',
    border,
    style,
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

        const categories = a.relationships.categories.data.map((c) => c.id);

        const scoreColor = getScoreColor(score);
        let str = `{${scoreColor}-fg}${score}{/} `;
        str += `{${theme.colors.normal.yellow}-fg}{bold}` + name + '{/} ';
        str += description;
        const category = json.included
          .filter((c) => categories.includes(c.id))
          .map((c) => c.attributes.name)
          .join(',');
        str += ` {${theme.colors.normal.cyan}-fg}{bold}${category}{/} `;
        str += 'Last Updated ' + dayjs(updatedAt).fromNow();
        return str;
      });
      rsaList.setItems(items);
      screen.render();
    });

  return rsaList;
};
