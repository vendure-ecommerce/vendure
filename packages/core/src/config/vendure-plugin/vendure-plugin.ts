import { Provider } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { DocumentNode } from 'graphql';

import { VendureConfig } from '../vendure-config';

/**
 * @description
 * A function which allows any injectable provider to be injected into the `onBootstrap` method of a {@link VendurePlugin}.
 *
 * @docsCategory plugin
 */
export type InjectorFn = <T>(type: Type<T>) => T;

/**
 * @description
 * An object which allows a plugin to extend the Vendure GraphQL API.
 *
 * @docsCategory plugin
 * */
export interface APIExtensionDefinition {
    /**
     * @description
     * The schema extensions.
     *
     * @example
     * ```TypeScript
     * const schema = gql`extend type SearchReindexResponse {
     *     timeTaken: Int!
     *     indexedItemCount: Int!
     * }`;
     * ```
     */
    schema: DocumentNode;
    /**
     * @description
     * An array of resolvers for the schema extensions. Should be defined as Nest GraphQL resolver
     * classes, i.e. using the Nest `@Resolver()` decorator etc.
     */
    resolvers: Array<Type<any>>;
}

/**
 * @description
 * A VendurePlugin is a means of configuring and/or extending the functionality of the Vendure server. In its simplest form,
 * a plugin simply modifies the VendureConfig object. Although such configuration can be directly supplied to the bootstrap
 * function, using a plugin allows one to abstract away a set of related configuration.
 *
 * As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
 * entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.
 *
 * @docsCategory plugin
 */
export interface VendurePlugin {
    /**
     * @description
     * This method is called before the app bootstraps, and can modify the VendureConfig object and perform
     * other (potentially async) tasks needed.
     */
    configure?(config: Required<VendureConfig>): Required<VendureConfig> | Promise<Required<VendureConfig>>;

    /**
     * @description
     * This method is called after the app has bootstrapped. In this method, instances of services may be injected
     * into the plugin. For example, the ProductService can be injected in order to enable operations on Product
     * entities.
     */
    onBootstrap?(inject: InjectorFn): void | Promise<void>;

    /**
     * @description
     * This method is called when the app closes. It can be used for any clean-up logic such as stopping servers.
     */
    onClose?(): void | Promise<void>;

    /**
     * @description
     * The plugin may extend the default Vendure GraphQL shop api by implementing this method and providing extended
     * schema definitions and any required resolvers.
     */
    extendShopAPI?(): APIExtensionDefinition;

    /**
     * @description
     * The plugin may extend the default Vendure GraphQL admin api by implementing this method and providing extended
     * schema definitions and any required resolvers.
     */
    extendAdminAPI?(): APIExtensionDefinition;

    /**
     * @description
     * The plugin may define custom providers which can then be injected via the Nest DI container.
     */
    defineProviders?(): Provider[];

    /**
     * @description
     * The plugin may define providers which are run in the Worker context, i.e. Nest microservice controllers.
     */
    defineWorkers?(): Array<Type<any>>;

    /**
     * @description
     * The plugin may define custom database entities, which should be defined as classes annotated as per the
     * TypeORM documentation.
     */
    defineEntities?(): Array<Type<any>>;
}
