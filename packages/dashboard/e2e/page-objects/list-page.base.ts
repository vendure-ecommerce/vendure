import { type Locator, type Page, expect } from '@playwright/test';

export interface ListPageConfig {
    /** URL path, e.g. '/tax-categories' */
    path: string;
    /** Page heading text, e.g. 'Tax Categories' */
    title: string;
    /** "New" button label, e.g. 'New Tax Category' */
    newButtonLabel: string;
}

/**
 * Base page object for all ListPage-based views in the dashboard.
 *
 * Every list screen uses the same `ListPage` component under the hood,
 * so the DOM structure is identical: heading, search input, data table,
 * "New" link button, row checkboxes, and "With selected..." bulk actions.
 */
export class BaseListPage {
    readonly heading: Locator;
    readonly searchInput: Locator;
    readonly dataTable: Locator;
    readonly newButton: Locator;

    constructor(
        protected page: Page,
        protected config: ListPageConfig,
    ) {
        this.heading = page.getByRole('heading', { name: config.title });
        this.searchInput = page.getByPlaceholder('Filter...');
        this.dataTable = page.locator('table');
        this.newButton = page.getByRole('link', { name: config.newButtonLabel });
    }

    async goto() {
        await this.page.goto(this.config.path);
    }

    async expectLoaded() {
        await expect(this.heading).toBeVisible();
        await expect(this.dataTable).toBeVisible();
    }

    getRows() {
        return this.dataTable.locator('tbody tr');
    }

    /** Click the first link in a row matching `name` to navigate to its detail page. */
    async clickEntity(name: string) {
        await this.page.getByRole('link', { name }).first().click();
    }

    async clickNewButton() {
        await this.newButton.click();
    }

    async search(term: string) {
        await this.searchInput.fill(term);
        // The list debounces search input; wait for the request to settle.
        await this.page.waitForTimeout(500);
    }

    async clearSearch() {
        await this.searchInput.clear();
        await this.page.waitForTimeout(500);
    }

    /**
     * Select one or more rows by clicking their checkboxes.
     * Pass 0-based row indices, or 'all' to select via the header checkbox.
     */
    async selectRows(indices: number[] | 'all') {
        if (indices === 'all') {
            // The header checkbox is in the first <th> of the <thead>
            await this.dataTable.locator('thead th').first().getByRole('checkbox').click();
        } else {
            for (const i of indices) {
                await this.getRows().nth(i).getByRole('checkbox').click();
            }
        }
    }

    /** Open the bulk actions dropdown and click "Delete", then confirm. */
    async bulkDelete(indices: number[] | 'all') {
        await this.selectRows(indices);
        // Open "With selected..." dropdown
        await this.page.getByRole('button', { name: /With selected/i }).click();
        // Click "Delete" in the dropdown
        await this.page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();
        // Confirm in the AlertDialog
        await this.page.locator('[role="alertdialog"]').getByRole('button', { name: 'Continue' }).click();
    }

    /** Open the row-level action menu (ellipsis) for a specific row index, then click "Delete" and confirm. */
    async deleteRowByIndex(rowIndex: number) {
        const row = this.getRows().nth(rowIndex);
        // The ellipsis trigger is the last button in the row
        await row.locator('button').last().click();
        await this.page.getByRole('menuitem').filter({ hasText: 'Delete' }).click();
        // Confirm in the AlertDialog — the row-level dialog button says "Delete"
        await this.page.locator('[role="alertdialog"]').getByRole('button', { name: 'Delete' }).click();
    }

    async expectRowCount(count: number) {
        await expect(this.getRows()).toHaveCount(count);
    }

    async expectRowCountGreaterThan(min: number) {
        expect(await this.getRows().count()).toBeGreaterThan(min);
    }

    /** Wait for the success toast (any type — some entities use toast.success, some use toast). */
    async expectSuccessToast() {
        // Wait for a Sonner toast that is either type="success" or the default type
        await expect(
            this.page.locator('[data-sonner-toast]').filter({ hasNotText: /error/i }).first(),
        ).toBeVisible({ timeout: 10_000 });
    }
}
