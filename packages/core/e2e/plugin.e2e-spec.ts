import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ConfigService } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { dataDir, TEST_SETUP_TIMEOUT_MS, testConfig } from './config/test-config';
import { initialData } from './fixtures/e2e-initial-data';
import {
    TestAPIExtensionPlugin,
    TestLazyExtensionPlugin,
    TestPluginWithAllLifecycleHooks,
    TestPluginWithConfigAndBootstrap,
    TestPluginWithProvider,
} from './fixtures/test-plugins';

describe('Plugins', () => {
    const bootstrapMockFn = jest.fn();
    const onBootstrapFn = jest.fn();
    const onWorkerBootstrapFn = jest.fn();
    const onCloseFn = jest.fn();
    const onWorkerCloseFn = jest.fn();

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [
            TestPluginWithAllLifecycleHooks.init(
                onBootstrapFn,
                onWorkerBootstrapFn,
                onCloseFn,
                onWorkerCloseFn,
            ),
            TestPluginWithConfigAndBootstrap.setup(bootstrapMockFn),
            TestAPIExtensionPlugin,
            TestPluginWithProvider,
            TestLazyExtensionPlugin,
        ],
    });

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

    it('calls onVendureBootstrap', () => {
        expect(onBootstrapFn).toHaveBeenCalled();
    });

    it('calls onWorkerVendureBootstrap', () => {
        expect(onWorkerBootstrapFn).toHaveBeenCalled();
    });

    it('can modify the config in configure()', () => {
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

    it('allows lazy evaluation of API extension', async () => {
        const result = await shopClient.query(gql`
            query {
                lazy
            }
        `);
        expect(result.lazy).toEqual('sleeping');
    });

    it('generates ListQueryOptions for api extensions', async () => {
        const result = await adminClient.query(gql`
            query {
                barList(options: { skip: 0, take: 1 }) {
                    items {
                        id
                        name
                    }
                    totalItems
                }
            }
        `);
        expect(result.barList).toEqual({
            items: [{ id: 'T_1', name: 'Test' }],
            totalItems: 1,
        });
    });

    it('DI works with defined providers', async () => {
        const result = await shopClient.query(gql`
            query {
                names
            }
        `);
        expect(result.names).toEqual(['seon', 'linda', 'hong']);
    });

    describe('on app close', () => {
        beforeAll(async () => {
            await server.destroy();
        });

        it('calls onVendureClose', () => {
            expect(onCloseFn).toHaveBeenCalled();
        });

        it('calls onWorkerVendureClose', () => {
            expect(onWorkerCloseFn).toHaveBeenCalled();
        });
    });
});
