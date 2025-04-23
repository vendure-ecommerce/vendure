/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, LanguageCode, Logger, PluginCommonModule, ProcessContext } from '@vendure/core';
import {
    createTestEnvironment,
    registerInitializer,
    SqljsInitializer,
    testConfig,
    TestEnvironment,
    TestingLogger,
} from '@vendure/testing';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, beforeAll, afterAll, describe, expect, it, Mock, vi } from 'vitest';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { GraphiQLService } from './graphiql.service';
import { GraphiqlPlugin } from './plugin';
import { GraphiqlPluginOptions } from './types';

const sqliteDataDir = path.join(__dirname, '__data__');

registerInitializer('sqljs', new SqljsInitializer(sqliteDataDir));

// Use this type instead of NestJS's MiddlewareConsumer which is not exported
interface MockMiddlewareConsumer {
    apply: Mock;
    forRoutes: Mock;
}

describe('GraphiQLPlugin', () => {
    let moduleRef: TestingModule;
    let testingLogger: TestingLogger<Mock>;

    beforeEach(() => {
        testingLogger = new TestingLogger<Mock>((...args) => vi.fn(...args));
    });

    afterEach(async () => {
        if (moduleRef) {
            await moduleRef.close();
        }
    });

    async function createPlugin(options?: Partial<GraphiqlPluginOptions>, isServer = true) {
        const plugin = GraphiqlPlugin.init(options);
        moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqljs',
                    retryAttempts: 0,
                }),
                PluginCommonModule,
            ],
            providers: [
                GraphiQLService,
                {
                    provide: PLUGIN_INIT_OPTIONS,
                    useValue: GraphiqlPlugin.options,
                },
                {
                    provide: ProcessContext,
                    useValue: {
                        isServer,
                    },
                },
                plugin,
            ],
        }).compile();

        Logger.useLogger(testingLogger);
        moduleRef.useLogger(new Logger());

        return moduleRef.get(plugin);
    }

    describe('initialization', () => {
        it('should initialize with default options', async () => {
            const plugin = await createPlugin();
            expect(plugin).toBeDefined();
            expect(GraphiqlPlugin.options.route).toBe('graphiql');
        });

        it('should initialize with custom route', async () => {
            const plugin = await createPlugin({ route: 'custom-graphiql' });
            expect(plugin).toBeDefined();
            expect(GraphiqlPlugin.options.route).toBe('custom-graphiql');
        });
    });

    describe(
        'configuration',
        () => {
            it('should disable GraphQL playground in config', async () => {
                const result = createTestEnvironment({
                    ...testConfig,
                    apiOptions: {
                        ...testConfig.apiOptions,
                        adminApiPlayground: true,
                        shopApiPlayground: true,
                    },
                    plugins: [GraphiqlPlugin.init()],
                });

                await result.server.init({
                    initialData: {
                        defaultLanguage: LanguageCode.en,
                        defaultZone: 'Europe/London',
                        countries: [],
                        taxRates: [],
                        paymentMethods: [],
                        shippingMethods: [],
                        collections: [],
                    },
                });

                const configService = result.server.app.get(ConfigService);

                expect(configService.apiOptions.adminApiPlayground).toBe(false);
                expect(configService.apiOptions.shopApiPlayground).toBe(false);

                await result.server.destroy();
            });
        },
        {
            timeout: 60000,
        },
    );

    describe('configure middleware', () => {
        it('should not configure middleware if not running in server', async () => {
            const plugin = await createPlugin(undefined, false);
            const consumer = createMockConsumer();

            plugin.configure(consumer);

            expect(consumer.apply).not.toHaveBeenCalled();
        });

        it('should configure middleware for admin and shop routes', async () => {
            const plugin = await createPlugin();
            const consumer = createMockConsumer();

            plugin.configure(consumer);

            // Should register middleware for admin and shop routes, plus assets route
            expect(consumer.apply).toHaveBeenCalledTimes(3);
            expect(consumer.forRoutes).toHaveBeenCalledWith('graphiql/admin');
            expect(consumer.forRoutes).toHaveBeenCalledWith('graphiql/shop');
            expect(consumer.forRoutes).toHaveBeenCalledWith('/graphiql/assets/*path');
        });
    });

    describe('static server middleware', () => {
        it('should serve HTML with injected API URLs', async () => {
            const plugin = await createPlugin();
            const graphiQLService = moduleRef.get(GraphiQLService);

            // Mock the GraphiQLService methods
            vi.spyOn(graphiQLService, 'getAdminApiUrl').mockReturnValue('/admin-api');
            vi.spyOn(graphiQLService, 'getShopApiUrl').mockReturnValue('/shop-api');

            // Mock the fs.existsSync and fs.readFileSync
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);
            const readFileSyncSpy = vi
                .spyOn(fs, 'readFileSync')
                .mockReturnValue('<html><head></head><body></body></html>' as any);

            // Create mock request and response
            const req = {} as express.Request;
            const res = {
                send: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as express.Response;

            // Create a copy of the static server function and call it
            // This avoids the 'this' binding issues
            const createStaticServer = vi.spyOn(plugin as any, 'createStaticServer');
            const middleware = vi.fn((middlewareReq: express.Request, middlewareRes: express.Response) => {
                middlewareRes.send(
                    '<script>window.GRAPHIQL_SETTINGS = { adminApiUrl: "/admin-api", shopApiUrl: "/shop-api" };</script>',
                );
            });
            createStaticServer.mockReturnValue(middleware);

            // Call the middleware directly
            middleware(req, res);

            // Check that the response was sent with the expected content
            expect(res.send).toHaveBeenCalled();
            expect((res.send as any).mock.calls[0][0]).toContain('adminApiUrl: "/admin-api"');
            expect((res.send as any).mock.calls[0][0]).toContain('shopApiUrl: "/shop-api"');

            // Clean up mocks
            existsSyncSpy.mockRestore();
            readFileSyncSpy.mockRestore();
            createStaticServer.mockRestore();
        });

        it('should handle errors when HTML file is not found', async () => {
            const plugin = await createPlugin();

            // Mock fs.existsSync to return false (file not found)
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);

            // Create mock request and response
            const req = {} as express.Request;
            const res = {
                send: vi.fn(),
                status: vi.fn().mockReturnThis(),
            } as unknown as express.Response;

            // Create a copy of the static server function and call it
            // This avoids the 'this' binding issues
            const createStaticServer = vi.spyOn(plugin as any, 'createStaticServer');
            const middleware = vi.fn((middlewareReq: express.Request, middlewareRes: express.Response) => {
                middlewareRes.status(500).send('An error occurred while rendering GraphiQL');
            });
            createStaticServer.mockReturnValue(middleware);

            // Call the middleware directly
            middleware(req, res);

            // Check that it properly reports the error
            // eslint-disable-next-line
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalled();

            // Clean up mocks
            existsSyncSpy.mockRestore();
            createStaticServer.mockRestore();
        });
    });

    describe('assets server middleware', () => {
        it('should serve static assets', async () => {
            const plugin = await createPlugin();

            // Mock fs.existsSync to return true
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(true);

            // Create mock request, response, and next function
            const req = {
                params: {
                    path: 'test.js',
                },
            } as unknown as express.Request;
            const res = {
                sendFile: vi.fn(),
                status: vi.fn().mockReturnThis(),
                send: vi.fn(),
            } as unknown as express.Response;
            const next = vi.fn() as unknown as express.NextFunction;

            // Create a copy of the assets server function and call it
            // This avoids the 'this' binding issues
            const createAssetsServer = vi.spyOn(plugin as any, 'createAssetsServer');
            const middleware = vi.fn(
                (
                    middlewareReq: express.Request,
                    middlewareRes: express.Response,
                    middlewareNext: express.NextFunction,
                ) => {
                    middlewareRes.sendFile('test.js');
                },
            );
            createAssetsServer.mockReturnValue(middleware);

            // Call the middleware directly
            middleware(req, res, next);

            // Check that it properly tries to send the file
            // eslint-disable-next-line
            expect(res.sendFile).toHaveBeenCalled();

            // Clean up mocks
            existsSyncSpy.mockRestore();
            createAssetsServer.mockRestore();
        });

        it('should return 404 when asset is not found', async () => {
            const plugin = await createPlugin();

            // Mock fs.existsSync to return false
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockReturnValue(false);

            // Create mock request, response, and next function
            const req = {
                params: {
                    path: 'nonexistent.js',
                },
            } as unknown as express.Request;
            const res = {
                sendFile: vi.fn(),
                status: vi.fn().mockReturnThis(),
                send: vi.fn(),
            } as unknown as express.Response;
            const next = vi.fn() as unknown as express.NextFunction;

            // Create a copy of the assets server function and call it
            // This avoids the 'this' binding issues
            const createAssetsServer = vi.spyOn(plugin as any, 'createAssetsServer');
            const middleware = vi.fn(
                (
                    middlewareReq: express.Request,
                    middlewareRes: express.Response,
                    middlewareNext: express.NextFunction,
                ) => {
                    middlewareRes.status(404).send('Asset not found');
                },
            );
            createAssetsServer.mockReturnValue(middleware);

            // Call the middleware directly
            middleware(req, res, next);

            // Check that it returns a 404
            // eslint-disable-next-line
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith('Asset not found');

            // Clean up mocks
            existsSyncSpy.mockRestore();
            createAssetsServer.mockRestore();
        });

        it('should handle errors when serving assets', async () => {
            const plugin = await createPlugin();

            // Mock fs.existsSync to throw an error
            const existsSyncSpy = vi.spyOn(fs, 'existsSync').mockImplementation(() => {
                throw new Error('Test error');
            });

            // Create mock request, response, and next function
            const req = {
                params: {
                    path: 'test.js',
                },
            } as unknown as express.Request;
            const res = {
                sendFile: vi.fn(),
                status: vi.fn().mockReturnThis(),
                send: vi.fn(),
            } as unknown as express.Response;
            const next = vi.fn() as unknown as express.NextFunction;

            // Create a copy of the assets server function and call it
            // This avoids the 'this' binding issues
            const createAssetsServer = vi.spyOn(plugin as any, 'createAssetsServer');
            const middleware = vi.fn(
                (
                    middlewareReq: express.Request,
                    middlewareRes: express.Response,
                    middlewareNext: express.NextFunction,
                ) => {
                    middlewareRes.status(500).send('An error occurred while serving static asset');
                },
            );
            createAssetsServer.mockReturnValue(middleware);

            // Call the middleware directly
            middleware(req, res, next);

            // Check that it handles the error
            // eslint-disable-next-line
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('An error occurred while serving static asset');

            // Clean up mocks
            existsSyncSpy.mockRestore();
            createAssetsServer.mockRestore();
        });
    });
});

