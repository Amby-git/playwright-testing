import { expect, type Locator, type Page } from '@playwright/test';

export type ProductSort = 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  private get productCards(): Locator {
    return this.page.locator('.inventory_item');
  }

  async expectProductsVisible(): Promise<void> {
    await expect(this.page.getByText('Products', { exact: true })).toBeVisible();
    await expect(this.productCards.first()).toBeVisible();
  }

  async openProductDetails(productName: string): Promise<void> {
    await this.page.locator('.inventory_item_name', { hasText: productName }).click();
  }

  async expectProductDetails(productName: string, description: string, price: string): Promise<void> {
    await expect(this.page.locator('.inventory_details_name')).toHaveText(productName);
    await expect(this.page.locator('.inventory_details_desc')).toHaveText(description);
    await expect(this.page.locator('.inventory_details_price')).toHaveText(price);
  }

  async expectProductNameAndPrice(productName: string, price: string): Promise<void> {
    await expect(this.page.locator('.inventory_details_name')).toHaveText(productName);
    await expect(this.page.locator('.inventory_details_price')).toHaveText(price);
  }

  async expectProductNameNotToBe(productName: string): Promise<void> {
    await expect(this.page.locator('.inventory_details_name')).not.toHaveText(productName);
  }

  async addProductFromDetails(): Promise<void> {
    await this.page.locator('.inventory_details').getByRole('button', { name: 'Add to cart' }).click();
  }

  async sortProducts(sort: ProductSort): Promise<void> {
    await this.page.locator('[data-test="product-sort-container"]').selectOption({ label: sort });
  }

  async expectSortedByName(direction: 'ascending' | 'descending'): Promise<void> {
    const names = await this.page.locator('.inventory_item_name').allTextContents();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    if (direction === 'descending') sorted.reverse();
    expect(names).toEqual(sorted);
  }

  async expectSortedByPrice(direction: 'low to high' | 'high to low'): Promise<void> {
    const texts = await this.page.locator('.inventory_item_price').allTextContents();
    const prices = texts.map((text) => Number(text.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    if (direction === 'high to low') sorted.reverse();
    expect(prices).toEqual(sorted);
  }

  async addProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async expectCartBadge(count: number): Promise<void> {
    const badge = this.page.locator('.shopping_cart_badge');
    if (count === 0) {
      await expect(badge).toHaveCount(0);
    } else {
      await expect(badge).toHaveText(String(count));
    }
  }

  async openCart(): Promise<void> {
    await this.page.getByRole('button', { name: /^Cart/ }).click();
  }

  private productCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}
