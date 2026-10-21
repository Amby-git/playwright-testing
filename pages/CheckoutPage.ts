import { expect, type Page } from '@playwright/test';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async expectInformationPage(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html$/);
    await expect(this.page.getByText('Checkout: Your Information', { exact: true })).toBeVisible();
  }

  async enterCustomerDetails(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);
    await this.page.getByPlaceholder('Zip/Postal Code').fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async expectOverviewPage(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html$/);
    await expect(this.page.getByText('Checkout: Overview', { exact: true })).toBeVisible();
  }

  async expectOverviewWithProduct(productName: string): Promise<void> {
    await this.expectOverviewPage();
    const overviewProduct = this.page.locator('.cart_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
    await expect(overviewProduct).toBeVisible();
  }

  async expectRequiredFieldError(message: string): Promise<void> {
    await expect(this.page.locator('[data-test="error"]')).toContainText(message);
  }

  async finish(): Promise<void> {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.page.getByText('Thank you for your order!', { exact: true })).toBeVisible();
  }

  async expectMessage(message: string): Promise<void> {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }
}
