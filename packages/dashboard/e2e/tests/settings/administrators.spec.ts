import { type Page, expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

// Administrators have a password field and a multi-select role picker
// that don't fit the standard CRUD factory, so we use custom tests.

test.describe('Administrators', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Page) =>
        new BaseListPage(page, {
            path: '/administrators',
            title: 'Administrators',
            newButtonLabel: 'New Administrator',
        });

    const detailPage = (page: Page) =>
        new BaseDetailPage(page, {
            newPath: '/administrators/new',
            pathPrefix: '/administrators/',
            newTitle: 'New administrator',
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

    test('should create a new administrator', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('First name', 'Test');
        await dp.fillInput('Last name', 'Admin');
        await dp.fillInput('Email Address or identifier', 'test-admin@example.com');
        await dp.fillPassword('Password', 'test123456');

        // Open the roles multi-select (the first combobox, in the "Roles" PageBlock which
        // precedes the "Channels" field) and select the "SuperAdmin" role
        const rolesCombobox = page.getByRole('combobox').first();
        await dp.selectPopoverOption(rolesCombobox, 'SuperAdmin');

        await dp.clickCreate();
        await dp.expectSuccessToast(/Successfully created administrator/);
        await dp.expectNavigatedToExisting();
    });

    test('should find the created administrator in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await expect(lp.getRows().filter({ hasText: 'Test Admin' }).first()).toBeVisible();
    });

    test('should navigate to administrator detail page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Test Admin');
        await expect(page).toHaveURL(/\/administrators\/[^/]+$/);
    });

    test('should update the administrator', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Test Admin');
        await expect(page).toHaveURL(/\/administrators\/[^/]+$/);

        const dp = detailPage(page);
        await dp.fillInput('First name', 'Updated');
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated administrator/);
    });

    test('should show updated name in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await expect(lp.getRows().filter({ hasText: 'Updated Admin' }).first()).toBeVisible();
    });

    // User-level channels — an administrator's own channels replace the channels of their roles
    test('should assign channels directly to an administrator', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('First name', 'Scoped');
        await dp.fillInput('Last name', 'Admin');
        await dp.fillInput('Email Address or identifier', 'scoped-admin@example.com');
        await dp.fillPassword('Password', 'test123456');

        await dp.selectPopoverOption(page.getByRole('combobox').first(), 'SuperAdmin');
        await dp.selectPopoverOption(dp.formItem('Channels').getByRole('combobox'), 'Default channel');

        await dp.clickCreate();
        await dp.expectSuccessToast(/Successfully created administrator/);
        await dp.expectNavigatedToExisting();

        // The channel is persisted, not just held in form state
        await page.reload();
        await expect(dp.formItem('Channels')).toContainText('Default channel');
    });

    test('should clear the channels of an administrator', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.clickEntity('Scoped Admin');

        const dp = detailPage(page);
        await expect(dp.formItem('Channels')).toContainText('Default channel');
        await dp.formItem('Channels').locator('[data-slot="combobox-chip-remove"]').click();
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated administrator/);

        await page.reload();
        await expect(dp.formItem('Channels')).not.toContainText('Default channel');
    });

    test('should bulk-delete administrators', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();

        // Select the test admin row (not the first row which is the superadmin)
        const testAdminRow = lp.getRows().filter({ hasText: 'Updated Admin' });
        await testAdminRow.getByRole('checkbox').click();
        await page.getByRole('button', { name: /Actions/i }).click();
        await page.locator('[role="menu"]').getByText('Delete', { exact: true }).click();
        await page.locator('[role="alertdialog"]').getByRole('button', { name: 'Continue' }).click();
        await lp.expectSuccessToast();

        // Verify the admin is gone
        await expect(lp.getRows().filter({ hasText: 'Updated Admin' })).toHaveCount(0);
    });
});
