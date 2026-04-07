const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

Before(async function () {
  await this.openBrowser();
});

After(async function () {
  await this.closeBrowser();
});
