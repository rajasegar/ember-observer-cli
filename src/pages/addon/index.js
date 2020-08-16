'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const Terminal = require('../../widgets/terminal');
const getScoreColor = require('../../utils/getScoreColor');
const os = require('os');
const { exec } = require('child_process');

module.exports = function (screen, addon) {
  let demoUrl = '';
  let repoUrl = '';
  let npmUrl = `https://npmjs.com/package/${addon}`;
  dayjs.extend(relativeTime);
  const addonUrl = `https://emberobserver.com/api/v2/addons?filter[name]=${addon}&include=versions,maintainers,keywords,latest-review,latest-review.version,latest-addon-version,categories&page[limit]=1`;

  let openCommand = 'open';
  if (os.platform() === 'win32') openCommand = 'start';
  if (os.platform() === 'linux') openCommand = 'xdg-open';
  const info = blessed.box({
    parent: screen,
    top: '10%+1',
    left: '0',
    width: '70%',
    height: '90%-3',
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
    height: '90%-3',
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

  const auto = true;
  var bar = blessed.listbar({
    parent: screen,
    bottom: 0,
    left: 0,
    right: 0,
    height: auto ? 'shrink' : 3,
    mouse: true,
    keys: true,
    border: 'line',
    vi: true,
    style: {
      bg: 'green',
      item: {
        bg: 'red',
        hover: {
          bg: 'blue',
        },
        //focus: {
        //  bg: 'blue'
        //}
      },
      selected: {
        bg: 'blue',
      },
    },
    commands: {
      install: {
        keys: ['i'],
        callback: function () {
          const command = `ember install ${addon}`;
          const terminal = Terminal({
            parent: screen,
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            border: {
              type: 'line',
              fg: 'white',
            },
            label: command,
            fullUnicode: true,
            screenKeys: false,
          });
          screen.append(terminal);
          screen.render();
          terminal.focus();

          terminal.key('Esc', () => {
            terminal.detach();
            screen.render();
          });
          terminal.pty.write(`${command}\r\n`);
          //terminal.pty.write(`ls\r\n`);
        },
      },
      github: {
        keys: ['g'],
        callback: function () {
          if (repoUrl) {
            exec(`${openCommand} ${repoUrl}`, () => {});
            screen.render();
          }
        },
      },
      npm: {
        keys: ['n'],
        callback: function () {
          if (npmUrl) {
            exec(`${openCommand} ${npmUrl}`, () => {});
            screen.render();
          }
        },
      },
      demo: {
        keys: ['d'],
        callback: function () {
          if (demoUrl) {
            exec(`${openCommand} ${demoUrl}`, () => {});
            screen.render();
          }
        },
      },
      home: {
        keys: ['h'],
        callback: function () {
          screen.render();
        },
      },
      quit: {
        keys: ['q'],
        callback: function () {
          screen.render();
        },
      },
    },
  });

  function displayScore(score) {
    const scoreColor = getScoreColor(score);

    return `{${scoreColor}-fg}{bold}Score ${score || '?'}{/}\n\n`;
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
        content += `Open Issues: {blue-fg}${issues}{/}\n\n`;
        content += `Forks: {blue-fg}${forks}{/}\n\n`;
        content += `Starred: {blue-fg}${stars}{/}\n\n`;
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
        'last-month-downloads': downloads,
        'latest-version-date': latestVersion,
      } = attributes;

      demoUrl = attributes['demo-url'];
      repoUrl = attributes['repository-url'];

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

      content += '{bold}Review{/}\n';
      content += 'Manually reviewed on <date> for version <version>\n';
      content += 'Are there meaningful tests? {bold}Yes{/}\n';
      content += 'Is the REAMDE filled out? {bold}Yes{/}\n';
      content += 'Does the addon have a build? {bold}Yes{/}\n';
      content += '{bold}Dependencies{/}\n';
      content +=
        'Version <version> of this addon depends on the following addons:\n';

      content += '{bold}Dev Dependencies{/}\n';
      content += '{bold}Dependencies{/}\n';

      let sidebarContent = `{yellow-fg}{bold}Press "i" to install this addon{/}\n\n`;

      sidebarContent += `latest version from ${dayjs(
        latestVersion
      ).fromNow()} \n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{bold}${downloads}{/} downloads in last month\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}demo{/}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}repo{/}\n`;
      sidebarContent += `${repo}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}package{/}\n`;
      sidebarContent += `${npmUrl}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += `{yellow-fg}license{/}\n`;
      sidebarContent += `${license}\n`;
      sidebarContent += `-----------------------\n`;
      sidebarContent += '{bold}npm keywords{/}\n';
      const keywords = json.included.filter((r) => r.type === 'keywords');
      sidebarContent += keywords.map((k) => k.attributes.keyword).join(',');

      sidebarContent += `\n-----------------------\n`;
      const versions = json.included.filter((r) => r.type === 'versions');
      sidebarContent += `{bold}Versions (${versions.length}){/}\n`;
      sidebarContent += versions
        .map((v) => {
          const { version, released } = v.attributes;
          return `${dayjs(released).format('YYYY-MMM-DD')} {bold}${version}{/}`;
        })
        .join('\n');

      sidebar.setContent(sidebarContent);
      screen.render();
    })
    .catch((err) => console.log(err));

  function show() {
    screen.append(info);
    screen.append(sidebar);
    screen.append(bar);
    bar.focus();
    screen.render();
  }

  function hide() {
    screen.detach(info);
    screen.detach(sidebar);
    screen.detach(bar);
    screen.render();
  }
  return { show, hide };
};
