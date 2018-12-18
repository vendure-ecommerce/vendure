import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { EntitySubscriberInterface } from 'typeorm';

import { Type } from '../../shared/shared-types';

import { InternalServerError } from './common/error/errors';
import { ReadOnlyRequired } from './common/types/common-types';
import { getConfig, setConfig } from './config/config-helpers';
import { VendureConfig } from './config/vendure-config';
import { registerCustomEntityFields } from './entity/custom-entity-fields';

export type VendureBootstrapFunction = (config: VendureConfig) => Promise<INestApplication>;

/**
 * Bootstrap the Vendure server.
 */
export async function bootstrap(userConfig: Partial<VendureConfig>): Promise<INestApplication> {
    const config = await preBootstrapConfig(userConfig);

    // The AppModule *must* be loaded only after the entities have been set in the
    // config, so that they are available when the AppModule decorator is evaluated.
    // tslint:disable-next-line:whitespace
    const appModule = await import('./app.module');
    const app = await NestFactory.create(appModule.AppModule, {
        cors: config.cors,
        logger: config.silent ? false : undefined,
    });
    await app.listen(config.port);
    return app;
}

/**
 * Setting the global config must be done prior to loading the AppModule.
 */
export async function preBootstrapConfig(
    userConfig: Partial<VendureConfig>,
): Promise<ReadOnlyRequired<VendureConfig>> {
    if (userConfig) {
        setConfig(userConfig);
    }

    // Entities *must* be loaded after the user config is set in order for the
    // base VendureEntity to be correctly configured with the primary key type
    // specified in the EntityIdStrategy.
    // tslint:disable-next-line:whitespace
    const pluginEntities = getEntitiesFromPlugins(userConfig);
    const entities = await getAllEntities(userConfig);
    const { coreSubscribersMap } = await import('./entity/subscribers');
    setConfig({
        dbConnectionOptions: {
            entities,
            subscribers: Object.values(coreSubscribersMap) as Array<Type<EntitySubscriberInterface>>,
        },
    });

    let config = getConfig();

    // Initialize plugins
    for (const plugin of config.plugins) {
        config = (await plugin.init(config)) as ReadOnlyRequired<VendureConfig>;
    }

    registerCustomEntityFields(config);
    return config;
}

async function getAllEntities(userConfig: Partial<VendureConfig>): Promise<Array<Type<any>>> {
    const { coreEntitiesMap } = await import('./entity/entities');
    const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;
    const coreEntityNames = Object.keys(coreEntitiesMap);
    const pluginEntities = getEntitiesFromPlugins(userConfig);

    for (const pluginEntity of pluginEntities) {
        if (coreEntityNames.includes(pluginEntity.name)) {
            throw new InternalServerError(`error.entity-name-conflict`, { entityName: pluginEntity.name });
        }
    }
    return [...coreEntities, ...pluginEntities];
}

/**
 * Collects all entities defined in plugins into a single array.
 */
function getEntitiesFromPlugins(userConfig: Partial<VendureConfig>): Array<Type<any>> {
    if (!userConfig.plugins) {
        return [];
    }
    return userConfig.plugins
        .map(p => (p.defineEntities ? p.defineEntities() : []))
        .reduce((all, entities) => [...all, ...entities], []);
}
