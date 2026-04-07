const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('пользователь открывает сайт кинотеатра', async function () {
  await this.page.goto('https://qamid.tmweb.ru', { waitUntil: 'networkidle0' });
});

Given('пользователь открывает день {int}', async function (dayNumber) {
  await this.page.click(`a.page-nav__day:nth-child(${dayNumber})`);
});

Given('пользователь открывает первый сеанс', async function () {
  const seances = await this.page.$$('.movie-seances__time');

  await Promise.all([
    this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
    seances[0].click(),
  ]);

  await this.page.waitForSelector('.acceptin-button');
});

When('пользователь выбирает {int} место', async function (seatsCount) {
  const seats = await this.page.$$('.buying-scheme__wrapper .buying-scheme__chair_standart:not(.buying-scheme__chair_taken), .buying-scheme__wrapper .buying-scheme__chair_vip:not(.buying-scheme__chair_taken)');

  for (let i = 0; i < seatsCount; i += 1) {
    await seats[i].click();
  }
});

When('пользователь выбирает {int} места', async function (seatsCount) {
  const seats = await this.page.$$('.buying-scheme__wrapper .buying-scheme__chair_standart:not(.buying-scheme__chair_taken), .buying-scheme__wrapper .buying-scheme__chair_vip:not(.buying-scheme__chair_taken)');

  for (let i = 0; i < seatsCount; i += 1) {
    await seats[i].click();
  }
});

When('пользователь нажимает кнопку бронирования', async function () {
  await Promise.all([
    this.page.waitForNavigation({ waitUntil: 'networkidle0' }),
    this.page.click('.acceptin-button'),
  ]);
});

Then('открывается страница бронирования', async function () {
  await this.page.waitForSelector('.ticket__check-title');
  const title = await this.page.$eval('.ticket__check-title', (el) => el.textContent.trim());
  assert.ok(title.includes('Вы выбрали билеты'));
});

Then('количество выбранных мест должно быть {int}', async function (expectedCount) {
  await this.page.waitForSelector('.ticket__chairs');
  const chairsText = await this.page.$eval('.ticket__chairs', (el) => el.textContent.trim());
  const realCount = chairsText.split(',').length;

  assert.strictEqual(realCount, expectedCount);
});

Then('кнопка бронирования должна быть неактивна', async function () {
  const isDisabled = await this.page.$eval('.acceptin-button', (button) => button.disabled);
  assert.strictEqual(isDisabled, true);
});
