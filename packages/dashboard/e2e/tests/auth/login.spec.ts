import { expect, test } from '@playwright/test';

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

// #5623 — after a logout, the next user's navigation should match their permissions without a reload
test.describe('Switching user', () => {
    test('shows the navigation of a user whose role is on another channel', async ({ page, browser }) => {
        const suffix = Date.now();
        const superAdminEmailAddress = `switch-superadmin-${suffix}@test.com`;
        const emailAddress = `switch-user-${suffix}@test.com`;
        const password = 'test-password';
        const client = new VendureAdminClient(page);
        await client.login();
        // Logging out ends all sessions of a User, so a separate SuperAdmin is logged out
        // instead of the one which the other tests use
        const { roles } = await client.gql(
            `query { roles(options: { filter: { code: { eq: "__super_admin_role__" } } }) { items { id } } }`,
        );
        await client.gql(
            `mutation ($input: CreateAdministratorInput!) { createAdministrator(input: $input) { id } }`,
            {
                input: {
                    firstName: 'Switch',
                    lastName: 'SuperAdmin',
                    emailAddress: superAdminEmailAddress,
                    password,
                    roleIds: [roles.items[0].id],
                },
            },
        );
        const { createChannel } = await client.gql(
            `mutation ($input: CreateChannelInput!) { createChannel(input: $input) { ... on Channel { id } } }`,
            {
                input: {
                    code: `switch-user-${suffix}`,
                    token: `switch-user-${suffix}`,
                    defaultLanguageCode: 'en',
                    currencyCode: 'USD',
                    pricesIncludeTax: false,
                    defaultShippingZoneId: '1',
                    defaultTaxZoneId: '1',
                },
            },
        );
        const { createRole } = await client.gql(
            `mutation ($input: CreateRoleInput!) { createRole(input: $input) { id } }`,
            {
                input: {
                    code: `switch-user-${suffix}`,
                    description: 'Catalog access on another channel',
                    permissions: ['ReadCatalog'],
                    channelIds: [createChannel.id],
                },
            },
        );
        await client.gql(
            `mutation ($input: CreateAdministratorInput!) { createAdministrator(input: $input) { id } }`,
            {
                input: {
                    firstName: 'Switch',
                    lastName: 'User',
                    emailAddress,
                    password,
                    roleIds: [createRole.id],
                },
            },
        );

        // A fresh browser context, so that the page is not signed in as the SuperAdmin
        const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
        const userPage = await context.newPage();
        const loginPage = new LoginPage(userPage);
        await loginPage.goto();
        await loginPage.login(superAdminEmailAddress, password);
        await expect(userPage).not.toHaveURL(/\/login/, { timeout: 15_000 });

        await userPage.locator('[data-sidebar="footer"] [data-sidebar="menu-button"]').last().click();
        await userPage.getByRole('menuitem', { name: 'Log out' }).click();
        await loginPage.expectVisible();
        await loginPage.login(emailAddress, password);
        await expect(userPage).not.toHaveURL(/\/login/, { timeout: 15_000 });

        await expect(
            userPage.locator('[data-sidebar="menu-button"]').filter({ hasText: 'Catalog' }),
        ).toBeVisible({
            timeout: 10_000,
        });
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
