import { DocumentNode } from 'graphql';

import { Type } from '../../../../shared/shared-types';
import { VendureConfig } from '../vendure-config';

/**
 * A VendurePlugin is a means of configuring and/or extending the functionality of the Vendure server. In its simplest form,
 * a plugin simply modifies the VendureConfig object. Although such configuration can be directly supplied to the bootstrap
 * function, using a plugin allows one to abstract away a set of related configuration.
 *
 * Aditionally, the init() method can perform async work such as starting servers, making calls to 3rd party services, or any other
 * kind of task which may be called for.
 */
export interface VendurePlugin {
    /**
     * This method is called before the app bootstraps, and can modify the VendureConfig object and perform
     * other (potentially async) tasks needed.
     */
    init(config: Required<VendureConfig>): Required<VendureConfig> | Promise<Required<VendureConfig>>;

    /**
     * This method is called after the app has bootstrapped. In this method, instances of services may be injected
     * into the plugin. For example, the ProductService can be injected in order to enable operations on Product
     * entities.
     */
    onBootstrap?(inject: <T>(type: Type<T>) => T): void | Promise<void>;

    /**
     * The plugin may extend the default Vendure GraphQL schema by implementing this method.
     */
    defineGraphQlTypes?(): DocumentNode;

    /**
     * The plugin may define custom GraphQL resolvers.
     */
    defineResolvers?(): Array<Type<any>>;

    /**
     * The plugin may define custom database entities, which should be defined as classes annotated as per the
     * TypeORM documentation.
     */
    defineEntities?(): Array<Type<any>>;
}