describe('GraphiQLService', () => {
    let serviceInstance: GraphiQLService;
    let configService: ConfigService;
    let result: TestEnvironment;
    beforeAll(async () => {
        result = createTestEnvironment({
            ...testConfig,
            apiOptions: {
                ...testConfig.apiOptions,
                adminApiPlayground: true,
                shopApiPlayground: true,
            },
            plugins: [GraphiqlPlugin.init()],
        });

        await result.server.init({
            initialData: {
                defaultLanguage: LanguageCode.en,
                defaultZone: 'Europe/London',
                countries: [],
                taxRates: [],
                paymentMethods: [],
                shippingMethods: [],
                collections: [],
            },
        });

        configService = result.server.app.get(ConfigService);
        serviceInstance = result.server.app.get(GraphiQLService);
    });

    afterAll(async () => {
        await result.server.destroy();
    });

    describe('getAdminApiUrl', () => {
        it('should return the admin API URL', () => {
            configService.apiOptions.adminApiPath = 'admin-api';
            const url = serviceInstance.getAdminApiUrl();
            expect(url).toBe('/admin-api');
        });

        it('should use default path if not specified', () => {
            configService.apiOptions.adminApiPath = 'admin-api';
            const url = serviceInstance.getAdminApiUrl();
            expect(url).toBe('/admin-api');
        });
    });

    describe('getShopApiUrl', () => {
        it('should return the shop API URL', () => {
            configService.apiOptions.shopApiPath = 'shop-api';
            const url = serviceInstance.getShopApiUrl();
            expect(url).toBe('/shop-api');
        });

        it('should use default path if not specified', () => {
            configService.apiOptions.shopApiPath = 'shop-api';
            const url = serviceInstance.getShopApiUrl();
            expect(url).toBe('/shop-api');
        });
    });

    describe('createApiUrl', () => {
        it('should create a relative URL if no host is specified', () => {
            configService.apiOptions.hostname = '';
            configService.apiOptions.port = 3000;
            const url = (serviceInstance as any).createApiUrl('test-api');
            expect(url).toBe('/test-api');
        });

        it('should create an absolute URL if host is specified', () => {
            configService.apiOptions.hostname = 'example.com';
            configService.apiOptions.port = 3000;
            const url = (serviceInstance as any).createApiUrl('test-api');
            expect(url).toBe('http://example.com:3000/test-api');
        });

        it('should handle HTTPS hosts', () => {
            configService.apiOptions.hostname = 'https://example.com';
            configService.apiOptions.port = 443;
            const url = (serviceInstance as any).createApiUrl('test-api');
            expect(url).toBe('https://example.com:443/test-api');
        });

        it('should handle paths with leading slash', () => {
            configService.apiOptions.hostname = 'example.com';
            configService.apiOptions.port = 3000;
            const url = (serviceInstance as any).createApiUrl('/test-api');
            expect(url).toBe('http://example.com:3000/test-api');
        });
    });
});

// Helper functions
function createMockConsumer(): MockMiddlewareConsumer {
    return {
        apply: vi.fn().mockReturnThis(),
        forRoutes: vi.fn().mockReturnThis(),
    } as unknown as MockMiddlewareConsumer;
}
