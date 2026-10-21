"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)('standard user can log in to Sauce Demo', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await (0, test_1.expect)(page).toHaveURL(/inventory\.html$/);
    await (0, test_1.expect)(page.getByText('Products', { exact: true })).toBeVisible();
});
//# sourceMappingURL=login.spec.js.map