import { expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

test.describe('Customers CRUD', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/customers',
            title: 'Customers',
            newButtonLabel: 'New Customer',
        });

    const detailPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseDetailPage(page, {
            newPath: '/customers/new',
            pathPrefix: '/customers/',
            newTitle: 'New customer',
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

    test('should create a new customer', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('First name', 'E2E');
        await dp.fillInput('Last name', 'TestCustomer');
        await dp.fillInput('Email address', 'e2e-test-customer@example.com');

        await dp.clickCreate();
        await dp.expectSuccessToast(/Successfully created customer/);
        await dp.expectNavigatedToExisting();
    });

    test('should find the created customer via search', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('TestCustomer');
        await expect(lp.getRows().filter({ hasText: 'TestCustomer' }).first()).toBeVisible();
    });

    test('should navigate to customer detail page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('TestCustomer');
        await lp.clickEntity('E2E TestCustomer');
        await expect(page).toHaveURL(/\/customers\/[^/]+$/);
    });

    test('should update the customer', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('TestCustomer');
        await lp.clickEntity('E2E TestCustomer');
        await expect(page).toHaveURL(/\/customers\/[^/]+$/);

        const dp = detailPage(page);
        await dp.fillInput('First name', 'Updated');
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated customer/);
    });

    test('should show updated customer in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('TestCustomer');
        await expect(lp.getRows().filter({ hasText: 'Updated TestCustomer' }).first()).toBeVisible();
    });

    test('should bulk-delete the test customer', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('TestCustomer');

        await lp.bulkDelete('all');
        await lp.expectSuccessToast();
    });
});
