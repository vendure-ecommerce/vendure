import { type Locator, expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';
import { BaseListPage } from '../../page-objects/list-page.base.js';

// Custom fields are configured in global-setup.ts on the Product entity.
// This suite verifies rendering of all custom field types: scalar, list, struct,
// list-of-struct, and list-inside-struct. Tests cover tabs, display/edit modes,
// and persistence after save.
//
// IMPORTANT: All tests share a single "Laptop" product, so the outer describe
// must be serial to prevent concurrent mutations.

type Page = Parameters<Parameters<typeof test>[1]>[0]['page'];

const listPage = (page: Page) =>
    new BaseListPage(page, {
        path: '/products',
        title: 'Products',
        newButtonLabel: 'New Product',
    });

const detailPage = (page: Page) =>
    new BaseDetailPage(page, {
        newPath: '/products/new',
        pathPrefix: '/products/',
        newTitle: 'New product',
    });

/** Navigate to the first seeded product's detail page. */
async function goToFirstProduct(page: Page) {
    const lp = listPage(page);
    await lp.goto();
    await lp.expectLoaded();
    await lp.search('Laptop');
    await lp.clickEntity('Laptop');
    await expect(page).toHaveURL(/\/products\/[^/]+$/);
}

/**
 * Locate a form-item by label within a scoped container (e.g. inside a struct).
 * Same logic as BaseDetailPage.formItem but scoped to a parent locator.
 */
function scopedFormItem(container: Locator, page: Page, label: string): Locator {
    return container.locator('[data-slot="form-item"]').filter({
        has: page.locator('[data-slot="form-label"]').getByText(label, { exact: true }),
    });
}

test.describe('Custom Fields', () => {
    test.describe.configure({ mode: 'serial' });

    // ─── Scalar field types ──────────────────────────────────────────────

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

    // ─── Tab grouping ────────────────────────────────────────────────────

    test('should display custom field tabs', async ({ page }) => {
        await goToFirstProduct(page);

        const tabList = page.locator('[data-slot="tabs-list"]');
        await expect(tabList).toBeVisible();

        // Verify all tab triggers are present
        for (const tabName of ['General', 'SEO', 'Details', 'Lists', 'Struct']) {
            await expect(page.locator('[data-slot="tabs-trigger"]', { hasText: tabName })).toBeVisible();
        }

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

        const seoTitleItem = page.locator('[data-slot="form-item"]').filter({
            has: page.locator('[data-slot="form-label"]').getByText('SEO Title', { exact: true }),
        });
        await expect(seoTitleItem).toBeVisible();
        await expect(seoTitleItem.getByRole('textbox')).toBeVisible();
    });

    // ─── Scalar save & persist ───────────────────────────────────────────

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

    // ─── String list (tag-style input) ───────────────────────────────────

    test('should render a string list field with tag input', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Lists' }).click();

        const tagsField = detailPage(page).formItem('Tags');
        await expect(tagsField).toBeVisible();

        // StringListInput renders a text input with "Type and press Enter" placeholder
        await expect(tagsField.getByRole('textbox')).toBeVisible();
    });

    test('should add and remove tags via Enter key', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Lists' }).click();

        const tagsField = detailPage(page).formItem('Tags');
        const tagInput = tagsField.getByRole('textbox');

        // Add two tags by typing + Enter
        await tagInput.fill('electronics');
        await tagInput.press('Enter');
        await tagInput.fill('sale');
        await tagInput.press('Enter');

        // Tags should appear as badge elements
        await expect(tagsField.getByText('electronics')).toBeVisible();
        await expect(tagsField.getByText('sale')).toBeVisible();

        // Remove "electronics" via its remove button (aria-label "Remove electronics")
        await tagsField.getByLabel('Remove electronics').click();
        await expect(tagsField.getByText('electronics')).not.toBeVisible();
        await expect(tagsField.getByText('sale')).toBeVisible();
    });

    test('should save and persist tag list values', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Lists' }).click();

        const tagsField = dp.formItem('Tags');
        const tagInput = tagsField.getByRole('textbox');

        // Add three tags
        await tagInput.fill('premium');
        await tagInput.press('Enter');
        await tagInput.fill('featured');
        await tagInput.press('Enter');
        await tagInput.fill('new-arrival');
        await tagInput.press('Enter');

        // Save
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);

        // Reload and verify
        await page.reload();
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Lists' }).click();
        const reloadedTags = dp.formItem('Tags');
        await expect(reloadedTags.getByText('premium')).toBeVisible();
        await expect(reloadedTags.getByText('featured')).toBeVisible();
        await expect(reloadedTags.getByText('new-arrival')).toBeVisible();
    });

    // ─── Struct (single) ─────────────────────────────────────────────────

    test('should render a struct field in display mode', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const specField = detailPage(page).formItem('Specifications');
        await expect(specField).toBeVisible();

        // Display mode shows a definition list with dt/dd pairs for each struct field
        await expect(specField.locator('dt').getByText('Material')).toBeVisible();
        await expect(specField.locator('dt').getByText('Height')).toBeVisible();
        await expect(specField.locator('dt').getByText('Recyclable')).toBeVisible();
        await expect(specField.locator('dt').getByText('Certifications')).toBeVisible();

        // Edit button (pencil icon with sr-only "Edit" text) should be visible
        await expect(specField.getByRole('button', { name: 'Edit' })).toBeVisible();
    });

    test('should switch to edit mode and show form inputs', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const specField = detailPage(page).formItem('Specifications');
        await specField.getByRole('button', { name: 'Edit' }).click();

        // Edit mode should show form inputs for each struct sub-field
        const materialField = scopedFormItem(specField, page, 'Material');
        await expect(materialField.getByRole('textbox')).toBeVisible();

        const heightField = scopedFormItem(specField, page, 'Height');
        await expect(heightField.locator('input[type="number"]')).toBeVisible();

        const recyclableField = scopedFormItem(specField, page, 'Recyclable');
        await expect(recyclableField.getByRole('switch')).toBeVisible();

        // "Certifications" is list: true inside the struct → shows "Add item"
        const certsField = scopedFormItem(specField, page, 'Certifications');
        await expect(certsField.getByRole('button', { name: /Add item/i })).toBeVisible();

        // Done button should be visible
        await expect(specField.getByRole('button', { name: 'Done' })).toBeVisible();
    });

    test('should fill struct values and switch back to display mode', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const specField = detailPage(page).formItem('Specifications');
        await specField.getByRole('button', { name: 'Edit' }).click();

        // Fill in struct fields
        await scopedFormItem(specField, page, 'Material').getByRole('textbox').fill('Aluminium');
        await scopedFormItem(specField, page, 'Height').locator('input[type="number"]').fill('15.5');
        await scopedFormItem(specField, page, 'Recyclable').getByRole('switch').click();

        // Click Done to return to display mode
        await specField.getByRole('button', { name: 'Done' }).click();

        // Display mode should now show the entered values
        const ddElements = specField.locator('dd');
        await expect(ddElements.filter({ hasText: 'Aluminium' })).toBeVisible();
        await expect(ddElements.filter({ hasText: '15.5' })).toBeVisible();
    });

    test('should save struct values and persist after reload', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const specField = dp.formItem('Specifications');
        await specField.getByRole('button', { name: 'Edit' }).click();

        await scopedFormItem(specField, page, 'Material').getByRole('textbox').fill('Steel');
        await scopedFormItem(specField, page, 'Height').locator('input[type="number"]').fill('20');
        await scopedFormItem(specField, page, 'Recyclable').getByRole('switch').click();

        await specField.getByRole('button', { name: 'Done' }).click();

        // Save
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);

        // Reload and verify
        await page.reload();
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const reloadedSpec = dp.formItem('Specifications');
        const ddElements = reloadedSpec.locator('dd');
        await expect(ddElements.filter({ hasText: 'Steel' })).toBeVisible();
        await expect(ddElements.filter({ hasText: '20' })).toBeVisible();
    });

    // ─── List inside struct ──────────────────────────────────────────────

    test('should add items to a list field inside a struct', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const specField = dp.formItem('Specifications');
        await specField.getByRole('button', { name: 'Edit' }).click();

        // "Certifications" is list: true inside the struct
        const certsField = scopedFormItem(specField, page, 'Certifications');
        const addBtn = certsField.getByRole('button', { name: /Add item/i });

        // Add two certification items
        await addBtn.click();
        await addBtn.click();

        const inputs = certsField.getByRole('textbox');
        await expect(inputs).toHaveCount(2);

        await inputs.nth(0).fill('ISO-9001');
        await inputs.nth(1).fill('CE');

        // Switch to display mode — certifications should show as comma-joined string
        await specField.getByRole('button', { name: 'Done' }).click();
        await expect(specField.locator('dd').filter({ hasText: 'ISO-9001, CE' })).toBeVisible();

        // Save and verify persistence
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);

        await page.reload();
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const reloadedSpec = dp.formItem('Specifications');
        await expect(reloadedSpec.locator('dd').filter({ hasText: 'ISO-9001, CE' })).toBeVisible();
    });

    // ─── List of structs ─────────────────────────────────────────────────

    test('should render a struct list field with an "Add item" button', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const dimField = detailPage(page).formItem('Dimensions');
        await expect(dimField).toBeVisible();
        await expect(dimField.getByRole('button', { name: /Add item/i })).toBeVisible();
    });

    test('should add a struct item to the list and edit it', async ({ page }) => {
        await goToFirstProduct(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const dimField = detailPage(page).formItem('Dimensions');

        // Add a new struct item
        await dimField.getByRole('button', { name: /Add item/i }).click();

        // A new struct appears in display mode with dashes. Click Edit.
        await dimField.getByRole('button', { name: 'Edit' }).first().click();

        // Fill in the struct fields (only one struct is in edit mode → .first())
        await scopedFormItem(dimField, page, 'Dimension Name').getByRole('textbox').first().fill('Width');
        await scopedFormItem(dimField, page, 'Dimension Value')
            .locator('input[type="number"]')
            .first()
            .fill('30');
        await scopedFormItem(dimField, page, 'Dimension Unit').getByRole('textbox').first().fill('cm');

        // Done editing
        await dimField.getByRole('button', { name: 'Done' }).first().click();

        // Display mode should show the values
        await expect(dimField.locator('dd').filter({ hasText: 'Width' })).toBeVisible();
        await expect(dimField.locator('dd').filter({ hasText: '30' })).toBeVisible();
        await expect(dimField.locator('dd').filter({ hasText: 'cm' })).toBeVisible();
    });

    test('should save struct list and persist after reload', async ({ page }) => {
        await goToFirstProduct(page);
        const dp = detailPage(page);
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const dimField = dp.formItem('Dimensions');

        // Add first dimension
        await dimField.getByRole('button', { name: /Add item/i }).click();
        await dimField.getByRole('button', { name: 'Edit' }).first().click();
        await scopedFormItem(dimField, page, 'Dimension Name').getByRole('textbox').first().fill('Length');
        await scopedFormItem(dimField, page, 'Dimension Value')
            .locator('input[type="number"]')
            .first()
            .fill('50');
        await scopedFormItem(dimField, page, 'Dimension Unit').getByRole('textbox').first().fill('mm');
        await dimField.getByRole('button', { name: 'Done' }).first().click();

        // Add second dimension — first item is now in display mode
        await dimField.getByRole('button', { name: /Add item/i }).click();
        // The newly added struct's Edit button. The first Edit belongs to the
        // first item (display mode), the second to the new item.
        const editButtons = dimField.getByRole('button', { name: 'Edit' });
        await editButtons.nth(1).click();

        // Only the second struct is in edit mode, so form inputs appear once
        await scopedFormItem(dimField, page, 'Dimension Name').getByRole('textbox').first().fill('Depth');
        await scopedFormItem(dimField, page, 'Dimension Value')
            .locator('input[type="number"]')
            .first()
            .fill('10');
        await scopedFormItem(dimField, page, 'Dimension Unit').getByRole('textbox').first().fill('mm');
        await dimField.getByRole('button', { name: 'Done' }).first().click();

        // Save
        await dp.clickUpdate();
        await dp.expectSuccessToast(/Successfully updated product/);

        // Reload and verify both structs persisted
        await page.reload();
        await page.locator('[data-slot="tabs-trigger"]', { hasText: 'Struct' }).click();

        const reloadedDim = dp.formItem('Dimensions');
        await expect(reloadedDim.locator('dd').filter({ hasText: 'Length' })).toBeVisible();
        await expect(reloadedDim.locator('dd').filter({ hasText: '50' })).toBeVisible();
        await expect(reloadedDim.locator('dd').filter({ hasText: 'Depth' })).toBeVisible();
        await expect(reloadedDim.locator('dd').filter({ hasText: '10' })).toBeVisible();
    });
});
