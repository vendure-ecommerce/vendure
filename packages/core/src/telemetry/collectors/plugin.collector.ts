import { DynamicModule, Injectable, Type } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { isDynamicModule } from '../../plugin/plugin-metadata';
import { TelemetryPluginInfo } from '../telemetry.types';

/**
 * Plugin class names that map to known npm packages.
 */
const PLUGIN_CLASS_TO_PACKAGE: Record<string, string> = {
    AdminUiPlugin: '@vendure/admin-ui-plugin',
    AssetServerPlugin: '@vendure/asset-server-plugin',
    ElasticsearchPlugin: '@vendure/elasticsearch-plugin',
    EmailPlugin: '@vendure/email-plugin',
    BullMQJobQueuePlugin: '@vendure/job-queue-plugin',
    StripePlugin: '@vendure/payments-plugin',
    MolliePlugin: '@vendure/payments-plugin',
    HardenPlugin: '@vendure/harden-plugin',
    SentryPlugin: '@vendure/sentry-plugin',
    GraphiQLPlugin: '@vendure/graphiql-plugin',
    StellatePlugin: '@vendure/stellate-plugin',
};

/**
 * Collects information about plugins used in the Vendure installation.
 * Only collects names of known official plugins; custom plugin names are NOT collected.
 */
@Injectable()
export class PluginCollector {
    constructor(private configService: ConfigService) {}

    collect(): TelemetryPluginInfo {
        const plugins = this.configService.plugins;
        const npmPlugins = new Set<string>();
        let customCount = 0;

        for (const plugin of plugins) {
            const pluginName = this.getPluginName(plugin);
            const npmPackage = this.identifyNpmPackage(plugin, pluginName);

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

    private getPluginName(plugin: Type<any> | DynamicModule): string {
        if (isDynamicModule(plugin)) {
            return plugin.module.name;
        }
        return plugin.name;
    }

    private identifyNpmPackage(plugin: Type<any> | DynamicModule, pluginName: string): string | undefined {
        // Look up by class name
        const knownPackage = PLUGIN_CLASS_TO_PACKAGE[pluginName];
        if (knownPackage) {
            return knownPackage;
        }

        return undefined;
    }
}
