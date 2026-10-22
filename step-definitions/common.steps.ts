import { Given, Then } from '@cucumber/cucumber';
import { logBusinessEvent } from '../support/logger';
import { TestWorld } from '../support/world';

Given('I am on the SauceDemo login page', async function (this: TestWorld) {
  if (!this.loginPage) throw new Error('LoginPage is not initialized. Ensure the browser setup hook has run.');
  logBusinessEvent('Opening the SauceDemo login page.');
  await this.loginPage.open();
});

Then('I should see the inventory products', async function (this: TestWorld) {
  if (!this.loginPage) throw new Error('LoginPage is not initialized. Ensure the browser setup hook has run.');
  await this.loginPage.expectSuccessfulLogin();
  logBusinessEvent('Inventory products are displayed.');
});
