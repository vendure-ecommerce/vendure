/* tslint:disable:no-non-null-assertion */
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { dataDir, TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './fixtures/e2e-initial-data';
import {
    CreateAdministrator,
    CreateChannel,
    CreateRole,
    CurrencyCode,
    LanguageCode,
    Me,
    Permission,
} from './graphql/generated-e2e-admin-types';
import { CREATE_ADMINISTRATOR, CREATE_CHANNEL, CREATE_ROLE, ME } from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Channels', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    let secondChannelAdminRole: CreateRole.CreateRole;

    beforeAll(async () => {
        await server.init({
            dataDir,
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create a new Channel', async () => {
        const { createChannel } = await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(
            CREATE_CHANNEL,
            {
                input: {
                    code: 'second-channel',
                    token: SECOND_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            },
        );

        expect(createChannel).toEqual({
            id: 'T_2',
            code: 'second-channel',
            token: SECOND_CHANNEL_TOKEN,
            currencyCode: 'GBP',
            defaultLanguageCode: 'en',
            defaultShippingZone: {
                id: 'T_1',
            },
            defaultTaxZone: {
                id: 'T_1',
            },
            pricesIncludeTax: true,
        });
    });

    it('superadmin has all permissions on new channel', async () => {
        const { me } = await adminClient.query<Me.Query>(ME);

        expect(me!.channels.length).toBe(2);

        const secondChannelData = me!.channels.find(c => c.token === SECOND_CHANNEL_TOKEN);
        const nonOwnerPermissions = Object.values(Permission).filter(p => p !== Permission.Owner);
        expect(secondChannelData!.permissions).toEqual(nonOwnerPermissions);
    });

    it('createRole on second Channel', async () => {
        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
                input: {
                    description: 'second channel admin',
                    code: 'second-channel-admin',
                    channelIds: ['T_2'],
                    permissions: [
                        Permission.ReadCatalog,
                        Permission.ReadSettings,
                        Permission.ReadAdministrator,
                        Permission.CreateAdministrator,
                        Permission.UpdateAdministrator,
                    ],
                },
            },
        );

        expect(createRole.channels).toEqual([
            {
                id: 'T_2',
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
            },
        ]);

        secondChannelAdminRole = createRole;
    });

    it('createAdministrator with second-channel-admin role', async () => {
        const { createAdministrator } = await adminClient.query<
            CreateAdministrator.Mutation,
            CreateAdministrator.Variables
        >(CREATE_ADMINISTRATOR, {
            input: {
                firstName: 'Admin',
                lastName: 'Two',
                emailAddress: 'admin2@test.com',
                password: 'test',
                roleIds: [secondChannelAdminRole.id],
            },
        });

        expect(createAdministrator.user.roles.map(r => r.description)).toEqual(['second channel admin']);
    });

    it(
        'cannot create role on channel for which admin does not have CreateAdministrator permission',
        assertThrowsWithMessage(async () => {
            await adminClient.asUserWithCredentials('admin2@test.com', 'test');
            await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(CREATE_ROLE, {
                input: {
                    description: 'read default channel catalog',
                    code: 'read default channel catalog',
                    channelIds: ['T_1'],
                    permissions: [Permission.ReadCatalog],
                },
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it('can create role on channel for which admin has CreateAdministrator permission', async () => {
        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
                input: {
                    description: 'read second channel catalog',
                    code: 'read-second-channel-catalog',
                    channelIds: ['T_2'],
                    permissions: [Permission.ReadCatalog],
                },
            },
        );

        expect(createRole.channels).toEqual([
            {
                id: 'T_2',
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
            },
        ]);
    });

    it('createRole with no channelId implicitly uses active channel', async () => {
        const { createRole } = await adminClient.query<CreateRole.Mutation, CreateRole.Variables>(
            CREATE_ROLE,
            {
                input: {
                    description: 'update second channel catalog',
                    code: 'update-second-channel-catalog',
                    permissions: [Permission.UpdateCatalog],
                },
            },
        );

        expect(createRole.channels).toEqual([
            {
                id: 'T_2',
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
            },
        ]);
    });
});
