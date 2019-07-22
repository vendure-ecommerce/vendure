import { Module } from '@nestjs/common';
import { METADATA } from '@nestjs/common/constants';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { pick } from '@vendure/common/lib/pick';
import { Type } from '@vendure/common/lib/shared-types';
import { DocumentNode } from 'graphql';

import { VendureConfig } from '../config/vendure-config';

import { PLUGIN_METADATA } from './plugin-metadata';

/**
 * @description
 * An object which allows a plugin to extend the Vendure GraphQL API.
 *
 * @docsCategory plugin
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
    schema?: DocumentNode;
    /**
     * @description
     * An array of resolvers for the schema extensions. Should be defined as Nest GraphQL resolver
     * classes, i.e. using the Nest `@Resolver()` decorator etc.
     */
    resolvers: Array<Type<any>>;
}

/**
 * @description
 * This method is called before the app bootstraps, and can modify the VendureConfig object and perform
 * other (potentially async) tasks needed.
 */
export type PluginConfigurationFn = (
    config: Required<VendureConfig>,
) => Required<VendureConfig> | Promise<Required<VendureConfig>>;

export interface VendurePluginMetadata extends ModuleMetadata {
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
     * The plugin may define providers which are run in the Worker context, i.e. Nest microservice controllers.
     */
    workers?: Array<Type<any>>;
    /**
     * @description
     * The plugin may define custom database entities, which should be defined as classes annotated as per the
     * TypeORM documentation.
     */
    entities?: Array<Type<any>>;
}

/**
 * @description
 * A VendurePlugin is a means of configuring and/or extending the functionality of the Vendure server. A Vendure Plugin is
 * a Nestjs Module, with optional additional metadata defining things like extensions to the GraphQL API, custom
 * configuration or new database entities.
 *
 * As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
 * entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.
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
        const nestModuleMetadata = pick(pluginMetadata, Object.values(METADATA) as any);
        Module(nestModuleMetadata)(target);
    };
}

export interface OnVendureBootstrap {
    onVendureBootstrap(): void | Promise<void>;
}

export interface OnVendureWorkerBootstrap {
    onVendureWorkerBootstrap(): void | Promise<void>;
}

export interface OnVendureClose {
    onVendureClose(): void | Promise<void>;
}

export interface OnVendureWorkerClose {
    onVendureWorkerClose(): void | Promise<void>;
}

export type PluginLifecycleMethods = OnVendureBootstrap &
    OnVendureWorkerBootstrap &
    OnVendureClose &
    OnVendureWorkerClose;
