/* tslint:disable:no-non-null-assertion */
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannel,
    CreateAdministrator,
    CreateChannel,
    CreateRole,
    CurrencyCode,
    DeleteChannel,
    DeletionResult,
    GetChannels,
    GetCustomerList,
    GetProductWithVariants,
    LanguageCode,
    Me,
    Permission,
    RemoveProductsFromChannel,
    UpdateChannel,
    UpdateGlobalSettings,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_ADMINISTRATOR,
    CREATE_CHANNEL,
    CREATE_ROLE,
    GET_CUSTOMER_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    ME,
    REMOVE_PRODUCT_FROM_CHANNEL,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Channels', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';
    const THIRD_CHANNEL_TOKEN = 'third_channel_token';
    let secondChannelAdminRole: CreateRole.CreateRole;
    let customerUser: GetCustomerList.Items;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        const { customers } = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: { take: 1 },
            },
        );
        customerUser = customers.items[0];
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

        const secondChannelData = me!.channels.find((c) => c.token === SECOND_CHANNEL_TOKEN);
        const nonOwnerPermissions = Object.values(Permission).filter((p) => p !== Permission.Owner);
        expect(secondChannelData!.permissions).toEqual(nonOwnerPermissions);
    });

    it('customer has Authenticated permission on new channel', async () => {
        await shopClient.asUserWithCredentials(customerUser.emailAddress, 'test');
        const { me } = await shopClient.query<Me.Query>(ME);

        expect(me!.channels.length).toBe(2);

        const secondChannelData = me!.channels.find((c) => c.token === SECOND_CHANNEL_TOKEN);
        expect(me!.channels).toEqual([
            {
                code: DEFAULT_CHANNEL_CODE,
                permissions: ['Authenticated'],
                token: E2E_DEFAULT_CHANNEL_TOKEN,
            },
            {
                code: 'second-channel',
                permissions: ['Authenticated'],
                token: SECOND_CHANNEL_TOKEN,
            },
        ]);
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

        expect(createAdministrator.user.roles.map((r) => r.description)).toEqual(['second channel admin']);
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

    describe('assigning Product to Channels', () => {
        let product1: GetProductWithVariants.Product;

        beforeAll(async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(CREATE_CHANNEL, {
                input: {
                    code: 'third-channel',
                    token: THIRD_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });
            product1 = product!;
        });

        it(
            'throws if attempting to assign Product to channel to which the admin has no access',
            assertThrowsWithMessage(async () => {
                await adminClient.asUserWithCredentials('admin2@test.com', 'test');
                await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
                    ASSIGN_PRODUCT_TO_CHANNEL,
                    {
                        input: {
                            channelId: 'T_3',
                            productIds: [product1.id],
                        },
                    },
                );
            }, 'You are not currently authorized to perform this action'),
        );

        it('assigns Product to Channel and applies price factor', async () => {
            const PRICE_FACTOR = 0.5;
            await adminClient.asSuperAdmin();
            const { assignProductsToChannel } = await adminClient.query<
                AssignProductsToChannel.Mutation,
                AssignProductsToChannel.Variables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                    priceFactor: PRICE_FACTOR,
                },
            });

            expect(assignProductsToChannel[0].channels.map((c) => c.id).sort()).toEqual(['T_1', 'T_2']);
            await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: product1.id,
            });

            expect(product!.variants.map((v) => v.price)).toEqual(
                product1.variants.map((v) => v.price * PRICE_FACTOR),
            );
            // Second Channel is configured to include taxes in price, so they should be the same.
            expect(product!.variants.map((v) => v.priceWithTax)).toEqual(
                product1.variants.map((v) => v.price * PRICE_FACTOR),
            );
        });

        it('does not assign Product to same channel twice', async () => {
            const { assignProductsToChannel } = await adminClient.query<
                AssignProductsToChannel.Mutation,
                AssignProductsToChannel.Variables
            >(ASSIGN_PRODUCT_TO_CHANNEL, {
                input: {
                    channelId: 'T_2',
                    productIds: [product1.id],
                },
            });

            expect(assignProductsToChannel[0].channels.map((c) => c.id).sort()).toEqual(['T_1', 'T_2']);
        });

        it(
            'throws if attempting to remove Product from default Channel',
            assertThrowsWithMessage(async () => {
                await adminClient.query<
                    RemoveProductsFromChannel.Mutation,
                    RemoveProductsFromChannel.Variables
                >(REMOVE_PRODUCT_FROM_CHANNEL, {
                    input: {
                        productIds: [product1.id],
                        channelId: 'T_1',
                    },
                });
            }, 'Products cannot be removed from the default Channel'),
        );

        it('removes Product from Channel', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeProductsFromChannel } = await adminClient.query<
                RemoveProductsFromChannel.Mutation,
                RemoveProductsFromChannel.Variables
            >(REMOVE_PRODUCT_FROM_CHANNEL, {
                input: {
                    productIds: [product1.id],
                    channelId: 'T_2',
                },
            });

            expect(removeProductsFromChannel[0].channels.map((c) => c.id)).toEqual(['T_1']);
        });
    });

    describe('setting defaultLanguage', () => {
        it(
            'throws if languageCode not in availableLanguages',
            assertThrowsWithMessage(async () => {
                await adminClient.query<UpdateChannel.Mutation, UpdateChannel.Variables>(UPDATE_CHANNEL, {
                    input: {
                        id: 'T_1',
                        defaultLanguageCode: LanguageCode.zh,
                    },
                });
            }, 'Language "zh" is not available. First enable it via GlobalSettings and try again.'),
        );

        it('allows setting to an available language', async () => {
            await adminClient.query<UpdateGlobalSettings.Mutation, UpdateGlobalSettings.Variables>(
                UPDATE_GLOBAL_SETTINGS,
                {
                    input: {
                        availableLanguages: [LanguageCode.en, LanguageCode.zh],
                    },
                },
            );

            const { updateChannel } = await adminClient.query<
                UpdateChannel.Mutation,
                UpdateChannel.Variables
            >(UPDATE_CHANNEL, {
                input: {
                    id: 'T_1',
                    defaultLanguageCode: LanguageCode.zh,
                },
            });

            expect(updateChannel.defaultLanguageCode).toBe(LanguageCode.zh);
        });

        it(
            'attempting to remove availableLanguage when used by a Channel throws',
            assertThrowsWithMessage(async () => {
                await adminClient.query<UpdateGlobalSettings.Mutation, UpdateGlobalSettings.Variables>(
                    UPDATE_GLOBAL_SETTINGS,
                    {
                        input: {
                            availableLanguages: [LanguageCode.en],
                        },
                    },
                );
            }, 'Cannot remove make language "zh" unavailable as it is used as the defaultLanguage by the channel "__default_channel__"'),
        );
    });

    it('deleteChannel', async () => {
        const PROD_ID = 'T_1';

        const { assignProductsToChannel } = await adminClient.query<
            AssignProductsToChannel.Mutation,
            AssignProductsToChannel.Variables
        >(ASSIGN_PRODUCT_TO_CHANNEL, {
            input: {
                channelId: 'T_2',
                productIds: [PROD_ID],
            },
        });
        expect(assignProductsToChannel[0].channels.map((c) => c.id).sort()).toEqual(['T_1', 'T_2']);

        const { deleteChannel } = await adminClient.query<DeleteChannel.Mutation, DeleteChannel.Variables>(
            DELETE_CHANNEL,
            {
                id: 'T_2',
            },
        );

        expect(deleteChannel.result).toBe(DeletionResult.DELETED);

        const { channels } = await adminClient.query<GetChannels.Query>(GET_CHANNELS);
        expect(channels.map((c) => c.id).sort()).toEqual(['T_1', 'T_3']);

        const { product } = await adminClient.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: PROD_ID,
        });
        expect(product!.channels.map((c) => c.id)).toEqual(['T_1']);
    });
});

const GET_CHANNELS = gql`
    query GetChannels {
        channels {
            id
            code
            token
        }
    }
`;

const UPDATE_CHANNEL = gql`
    mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            id
            code
            defaultLanguageCode
            currencyCode
        }
    }
`;

const DELETE_CHANNEL = gql`
    mutation DeleteChannel($id: ID!) {
        deleteChannel(id: $id) {
            message
            result
        }
    }
`;

const UPDATE_GLOBAL_SETTINGS = gql`
    mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
        updateGlobalSettings(input: $input) {
            id
            availableLanguages
        }
    }
`;
