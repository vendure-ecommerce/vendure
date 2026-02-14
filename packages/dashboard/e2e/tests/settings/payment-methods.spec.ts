import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Payment Methods require ConfigurableOperation handler selectors which are beyond
// the simple CRUD factory. Initial seed data has no payment methods.
// TODO: Add full CRUD tests with custom ConfigurableOperation handling.

test.describe('Payment Methods', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/payment-methods',
            title: 'Payment Methods',
            newButtonLabel: 'New Payment Method',
        });

    test('should display the payment methods list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should navigate to create form', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickNewButton();
        await expect(page).toHaveURL(/\/payment-methods\/new/);
        await expect(page.getByRole('heading', { name: 'New payment method' })).toBeVisible();
    });
});
