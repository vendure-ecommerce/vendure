import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Administrator create/edit requires password and role selector.
// TODO: Add full CRUD tests.

test.describe('Administrators', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/administrators',
            title: 'Administrators',
            newButtonLabel: 'New Administrator',
        });

    test('should display the administrators list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show the superadmin', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await expect(lp.getRows().filter({ hasText: 'Super Admin' }).first()).toBeVisible();
    });

    test('should navigate to administrator detail', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Super Admin');
        await expect(page).toHaveURL(/\/administrators\/[^/]+$/);
    });
});
