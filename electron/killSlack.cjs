// electron/killSlack.cjs
const { exec } = require('child_process');
const os = require('os');

function killSlack() {
  const platform = os.platform();

  switch (platform) {
    case 'darwin':          // macOS
      return 'osascript -e \'quit app "Slack"\'';

    case 'win32':           // Windows
      return 'taskkill /IM slack.exe /F';

    default:                // Linux & everything else
      // -i  ignore case, -f  match full cmdline
      return 'pkill -i -f slack || true';
  }
}

module.exports = killSlack;
