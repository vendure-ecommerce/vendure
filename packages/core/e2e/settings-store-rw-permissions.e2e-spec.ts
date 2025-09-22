import { DefaultLogger, LogLevel, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    dashboardSavedViewsPermission,
    SettingsStoreRwPermissionsPlugin,
} from './fixtures/test-plugins/settings-store-rw-permissions-plugin';

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

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('Separate read/write permissions (object syntax)', () => {
        it('supports object syntax for read/write permissions', async () => {
            // Set initial value as super admin
            await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.separateReadWrite',
                    value: 'initial-value',
                },
            });

            // Get the value back
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.separateReadWrite',
            });
            expect(getSettingsStoreValue).toBe('initial-value');
        });

        it('supports custom RwPermissionDefinition', async () => {
            // Set initial value as super admin
            await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.dashboardSavedViews',
                    value: { viewName: 'My Dashboard', filters: [] },
                },
            });

            // Get the value back
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.dashboardSavedViews',
            });
            expect(getSettingsStoreValue).toEqual({ viewName: 'My Dashboard', filters: [] });
        });

        it('supports multiple read permissions', async () => {
            // Set initial value as super admin
            await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.multipleReadPermissions',
                    value: 'multi-read-value',
                },
            });

            // Get the value back
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.multipleReadPermissions',
            });
            expect(getSettingsStoreValue).toBe('multi-read-value');
        });

        it('supports read-only access pattern', async () => {
            // Set initial value as super admin (should work)
            const { setSettingsStoreValue } = await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.readOnlyAccess',
                    value: 'readonly-value',
                },
            });

            // Should fail because field is marked as readonly
            expect(setSettingsStoreValue.result).toBe(false);
            expect(setSettingsStoreValue.error).toContain('readonly');
        });

        it('supports public read with restricted write', async () => {
            // Set initial value as super admin
            await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.publicRead',
                    value: 'public-read-value',
                },
            });

            // Get the value back
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.publicRead',
            });
            expect(getSettingsStoreValue).toBe('public-read-value');
        });
    });

    describe('Backward compatibility', () => {
        it('still supports simple permission syntax', async () => {
            // Set initial value as super admin
            await adminClient.query(SET_SETTINGS_STORE_VALUE, {
                input: {
                    key: 'rwtest.backwardCompatible',
                    value: 'backward-compatible-value',
                },
            });

            // Get the value back
            const { getSettingsStoreValue } = await adminClient.query(GET_SETTINGS_STORE_VALUE, {
                key: 'rwtest.backwardCompatible',
            });
            expect(getSettingsStoreValue).toBe('backward-compatible-value');
        });
    });

    describe('Type safety and documentation', () => {
        it('demonstrates the RwPermissionDefinition usage', () => {
            // This test documents how to use the new RwPermissionDefinition
            expect(dashboardSavedViewsPermission.Read).toBe('ReadDashboardSavedViews');
            expect(dashboardSavedViewsPermission.Write).toBe('WriteDashboardSavedViews');
        });
    });
});
