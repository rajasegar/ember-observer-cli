const blessed = require('blessed');

const screen = blessed.screen({ fullUnicode: true });

const topAddonsList = require('./src/widgets/topAddonsList')(screen);
const navbar = require('./src/widgets/navbar')(screen);
const rsaList = require('./src/widgets/rsaList')(screen);
const newList = require('./src/widgets/newAddonsList')(screen);
const createMainWidget = require('./src/pages/addon/widgets/main');

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

screen.key(['q'], () => {
  return process.exit(0); // eslint-disable-line
});

navbar.key('tab', () => {
  topAddonsList.focus();
});

topAddonsList.key('tab', () => {
  rsaList.focus();
});
rsaList.key('tab', () => {
  newList.focus();
});
newList.key('tab', () => {
  navbar.focus();
});

topAddonsList.on('select', gotoAddonPage);
rsaList.on('select', gotoAddonPage);
newList.on('select', gotoAddonPage);

function gotoAddonPage(node) {
  const { content } = node;
  const addonNameRegex = /{bold}([a-zA-Z-@/]*){\/}/;
  let matches = content.match(addonNameRegex);
  if (matches.length > 0 && matches[1]) {
    hideAll();
    const { info, sidebar } = createMainWidget(screen, matches[1]);
    screen.append(info);
    screen.append(sidebar);
    screen.render();
  }
}

function hideAll() {
  topAddonsList.detach();
  navbar.detach();
  rsaList.detach();
  newList.detach();
  screen.render();
}

screen.append(header);
screen.append(navbar);
screen.append(topAddonsList);
screen.append(rsaList);
screen.append(newList);

navbar.focus();

screen.render();
