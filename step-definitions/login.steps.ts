import { Given, Then, When } from '@cucumber/cucumber';
import { testConfig } from '../config/test-config';
import { logBusinessEvent } from '../support/logger';
import { TestWorld } from '../support/world';

Given('I am on the SauceDemo login page', async function (this: TestWorld) {
  logBusinessEvent('Opening the SauceDemo login page.');
  await this.loginPage!.open();
});

When('I log in with valid credentials', async function (this: TestWorld) {
  logBusinessEvent('Starting login with configured credentials.');
  await this.loginPage!.login(testConfig.username, testConfig.password);
  await this.startDiagnosticsTracing();
});

When('I log in with an invalid password', async function (this: TestWorld) {
  logBusinessEvent('Submitting login with an invalid password.');
  await this.loginPage!.login(testConfig.username, testConfig.invalidPassword);
  await this.startDiagnosticsTracing();
});

When('I log in with an invalid username', async function (this: TestWorld) {
  logBusinessEvent('Submitting login with an invalid username.');
  await this.loginPage!.login(testConfig.invalidUsername, testConfig.password);
  await this.startDiagnosticsTracing();
});

When('I submit empty login credentials', async function (this: TestWorld) {
  logBusinessEvent('Submitting the login form with empty credentials.');
  await this.loginPage!.login('', '');
  await this.startDiagnosticsTracing();
});

Then('I should see the inventory products', async function (this: TestWorld) {
  await this.loginPage!.expectSuccessfulLogin();
  logBusinessEvent('Inventory products are displayed.');
});

Then('I should see the login error {string}', async function (this: TestWorld, message: string) {
  await this.loginPage!.expectLoginError(message);
});
