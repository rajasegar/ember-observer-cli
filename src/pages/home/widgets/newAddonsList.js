'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs');
const getTheme = require('../../../utils/getTheme');

dayjs.extend(relativeTime);

module.exports = function (screen) {
  const newAddonsUrl =
    'https://emberobserver.com/api/v2/addons?include=categories&page[limit]=10&sort=-publishedDate';

  const theme = getTheme();
  const { style, border } = theme.newAddonsList;
  // New  Addons List
  const newList = blessed.list({
    parent: screen,
    top: '70%+1',
    left: '30%+1',
    width: '70%',
    height: '30%-3',
    border,
    style,
    label: 'New Addons',
    keys: true,
    vi: true,
    tags: true,
  });

  fetch(newAddonsUrl)
    .then((res) => res.json())
    .then((json) => {
      const items = json.data.map((a) => {
        const {
          name,
          description,
          'latest-version-date': updatedAt,
        } = a.attributes;

        let str = `{${theme.colors.normal.red}-fg}[?]{/} `;
        str += `{${theme.colors.normal.yellow}-fg}{bold}` + name + '{/} ';
        str += description;
        str +=
          ` {${theme.colors.normal.cyan}-fg}{bold}Last Updated ` +
          dayjs(updatedAt).fromNow() +
          '{/}';
        return str;
      });
      newList.setItems(items);
      screen.render();
    });
  return newList;
};
