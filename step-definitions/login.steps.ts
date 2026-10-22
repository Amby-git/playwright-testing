import { Then, When } from '@cucumber/cucumber';
import { testConfig } from '../config/test-config';
import { logBusinessEvent } from '../support/logger';
import { TestWorld } from '../support/world';

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

When('I submit the {string} login case', async function (this: TestWorld, loginCase: string) {
  let username: string;
  let password: string;

  switch (loginCase) {
    case 'invalid username':
      username = testConfig.invalidUsername;
      password = testConfig.password;
      break;
    case 'invalid password':
      username = testConfig.username;
      password = testConfig.invalidPassword;
      break;
    case 'empty username':
      username = '';
      password = testConfig.password;
      break;
    case 'empty password':
      username = testConfig.username;
      password = '';
      break;
    default:
      throw new Error(`Unsupported login case: "${loginCase}".`);
  }

  logBusinessEvent(`Submitting the ${loginCase} login case.`);
  await this.loginPage!.login(username, password);
  await this.startDiagnosticsTracing();
});

When('I log in with the locked-out user', async function (this: TestWorld) {
  logBusinessEvent('Submitting login with the locked-out SauceDemo account.');
  await this.loginPage!.login('locked_out_user', testConfig.password);
  await this.startDiagnosticsTracing();
});

Then('I should see the login error {string}', async function (this: TestWorld, message: string) {
  await this.loginPage!.expectLoginError(message);
});
