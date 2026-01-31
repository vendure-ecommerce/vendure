import { DynamicModule, Injectable, Type } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { isDynamicModule } from '../../plugin/plugin-metadata';
import { TelemetryPluginInfo } from '../telemetry.types';

/**
 * Collects information about plugins used in the Vendure installation.
 * Detects npm packages by checking if the plugin originates from node_modules.
 * Custom plugin names are NOT collected for privacy.
 */
@Injectable()
export class PluginCollector {
    constructor(private configService: ConfigService) {}

    collect(): TelemetryPluginInfo {
        const plugins = this.configService.plugins;
        const npmPlugins = new Set<string>();
        let customCount = 0;

        for (const plugin of plugins) {
            const npmPackage = this.findNpmPackage(plugin);

            if (npmPackage) {
                npmPlugins.add(npmPackage);
            } else {
                customCount++;
            }
        }

        return {
            npm: Array.from(npmPlugins).sort(),
            customCount,
        };
    }

    /**
     * Finds the npm package name for a plugin by checking the require cache.
     */
    private findNpmPackage(plugin: Type<any> | DynamicModule): string | undefined {
        const pluginClass = isDynamicModule(plugin) ? plugin.module : plugin;

        // Search require cache for the module that exports this plugin class
        for (const [modulePath, moduleObj] of Object.entries(require.cache)) {
            if (!moduleObj?.exports || !modulePath.includes('node_modules')) {
                continue;
            }

            const exports = moduleObj.exports;
            if (
                exports === pluginClass ||
                exports.default === pluginClass ||
                (typeof exports === 'object' && Object.values(exports).includes(pluginClass))
            ) {
                return this.extractPackageName(modulePath);
            }
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
