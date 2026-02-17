import { expect, test } from '@playwright/test';

// Health Checks page displays system health status from the /health endpoint.
// Shows "Current status" and "Monitored Resources" cards.

test.describe('Health Checks', () => {
    test('should display the health checks page', async ({ page }) => {
        await page.goto('/healthchecks');
        await expect(page.getByRole('heading', { level: 1, name: 'Health checks' })).toBeVisible();
    });

    test('should show the current status card', async ({ page }) => {
        await page.goto('/healthchecks');
        await expect(page.getByText('Current status')).toBeVisible();
    });

    test('should show a healthy status', async ({ page }) => {
        await page.goto('/healthchecks');
        await expect(page.getByText('All resources are up and running')).toBeVisible({ timeout: 10_000 });
    });

    test('should show monitored resources', async ({ page }) => {
        await page.goto('/healthchecks');
        await expect(page.getByText('Monitored Resources')).toBeVisible();
        await expect(page.getByText('database')).toBeVisible({ timeout: 10_000 });
    });
});
