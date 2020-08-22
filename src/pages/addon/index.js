'use strict';

const blessed = require('blessed');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
const Terminal = require('../../widgets/terminal');
const getScoreColor = require('../../utils/getScoreColor');
const os = require('os');
const { exec } = require('child_process');

const _info = require('./widgets/info');
const _githubWidget = require('./widgets/github');
const _scoreWidget = require('./widgets/score');
const _depsWidget = require('./widgets/deps');
const _devdepsWidget = require('./widgets/devdeps');
const _sidebar = require('./widgets/sidebar');
const _readme = require('./widgets/readme');

module.exports = function (screen, addon) {
  let demoUrl = '';
  let repoUrl = '';
  let npmUrl = `https://npmjs.com/package/${addon}`;
  dayjs.extend(relativeTime);
  const addonUrl = `https://emberobserver.com/api/v2/addons?filter[name]=${addon}&include=versions,maintainers,keywords,latest-review,latest-review.version,latest-addon-version,categories&page[limit]=1`;

  let openCommand = 'open';
  if (os.platform() === 'win32') openCommand = 'start';
  if (os.platform() === 'linux') openCommand = 'xdg-open';

  // Initialize widgets
  const info = _info(screen, addon);
  const githubWidget = _githubWidget(screen);
  const scoreWidget = _scoreWidget(screen);
  const depsWidget = _depsWidget(screen);
  const devdepsWidget = _devdepsWidget(screen);
  const sidebar = _sidebar(screen);
  const readme = _readme(screen);

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
      selected: {
        bg: 'yellow',
        fg: 'black',
      },
      item: {
        fg: 'black',
        bg: 'white',
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

          terminal.key('escape', function () {
            terminal.detach();
          });

          terminal.pty.write(`${command}\r\n`);
        },
      },
      repo: {
        keys: ['r'],
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
      search: {
        keys: ['/'],
        callback: function () {},
      },
      quit: {
        keys: ['q'],
        callback: function () {
          return screen.destroy();
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
        content += `Open Issues: {blue-fg}${issues}{/}\n`;
        content += `Forks: {blue-fg}${forks}{/}\n`;
        content += `Starred: {blue-fg}${stars}{/}\n`;
        content += `Contributors: \n`;
        content += `latest commit: {yellow-fg}${dayjs(
          latestCommit
        ).fromNow()}{/}\n`;
        content += `first commit: {yellow-fg}${dayjs(
          firstCommit
        ).fromNow()}{/}\n`;

        return content;
      });
  }

  function fetchReadme(id) {
    const url = `https://emberobserver.com/api/v2/addons/${id}/readme`;
    return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const { attributes } = json.data;
        return attributes.contents;
      });
  }

  function fetchDeps(id) {
    // Show addon dependencies
    const url = `https://emberobserver.com/api/v2/addon-dependencies?filter[addonVersionId]=${id}&sort=package`;

    return fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const deps = json.data
          .filter((d) => d.attributes['dependency-type'] === 'dependencies')
          .map((d) => {
            return d.attributes.package;
          });

        const devdeps = json.data
          .filter((d) => d.attributes['dependency-type'] === 'devDependencies')
          .map((d) => {
            return d.attributes.package;
          });

        return {
          deps: {
            content: deps.join('\n'),
            length: deps.length,
          },
          devdeps: {
            content: devdeps.join('\n'),
            length: devdeps.length,
          },
        };
      });
  }

  fetch(addonUrl)
    .then((res) => res.json())
    .then((json) => {
      const { attributes, id } = json.data[0];
      const {
        description,
        ranking,
        score,
        license,
        'repository-url': repo,
        'last-month-downloads': downloads,
        'latest-version-date': latestVersion,
        'latest-addon-version-id': addonVersion,
      } = attributes;

      demoUrl = attributes['demo-url'];
      repoUrl = attributes['repository-url'];

      let content = ``;
      content += `${description}\n\n`;
      if (ranking) {
        content += `Ranks #${ranking} of the addons\n\n`;
      }
      content += displayScore(score);
      scoreWidget.setDisplay(score);

      scoreWidget.setOptions({
        color: getScoreColor(score),
      });
      content += `{yellow-fg}Categories {/}: `;

      const categories = json.included.filter((d) => d.type === 'categories');

      content += categories.map((c) => c.attributes.name).join(',');

      fetchGithubStats(id).then((ghstats) => {
        githubWidget.setContent(ghstats);
        screen.render();
      });

      fetchReadme(id).then((content) => {
        readme.setMarkdown(content);
        screen.render();
      });

      fetchDeps(addonVersion).then((data) => {
        const { deps, devdeps } = data;
        depsWidget.setContent(deps.content);
        depsWidget.setLabel(` Dependencies (${deps.length}) `);
        devdepsWidget.setContent(devdeps.content);
        devdepsWidget.setLabel(` Dev Dependencies (${devdeps.length}) `);
        screen.render();
      });

      content += '\n{yellow-fg}Review{/}\n';
      content += 'Manually reviewed on <date> for version <version>\n';
      content += 'Are there meaningful tests? {bold}Yes{/}\n';
      content += 'Is the REAMDE filled out? {bold}Yes{/}\n';
      content += 'Does the addon have a build? {bold}Yes{/}\n';

      info.setContent(content);
      screen.render();

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
      sidebarContent += '{yellow-fg}npm keywords{/}\n';
      const keywords = json.included.filter((r) => r.type === 'keywords');
      sidebarContent += keywords.map((k) => k.attributes.keyword).join(',');

      sidebarContent += `\n-----------------------\n`;

      // Maintainers
      const maintainers = json.included.filter((r) => r.type === 'maintainers');
      sidebarContent += `{yellow-fg}Maintainers (${maintainers.length}){/}\n`;
      sidebarContent += maintainers
        .map((v) => {
          return v.attributes.name;
        })
        .join('\n');

      sidebarContent += `\n-----------------------\n`;
      const versions = json.included.filter((r) => r.type === 'versions');
      sidebarContent += `{yellow-fg}Versions (${versions.length}){/}\n`;
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

  readme.key('tab', () => sidebar.focus());
  sidebar.key('tab', () => readme.focus());

  function show() {
    screen.append(info);
    screen.append(sidebar);
    screen.append(bar);
    screen.append(depsWidget);
    screen.append(devdepsWidget);
    screen.append(githubWidget);
    screen.append(scoreWidget);
    screen.append(readme);
    readme.focus();
    screen.render();
  }

  function hide() {
    screen.detach(info);
    screen.detach(sidebar);
    screen.detach(bar);
    screen.detach(depsWidget);
    screen.detach(devdepsWidget);
    screen.detach(githubWidget);
    screen.detach(scoreWidget);
    screen.detach(readme);
    screen.render();
  }
  return { show, hide };
};
