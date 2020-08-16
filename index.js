const blessed = require('blessed');

const screen = blessed.screen({ fullUnicode: true });

const inithomePage = require('./src/pages/home');
const initSearchPage = require('./src/pages/search');

const header = blessed.box({
  parent: screen,
  content: 'Ember Observer CLI',
  top: 0,
  left: 0,
  width: '30%',
  height: '10%',
  border: {
    type: 'line',
    fg: 'white',
  },
});

const searchBox = blessed.form({
  parent: screen,
  top: 0,
  left: '30%+1',
  width: '70%',
  height: '10%',
  border: {
    type: 'line',
    fg: 'white',
  },
  content: 'Search addons',
  keys: true,
});
const text = blessed.textbox({
  parent: searchBox,
  mouse: true,
  keys: true,
  fg: 'white',
  border: {
    type: 'line',
    fg: 'white',
  },
  height: 3,
  width: 80,
  left: 1,
  top: 1,
  name: 'text',
  inputOnFocus: true,
});

const homePage = inithomePage(screen);

text.key('tab', () => {
  homePage.navbar.focus();
});

text.on('submit', (data) => {
  if (data) {
    // search addon
    const searchPage = initSearchPage(screen, data);

    homePage.hide();
    screen.append(searchPage);
    text.clearValue();
    screen.render();
    searchPage.focus();
  }
});

screen.key(['q'], () => {
  return process.exit(0); // eslint-disable-line
});

screen.key(['/'], () => {
  text.focus();
});

screen.append(header);
screen.append(searchBox);
homePage.show();

module.exports = screen;
