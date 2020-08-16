'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs');

dayjs.extend(relativeTime);

module.exports = function (screen) {
  const newAddonsUrl =
    'https://emberobserver.com/api/v2/addons?include=categories&page[limit]=10&sort=-publishedDate';

  // New  Addons List
  const newList = blessed.list({
    parent: screen,
    top: '70%+1',
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

        let str = '{red-fg}[?]{/red-fg} ';
        str += '{yellow-fg}{bold}' + name + '{/} ';
        str += description;
        str +=
          ' {cyan-fg}{bold}Last Updated ' + dayjs(updatedAt).fromNow() + '{/}';
        return str;
      });
      newList.setItems(items);
      screen.render();
    });
  return newList;
};
