import { type Browser, expect, test } from '@playwright/test';

import { LoginPage } from '../../page-objects/login-page.js';
import { VendureAdminClient } from '../../utils/vendure-admin-client.js';

// These tests need a clean browser with no saved auth state
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
    test('should display the login form', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.expectVisible();
    });

    test('should login with valid credentials and redirect to home', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('superadmin', 'superadmin');
        await expect(page).not.toHaveURL(/\/login/);
    });

    test('should show error with invalid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('bad@email.com', 'wrongpassword');
        await loginPage.expectError();
    });

    test('should redirect to login when accessing protected route unauthenticated', async ({ page }) => {
        await page.goto('/products');
        await expect(page).toHaveURL(/\/login/);
    });
});

// #5617 — an administrator without access to any channel cannot use the Dashboard
test.describe('Administrator without access to any channel', () => {
    const password = 'test-password';

    async function createAdministrator(client: VendureAdminClient, channelIds?: string[]) {
        const suffix = `${Date.now()}-${Math.round(Math.random() * 1000)}`;
        const emailAddress = `no-channel-${suffix}@test.com`;
        const { createRole } = await client.gql(
            `mutation ($input: CreateRoleInput!) { createRole(input: $input) { id } }`,
            {
                input: {
                    code: `no-channel-${suffix}`,
                    description: 'Role for an administrator without channels',
                    permissions: ['ReadCatalog'],
                    channelIds,
                },
            },
        );
        await client.gql(
            `mutation ($input: CreateAdministratorInput!) { createAdministrator(input: $input) { id } }`,
            {
                input: {
                    firstName: 'No',
                    lastName: 'Channel',
                    emailAddress,
                    password,
                    roleIds: [createRole.id],
                },
            },
        );
        return { emailAddress, roleId: createRole.id as string };
    }

    // A fresh browser context, so that the page is not signed in as the SuperAdmin
    async function newLoginPage(browser: Browser) {
        const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
        const page = await context.newPage();
        return { context, page, loginPage: new LoginPage(page) };
    }

    test('shows an error and the login form after logging in', async ({ page, browser }) => {
        const client = new VendureAdminClient(page);
        await client.login();
        const { emailAddress } = await createAdministrator(client, []);

        const { context, page: adminPage, loginPage } = await newLoginPage(browser);
        await loginPage.goto();
        await loginPage.login(emailAddress, password);

        await expect(
            adminPage
                .locator('[data-sonner-toast]')
                .filter({ hasText: 'You do not have access to any channel' }),
        ).toBeVisible({ timeout: 10_000 });
        await loginPage.expectVisible();

        // The session was ended, so a reload still shows the login form
        await adminPage.reload();
        await loginPage.expectVisible();
        await context.close();
    });

    test('shows the login form after a reload when access to all channels was removed', async ({
        page,
        browser,
    }) => {
        const client = new VendureAdminClient(page);
        await client.login();
        const { emailAddress, roleId } = await createAdministrator(client);

        const { context, page: adminPage, loginPage } = await newLoginPage(browser);
        await loginPage.goto();
        await loginPage.login(emailAddress, password);
        await expect(adminPage).not.toHaveURL(/\/login/, { timeout: 15_000 });

        await client.gql(`mutation ($input: UpdateRoleInput!) { updateRole(input: $input) { id } }`, {
            input: { id: roleId, channelIds: [] },
        });
        await adminPage.reload();

        await expect(
            adminPage
                .locator('[data-sonner-toast]')
                .filter({ hasText: 'You do not have access to any channel' }),
        ).toBeVisible({ timeout: 10_000 });
        await loginPage.expectVisible();
        await context.close();
    });

    test('does not report missing channel access when the current user cannot be loaded', async ({
        browser,
    }) => {
        const { context, page: adminPage, loginPage } = await newLoginPage(browser);
        // Fail the first current-user request after the login, as a network error would
        let loginSent = false;
        let failedRefetch = false;
        await adminPage.route('**/admin-api**', async route => {
            const operation = route.request().postDataJSON()?.query ?? '';
            if (operation.includes('mutation Login')) {
                loginSent = true;
            } else if (loginSent && !failedRefetch && operation.includes('query CurrentUserInformation')) {
                failedRefetch = true;
                return route.abort();
            }
            return route.continue();
        });
        await loginPage.goto();
        await loginPage.login('superadmin', 'superadmin');

        await expect(adminPage).not.toHaveURL(/\/login/, { timeout: 15_000 });
        expect(failedRefetch).toBe(true);
        await expect(
            adminPage
                .locator('[data-sonner-toast]')
                .filter({ hasText: 'You do not have access to any channel' }),
        ).toHaveCount(0);
        await context.close();
    });
});

// #1116 — administrators should be able to reset a forgotten password
test.describe('Password reset', () => {
    test('login page links to the forgot password page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await page.getByRole('link', { name: 'Forgot password?' }).click();
        await expect(page).toHaveURL(/\/forgot-password/);
    });

    test('forgot password form shows confirmation after submitting', async ({ page }) => {
        await page.goto('/forgot-password');
        await page.getByPlaceholder('Email').fill('unknown-admin@test.com');
        await page.getByRole('button', { name: 'Send reset link' }).click();
        // A confirmation is shown regardless of whether the email address exists,
        // to avoid leaking which accounts exist
        await expect(page.getByText('Check your email')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Back to sign in' })).toBeVisible();
    });

    test('reset password page without a token shows invalid link message', async ({ page }) => {
        await page.goto('/reset-password');
        await expect(page.getByText('This link is invalid or has expired')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Request a new link' })).toBeVisible();
    });

    test('reset password shows error when passwords do not match', async ({ page }) => {
        await page.goto('/reset-password?token=some-token');
        await page.getByPlaceholder('New password', { exact: true }).fill('new-password-123');
        await page.getByPlaceholder('Confirm new password').fill('different-password');
        await page.getByRole('button', { name: 'Reset password' }).click();
        await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('reset password with an invalid token shows invalid link message', async ({ page }) => {
        await page.goto('/reset-password?token=invalid-token');
        await page.getByPlaceholder('New password', { exact: true }).fill('new-password-123');
        await page.getByPlaceholder('Confirm new password').fill('new-password-123');
        await page.getByRole('button', { name: 'Reset password' }).click();
        await expect(page.getByText('This link is invalid or has expired')).toBeVisible();
    });
});
