"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.test = void 0;
const test_1 = require("@playwright/test");
Object.defineProperty(exports, "expect", { enumerable: true, get: function () { return test_1.expect; } });
exports.test = test_1.test.extend({
    authenticatedPage: async ({ page }, use) => {
        await page.goto('/');
        await page.getByPlaceholder('Username').fill('standard_user');
        await page.getByPlaceholder('Password').fill('secret_sauce');
        await page.getByRole('button', { name: 'Login' }).click();
        await (0, test_1.expect)(page).toHaveURL(/inventory\.html/);
        await (0, test_1.expect)(page.getByText('Products', { exact: true })).toBeVisible();
        await use(page);
    },
});
//# sourceMappingURL=test.js.map