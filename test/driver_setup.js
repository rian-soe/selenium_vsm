const { Builder, Capabilities } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');

async function setupDriver(browserName, chromePath = '', firefoxPath = '') {
  let builder = new Builder().forBrowser(browserName);

  if (browserName === 'chrome') {
    if (chromePath) {
      const service = new chrome.ServiceBuilder(chromePath);
      builder.setChromeService(service);
    }
    builder.setChromeOptions(new chrome.Options());
  } else if (browserName === 'firefox') {
    if (firefoxPath) {
      const service = new firefox.ServiceBuilder(firefoxPath);
      builder.setFirefoxService(service);
    }
    builder.setFirefoxOptions(new firefox.Options());
  } else {
    throw new Error(`Unsupported browser: ${browserName}`);
  }

  return await builder.build();
}

module.exports = setupDriver;