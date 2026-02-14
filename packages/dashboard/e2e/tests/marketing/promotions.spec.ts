import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Promotions require condition/action ConfigurableOperation selectors.
// TODO: Add full CRUD tests with custom ConfigurableOperation handling.

test.describe('Promotions', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/promotions',
            title: 'Promotions',
            newButtonLabel: 'New Promotion',
        });

    test('should display the promotions list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should navigate to create form', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickNewButton();
        await expect(page).toHaveURL(/\/promotions\/new/);
        await expect(page.getByRole('heading', { name: 'New promotion' })).toBeVisible();
    });
});
