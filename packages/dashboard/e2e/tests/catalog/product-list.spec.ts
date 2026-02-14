import { expect, test } from '@playwright/test';

import { ProductListPage } from '../../page-objects/product-list-page.js';

test.describe('Product List', () => {
    test('should display the product list page', async ({ page }) => {
        const productList = new ProductListPage(page);
        await productList.goto();
        await productList.expectLoaded();
    });

    test('should show products in the table', async ({ page }) => {
        const productList = new ProductListPage(page);
        await productList.goto();
        await productList.expectLoaded();

        const rows = productList.getRows();
        await expect(rows.first()).toBeVisible();
        expect(await rows.count()).toBeGreaterThan(0);
    });

    test('should navigate to product detail when clicking a product', async ({ page }) => {
        const productList = new ProductListPage(page);
        await productList.goto();
        await productList.expectLoaded();

        // Click the first product link in the table
        const firstProductLink = productList.getRows().first().getByRole('link').first();
        await firstProductLink.click();

        await expect(page).toHaveURL(/\/products\/.+/);
    });

    test('should display "New Product" button', async ({ page }) => {
        const productList = new ProductListPage(page);
        await productList.goto();
        await productList.expectLoaded();

        await expect(productList.newProductButton).toBeVisible();
    });
});
