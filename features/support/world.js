const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async openBrowser() {
    this.browser = await puppeteer.launch({
      headless: process.env.HEADLESS === 'true' ? true : false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    this.page = await this.browser.newPage();
  }

  async closeBrowser() {
    if (this.page) {
      await this.page.close();
    }

    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
