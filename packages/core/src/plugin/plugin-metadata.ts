import { DynamicModule } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { Type } from '@vendure/common/lib/shared-types';

import { notNullOrUndefined } from '../../../common/lib/shared-utils';

import { APIExtensionDefinition, PluginConfigurationFn } from './vendure-plugin';

export const PLUGIN_METADATA = {
    CONFIGURATION: 'configuration',
    SHOP_API_EXTENSIONS: 'shopApiExtensions',
    ADMIN_API_EXTENSIONS: 'adminApiExtensions',
    ENTITIES: 'entities',
};

export function getEntitiesFromPlugins(plugins?: Array<Type<any> | DynamicModule>): Array<Type<any>> {
    if (!plugins) {
        return [];
    }
    return plugins
        .map(p => reflectMetadata(p, PLUGIN_METADATA.ENTITIES))
        .reduce((all, entities) => [...all, ...(entities || [])], []);
}

export function getModuleMetadata(module: Type<any>) {
    return {
        controllers: Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, module) || [],
        providers: Reflect.getMetadata(MODULE_METADATA.PROVIDERS, module) || [],
        imports: Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) || [],
        exports: Reflect.getMetadata(MODULE_METADATA.EXPORTS, module) || [],
    };
}

export function getPluginAPIExtensions(
    plugins: Array<Type<any> | DynamicModule>,
    apiType: 'shop' | 'admin',
): APIExtensionDefinition[] {
    const extensions =
        apiType === 'shop'
            ? plugins.map(p => reflectMetadata(p, PLUGIN_METADATA.SHOP_API_EXTENSIONS))
            : plugins.map(p => reflectMetadata(p, PLUGIN_METADATA.ADMIN_API_EXTENSIONS));

    return extensions.filter(notNullOrUndefined);
}

export function getPluginModules(plugins: Array<Type<any> | DynamicModule>): Array<Type<any>> {
    return plugins.map(p => (isDynamicModule(p) ? p.module : p));
}

export function getConfigurationFunction(
    plugin: Type<any> | DynamicModule,
): PluginConfigurationFn | undefined {
    return reflectMetadata(plugin, PLUGIN_METADATA.CONFIGURATION);
}

export function graphQLResolversFor(
    plugin: Type<any> | DynamicModule,
    apiType: 'shop' | 'admin',
): Array<Type<any>> {
    const apiExtensions: APIExtensionDefinition =
        apiType === 'shop'
            ? reflectMetadata(plugin, PLUGIN_METADATA.SHOP_API_EXTENSIONS)
            : reflectMetadata(plugin, PLUGIN_METADATA.ADMIN_API_EXTENSIONS);

    return apiExtensions
        ? typeof apiExtensions.resolvers === 'function'
            ? apiExtensions.resolvers()
            : apiExtensions.resolvers
        : [];
}

function reflectMetadata(metatype: Type<any> | DynamicModule, metadataKey: string) {
    if (isDynamicModule(metatype)) {
        return Reflect.getMetadata(metadataKey, metatype.module);
    } else {
        return Reflect.getMetadata(metadataKey, metatype);
    }
}

export function isDynamicModule(input: Type<any> | DynamicModule): input is DynamicModule {
    return !!(input as DynamicModule).module;
}
