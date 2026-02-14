import { expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

test.describe('Products CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/products',
            title: 'Products',
            newButtonLabel: 'New Product',
        });

    const detailPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseDetailPage(page, {
            newPath: '/products/new',
            pathPrefix: '/products/',
            newTitle: 'New product',
        });

    test('should create a new product', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('Product name', 'E2E Test Product');
        // Slug auto-generates from the product name; wait for debounce
        await page.waitForTimeout(500);

        await dp.clickCreate();
        await dp.expectSuccessToast(/Successfully created product/);
        await dp.expectNavigatedToExisting();
    });

    test('should find the created product via search', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Product');
        await expect(lp.getRows().filter({ hasText: 'E2E Test Product' }).first()).toBeVisible();
    });

    test('should navigate to product detail page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Product');
        await lp.clickEntity('E2E Test Product');
        await expect(page).toHaveURL(/\/products\/[^/]+$/);
    });

    test('should update the product', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Product');
        await lp.clickEntity('E2E Test Product');
        await expect(page).toHaveURL(/\/products\/[^/]+$/);

        const dp = detailPage(page);
        await dp.fillInput('Product name', 'E2E Updated Product');
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);
    });

    test('should show updated product in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Updated Product');
        await expect(lp.getRows().filter({ hasText: 'E2E Updated Product' }).first()).toBeVisible();
    });

    test('should bulk-delete the test product', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Updated Product');

        await lp.bulkDelete('all');
        await lp.expectSuccessToast();
    });
});
