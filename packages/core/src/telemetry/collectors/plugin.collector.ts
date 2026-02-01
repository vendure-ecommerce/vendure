import { DynamicModule, Injectable, Type } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { isDynamicModule } from '../../plugin/plugin-metadata';
import { TelemetryPluginInfo } from '../telemetry.types';

/**
 * Known Vendure plugins mapped to their npm package names.
 * This is more reliable than require.cache inspection which fails with ESM/TypeScript.
 */
const KNOWN_VENDURE_PLUGINS: Record<string, string> = {
    // @vendure/core
    DefaultSearchPlugin: '@vendure/core',
    DefaultJobQueuePlugin: '@vendure/core',
    DefaultSchedulerPlugin: '@vendure/core',
    // @vendure/asset-server-plugin
    AssetServerPlugin: '@vendure/asset-server-plugin',
    // @vendure/email-plugin
    EmailPlugin: '@vendure/email-plugin',
    // @vendure/admin-ui-plugin
    AdminUiPlugin: '@vendure/admin-ui-plugin',
    // @vendure/dashboard
    DashboardPlugin: '@vendure/dashboard',
    // @vendure/job-queue-plugin
    BullMQJobQueuePlugin: '@vendure/job-queue-plugin',
    // @vendure/elasticsearch-plugin
    ElasticsearchPlugin: '@vendure/elasticsearch-plugin',
    // @vendure/graphiql-plugin
    GraphiqlPlugin: '@vendure/graphiql-plugin',
    // @vendure/harden-plugin
    HardenPlugin: '@vendure/harden-plugin',
    // @vendure/sentry-plugin
    SentryPlugin: '@vendure/sentry-plugin',
    // @vendure/payments-plugin
    StripePlugin: '@vendure/payments-plugin',
    MolliePlugin: '@vendure/payments-plugin',
    BraintreePlugin: '@vendure/payments-plugin',
};

/**
 * Collects information about plugins used in the Vendure installation.
 * Detects npm packages by checking if the plugin originates from node_modules.
 * Custom plugin names are NOT collected for privacy.
 */
@Injectable()
export class PluginCollector {
    constructor(private readonly configService: ConfigService) {}

    collect(): TelemetryPluginInfo {
        try {
            const plugins = this.configService.plugins;
            const npmPlugins = new Set<string>();
            let customCount = 0;

            for (const plugin of plugins) {
                try {
                    const npmPackage = this.findNpmPackage(plugin);

                    if (npmPackage) {
                        npmPlugins.add(npmPackage);
                    } else {
                        customCount++;
                    }
                } catch {
                    customCount++;
                }
            }

            return {
                npm: Array.from(npmPlugins).sort((a, b) => a.localeCompare(b)),
                customCount,
            };
        } catch {
            return { npm: [], customCount: 0 };
        }
    }

    /**
     * Finds the npm package name for a plugin.
     * First checks against known Vendure plugins, then falls back to require.cache inspection.
     */
    private findNpmPackage(plugin: Type<any> | DynamicModule): string | undefined {
        const pluginClass = isDynamicModule(plugin) ? plugin.module : plugin;
        const pluginName = pluginClass?.name ?? 'unknown';

        // First, check against known Vendure plugins (most reliable)
        const knownPackage = KNOWN_VENDURE_PLUGINS[pluginName];
        if (knownPackage) {
            return knownPackage;
        }

        // Fall back to require.cache inspection for third-party npm plugins
        return this.findInRequireCache(pluginClass);
    }

    /**
     * Searches the require cache for a plugin class.
     * This is a fallback for third-party npm plugins not in our known list.
     */
    private findInRequireCache(pluginClass: Type<any>): string | undefined {
        // Check if require.cache is available (may not be in ESM-only environments)
        if (typeof require === 'undefined' || !require.cache) {
            return undefined;
        }

        try {
            for (const [modulePath, moduleObj] of Object.entries(require.cache)) {
                if (!moduleObj?.exports || !modulePath.includes('node_modules')) {
                    continue;
                }

                try {
                    const exports = moduleObj.exports;

                    // Direct match or default export match
                    if (exports === pluginClass || exports?.default === pluginClass) {
                        return this.extractPackageName(modulePath);
                    }

                    // Check named exports
                    if (typeof exports === 'object' && exports !== null) {
                        const exportValues = Object.values(exports);
                        if (exportValues.includes(pluginClass)) {
                            return this.extractPackageName(modulePath);
                        }
                    }
                } catch {
                    // Skip modules with problematic exports
                    continue;
                }
            }
        } catch {
            // Ignore errors accessing require.cache
        }

        return undefined;
    }

    /**
     * Extracts the npm package name from a node_modules path.
     * Handles both scoped (@scope/package) and unscoped packages.
     */
    private extractPackageName(modulePath: string): string | undefined {
        const nodeModulesIndex = modulePath.lastIndexOf('node_modules');
        if (nodeModulesIndex === -1) {
            return undefined;
        }

        const pathAfterNodeModules = modulePath.slice(nodeModulesIndex + 'node_modules/'.length);
        const parts = pathAfterNodeModules.split(/[/\\]/);

        if (parts[0].startsWith('@')) {
            // Scoped package: @scope/package
            return `${parts[0]}/${parts[1]}`;
        }
        return parts[0];
    }
}
