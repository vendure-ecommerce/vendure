import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Shipping Methods require ConfigurableOperation selectors (checker + calculator)
// which are beyond the simple CRUD factory. These tests cover list page functionality.
// TODO: Add full CRUD tests with custom ConfigurableOperation handling.

test.describe('Shipping Methods', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/shipping-methods',
            title: 'Shipping Methods',
            newButtonLabel: 'New Shipping Method',
        });

    test('should display the shipping methods list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show existing shipping methods', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        // Initial data seeds 2 shipping methods: Standard + Express
        await lp.expectRowCountGreaterThan(0);
    });

    test('should navigate to create form', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickNewButton();
        await expect(page).toHaveURL(/\/shipping-methods\/new/);
        await expect(page.getByRole('heading', { name: 'New shipping method' })).toBeVisible();
    });

    test('should navigate to shipping method detail', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Standard Shipping');
        await expect(page).toHaveURL(/\/shipping-methods\/[^/]+$/);
    });
});
