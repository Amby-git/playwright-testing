"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_config_1 = require("../config/test-config");
(0, cucumber_1.Given)('I am on the SauceDemo login page', async function () {
    await this.loginPage.open();
});
(0, cucumber_1.When)('I log in with valid credentials', async function () {
    await this.loginPage.login(test_config_1.testConfig.username, test_config_1.testConfig.password);
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.When)('I log in with username {string} and password {string}', async function (username, password) {
    await this.loginPage.login(username, password);
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.When)('I log in with an invalid password', async function () {
    await this.loginPage.login(test_config_1.testConfig.username, test_config_1.testConfig.invalidPassword);
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.When)('I log in with an invalid username', async function () {
    await this.loginPage.login(test_config_1.testConfig.username, test_config_1.testConfig.invalidPassword);
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.When)('I log in with an invalid username {string}', async function (username) {
    await this.loginPage.login(username, test_config_1.testConfig.password);
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.When)('I submit empty login credentials', async function () {
    await this.loginPage.login('', '');
    await this.startDiagnosticsTracing();
});
(0, cucumber_1.Then)('I should see the inventory products', async function () {
    await this.loginPage.expectSuccessfulLogin();
});
(0, cucumber_1.Then)('I should see the login error {string}', async function (message) {
    await this.loginPage.expectLoginError(message);
});
(0, cucumber_1.Then)('I should see the message {string}', async function (expectedMessage) {
    await this.loginPage.expectMessage(expectedMessage);
});
//# sourceMappingURL=login.steps.js.map