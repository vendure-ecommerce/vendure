import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { GLOBAL_SETTINGS_FRAGMENT } from './graphql/fragments';
import {
    GetGlobalSettings,
    GlobalSettingsFragment,
    LanguageCode,
    UpdateGlobalSettings,
} from './graphql/generated-e2e-admin-types';
import { UPDATE_GLOBAL_SETTINGS } from './graphql/shared-definitions';

describe('GlobalSettings resolver', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        ...{
            customFields: {
                Customer: [{ name: 'age', type: 'int' }],
            },
        },
    });
    let globalSettings: GlobalSettingsFragment;

    const globalSettingsGuard: ErrorResultGuard<GlobalSettingsFragment> = createErrorResultGuard<
        GlobalSettingsFragment
    >(input => !!input.availableLanguages);

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetGlobalSettings.Query>(GET_GLOBAL_SETTINGS);
        globalSettings = result.globalSettings;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('globalSettings query', () => {
        it('includes basic settings', () => {
            expect(globalSettings.availableLanguages).toEqual([LanguageCode.en]);
            expect(globalSettings.trackInventory).toBe(false);
        });

        it('includes orderProcess', () => {
            expect(globalSettings.serverConfig.orderProcess[0]).toEqual({
                name: 'Created',
                to: ['AddingItems'],
            });
        });

        it('includes permittedAssetTypes', () => {
            expect(globalSettings.serverConfig.permittedAssetTypes).toEqual([
                'image/*',
                'video/*',
                'audio/*',
                '.pdf',
            ]);
        });

        it('includes customFieldConfig', () => {
            expect(globalSettings.serverConfig.customFieldConfig.Customer).toEqual([{ name: 'age' }]);
        });

        it('includes non-internal permission definitions', () => {
            const permissionNames = globalSettings.serverConfig.permissions.map(p => p.name);
            expect(permissionNames).toContain('CreateAdministrator');
            expect(permissionNames).not.toContain('SuperAdmin');
            expect(permissionNames).not.toContain('Owner');
            expect(permissionNames).not.toContain('Authenticated');
        });
    });

    describe('update', () => {
        it('returns error result when removing required language', async () => {
            const { updateGlobalSettings } = await adminClient.query<
                UpdateGlobalSettings.Mutation,
                UpdateGlobalSettings.Variables
            >(UPDATE_GLOBAL_SETTINGS, {
                input: {
                    availableLanguages: [LanguageCode.zh],
                },
            });
            globalSettingsGuard.assertErrorResult(updateGlobalSettings);

            expect(updateGlobalSettings.message).toBe(
                'Cannot make language "en" unavailable as it is used as the defaultLanguage by the channel "__default_channel__"',
            );
        });

        it('successful update', async () => {
            const { updateGlobalSettings } = await adminClient.query<
                UpdateGlobalSettings.Mutation,
                UpdateGlobalSettings.Variables
            >(UPDATE_GLOBAL_SETTINGS, {
                input: {
                    availableLanguages: [LanguageCode.en, LanguageCode.zh],
                    trackInventory: true,
                },
            });
            globalSettingsGuard.assertSuccess(updateGlobalSettings);

            expect(updateGlobalSettings.availableLanguages).toEqual([LanguageCode.en, LanguageCode.zh]);
            expect(updateGlobalSettings.trackInventory).toBe(true);
        });
    });
});

const GET_GLOBAL_SETTINGS = gql`
    query GetGlobalSettings {
        globalSettings {
            ...GlobalSettings
        }
    }
    ${GLOBAL_SETTINGS_FRAGMENT}
`;
