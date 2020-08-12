const blessed = require("blessed");

const screen = blessed.screen({ fullUnicode: true });

const header = blessed.box({
  parent: screen,
  content: "Ember Observer CLI",
  top: 0,
  left: 0,
  width: "100%",
  height: "10%",
  border: {
    type: "line",
    fg: "white",
  },
});

const listItems = ["{red-fg}Apple{/red-fg}", "Orange", "Banana", "Grapes"];

const navbar = blessed.list({
  parent: screen,
  top: "10%+1",
  left: 0,
  width: "30%",
  height: "90%",
  border: {
    type: "line",
    fg: "white",
  },
  label: "Categories",
  items: listItems,
  keys: true,
  vi: true,
  style: {
    selected: {
      fg: "black",
      bg: "white",
    },
    focus: {
      border: {
        fg: "yellow",
      },
    },
  },
  tags: true,
});

const topAddons = [
  {
    name: "ember-cli-babel",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-cli-typescript",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-resolver",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-concurrency",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "qunit-dom",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-data",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-fetch",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-cli-mirage",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-basic-dropdown",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
  {
    name: "ember-composable-helpers",
    description: "Ember CLI addon for Babel",
    category: "Build Tools",
    lastUpdated: "11 days ago",
  },
];
const topAddonsList = topAddons.map((a, index) => {
  let str = "{red-fg}#" + (index + 1) + "{/red-fg} ";
  str += "{yellow-fg}{bold}" + a.name + "{/} ";
  str += a.description + "\r\n";
  str += a.category + " " + "Last Updated " + a.lastUpdated;
  return str;
});
const content = blessed.list({
  parent: screen,
  top: "10%+1",
  left: "30%+1",
  width: "70%",
  height: "90%",
  border: {
    type: "line",
    fg: "white",
  },
  style: {
    selected: {
      fg: "black",
      bg: "white",
    },
    focus: {
      border: {
        fg: "yellow",
      },
    },
  },
  label: "Top Addons",
  items: topAddonsList,
  keys: true,
  vi: true,
  tags: true,
});

screen.key(["q"], () => {
  return process.exit(0);
});

navbar.key("tab", () => {
  content.focus();
});

content.key("tab", () => {
  navbar.focus();
});

screen.append(header);
screen.append(navbar);
screen.append(content);

navbar.focus();

screen.render();
