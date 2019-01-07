import { DocumentNode } from 'graphql';

import { Type } from '../../../../shared/shared-types';
import { VendureConfig } from '../vendure-config';

export type InjectorFn = <T>(type: Type<T>) => T;

/**
 * A VendurePlugin is a means of configuring and/or extending the functionality of the Vendure server. In its simplest form,
 * a plugin simply modifies the VendureConfig object. Although such configuration can be directly supplied to the bootstrap
 * function, using a plugin allows one to abstract away a set of related configuration.
 *
 * As well as configuring the app, a plugin may also extend the GraphQL schema by extending existing types or adding
 * entirely new types. Database entities and resolvers can also be defined to handle the extended GraphQL types.
 */
export interface VendurePlugin {
    /**
     * This method is called before the app bootstraps, and can modify the VendureConfig object and perform
     * other (potentially async) tasks needed.
     */
    configure(config: Required<VendureConfig>): Required<VendureConfig> | Promise<Required<VendureConfig>>;

    /**
     * This method is called after the app has bootstrapped. In this method, instances of services may be injected
     * into the plugin. For example, the ProductService can be injected in order to enable operations on Product
     * entities.
     */
    onBootstrap?(inject: InjectorFn): void | Promise<void>;

    /**
     * The plugin may extend the default Vendure GraphQL schema by implementing this method.
     */
    defineGraphQlTypes?(): DocumentNode;

    /**
     * The plugin may define custom providers (including GraphQL resolvers) which can then be injected via the Nest DI container.
     */
    defineProviders?(): Array<Type<any>>;

    /**
     * The plugin may define custom database entities, which should be defined as classes annotated as per the
     * TypeORM documentation.
     */
    defineEntities?(): Array<Type<any>>;
}
