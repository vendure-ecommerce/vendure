import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Type } from 'shared/shared-types';
import { EntitySubscriberInterface } from 'typeorm';

import { ReadOnlyRequired } from './common/types/common-types';
import { getConfig, setConfig, VendureConfig } from './config/vendure-config';
import { VendureEntity } from './entity/base/base.entity';
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
    const app = await NestFactory.create(appModule.AppModule, { cors: config.cors });
    return app.listen(config.port);
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
    const { coreEntitiesMap } = await import('./entity/entities');
    const { coreSubscribersMap } = await import('./entity/subscribers');
    setConfig({
        dbConnectionOptions: {
            entities: Object.values(coreEntitiesMap) as Array<Type<VendureEntity>>,
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
