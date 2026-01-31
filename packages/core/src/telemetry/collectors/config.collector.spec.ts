import { LanguageCode } from '@vendure/common/lib/generated-types';
import { beforeEach, describe, expect, it } from 'vitest';

import { ConfigService } from '../../config/config.service';

import { ConfigCollector } from './config.collector';

describe('ConfigCollector', () => {
    let collector: ConfigCollector;
    let mockConfigService: Partial<ConfigService>;

    beforeEach(() => {
        mockConfigService = {
            assetOptions: {
                assetStorageStrategy: {
                    constructor: { name: 'LocalAssetStorageStrategy' },
                },
            } as any,
            jobQueueOptions: {
                jobQueueStrategy: {
                    constructor: { name: 'InMemoryJobQueueStrategy' },
                },
            } as any,
            entityOptions: {
                entityIdStrategy: {
                    constructor: { name: 'AutoIncrementIdStrategy' },
                },
            } as any,
            entityIdStrategy: {
                constructor: { name: 'FallbackIdStrategy' },
            } as any,
            defaultLanguageCode: LanguageCode.en,
            customFields: {
                Product: [{ name: 'customField1' }, { name: 'customField2' }],
                Customer: [{ name: 'customField3' }],
            } as any,
            authOptions: {
                adminAuthenticationStrategy: [{ constructor: { name: 'NativeAuthenticationStrategy' } }],
                shopAuthenticationStrategy: [
                    { constructor: { name: 'NativeAuthenticationStrategy' } },
                    { constructor: { name: 'GoogleAuthenticationStrategy' } },
                ],
            } as any,
        };
        collector = new ConfigCollector(mockConfigService as ConfigService);
    });

    describe('collect()', () => {
        // Test success paths first before error paths
        describe('happy path', () => {
            it('returns strategy constructor names', () => {
                const result = collector.collect();

                expect(result.assetStorageType).toBe('LocalAssetStorageStrategy');
                expect(result.jobQueueType).toBe('InMemoryJobQueueStrategy');
                expect(result.entityIdStrategy).toBe('AutoIncrementIdStrategy');
            });

            it('returns defaultLanguage from config', () => {
                const result = collector.collect();

                expect(result.defaultLanguage).toBe(LanguageCode.en);
            });

            it('counts custom fields across all entity types', () => {
                const result = collector.collect();

                expect(result.customFieldsCount).toBe(3); // 2 + 1
            });

            it('returns authentication method names sorted and deduplicated', () => {
                const result = collector.collect();

                expect(result.authenticationMethods).toEqual([
                    'GoogleAuthenticationStrategy',
                    'NativeAuthenticationStrategy',
                ]);
            });
        });

        describe('entityIdStrategy fallback', () => {
            it('falls back to entityIdStrategy when entityOptions.entityIdStrategy is undefined', () => {
                mockConfigService.entityOptions = {} as any;

                const result = collector.collect();

                expect(result.entityIdStrategy).toBe('FallbackIdStrategy');
            });

            it('returns unknown when entityOptions is undefined (cannot access fallback)', () => {
                // When entityOptions is undefined, accessing entityOptions.entityIdStrategy
                // throws an error which is caught, returning 'unknown'.
                // This is different from entityOptions being an empty object.
                mockConfigService.entityOptions = undefined as any;

                const result = collector.collect();

                expect(result.entityIdStrategy).toBe('unknown');
            });
        });

        describe('custom fields handling', () => {
            it('returns 0 when no custom fields', () => {
                mockConfigService.customFields = {} as any;

                const result = collector.collect();

                expect(result.customFieldsCount).toBe(0);
            });

            it('handles custom fields with non-array values', () => {
                mockConfigService.customFields = {
                    Product: [{ name: 'field1' }],
                    Customer: undefined,
                    Order: null,
                } as any;

                const result = collector.collect();

                expect(result.customFieldsCount).toBe(1);
            });

            it('handles complex custom fields configuration', () => {
                mockConfigService.customFields = {
                    Product: [{ name: 'f1' }, { name: 'f2' }, { name: 'f3' }],
                    ProductVariant: [{ name: 'f4' }],
                    Customer: [{ name: 'f5' }, { name: 'f6' }],
                    Order: [],
                    OrderLine: [{ name: 'f7' }],
                } as any;

                const result = collector.collect();

                expect(result.customFieldsCount).toBe(7);
            });
        });

        describe('authentication methods handling', () => {
            it('handles empty strategy arrays', () => {
                mockConfigService.authOptions = {
                    adminAuthenticationStrategy: [],
                    shopAuthenticationStrategy: [],
                } as any;

                const result = collector.collect();

                expect(result.authenticationMethods).toEqual([]);
            });

            it('handles null strategy array', () => {
                mockConfigService.authOptions = {
                    adminAuthenticationStrategy: null as any,
                    shopAuthenticationStrategy: [{ constructor: { name: 'SomeStrategy' } }],
                } as any;

                const result = collector.collect();

                // Should return empty array due to error handling
                expect(result.authenticationMethods).toEqual([]);
            });
        });

        describe('error handling', () => {
            // These tests verify graceful degradation when config is malformed

            it('returns "unknown" when assetOptions is undefined', () => {
                mockConfigService.assetOptions = undefined as any;

                const result = collector.collect();

                expect(result.assetStorageType).toBe('unknown');
            });

            it('returns "unknown" when jobQueueOptions is undefined', () => {
                mockConfigService.jobQueueOptions = undefined as any;

                const result = collector.collect();

                expect(result.jobQueueType).toBe('unknown');
            });

            it('returns "unknown" when both entityOptions and entityIdStrategy are undefined', () => {
                mockConfigService.entityOptions = undefined as any;
                mockConfigService.entityIdStrategy = undefined;

                const result = collector.collect();

                expect(result.entityIdStrategy).toBe('unknown');
            });

            it('returns 0 when customFields throws', () => {
                Object.defineProperty(mockConfigService, 'customFields', {
                    get() {
                        throw new Error('Config error');
                    },
                });

                const result = collector.collect();

                expect(result.customFieldsCount).toBe(0);
            });

            it('returns empty array when authOptions is undefined', () => {
                mockConfigService.authOptions = undefined as any;

                const result = collector.collect();

                expect(result.authenticationMethods).toEqual([]);
            });
        });
    });
});
