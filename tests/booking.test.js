const puppeteer = require('puppeteer');

describe('Бронирование билетов (Puppeteer)', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1280, height: 720 },
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }, 30000);

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://qamid.tmweb.ru', { waitUntil: 'networkidle0' });
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('happy path: бронирование 1 места', async () => {
    // Given
    await page.click('a.page-nav__day:nth-child(4)');
    const seances = await page.$$('.movie-seances__time');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      seances[0].click(),
    ]);

    // When
    await page.waitForSelector('.acceptin-button');
    await page.click('.buying-scheme__wrapper .buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.acceptin-button'),
    ]);

    // Then
    await page.waitForSelector('.ticket__check-title');
    const title = await page.$eval('.ticket__check-title', (el) => el.textContent.trim());
    expect(title).toContain('Вы выбрали билеты');
  });

  test('happy path: бронирование 2 мест', async () => {
    // Given
    await page.click('a.page-nav__day:nth-child(4)');
    const seances = await page.$$('.movie-seances__time');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      seances[0].click(),
    ]);

    // When
    await page.waitForSelector('.acceptin-button');
    const seats = await page.$$('.buying-scheme__wrapper .buying-scheme__chair_standart:not(.buying-scheme__chair_taken), .buying-scheme__wrapper .buying-scheme__chair_vip:not(.buying-scheme__chair_taken)');
    await seats[0].click();
    await seats[1].click();
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('.acceptin-button'),
    ]);

    // Then
    await page.waitForSelector('.ticket__chairs');
    const chairsText = await page.$eval('.ticket__chairs', (el) => el.textContent.trim());
    const seatsCount = chairsText.split(',').length;
    expect(seatsCount).toBe(2);
  });

  test('sad path: нельзя забронировать без выбора места', async () => {
    // Given
    await page.click('a.page-nav__day:nth-child(4)');
    const seances = await page.$$('.movie-seances__time');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      seances[0].click(),
    ]);

    // Then
    await page.waitForSelector('.acceptin-button');
    const isDisabled = await page.$eval('.acceptin-button', (button) => button.disabled);
    expect(isDisabled).toBe(true);
  });
});
