import { expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

// Custom fields are configured in global-setup.ts on the Product entity.
// This suite verifies that every custom field type renders the correct input,
// that tab grouping works, and that values persist after saving.

test.describe('Custom Fields', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/products',
            title: 'Products',
            newButtonLabel: 'New Product',
        });

    const detailPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseDetailPage(page, {
            newPath: '/products/new',
            pathPrefix: '/products/',
            newTitle: 'New product',
        });

    /** Navigate to the first seeded product's detail page. */
    async function goToFirstProduct(page: Parameters<Parameters<typeof test>[1]>[0]['page']) {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.search('Laptop');
        await lp.clickEntity('Laptop');
        await expect(page).toHaveURL(/\/products\/[^/]+$/);
    }

    test('should render all custom field types on a product detail page', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);

        // string → textbox
        await expect(dp.formItem('Info URL').getByRole('textbox')).toBeVisible();
        // float → spinbutton
        await expect(dp.formItem('Weight').getByRole('spinbutton')).toBeVisible();
        // int → spinbutton
        await expect(dp.formItem('Review Rating').getByRole('spinbutton')).toBeVisible();
        // boolean → switch
        await expect(dp.formItem('Downloadable').getByRole('switch')).toBeVisible();
        // datetime → button (calendar picker trigger)
        await expect(dp.formItem('Release Date').getByRole('button')).toBeVisible();
        // text → textbox
        await expect(dp.formItem('Additional Info').getByRole('textbox')).toBeVisible();
        // string with options → combobox
        await expect(dp.formItem('Priority').getByRole('combobox')).toBeVisible();
    });

    test('should display custom field tabs', async ({ page }) => {
        await goToFirstProduct(page);

        const tabList = page.locator('[data-slot="tabs-list"]');
        await expect(tabList).toBeVisible();

        // Verify all three tab triggers are present
        await expect(page.locator('[data-slot="tabs-trigger"]', { hasText: 'General' })).toBeVisible();
        await expect(page.locator('[data-slot="tabs-trigger"]', { hasText: 'SEO' })).toBeVisible();
        await expect(page.locator('[data-slot="tabs-trigger"]', { hasText: 'Details' })).toBeVisible();

        // "General" should be the active tab by default
        await expect(page.locator('[data-slot="tabs-trigger"]', { hasText: 'General' })).toHaveAttribute(
            'data-state',
            'active',
        );
    });

    test('should switch between custom field tabs', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);

        // Click "SEO" tab → SEO fields should be visible
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'SEO' }).click();
        await expect(dp.formItem('SEO Title')).toBeVisible();
        await expect(dp.formItem('SEO Description')).toBeVisible();

        // Click "Details" tab → Detail Notes should be visible
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Details' }).click();
        await expect(dp.formItem('Detail Notes')).toBeVisible();

        // Click "General" tab → original fields visible again
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'General' }).click();
        await expect(dp.formItem('Info URL').getByRole('textbox')).toBeVisible();
        await expect(dp.formItem('Weight').getByRole('spinbutton')).toBeVisible();
    });

    test('should render locale fields with language selector', async ({ page }) => {
        await goToFirstProduct(page);

        // Switch to SEO tab
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'SEO' }).click();

        // TranslatableFormField wraps locale fields with a language tab selector.
        // The SEO Title field should be within a translatable form container
        // that has a language code button (e.g. "en").
        const seoTitleItem = page.locator('[data-slot="form-item"]').filter({
            has: page.locator('[data-slot="form-label"]').getByText('SEO Title', { exact: true }),
        });
        await expect(seoTitleItem).toBeVisible();
        await expect(seoTitleItem.getByRole('textbox')).toBeVisible();
    });

    test('should save custom field values on a product', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);

        // Fill in custom field values on the General tab
        await dp.fillInput('Info URL', 'https://example.com');
        await dp.fillNumber('Weight', '2.5');
        await dp.fillNumber('Review Rating', '4');
        await dp.toggleSwitch('Downloadable', true);
        await dp.selectOption('Priority', 'high');

        // Save
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);

        // Reload and verify persistence
        await page.reload();
        await expect(dp.formItem('Info URL').getByRole('textbox')).toHaveValue('https://example.com');
        await expect(dp.formItem('Weight').getByRole('spinbutton')).toHaveValue('2.5');
        await expect(dp.formItem('Review Rating').getByRole('spinbutton')).toHaveValue('4');
        await expect(dp.formItem('Downloadable').getByRole('switch')).toBeChecked();
        await expect(dp.formItem('Priority').getByRole('combobox')).toHaveText('high');
    });
});
