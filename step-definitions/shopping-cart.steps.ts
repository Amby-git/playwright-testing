import { Given, Then, When } from '@cucumber/cucumber';
import { testConfig } from '../config/test-config';
import { logBusinessEvent } from '../support/logger';
import type { ProductSort } from '../pages/InventoryPage';
import { TestWorld } from '../support/world';

Given('I am logged in as the standard user', async function (this: TestWorld) {
  const loginPage = requireWorldValue(this.loginPage, 'LoginPage');
  await loginPage.open();
  logBusinessEvent('Starting login with configured credentials.');
  await loginPage.login(testConfig.username, testConfig.password);
  await this.startDiagnosticsTracing();
  await loginPage.expectSuccessfulLogin();
});

Then('the product listing should be visible', async function (this: TestWorld) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').expectProductsVisible();
  logBusinessEvent('Inventory products are displayed.');
});

When('I sort products by price {string}', async function (this: TestWorld, direction: string) {
  const option = priceSortOption(direction);
  await requireWorldValue(this.inventoryPage, 'InventoryPage').sortProducts(option);
  logBusinessEvent(`Products sorted by ${direction}.`);
});

When('I sort products by name from {string}', async function (this: TestWorld, direction: string) {
  const option = nameSortOption(direction);
  await requireWorldValue(this.inventoryPage, 'InventoryPage').sortProducts(option);
  logBusinessEvent(`Products sorted by name ${direction}.`);
});

Then('products should be sorted by price {string}', async function (this: TestWorld, direction: string) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').expectSortedByPrice(priceSortDirection(direction));
});

Then('products should be sorted by name from {string}', async function (this: TestWorld, direction: string) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').expectSortedByName(nameSortDirection(direction));
});

When('I add {string} to the cart', async function (this: TestWorld, productName: string) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').addProduct(productName);
  logBusinessEvent(`Added ${productName} to the cart.`);
});

When('I remove {string} from the inventory page', async function (this: TestWorld, productName: string) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').removeProduct(productName);
  logBusinessEvent(`Removed ${productName} from the cart.`);
});

Then('the cart badge should show {int} item', async function (this: TestWorld, count: number) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').expectCartBadge(count);
});

When('I open the cart', async function (this: TestWorld) {
  await requireWorldValue(this.inventoryPage, 'InventoryPage').openCart();
  logBusinessEvent('Opened the shopping cart.');
});

Then('I should see {string} in the cart', async function (this: TestWorld, productName: string) {
  await requireWorldValue(this.cartPage, 'CartPage').expectProductVisible(productName);
});

When('I remove {string} from the cart', async function (this: TestWorld, productName: string) {
  await requireWorldValue(this.cartPage, 'CartPage').removeProduct(productName);
  logBusinessEvent(`Removed ${productName} from the cart.`);
});

Then('the cart should be empty', async function (this: TestWorld) {
  await requireWorldValue(this.cartPage, 'CartPage').expectEmpty();
});

When('I start checkout', async function (this: TestWorld) {
  await requireWorldValue(this.cartPage, 'CartPage').proceedToCheckout();
  logBusinessEvent('Checkout started from the cart.');
});

Then('checkout information should be displayed', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectInformationPage();
});

When('I continue checkout without customer details', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').continue();
});

Then('I should see the checkout error {string}', async function (this: TestWorld, message: string) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectRequiredFieldError(message);
});

When('I enter customer details {string} {string} {string}', async function (
  this: TestWorld,
  firstName: string,
  lastName: string,
  postalCode: string,
) {
  await this.stopDiagnosticsTracingBeforeSensitiveInput();
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').enterCustomerDetails(firstName, lastName, postalCode);
  logBusinessEvent('Customer checkout information entered; values omitted.');
});

When('I continue checkout', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').continue();
  logBusinessEvent('Checkout information submitted.');
});

Then('the checkout overview should be displayed', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectOverviewPage();
});

Then('the checkout overview should show {string}', async function (this: TestWorld, productName: string) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectOverviewWithProduct(productName);
});

When('I finish checkout', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').finish();
  logBusinessEvent('Order submitted.');
});

Then('I should see the order confirmation', async function (this: TestWorld) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectOrderComplete();
  logBusinessEvent('Order confirmation received.');
});

Then('I should see the message {string}', async function (this: TestWorld, message: string) {
  await requireWorldValue(this.checkoutPage, 'CheckoutPage').expectMessage(message);
});

function requireWorldValue<T>(value: T | undefined, pageObjectName: string): T {
  if (!value) throw new Error(`${pageObjectName} is not initialized. Ensure the scenario setup hook has run.`);
  return value;
}

function priceSortOption(direction: string): ProductSort {
  switch (direction) {
    case 'low to high': return 'Price (low to high)';
    case 'high to low': return 'Price (high to low)';
    default: throw new Error(`Unsupported price sort direction: "${direction}".`);
  }
}

function priceSortDirection(direction: string): 'low to high' | 'high to low' {
  if (direction === 'low to high' || direction === 'high to low') return direction;
  throw new Error(`Unsupported price sort direction: "${direction}".`);
}

function nameSortOption(direction: string): ProductSort {
  switch (direction) {
    case 'A to Z': return 'Name (A to Z)';
    case 'Z to A': return 'Name (Z to A)';
    default: throw new Error(`Unsupported name sort direction: "${direction}".`);
  }
}

function nameSortDirection(direction: string): 'ascending' | 'descending' {
  if (direction === 'A to Z') return 'ascending';
  if (direction === 'Z to A') return 'descending';
  throw new Error(`Unsupported name sort direction: "${direction}".`);
}
