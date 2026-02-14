import { type Page, expect, test } from '@playwright/test';

import { BaseDetailPage } from '../../page-objects/detail-page.base.js';

// Regression: https://github.com/vendurehq/vendure/issues/4327
//
// When adding multiple collection filters of the same type (e.g. two "Filter by
// product variant name"), the input fields are incorrectly synchronized. Changing
// values in one filter causes all filters with the same code to update.

test.describe('Issue #4327: Collection filters with same type share state', () => {
    const detailPage = (page: Page) =>
        new BaseDetailPage(page, {
            newPath: '/collections/new',
            pathPrefix: '/collections/',
            newTitle: 'New collection',
        });

    test.fixme('should maintain independent state for two filters of the same type', async ({ page }) => {
        const dp = detailPage(page);
        await dp.gotoNew();
        await dp.expectNewPageLoaded();

        await dp.fillInput('Name', 'Filter State Test Collection');
        await expect(dp.formItem('Slug').getByRole('textbox')).not.toHaveValue('', { timeout: 5_000 });

        // Add first "Filter by product variant name" filter
        await page.getByRole('button', { name: /Add collection filter/i }).click();
        await page.getByRole('menuitem', { name: /Filter by product variant name/i }).click();

        // Fill the first filter's term
        const termInputs = page.locator('[data-slot="form-item"]').filter({
            has: page.getByText('Term', { exact: true }),
        });
        await termInputs.first().getByRole('textbox').fill('shirt');

        // Add second "Filter by product variant name" filter
        await page.getByRole('button', { name: /Add collection filter/i }).click();
        await page.getByRole('menuitem', { name: /Filter by product variant name/i }).click();

        // Fill the second filter's term with a DIFFERENT value
        // After adding the second filter, there should be two "Term" inputs
        const allTermInputs = page.locator('[data-slot="form-item"]').filter({
            has: page.getByText('Term', { exact: true }),
        });
        await allTermInputs.last().getByRole('textbox').fill('pants');

        // Verify the first filter's term is still "shirt" (not overwritten by "pants")
        await expect(allTermInputs.first().getByRole('textbox')).toHaveValue('shirt');
        // Verify the second filter's term is "pants"
        await expect(allTermInputs.last().getByRole('textbox')).toHaveValue('pants');
    });
});
