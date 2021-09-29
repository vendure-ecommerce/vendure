import { Module, Provider, Type as NestType } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { pick } from '@vendure/common/lib/pick';
import { Type } from '@vendure/common/lib/shared-types';
import { DocumentNode } from 'graphql';

import { RuntimeVendureConfig } from '../config/vendure-config';

import { PLUGIN_METADATA } from './plugin-metadata';

/**
 * @description
 * Defines the metadata of a Vendure plugin. This interface is an superset of the [Nestjs ModuleMetadata](https://docs.nestjs.com/modules)
 * (which allows the definition of `imports`, `exports`, `providers` and `controllers`), which means
 * that any Nestjs Module is a valid Vendure plugin. In addition, the VendurePluginMetadata allows the definition of
 * extra properties specific to Vendure.
 *
 * @docsCategory plugin
 * @docsPage VendurePluginMetadata
 */
export interface VendurePluginMetadata extends ModuleMetadata {
    /**
     * @description
     * A function which can modify the {@link VendureConfig} object before the server bootstraps.
     */
    configuration?: PluginConfigurationFn;
    /**
     * @description
     * The plugin may extend the default Vendure GraphQL shop api by providing extended
     * schema definitions and any required resolvers.
     */
    shopApiExtensions?: APIExtensionDefinition;
    /**
     * @description
     * The plugin may extend the default Vendure GraphQL admin api by providing extended
     * schema definitions and any required resolvers.
     */
    adminApiExtensions?: APIExtensionDefinition;
    /**
     * @description
     * The plugin may define custom [TypeORM database entities](https://typeorm.io/#/entities).
     */
    entities?: Array<Type<any>> | (() => Array<Type<any>>);
}
/**
 * @description
 * An object which allows a plugin to extend the Vendure GraphQL API.
 *
 * @docsCategory plugin
 * @docsPage VendurePluginMetadata
 * */

export interface APIExtensionDefinition {
    /**
     * @description
     * Extensions to the schema.
     *
     * @example
     * ```TypeScript
     * const schema = gql`extend type SearchReindexResponse {
     *     timeTaken: Int!
     *     indexedItemCount: Int!
     * }`;
     * ```
     */
    schema?: DocumentNode | (() => DocumentNode);
    /**
     * @description
     * An array of resolvers for the schema extensions. Should be defined as [Nestjs GraphQL resolver](https://docs.nestjs.com/graphql/resolvers-map)
     * classes, i.e. using the Nest `\@Resolver()` decorator etc.
     */
    resolvers: Array<Type<any>> | (() => Array<Type<any>>);
}

/**
 * @description
 * This method is called before the app bootstraps and should be used to perform any needed modifications to the {@link VendureConfig}.
 *
 * @docsCategory plugin
 * @docsPage VendurePluginMetadata
 */
export type PluginConfigurationFn = (
    config: RuntimeVendureConfig,
) => RuntimeVendureConfig | Promise<RuntimeVendureConfig>;

/**
 * @description
 * The VendurePlugin decorator is a means of configuring and/or extending the functionality of the Vendure server. A Vendure plugin is
 * a [Nestjs Module](https://docs.nestjs.com/modules), with optional additional metadata defining things like extensions to the GraphQL API, custom
 * configuration or new database entities.
 *
 * As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
 * entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.
 *
 * @example
 * ```TypeScript
 * import { Controller, Get } from '\@nestjs/common';
 * import { Ctx, PluginCommonModule, ProductService, RequestContext, VendurePlugin } from '\@vendure/core';
 *
 * \@Controller('products')
 * export class ProductsController {
 *     constructor(private productService: ProductService) {}
 *
 *     \@Get()
 *     findAll(\@Ctx() ctx: RequestContext) {
 *         return this.productService.findAll(ctx);
 *     }
 * }
 *
 *
 * //A simple plugin which adds a REST endpoint for querying products.
 * \@VendurePlugin({
 *     imports: [PluginCommonModule],
 *     controllers: [ProductsController],
 * })
 * export class RestPlugin {}
 * ```
 *
 * @docsCategory plugin
 */
export function VendurePlugin(pluginMetadata: VendurePluginMetadata): ClassDecorator {
    // tslint:disable-next-line:ban-types
    return (target: Function) => {
        for (const metadataProperty of Object.values(PLUGIN_METADATA)) {
            const property = metadataProperty as keyof VendurePluginMetadata;
            if (pluginMetadata[property] != null) {
                Reflect.defineMetadata(property, pluginMetadata[property], target);
            }
        }
        const nestModuleMetadata = pick(pluginMetadata, Object.values(MODULE_METADATA) as any);
        // Automatically add any of the Plugin's "providers" to the "exports" array. This is done
        // because when a plugin defines GraphQL resolvers, these resolvers are used to dynamically
        // created a new Module in the ApiModule, and if those resolvers depend on any providers,
        // the must be exported. See the function {@link createDynamicGraphQlModulesForPlugins}
        // for the implementation.
        // However, we must omit any global providers (https://github.com/vendure-ecommerce/vendure/issues/837)
        const nestGlobalProviderTokens = [APP_INTERCEPTOR, APP_FILTER, APP_GUARD, APP_PIPE];
        const exportedProviders = (nestModuleMetadata.providers || []).filter(provider => {
            if (isNamedProvider(provider)) {
                if (nestGlobalProviderTokens.includes(provider.provide as any)) {
                    return false;
                }
            }
            return true;
        });
        nestModuleMetadata.exports = [...(nestModuleMetadata.exports || []), ...exportedProviders];
        Module(nestModuleMetadata)(target);
    };
}

function isNamedProvider(provider: Provider): provider is Exclude<Provider, NestType<any>> {
    return provider.hasOwnProperty('provide');
}
