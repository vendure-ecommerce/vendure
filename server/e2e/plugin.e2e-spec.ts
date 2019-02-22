import gql from 'graphql-tag';
import path from 'path';

import { LanguageCode } from '../../shared/generated-types';
import { ConfigService } from '../src/config/config.service';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import {
    TestAPIExtensionPlugin,
    TestPluginWithConfigAndBootstrap,
    TestPluginWithProvider,
} from './fixtures/test-plugins';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('Plugins', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();
    const bootstrapMockFn = jest.fn();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 1,
            },
            {
                plugins: [
                    new TestPluginWithConfigAndBootstrap(bootstrapMockFn),
                    new TestAPIExtensionPlugin(),
                    new TestPluginWithProvider(),
                ],
            },
        );
        await adminClient.init();
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('can modify the config in configure() and inject in onBootstrap()', () => {
        expect(bootstrapMockFn).toHaveBeenCalled();
        const configService: ConfigService = bootstrapMockFn.mock.calls[0][0];
        expect(configService instanceof ConfigService).toBe(true);
        expect(configService.defaultLanguageCode).toBe(LanguageCode.zh);
    });

    it('extends the admin API', async () => {
        const result = await adminClient.query(gql`
            query {
                foo
            }
        `);
        expect(result.foo).toEqual(['bar']);
    });

    it('extends the shop API', async () => {
        const result = await shopClient.query(gql`
            query {
                baz
            }
        `);
        expect(result.baz).toEqual(['quux']);
    });

    it('DI works with defined providers', async () => {
        const result = await shopClient.query(gql`
            query {
                names
            }
        `);
        expect(result.names).toEqual(['seon', 'linda', 'hong']);
    });
});
