import { DynamicModule } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigService } from '../../config/config.service';

import { PluginCollector } from './plugin.collector';

describe('PluginCollector', () => {
    let collector: PluginCollector;
    let mockConfigService: Record<string, any>;
    const addedCacheKeys: string[] = [];

    beforeEach(() => {
        mockConfigService = {
            plugins: [],
        };
        collector = new PluginCollector(mockConfigService as ConfigService);
    });

    afterEach(() => {
        // Clean up any cache entries we added during tests
        for (const key of addedCacheKeys) {
            delete require.cache[key];
        }
        addedCacheKeys.length = 0;
    });

    function addToRequireCache(modulePath: string, exports: any) {
        require.cache[modulePath] = { exports } as any;
        addedCacheKeys.push(modulePath);
    }

    describe('collect()', () => {
        it('returns empty npm array and zero customCount when no plugins', () => {
            mockConfigService.plugins = [];

            const result = collector.collect();

            expect(result.npm).toEqual([]);
            expect(result.customCount).toBe(0);
        });

        it('counts custom plugins without collecting names', () => {
            class CustomPlugin {}
            class AnotherCustomPlugin {}

            mockConfigService.plugins = [CustomPlugin, AnotherCustomPlugin];

            const result = collector.collect();

            expect(result.customCount).toBe(2);
            expect(result.npm).toEqual([]);
        });

        it('detects npm packages from node_modules paths', () => {
            class NpmPlugin {}

            addToRequireCache('/project/node_modules/@vendure/some-plugin/dist/index.js', NpmPlugin);

            mockConfigService.plugins = [NpmPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('@vendure/some-plugin');
            expect(result.customCount).toBe(0);
        });

        it('extracts scoped package names (@scope/package)', () => {
            class ScopedPlugin {}

            addToRequireCache('/project/node_modules/@myorg/my-plugin/dist/plugin.js', ScopedPlugin);

            mockConfigService.plugins = [ScopedPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('@myorg/my-plugin');
        });

        it('extracts regular package names', () => {
            class RegularPlugin {}

            addToRequireCache('/project/node_modules/vendure-plugin-foo/dist/index.js', RegularPlugin);

            mockConfigService.plugins = [RegularPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('vendure-plugin-foo');
        });

        it('handles DynamicModule plugins', () => {
            class DynamicModulePlugin {}

            const dynamicModule: DynamicModule = {
                module: DynamicModulePlugin,
                providers: [],
            };

            addToRequireCache(
                '/project/node_modules/@vendure/dynamic-plugin/dist/index.js',
                DynamicModulePlugin,
            );

            mockConfigService.plugins = [dynamicModule];

            const result = collector.collect();

            expect(result.npm).toContain('@vendure/dynamic-plugin');
        });

        it('handles DynamicModule with undefined module property as custom plugin', () => {
            // Edge case: object that looks like DynamicModule but has no module
            const weirdPlugin = { providers: [] } as any;

            mockConfigService.plugins = [weirdPlugin];

            const result = collector.collect();

            // Should count as custom since it can't be resolved
            expect(result.customCount).toBe(1);
        });

        it('handles default exports', () => {
            class DefaultExportPlugin {}

            addToRequireCache('/project/node_modules/default-export-plugin/dist/index.js', {
                default: DefaultExportPlugin,
            });

            mockConfigService.plugins = [DefaultExportPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('default-export-plugin');
        });

        it('handles named exports', () => {
            class NamedExportPlugin {}

            addToRequireCache('/project/node_modules/named-export-plugin/dist/index.js', {
                NamedExportPlugin,
                OtherExport: class {},
            });

            mockConfigService.plugins = [NamedExportPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('named-export-plugin');
        });

        it('deduplicates npm package names', () => {
            class Plugin1 {}
            class Plugin2 {}

            addToRequireCache('/project/node_modules/@vendure/multi-export/dist/index.js', {
                Plugin1,
                Plugin2,
            });

            mockConfigService.plugins = [Plugin1, Plugin2];

            const result = collector.collect();

            expect(result.npm).toEqual(['@vendure/multi-export']);
            expect(result.customCount).toBe(0);
        });

        it('sorts npm package names alphabetically', () => {
            class PluginZ {}
            class PluginA {}
            class PluginM {}

            addToRequireCache('/project/node_modules/z-plugin/dist/index.js', PluginZ);
            addToRequireCache('/project/node_modules/a-plugin/dist/index.js', PluginA);
            addToRequireCache('/project/node_modules/m-plugin/dist/index.js', PluginM);

            mockConfigService.plugins = [PluginZ, PluginA, PluginM];

            const result = collector.collect();

            expect(result.npm).toEqual(['a-plugin', 'm-plugin', 'z-plugin']);
        });

        it('handles mixed npm and custom plugins', () => {
            class NpmPlugin {}
            class CustomPlugin {}

            addToRequireCache('/project/node_modules/@vendure/npm-plugin/dist/index.js', NpmPlugin);

            mockConfigService.plugins = [NpmPlugin, CustomPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('@vendure/npm-plugin');
            expect(result.customCount).toBe(1);
        });

        it('ignores cache entries without exports', () => {
            class SomePlugin {}

            addToRequireCache('/project/node_modules/broken-plugin/dist/index.js', undefined);

            mockConfigService.plugins = [SomePlugin];

            const result = collector.collect();

            expect(result.customCount).toBe(1);
        });

        it('ignores cache entries not in node_modules', () => {
            class LocalPlugin {}

            addToRequireCache('/project/src/plugins/local-plugin.ts', LocalPlugin);

            mockConfigService.plugins = [LocalPlugin];

            const result = collector.collect();

            expect(result.npm).toEqual([]);
            expect(result.customCount).toBe(1);
        });

        it('handles Windows-style paths', () => {
            class WindowsPlugin {}

            // Windows path with backslashes
            addToRequireCache('C:\\project\\node_modules\\windows-plugin\\dist\\index.js', WindowsPlugin);

            mockConfigService.plugins = [WindowsPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('windows-plugin');
        });

        it('handles nested node_modules (uses last occurrence for correct resolution)', () => {
            class NestedPlugin {}

            // Plugin in nested node_modules - uses lastIndexOf to find the correct package
            addToRequireCache(
                '/project/node_modules/parent-pkg/node_modules/nested-plugin/dist/index.js',
                NestedPlugin,
            );

            mockConfigService.plugins = [NestedPlugin];

            const result = collector.collect();

            expect(result.npm).toContain('nested-plugin');
        });
    });
});
