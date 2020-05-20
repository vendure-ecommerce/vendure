import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ConfigService } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { TestPluginWithAllLifecycleHooks } from './fixtures/test-plugins/with-all-lifecycle-hooks';
import { TestAPIExtensionPlugin } from './fixtures/test-plugins/with-api-extensions';
import { TestPluginWithConfigAndBootstrap } from './fixtures/test-plugins/with-config-and-bootstrap';
import { TestLazyExtensionPlugin } from './fixtures/test-plugins/with-lazy-api-extensions';
import { TestPluginWithProvider } from './fixtures/test-plugins/with-provider';
import { TestRestPlugin } from './fixtures/test-plugins/with-rest-controller';
import { TestProcessContextPlugin } from './fixtures/test-plugins/with-worker-controller';

describe('Plugins', () => {
    const bootstrapMockFn = jest.fn();
    const onConstructorFn = jest.fn();
    const beforeBootstrapFn = jest.fn();
    const beforeWorkerBootstrapFn = jest.fn();
    const onBootstrapFn = jest.fn();
    const onWorkerBootstrapFn = jest.fn();
    const onCloseFn = jest.fn();
    const onWorkerCloseFn = jest.fn();

    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        plugins: [
            TestPluginWithAllLifecycleHooks.init(
                onConstructorFn,
                beforeBootstrapFn,
                beforeWorkerBootstrapFn,
                onBootstrapFn,
                onWorkerBootstrapFn,
                onCloseFn,
                onWorkerCloseFn,
            ),
            TestPluginWithConfigAndBootstrap.setup(bootstrapMockFn),
            TestAPIExtensionPlugin,
            TestPluginWithProvider,
            TestLazyExtensionPlugin,
            TestRestPlugin,
            TestProcessContextPlugin,
        ],
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('constructs one instance for each process', () => {
        expect(onConstructorFn).toHaveBeenCalledTimes(2);
    });

    it('calls beforeVendureBootstrap', () => {
        expect(beforeBootstrapFn).toHaveBeenCalledTimes(1);
        expect(beforeBootstrapFn).toHaveBeenCalledWith(server.app);
    });

    it('calls beforeVendureWorkerBootstrap', () => {
        expect(beforeWorkerBootstrapFn).toHaveBeenCalledTimes(1);
        expect(beforeWorkerBootstrapFn).toHaveBeenCalledWith(server.worker);
    });

    it('calls onVendureBootstrap', () => {
        expect(onBootstrapFn).toHaveBeenCalledTimes(1);
    });

    it('calls onWorkerVendureBootstrap', () => {
        expect(onWorkerBootstrapFn).toHaveBeenCalledTimes(1);
    });

    it('can modify the config in configure()', () => {
        expect(bootstrapMockFn).toHaveBeenCalledTimes(1);
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

    describe('REST plugins', () => {
        const restControllerUrl = `http://localhost:${testConfig.apiOptions.port}/test`;

        it('public route', async () => {
            const response = await shopClient.fetch(restControllerUrl + '/public');
            const body = await response.text();

            expect(body).toBe('success');
        });

        it('permission-restricted route forbidden', async () => {
            const response = await shopClient.fetch(restControllerUrl + '/restricted');
            expect(response.status).toBe(403);
            const result = await response.json();
            expect(result.message).toContain('FORBIDDEN');
        });

        it('permission-restricted route forbidden allowed', async () => {
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            const response = await shopClient.fetch(restControllerUrl + '/restricted');
            expect(response.status).toBe(200);
            const result = await response.text();
            expect(result).toBe('success');
        });

        it('handling I18nErrors', async () => {
            const response = await shopClient.fetch(restControllerUrl + '/bad');
            expect(response.status).toBe(500);
            const result = await response.json();
            expect(result.message).toContain('uh oh!');
        });
    });

    describe('processContext', () => {
        it('server context', async () => {
            const response = await shopClient.fetch(
                `http://localhost:${testConfig.apiOptions.port}/process-context/server`,
            );
            const body = await response.text();

            expect(body).toBe('true');
        });
        it('worker context', async () => {
            const response = await shopClient.fetch(
                `http://localhost:${testConfig.apiOptions.port}/process-context/worker`,
            );
            const body = await response.text();

            expect(body).toBe('true');
        });
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
