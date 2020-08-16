'use strict';
const initAddonPage = require('../pages/addon/');
module.exports = function (node, screen) {
  const { content } = node;
  const addonNameRegex = /{bold}([a-zA-Z-@/]*){\/}/;
  let matches = content.match(addonNameRegex);
  if (matches.length > 0 && matches[1]) {
    const addonPage = initAddonPage(screen, matches[1]);
    addonPage.show();
  }
};
