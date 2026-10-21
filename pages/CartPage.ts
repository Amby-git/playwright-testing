import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async expectProductVisible(productName: string): Promise<void> {
    await expect(this.cartItem(productName)).toBeVisible();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.cartItem(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.page.locator('.cart_item')).toHaveCount(0);
    await expect(this.page.locator('.shopping_cart_badge')).toHaveCount(0);
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }

  private cartItem(productName: string): Locator {
    return this.page.locator('.cart_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}
