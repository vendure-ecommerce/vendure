import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

test.describe('Customers', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/customers',
            title: 'Customers',
            newButtonLabel: 'New Customer',
        });

    test('should display the customers list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show seeded customers', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        // Global setup seeds 5 customers
        await lp.expectRowCountGreaterThan(0);
    });

    test('should search for a customer', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('hayden');
        const rows = lp.getRows();
        await expect(rows.first()).toBeVisible();
    });

    test('should navigate to customer detail', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.getRows().first().getByRole('link').first().click();
        await expect(page).toHaveURL(/\/customers\/[^/]+$/);
    });
});
