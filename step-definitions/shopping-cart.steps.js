"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_config_1 = require("../config/test-config");
(0, cucumber_1.Given)('I am logged in as the standard user', async function () {
    await this.loginPage.open();
    await this.loginPage.login(test_config_1.testConfig.username, test_config_1.testConfig.password);
    await this.startDiagnosticsTracing();
    await this.loginPage.expectSuccessfulLogin();
});
(0, cucumber_1.Then)('the product listing should be visible', async function () {
    await this.inventoryPage.expectProductsVisible();
});
(0, cucumber_1.When)('I sort products by price from low to high', async function () {
    await this.inventoryPage.sortProducts('Price (low to high)');
});
(0, cucumber_1.When)('I sort products by name from {string}', async function (direction) {
    const option = direction === 'Z to A' ? 'Name (Z to A)' : 'Name (A to Z)';
    await this.inventoryPage.sortProducts(option);
});
(0, cucumber_1.Then)('products should be sorted by price from low to high', async function () {
    await this.inventoryPage.expectSortedByPrice('low to high');
});
(0, cucumber_1.Then)('products should be sorted by name from {string}', async function (direction) {
    await this.inventoryPage.expectSortedByName(direction === 'Z to A' ? 'descending' : 'ascending');
});
(0, cucumber_1.When)('I add {string} to the cart', async function (productName) {
    await this.inventoryPage.addProduct(productName);
});
(0, cucumber_1.Then)('the cart badge should show {int} item', async function (count) {
    await this.inventoryPage.expectCartBadge(count);
});
(0, cucumber_1.When)('I open the cart', async function () {
    await this.inventoryPage.openCart();
});
(0, cucumber_1.Then)('I should see {string} in the cart', async function (productName) {
    await this.cartPage.expectProductVisible(productName);
});
(0, cucumber_1.When)('I remove {string} from the cart', async function (productName) {
    await this.cartPage.removeProduct(productName);
});
(0, cucumber_1.Then)('the cart should be empty', async function () {
    await this.cartPage.expectEmpty();
});
(0, cucumber_1.When)('I start checkout', async function () {
    await this.cartPage.proceedToCheckout();
});
(0, cucumber_1.When)('I continue checkout without customer details', async function () {
    await this.checkoutPage.continue();
});
(0, cucumber_1.Then)('I should see the checkout error {string}', async function (message) {
    await this.checkoutPage.expectRequiredFieldError(message);
});
(0, cucumber_1.When)('I enter customer details {string} {string} {string}', async function (firstName, lastName, postalCode) {
    await this.stopDiagnosticsTracingBeforeSensitiveInput();
    await this.checkoutPage.enterCustomerDetails(firstName, lastName, postalCode);
});
(0, cucumber_1.When)('I continue checkout', async function () {
    await this.checkoutPage.continue();
});
(0, cucumber_1.When)('I finish checkout', async function () {
    await this.checkoutPage.finish();
});
(0, cucumber_1.Then)('I should see the order confirmation', async function () {
    await this.checkoutPage.expectOrderComplete();
});
//# sourceMappingURL=shopping-cart.steps.js.map