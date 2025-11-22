import { DefaultLogger, LogLevel, mergeConfig, Permission } from '@vendure/core';
import { createTestEnvironment, SimpleGraphQLClient } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    dashboardSavedViewsPermission,
    SettingsStoreRwPermissionsPlugin,
} from './fixtures/test-plugins/settings-store-rw-permissions-plugin';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { createAdministratorDocument, createRoleDocument } from './graphql/shared-definitions';

const GET_SETTINGS_STORE_VALUE = gql`
    query GetSettingsStoreValue($key: String!) {
        getSettingsStoreValue(key: $key)
    }
`;

const SET_SETTINGS_STORE_VALUE = gql`
    mutation SetSettingsStoreValue($input: SettingsStoreInput!) {
        setSettingsStoreValue(input: $input) {
            key
            result
            error
        }
    }
`;

describe('Settings Store Read/Write Permissions', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            logger: new DefaultLogger({ level: LogLevel.Warn }),
            plugins: [SettingsStoreRwPermissionsPlugin],
        }),
    );

    let readCatalogAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let updateCatalogAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let readWriteCatalogAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let customReadAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let customWriteAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let customReadWriteAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let readSettingsAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let updateSettingsAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];
    let authenticatedOnlyAdmin: Codegen.CreateAdministratorMutation['createAdministrator'];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        // Create admins with different permission sets
        readCatalogAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'ReadCatalog',
            permissions: [Permission.ReadCatalog],
        });

        updateCatalogAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'UpdateCatalog',
            permissions: [Permission.UpdateCatalog],
        });

        readWriteCatalogAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'ReadWriteCatalog',
            permissions: [Permission.ReadCatalog, Permission.UpdateCatalog],
        });

        // Create admins with custom RwPermissionDefinition permissions
        customReadAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'CustomRead',
            permissions: ['ReadDashboardSavedViews'],
        });

        customWriteAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'CustomWrite',
            permissions: ['WriteDashboardSavedViews'],
        });

        customReadWriteAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'CustomReadWrite',
            permissions: ['ReadDashboardSavedViews', 'WriteDashboardSavedViews'],
        });

        readSettingsAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'ReadSettings',
            permissions: [Permission.ReadSettings],
        });

        updateSettingsAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'UpdateSettings',
            permissions: [Permission.UpdateSettings],
        });

        authenticatedOnlyAdmin = await createAdminWithPermissions({
            adminClient,
            name: 'AuthenticatedOnly',
            permissions: [Permission.Authenticated],
        });

        // Set up initial test data as super admin
        await adminClient.asSuperAdmin();
        await adminClient.query(SET_SETTINGS_STORE_VALUE, {
            input: { key: 'rwtest.separateReadWrite', value: 'initial-separate-value' },
        });
        await adminClient.query(SET_SETTINGS_STORE_VALUE, {
            input: { key: 'rwtest.dashboardSavedViews', value: { viewName: 'Test View', filters: [] } },
        });
        await adminClient.query(SET_SETTINGS_STORE_VALUE, {
            input: { key: 'rwtest.multipleReadPermissions', value: 'multi-read-value' },
        });
        await adminClient.query(SET_SETTINGS_STORE_VALUE, {
            input: { key: 'rwtest.backwardCompatible', value: 'backward-compatible-value' },
        });
        await adminClient.query(SET_SETTINGS_STORE_VALUE, {
            input: { key: 'rwtest.publicRead', value: 'public-read-value' },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Separate read/write permissions (object syntax)', () => {
        it('user with read permission can read but not write', async () => {
            await adminClient.asUserWithCredentials(readCatalogAdmin.emailAddress, 'test');

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.separateReadWrite',
            });
            expect(getSettingsStoreValue).toBe('initial-separate-value');

            // Should not be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.separateReadWrite',
                    value: 'test-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('user with write permission can write but not read', async () => {
            await adminClient.asUserWithCredentials(updateCatalogAdmin.emailAddress, 'test');

            // Should not be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.separateReadWrite',
            });
            expect(getSettingsStoreValue).toBeNull();

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.separateReadWrite',
                    value: 'write-only-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);
            expect(setSettingsStoreValue.error).toBeNull();
        });

        it('user with both permissions can read and write', async () => {
            await adminClient.asUserWithCredentials(readWriteCatalogAdmin.emailAddress, 'test');

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.separateReadWrite',
                    value: 'read-write-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.separateReadWrite',
            });
            expect(getSettingsStoreValue).toBe('read-write-value');
        });
    });

    describe('Custom RwPermissionDefinition', () => {
        it('user with custom read permission can only read', async () => {
            await adminClient.asUserWithCredentials(customReadAdmin.emailAddress, 'test');

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.dashboardSavedViews',
            });
            expect(getSettingsStoreValue).toEqual({ viewName: 'Test View', filters: [] });

            // Should not be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.dashboardSavedViews',
                    value: { viewName: 'Modified View', filters: [] },
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('user with custom write permission can only write', async () => {
            await adminClient.asUserWithCredentials(customWriteAdmin.emailAddress, 'test');

            // Should not be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.dashboardSavedViews',
            });
            expect(getSettingsStoreValue).toBeNull();

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.dashboardSavedViews',
                    value: { viewName: 'Write-Only View', filters: [] },
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);
        });

        it('user with both custom permissions can read and write', async () => {
            await adminClient.asUserWithCredentials(customReadWriteAdmin.emailAddress, 'test');

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.dashboardSavedViews',
                    value: { viewName: 'Custom RW View', filters: ['filter1'] },
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.dashboardSavedViews',
            });
            expect(getSettingsStoreValue).toEqual({ viewName: 'Custom RW View', filters: ['filter1'] });
        });

        it('user without custom permissions cannot access', async () => {
            await adminClient.asUserWithCredentials(authenticatedOnlyAdmin.emailAddress, 'test');

            // Should not be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.dashboardSavedViews',
            });
            expect(getSettingsStoreValue).toBeNull();

            // Should not be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.dashboardSavedViews',
                    value: { viewName: 'Unauthorized View', filters: [] },
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('demonstrates that RwPermissionDefinition generates correct permission names', () => {
            // This test documents how to use the new RwPermissionDefinition
            expect(dashboardSavedViewsPermission.Read).toBe('ReadDashboardSavedViews');
            expect(dashboardSavedViewsPermission.Write).toBe('WriteDashboardSavedViews');
        });
    });

    describe('Multiple read permissions (OR logic)', () => {
        it('user with one of the read permissions can read', async () => {
            await adminClient.asUserWithCredentials(readSettingsAdmin.emailAddress, 'test');

            // Can read with ReadSettings permission (one of the allowed)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.multipleReadPermissions',
            });
            expect(getSettingsStoreValue).toBe('multi-read-value');

            // Cannot write (needs UpdateSettings)
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.multipleReadPermissions',
                    value: 'unauthorized-write',
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('user with the other read permission can also read', async () => {
            await adminClient.asUserWithCredentials(readCatalogAdmin.emailAddress, 'test');

            // Can read with ReadCatalog permission (the other allowed)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.multipleReadPermissions',
            });
            expect(getSettingsStoreValue).toBe('multi-read-value');
        });

        it('user with write permission can write', async () => {
            await adminClient.asUserWithCredentials(updateSettingsAdmin.emailAddress, 'test');

            // Should not be able to read (doesn't have ReadCatalog or ReadSettings)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.multipleReadPermissions',
            });
            expect(getSettingsStoreValue).toBeNull();

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.multipleReadPermissions',
                    value: 'write-authorized-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);
        });
    });

    describe('Backward compatibility', () => {
        it('user without required permission cannot read or write', async () => {
            await adminClient.asUserWithCredentials(readCatalogAdmin.emailAddress, 'test');

            // Cannot read (needs UpdateSettings)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.backwardCompatible',
            });
            expect(getSettingsStoreValue).toBeNull();

            // Cannot write (needs UpdateSettings)
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.backwardCompatible',
                    value: 'unauthorized-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('user with required permission can read and write', async () => {
            await adminClient.asUserWithCredentials(updateSettingsAdmin.emailAddress, 'test');

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.backwardCompatible',
            });
            expect(getSettingsStoreValue).toBe('backward-compatible-value');

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.backwardCompatible',
                    value: 'authorized-backward-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);
        });
    });

    describe('Public read with restricted write', () => {
        it('authenticated user can read but not write', async () => {
            await adminClient.asUserWithCredentials(authenticatedOnlyAdmin.emailAddress, 'test');

            // Should be able to read (only requires Authenticated)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.publicRead',
            });
            expect(getSettingsStoreValue).toBe('public-read-value');

            // Should not be able to write (requires CreateAdministrator)
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.publicRead',
                    value: 'unauthorized-public-write',
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('permissions');
        });

        it('super admin can write', async () => {
            await adminClient.asSuperAdmin();

            // Should be able to write
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.publicRead',
                    value: 'super-admin-write-value',
                },
            });
            expect(setSettingsStoreValue.result).toBe(true);
        });
    });

    describe('Read-only fields with permissions', () => {
        it('read-only field prevents writes even with correct permissions', async () => {
            await adminClient.asUserWithCredentials(readSettingsAdmin.emailAddress, 'test');

            // Should be able to read
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.readOnlyAccess',
            });
            expect(getSettingsStoreValue).toBeNull(); // No initial value set for this field

            // Should fail to write because field is readonly
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.readOnlyAccess',
                    value: 'readonly-attempt',
                },
            });
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('readonly');
        });

        it('user without read permission cannot read readonly field', async () => {
            await adminClient.asUserWithCredentials(authenticatedOnlyAdmin.emailAddress, 'test');

            // Should not be able to read (needs ReadSettings)
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.readOnlyAccess',
            });
            expect(getSettingsStoreValue).toBeNull();
        });
    });
});

async function createAdminWithPermissions(input: {
    adminClient: SimpleGraphQLClient;
    name: string;
    permissions: Array<Permission | string>;
}) {
    const { adminClient, name, permissions } = input;

    // All permissions are standard - use the typed mutation
    const { createRole } = await adminClient.query<
        Codegen.CreateRoleMutation,
        Codegen.CreateRoleMutationVariables
    >(createRoleDocument, {
        input: {
            code: name,
            description: name,
            permissions: permissions as Permission[],
        },
    });

    const { createAdministrator } = await adminClient.query<
        Codegen.CreateAdministratorMutation,
        Codegen.CreateAdministratorMutationVariables
    >(createAdministratorDocument, {
        input: {
            firstName: name,
            lastName: 'LastName',
            emailAddress: `${name}@test.com`,
            roleIds: [createRole.id],
            password: 'test',
        },
    });
    return createAdministrator;
}
