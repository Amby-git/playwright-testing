"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("../fixtures/test");
(0, test_1.test)('authenticated user can add Sauce Labs Backpack to the cart', async ({ authenticatedPage }) => {
    const backpack = authenticatedPage
        .locator('.inventory_item')
        .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await (0, test_1.expect)(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
});
(0, test_1.test)('cart badge shows one item after adding Sauce Labs Backpack', async ({ authenticatedPage }) => {
    const backpack = authenticatedPage
        .locator('.inventory_item')
        .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await (0, test_1.expect)(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('1');
});
(0, test_1.test)('user can open the cart and see Sauce Labs Backpack', async ({ authenticatedPage }) => {
    const backpack = authenticatedPage
        .locator('.inventory_item')
        .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await authenticatedPage.getByRole('button', { name: /^Cart/ }).click();
    await (0, test_1.expect)(authenticatedPage).toHaveURL(/cart\.html/);
    await (0, test_1.expect)(authenticatedPage.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
});
(0, test_1.test)('user can remove Sauce Labs Backpack and verify the cart is empty', async ({ authenticatedPage }) => {
    const backpack = authenticatedPage
        .locator('.inventory_item')
        .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
    await backpack.getByRole('button', { name: 'Add to cart' }).click();
    await authenticatedPage.getByRole('button', { name: /^Cart/ }).click();
    const cartItem = authenticatedPage
        .locator('.cart_item')
        .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
    await cartItem.getByRole('button', { name: 'Remove' }).click();
    await (0, test_1.expect)(authenticatedPage.locator('.cart_item')).toHaveCount(0);
    await (0, test_1.expect)(authenticatedPage.locator('.shopping_cart_badge')).toHaveCount(0);
});
//# sourceMappingURL=shopping.spec.js.map