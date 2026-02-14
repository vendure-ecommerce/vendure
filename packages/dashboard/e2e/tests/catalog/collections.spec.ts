import { expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

// Collections support hierarchical tree display, drag-and-drop reordering,
// filters (ConfigurableOperationMultiSelector), and assets. For CRUD tests
// we only need Name (slug auto-generates).

test.describe('Collections CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/collections',
            title: 'Collections',
            newButtonLabel: 'New Collection',
        });

    const detailPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseDetailPage(page, {
            newPath: '/collections/new',
            pathPrefix: '/collections/',
            newTitle: 'New collection',
        });

    test('should display the collections list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show seeded collections', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        // Initial data seeds a "Plants" collection
        await lp.expectRowCountGreaterThan(0);
    });

    test('should navigate to collection detail', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Plants');
        await expect(page).toHaveURL(/\/collections\/[^/]+$/);
    });

    test('should create a new collection', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('Name', 'E2E Test Collection');
        // Slug auto-generates from the name; wait for debounce
        await page.waitForTimeout(500);

        await dp.clickCreate();
        await dp.expectSuccessToast(/Successfully created collection/);
        await dp.expectNavigatedToExisting();
    });

    test('should find the created collection via search', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Collection');
        await expect(lp.getRows().filter({ hasText: 'E2E Test Collection' }).first()).toBeVisible();
    });

    test('should navigate to created collection detail page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Collection');
        await lp.clickEntity('E2E Test Collection');
        await expect(page).toHaveURL(/\/collections\/[^/]+$/);
    });

    test('should update the collection', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Test Collection');
        await lp.clickEntity('E2E Test Collection');
        await expect(page).toHaveURL(/\/collections\/[^/]+$/);

        const dp = detailPage(page);
        await dp.fillInput('Name', 'E2E Updated Collection');
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated collection/);
    });

    test('should show updated collection in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Updated Collection');
        await expect(lp.getRows().filter({ hasText: 'E2E Updated Collection' }).first()).toBeVisible();
    });

    test('should bulk-delete the test collection', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('E2E Updated Collection');

        await lp.bulkDelete('all');
        await lp.expectSuccessToast();
    });
});
