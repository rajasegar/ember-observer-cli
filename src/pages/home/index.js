'use strict';

module.exports = function (screen) {
  const topAddonsList = require('./widgets/topAddonsList')(screen);
  const navbar = require('./widgets/navbar')(screen);
  const rsaList = require('./widgets/rsaList')(screen);
  const newList = require('./widgets/newAddonsList')(screen);
  const footer = require('./widgets/footer')(screen);
  const createCategoryWidget = require('./widgets/addonsByCategory');
  const initAddonPage = require('../../pages/addon/');

  let addonsByCategory = null;
  navbar.key('tab', () => {
    if (addonsByCategory) {
      addonsByCategory.focus();
      screen.render();
    } else {
      topAddonsList.focus();
    }
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

  navbar.on('select', (node) => {
    const { content } = node;
    const name = content.slice(0, content.indexOf('(') - 1);
    const category = navbar.categories.find((c) => {
      return c.attributes.name === name;
    });
    addonsByCategory = createCategoryWidget(screen, category.id, name);

    topAddonsList.detach();
    rsaList.detach();
    newList.detach();
    screen.append(addonsByCategory);
    screen.render();
    addonsByCategory.focus();

    addonsByCategory.key('tab', () => {
      navbar.focus();
    });

    addonsByCategory.on('select', gotoAddonPage);
  });

  function gotoAddonPage(node) {
    const { content } = node;
    const addonNameRegex = /{bold}([a-zA-Z-@/]*){\/}/;
    let matches = content.match(addonNameRegex);
    if (matches.length > 0 && matches[1]) {
      hide();
      const addonPage = initAddonPage(screen, matches[1]);
      addonPage.show();
    }
  }

  function hide() {
    topAddonsList.detach();
    navbar.detach();
    rsaList.detach();
    newList.detach();
    footer.detach();
    if (addonsByCategory) {
      addonsByCategory.detach();
    }
    screen.render();
  }

  function show() {
    screen.append(navbar);
    screen.append(topAddonsList);
    screen.append(rsaList);
    screen.append(newList);
    screen.append(footer);
    navbar.focus();
  }

  return { hide, show, navbar };
};
