import { type Locator, type Page, expect } from '@playwright/test';

export class ProductListPage {
    readonly heading: Locator;
    readonly searchInput: Locator;
    readonly dataTable: Locator;
    readonly newProductButton: Locator;

    constructor(private page: Page) {
        this.heading = page.getByRole('heading', { name: 'Products' });
        this.searchInput = page.getByRole('searchbox');
        this.dataTable = page.locator('table');
        this.newProductButton = page.getByRole('link', { name: 'New Product' });
    }

    async goto() {
        await this.page.goto('/products');
    }

    async expectLoaded() {
        await expect(this.heading).toBeVisible();
        await expect(this.dataTable).toBeVisible();
    }

    getRows() {
        return this.dataTable.locator('tbody tr');
    }

    async clickProduct(name: string) {
        await this.page.getByRole('link', { name }).click();
    }

    async search(term: string) {
        await this.searchInput.fill(term);
        // Allow debounce + network request to settle
        await this.page.waitForTimeout(500);
    }
}
