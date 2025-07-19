// electron/killSlack.cjs
const { exec } = require('child_process');
const os = require('os');

function killSlack() {
  const platform = os.platform();
  switch (platform) {
    case 'darwin': return 'osascript -e \'quit app "Slack"\'';
    case 'win32': return 'taskkill /IM slack.exe /F';
    default: return 'pkill -i -f slack || true';
  }
}

module.exports = killSlack;
