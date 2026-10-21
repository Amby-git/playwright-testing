
import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectLoginError(message: string): Promise<void> {
    await this.expectMessage(message);
  }

  async expectMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(
        this.page.getByText('Products', { exact: true })
    ).toBeVisible();
  }
}