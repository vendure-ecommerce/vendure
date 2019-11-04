/* tslint:disable:no-non-null-assertion */
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { dataDir, TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './fixtures/e2e-initial-data';
import {
    CreateChannel,
    CurrencyCode,
    LanguageCode,
    Me,
    Permission,
} from './graphql/generated-e2e-admin-types';
import { ME } from './graphql/shared-definitions';

describe('Channels', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);
    const SECOND_CHANNEL_TOKEN = 'second_channel_token';

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

        const secondChannelData = me!.channels.find(c => c.token === SECOND_CHANNEL_TOKEN);
        const nonOwnerPermissions = Object.values(Permission).filter(p => p !== Permission.Owner);
        expect(secondChannelData!.permissions).toEqual(nonOwnerPermissions);
    });
});

const CREATE_CHANNEL = gql`
    mutation CreateChannel($input: CreateChannelInput!) {
        createChannel(input: $input) {
            id
            code
            token
            currencyCode
            defaultLanguageCode
            defaultShippingZone {
                id
            }
            defaultTaxZone {
                id
            }
            pricesIncludeTax
        }
    }
`;
