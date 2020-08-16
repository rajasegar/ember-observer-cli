'use strict';

module.exports = function (screen) {
  const topAddonsList = require('./widgets/topAddonsList')(screen);
  const navbar = require('./widgets/navbar')(screen);
  const rsaList = require('./widgets/rsaList')(screen);
  const newList = require('./widgets/newAddonsList')(screen);
  const initAddonPage = require('../../pages/addon/');

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
    screen.render();
  }

  function show() {
    screen.append(navbar);
    screen.append(topAddonsList);
    screen.append(rsaList);
    screen.append(newList);
    navbar.focus();
  }

  return { hide, show, navbar };
};
