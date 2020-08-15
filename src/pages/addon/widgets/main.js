'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

module.exports = function (screen, addon) {
  const addonUrl = `https://emberobserver.com/api/v2/addons?filter[name]=${addon}&include=versions,maintainers,keywords,latest-review,latest-review.version,latest-addon-version,categories&page[limit]=1`;

  const info = blessed.box({
    parent: screen,
    top: '10%+1',
    left: '0',
    width: '70%',
    height: '90%',
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
    keys: true,
    tags: true,
  });

  const sidebar = blessed.box({
    parent: screen,
    top: '10%+1',
    left: '70%+1',
    width: '30%',
    height: '90%',
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
    keys: true,
    tags: true,
  });

  function displayScore(score) {
    // Color values taken from here
    // https://github.com/emberobserver/client/blob/0764b6b055a1efe314862bae1ae957f6a6281a01/app/styles/_scores.scss
    const scoreColors = {
      '0': '#999',
      '1': '#ff7e63',
      '2': '#ff7e63',
      '3': '#fbab61',
      '4': '#fbab61',
      '5': '#EDE217',
      '6': '#EDE217',
      '7': '#7ECF27',
      '8': '#7ECF27',
      '9': '#28b36d',
      '10': '#28b36d',
    };

    const _score = Math.round(Number(score));

    return `{${scoreColors[_score]}-fg}{bold}Score ${score || '?'}{/}\n\n`;
  }

  function fetchGithubStats(id) {
    const url = `https://emberobserver.com/api/v2/addons/${id}/github-stats`;
    return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const { attributes } = json.data;
        const {
          forks,
          stars,
          'open-issues': issues,
          'first-commit-date': firstCommit,
          'latest-commit-date': latestCommit,
        } = attributes;
        let content = '';
        content += `{bold}Github {/}\n\n`;
        content += `Open Issues: ${issues}\n\n`;
        content += `Forks: ${forks}\n\n`;
        content += `Starred: ${stars}\n\n`;
        content += `Contributors: \n\n`;
        content += `latest commit: ${dayjs(latestCommit).fromNow()}\n\n`;
        content += `first commit: ${dayjs(firstCommit).fromNow()}\n\n`;
        return content;
      });
  }

  fetch(addonUrl)
    .then((res) => res.json())
    .then((json) => {
      const { attributes, id } = json.data[0];
      const {
        name,
        description,
        ranking,
        score,
        license,
        'repository-url': repo,
      } = attributes;
      let content = `{bold}${name}{/}\n\n`;
      content += `${description}\n\n`;
      if (ranking) {
        content += `Ranks #${ranking} of the addons\n\n`;
      }
      content += displayScore(score);
      content += `{bold}Categories {/}\n\n`;

      fetchGithubStats(id).then((ghstats) => {
        content += ghstats;
        info.setContent(content);
        screen.render();
      });

      let sidebarContent = `{bold}ember install ${addon}{/}\n\n`;

      sidebarContent += `version from x days ago\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `downloads in last month\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}demo{/}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}repo{/}\n`;
      sidebarContent += `${repo}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}package{/}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}license{/}\n`;
      sidebarContent += `${license}\n`;
      sidebarContent += `-----------------------\n`;

      sidebar.setContent(sidebarContent);
      screen.render();
    })
    .catch((err) => console.log(err));

  return { info, sidebar };
};
