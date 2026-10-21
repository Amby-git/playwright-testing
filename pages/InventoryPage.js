"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const test_1 = require("@playwright/test");
class InventoryPage {
    page;
    constructor(page) {
        this.page = page;
    }
    get productCards() {
        return this.page.locator('.inventory_item');
    }
    async expectProductsVisible() {
        await (0, test_1.expect)(this.page.getByText('Products', { exact: true })).toBeVisible();
        await (0, test_1.expect)(this.productCards.first()).toBeVisible();
    }
    async sortProducts(sort) {
        await this.page.locator('[data-test="product-sort-container"]').selectOption({ label: sort });
    }
    async expectSortedByName(direction) {
        const names = await this.page.locator('.inventory_item_name').allTextContents();
        const sorted = [...names].sort((a, b) => a.localeCompare(b));
        if (direction === 'descending')
            sorted.reverse();
        (0, test_1.expect)(names).toEqual(sorted);
    }
    async expectSortedByPrice(direction) {
        const texts = await this.page.locator('.inventory_item_price').allTextContents();
        const prices = texts.map((text) => Number(text.replace('$', '')));
        const sorted = [...prices].sort((a, b) => a - b);
        if (direction === 'high to low')
            sorted.reverse();
        (0, test_1.expect)(prices).toEqual(sorted);
    }
    async addProduct(productName) {
        await this.productCard(productName).getByRole('button', { name: 'Add to cart' }).click();
    }
    async removeProduct(productName) {
        await this.productCard(productName).getByRole('button', { name: 'Remove' }).click();
    }
    async expectCartBadge(count) {
        const badge = this.page.locator('.shopping_cart_badge');
        if (count === 0) {
            await (0, test_1.expect)(badge).toHaveCount(0);
        }
        else {
            await (0, test_1.expect)(badge).toHaveText(String(count));
        }
    }
    async openCart() {
        await this.page.getByRole('button', { name: /^Cart/ }).click();
    }
    productCard(productName) {
        return this.productCards.filter({
            has: this.page.locator('.inventory_item_name', { hasText: productName }),
        });
    }
}
exports.InventoryPage = InventoryPage;
//# sourceMappingURL=InventoryPage.js.map