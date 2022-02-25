import { INestApplication } from '@nestjs/common';
import { DefaultLogger, User } from '@vendure/core';
import { populate } from '@vendure/core/cli';
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { InitialData } from '../src/index';

import {
    ChannelFragment,
    CreateChannelMutation,
    CreateChannelMutationVariables,
    CurrencyCode,
    GetAssetListQuery,
    GetCollectionsQuery,
    GetProductListQuery,
    LanguageCode,
} from './graphql/generated-e2e-admin-types';
import {
    CREATE_CHANNEL,
    GET_ASSET_LIST,
    GET_COLLECTIONS,
    GET_PRODUCT_LIST,
} from './graphql/shared-definitions';

describe('populate() function', () => {
    let channel2: ChannelFragment;
    const { server, adminClient } = createTestEnvironment({
        ...testConfig(),
        // logger: new DefaultLogger(),
        customFields: {
            Product: [
                { type: 'string', name: 'pageType' },
                {
                    name: 'owner',
                    public: true,
                    nullable: true,
                    type: 'relation',
                    entity: User,
                    eager: true,
                },
                {
                    name: 'keywords',
                    public: true,
                    nullable: true,
                    type: 'string',
                    list: true,
                },
                {
                    name: 'localName',
                    type: 'localeString',
                },
            ],
            ProductVariant: [{ type: 'int', name: 'weight' }],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData: { ...initialData, collections: [] },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        const { createChannel } = await adminClient.query<
            CreateChannelMutation,
            CreateChannelMutationVariables
        >(CREATE_CHANNEL, {
            input: {
                code: 'Channel 2',
                token: 'channel-2',
                currencyCode: CurrencyCode.EUR,
                defaultLanguageCode: LanguageCode.en,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_2',
                pricesIncludeTax: true,
            },
        });
        channel2 = createChannel as ChannelFragment;
        await server.destroy();
    }, TEST_SETUP_TIMEOUT_MS);

    describe('populating default channel', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const initialDataForPopulate: InitialData = {
                defaultLanguage: initialData.defaultLanguage,
                defaultZone: initialData.defaultZone,
                taxRates: [],
                shippingMethods: [],
                paymentMethods: [],
                countries: [],
                collections: [{ name: 'Collection 1', filters: [] }],
            };
            const csvFile = path.join(__dirname, 'fixtures', 'product-import.csv');
            app = await populate(
                async () => {
                    await server.bootstrap();
                    return server.app;
                },
                initialDataForPopulate,
                csvFile,
            );
        }, TEST_SETUP_TIMEOUT_MS);

        afterAll(async () => {
            await app.close();
        });

        it('populates products', async () => {
            await adminClient.asSuperAdmin();
            const { products } = await adminClient.query<GetProductListQuery>(GET_PRODUCT_LIST);
            expect(products.totalItems).toBe(4);
            expect(products.items.map(i => i.name).sort()).toEqual([
                'Artists Smock',
                'Giotto Mega Pencils',
                'Mabef M/02 Studio Easel',
                'Perfect Paper Stretcher',
            ]);
        });

        it('populates assets', async () => {
            const { assets } = await adminClient.query<GetAssetListQuery>(GET_ASSET_LIST);
            expect(assets.items.map(i => i.name).sort()).toEqual([
                'box-of-12.jpg',
                'box-of-8.jpg',
                'pps1.jpg',
                'pps2.jpg',
            ]);
        });

        it('populates collections', async () => {
            const { collections } = await adminClient.query<GetCollectionsQuery>(GET_COLLECTIONS);
            expect(collections.items.map(i => i.name).sort()).toEqual(['Collection 1']);
        });
    });

    describe('populating a non-default channel', () => {
        let app: INestApplication;
        beforeAll(async () => {
            const initialDataForPopulate: InitialData = {
                defaultLanguage: initialData.defaultLanguage,
                defaultZone: initialData.defaultZone,
                taxRates: [],
                shippingMethods: [],
                paymentMethods: [],
                countries: [],
                collections: [{ name: 'Collection 2', filters: [] }],
            };
            const csvFile = path.join(__dirname, 'fixtures', 'product-import-channel.csv');

            app = await populate(
                async () => {
                    await server.bootstrap();
                    return server.app;
                },
                initialDataForPopulate,
                csvFile,
                channel2.token,
            );
        });

        afterAll(async () => {
            await app.close();
        });

        it('populates products', async () => {
            await adminClient.asSuperAdmin();
            await adminClient.setChannelToken(channel2.token);
            const { products } = await adminClient.query<GetProductListQuery>(GET_PRODUCT_LIST);
            expect(products.totalItems).toBe(1);
            expect(products.items.map(i => i.name).sort()).toEqual(['Model Hand']);
        });

        it('populates assets', async () => {
            const { assets } = await adminClient.query<GetAssetListQuery>(GET_ASSET_LIST);
            expect(assets.items.map(i => i.name).sort()).toEqual(['vincent-botta-736919-unsplash.jpg']);
        });

        it('populates collections', async () => {
            const { collections } = await adminClient.query<GetCollectionsQuery>(GET_COLLECTIONS);
            expect(collections.items.map(i => i.name).sort()).toEqual(['Collection 2']);
        });

        it('product also assigned to default channel', async () => {
            await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { products } = await adminClient.query<GetProductListQuery>(GET_PRODUCT_LIST);
            expect(products.totalItems).toBe(1);
            expect(products.items.map(i => i.name).sort()).toEqual(['Model Hand']);
        });
    });
});
