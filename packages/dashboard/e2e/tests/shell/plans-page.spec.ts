import { expect, Page, test } from '@playwright/test';

const CATALOG_URL = 'https://api.vendure.io/v1/catalog';

const catalog = {
    offers: [
        {
            displayName: 'Starter',
            headlineCapabilities: [
                {
                    key: 'org.accounts',
                    name: 'Company Accounts',
                    description: 'Buyers share a company account with membership, roles and order history',
                },
            ],
        },
        {
            displayName: 'Growth',
            headlineCapabilities: [
                {
                    key: 'quote.requests',
                    name: 'Quote Requests',
                    description: 'Customers ask for a price quote before they buy',
                },
            ],
        },
    ],
};

async function openPlansPageFromUserMenu(page: Page) {
    await page.goto('/');
    await page.locator('[data-sidebar="footer"]').getByRole('button').first().click();
    await expect(page.getByRole('menuitem', { name: 'Explore Platform & Cloud' })).toHaveCount(0);
    await page.getByRole('menuitem', { name: 'Plans' }).click();
    await expect(page).toHaveURL(/\/plans$/);
}

// OSS-883 — the user menu opens the Plans page, which lists the public capability catalog
test.describe('Plans page', () => {
    test('lists the catalog capabilities as locked without a capabilities provider', async ({ page }) => {
        await page.route(CATALOG_URL, route =>
            route.fulfill({ json: catalog, headers: { 'access-control-allow-origin': '*' } }),
        );

        await openPlansPageFromUserMenu(page);

        const row = page.getByRole('row', { name: /Company Accounts/ });
        await expect(row).toContainText('Starter');
        await expect(row).toContainText('Locked');
        await expect(page.getByRole('row', { name: /Quote Requests/ })).toContainText('Locked');
        await expect(page.getByRole('link', { name: 'Open Vendure Console' })).toHaveAttribute(
            'href',
            'https://console.vendure.io/signup',
        );
    });

    test('shows a static message when the catalog is not reachable', async ({ page }) => {
        await page.route(CATALOG_URL, route => route.abort());

        await openPlansPageFromUserMenu(page);

        await expect(page.getByText('The capability catalog is not available')).toBeVisible();
        await expect(page.getByRole('table')).toHaveCount(0);
    });
});
