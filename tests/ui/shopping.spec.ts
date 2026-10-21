import { test, expect } from '../fixtures/test';

test('authenticated user can add Sauce Labs Backpack to the cart', async ({ authenticatedPage }) => {
  const backpack = authenticatedPage
    .locator('.inventory_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();

  await expect(backpack.getByRole('button', { name: 'Remove' })).toBeVisible();
});

test('cart badge shows one item after adding Sauce Labs Backpack', async ({ authenticatedPage }) => {
  const backpack = authenticatedPage
    .locator('.inventory_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();

  await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveText('1');
});

test('user can open the cart and see Sauce Labs Backpack', async ({ authenticatedPage }) => {
  const backpack = authenticatedPage
    .locator('.inventory_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await authenticatedPage.getByRole('button', { name: /^Cart/ }).click();

  await expect(authenticatedPage).toHaveURL(/cart\.html/);
  await expect(authenticatedPage.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
});

test('user can remove Sauce Labs Backpack and verify the cart is empty', async ({ authenticatedPage }) => {
  const backpack = authenticatedPage
    .locator('.inventory_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await authenticatedPage.getByRole('button', { name: /^Cart/ }).click();

  const cartItem = authenticatedPage
    .locator('.cart_item')
    .filter({ has: authenticatedPage.getByText('Sauce Labs Backpack', { exact: true }) });
  await cartItem.getByRole('button', { name: 'Remove' }).click();

  await expect(authenticatedPage.locator('.cart_item')).toHaveCount(0);
  await expect(authenticatedPage.locator('.shopping_cart_badge')).toHaveCount(0);
});
