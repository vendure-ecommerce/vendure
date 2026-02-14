import { expect, test } from '@playwright/test';

import { BaseListPage } from '../../page-objects/list-page.base.js';

// Orders use a multi-step draft flow rather than a single CRUD form.
// Each action (set customer, add line, set address, set shipping) is an
// individual mutation — there's no "Create" button. The "Complete draft"
// button finalizes the order once all requirements are met.

test.describe('Orders', () => {
    test.describe.configure({ mode: 'serial' });

    const listPage = (page: Parameters<Parameters<typeof test>[1]>[0]['page']) =>
        new BaseListPage(page, {
            path: '/orders',
            title: 'Orders',
            newButtonLabel: 'Draft order',
            newButtonRole: 'button',
        });

    test('should display the orders list page', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
    });

    test('should show "Draft order" button', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await expect(lp.newButton).toBeVisible();
    });

    test('should create, configure, and complete a draft order', async ({ page }) => {
        test.setTimeout(60_000); // Draft order flow involves multiple mutations

        // Step 1: Create a draft order from the list page
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.newButton.click();
        await expect(page).toHaveURL(/\/orders\/draft\//, { timeout: 10_000 });

        // Step 2: Set a customer — CustomerSelector uses Command/Popover
        await page.getByRole('button', { name: /Select customer/i }).click();
        await page.getByPlaceholder('Search customers...').fill('hayden');
        // CommandItems have role="option"; wait for search results to load
        await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 });
        await page.getByRole('option').first().click();
        // Wait for the set-customer mutation to complete and re-render
        await page.waitForTimeout(1000);

        // Step 3: Add a product variant — ProductVariantSelector uses Command/Popover
        // The button has role="combobox" but no aria-label, so we match by role + text content
        const addItemButton = page.locator('[role="combobox"]').filter({ hasText: 'Add item to order' });
        await addItemButton.scrollIntoViewIfNeeded();
        await addItemButton.click();
        await page.getByPlaceholder('Add item to order...').fill('laptop');
        await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5_000 });
        await page.getByRole('option').first().click();
        // Wait for add-line mutation — the combobox should close
        await page.waitForTimeout(1000);

        // Step 4: Set shipping address — CustomerAddressSelector uses Popover with Card elements
        // There are two "Select address" buttons (shipping + billing); target the first one
        await page
            .getByRole('button', { name: /Select address/i })
            .first()
            .click();
        // Address cards are plain divs in the popover — click the first one
        await page.locator('[data-slot="popover-content"]').locator('[data-slot="card"]').first().click();
        // Wait for set-address mutation
        await page.waitForTimeout(1000);

        // Step 5: Select a shipping method — inline cards (not a popover)
        // Shipping methods appear after address is set; wait for them
        // Use exact text match to avoid ambiguity with the outer wrapper card
        const shippingLabel = page.getByText('Standard Shipping', { exact: true });
        await shippingLabel.scrollIntoViewIfNeeded();
        await expect(shippingLabel).toBeVisible({ timeout: 5_000 });
        await shippingLabel.click();
        // Wait for set-shipping-method mutation
        await page.waitForTimeout(1000);

        // Step 6: Complete the draft order
        const completeDraftButton = page.getByRole('button', { name: /Complete draft/i });
        await completeDraftButton.scrollIntoViewIfNeeded();
        await expect(completeDraftButton).toBeEnabled({ timeout: 5_000 });
        await completeDraftButton.click();
        // After completion, navigates to the regular order detail page
        await expect(page).toHaveURL(/\/orders\/[^/]+$/, { timeout: 10_000 });
        await expect(page).not.toHaveURL(/\/draft\//);
    });

    test('should show the completed order in the list', async ({ page }) => {
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.expectRowCountGreaterThan(0);
    });

    test('should create and delete a draft order', async ({ page }) => {
        // Create a new draft
        const lp = listPage(page);
        await lp.goto();
        await lp.expectLoaded();
        await lp.newButton.click();
        await expect(page).toHaveURL(/\/orders\/draft\//, { timeout: 10_000 });

        // Delete the draft without configuring it
        await page.getByRole('button', { name: /Delete draft/i }).click();
        // Confirm the deletion dialog — AlertDialog uses "Continue" as the action button
        await page.locator('[role="alertdialog"]').getByRole('button', { name: 'Continue' }).click();
        // Should navigate back to the orders list (URL may include query params)
        await expect(page).not.toHaveURL(/\/draft\//, { timeout: 15_000 });
        await expect(page.getByRole('heading', { level: 1, name: 'Orders' })).toBeVisible();
    });
});
