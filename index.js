const blessed = require('blessed');
const fetch = require('node-fetch');

const screen = blessed.screen({ fullUnicode: true });

const header = blessed.box({
  parent: screen,
  content: 'Ember Observer CLI',
  top: 0,
  left: 0,
  width: '100%',
  height: '10%',
  border: {
    type: 'line',
    fg: 'white',
  },
});

const categoriesUrl =
  'https://emberobserver.com/api/v2/categories?include=subcategories,parent';

const topAddonsUrl =
  'https://emberobserver.com/api/v2/addons?filter[top]=true&include=categories&page[limit]=10&sort=ranking';

const rsaUrl =
  'https://emberobserver.com/api/v2/addons?filter[recentlyReviewed]=true&include=categories&page[limit]=10';

const newAddonsUrl =
  'https://emberobserver.com/api/v2/addons?include=categories&page[limit]=10&sort=-publishedDate';

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
    const items = json.data.map((a, index) => {
      const { name, description, 'updated-at': updatedAt } = a.attributes;
      let str = '{red-fg}#' + (index + 1) + '{/red-fg} ';
      str += '{yellow-fg}{bold}' + name + '{/} ';
      str += description;
      str += 'unknown' + ' ' + 'Last Updated ' + updatedAt;
      return str;
    });
    rsaList.setItems(items);
    screen.render();
  });

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
  label: 'Recently Scored Addons',
  keys: true,
  vi: true,
  tags: true,
});

fetch(newAddonsUrl)
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
    newList.setItems(items);
    screen.render();
  });

screen.key(['q'], () => {
  return process.exit(0); // eslint-disable-line
});

navbar.key('tab', () => {
  topAddonsList.focus();
});

topAddonsList.key('tab', () => {
  navbar.focus();
});

screen.append(header);
screen.append(navbar);
screen.append(topAddonsList);
screen.append(rsaList);
screen.append(newList);

navbar.focus();

screen.render();
