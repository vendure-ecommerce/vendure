import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

test.describe('Product List', () => {
    const listPage = (page: import('@playwright/test').Page) =>
        new BaseListPage(page, {
            path: '/products',
            title: 'Products',
            newButtonLabel: 'New Product',
        });

    test('should display the product list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show products in the table', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();

        const rows = lp.getRows();
        await expect(rows.first()).toBeVisible();
        expect(await rows.count()).toBeGreaterThan(0);
    });

    test('should navigate to product detail when clicking a product', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();

        // Click the first product link in the table
        const firstProductLink = lp.getRows().first().getByRole('link').first();
        await firstProductLink.click();

        await expect(page).toHaveURL(/\/products\/.+/);
    });

    test('should display "New Product" button', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();

        await expect(lp.newButton).toBeVisible();
    });
});
