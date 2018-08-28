import { NestFactory } from '@nestjs/core';
import { Type } from 'shared/shared-types';

import { getConfig, setConfig, VendureConfig } from './config/vendure-config';
import { VendureEntity } from './entity/base/base.entity';
import { registerCustomEntityFields } from './entity/custom-entity-fields';

/**
 * Bootstrap the Vendure server.
 */
export async function bootstrap(userConfig: Partial<VendureConfig>) {
    if (userConfig) {
        setConfig(userConfig);
    }

    // Entities *must* be loaded after the user config is set in order for the
    // base VendureEntity to be correctly configured with the primary key type
    // specified in the EntityIdStrategy.
    // tslint:disable-next-line:whitespace
    const { coreEntitiesMap } = await import('./entity/entities');
    setConfig({
        dbConnectionOptions: {
            entities: Object.values(coreEntitiesMap) as Array<Type<VendureEntity>>,
        },
    });

    const config = getConfig();

    registerCustomEntityFields(config);

    // The AppModule *must* be loaded only after the entities have been set in the
    // config, so that they are available when the AppModule decorator is evaluated.
    // tslint:disable-next-line:whitespace
    const appModule = await import('./app.module');
    const app = await NestFactory.create(appModule.AppModule, { cors: config.cors });
    await app.listen(config.port);
}
