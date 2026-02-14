import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Collections have complex hierarchy, filters, and asset management.
// TODO: Add full CRUD tests with custom filter/asset handling.

test.describe('Collections', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/collections',
            title: 'Collections',
            newButtonLabel: 'New Collection',
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
});
