import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Roles have complex permissions grid, and system roles (SuperAdmin, Customer)
// have disabled detail links and cannot be edited.
// TODO: Add full CRUD tests for custom roles.

test.describe('Roles', () => {
    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/roles',
            title: 'Roles',
            newButtonLabel: 'New Role',
        });

    test('should display the roles list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show built-in roles', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        // RoleCodeLabel renders __super_admin_role__ as "Super Admin"
        await expect(lp.getRows().filter({ hasText: 'Super Admin' }).first()).toBeVisible();
    });

    test('should navigate to create form', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        // System roles (SuperAdmin, Customer) have disabled detail links,
        // so we test navigation via the "New Role" button instead.
        await lp.clickNewButton();
        await expect(page).toHaveURL(/\/roles\/new/);
    });
});
