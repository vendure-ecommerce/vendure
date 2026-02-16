import { expect, test } from '@playwright/test';

// Global Settings is a single detail page (not a list) with:
// - Available languages (LanguageSelector)
// - Global out of stock threshold (NumberInput)
// - Track inventory by default (Switch)

test.describe('Global Settings', () => {
    test('should display the global settings page', async ({ page }) => {
        await page.goto('/global-settings');
        await expect(page.getByRole('heading', { level: 1, name: 'Global Settings' })).toBeVisible();
    });

    test('should show the settings form fields', async ({ page }) => {
        await page.goto('/global-settings');
        await expect(page.getByRole('heading', { level: 1, name: 'Global Settings' })).toBeVisible();
        await expect(page.getByText('Available languages')).toBeVisible();
        await expect(page.getByText('Global out of stock threshold')).toBeVisible();
        await expect(page.getByText('Track inventory by default')).toBeVisible();
    });

    test('should have an Update button', async ({ page }) => {
        await page.goto('/global-settings');
        await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
    });
});
