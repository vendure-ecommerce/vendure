import { NestFactory } from '@nestjs/core';
import { getConfig, setConfig, VendureConfig } from './config/vendure-config';

/**
 * Bootstrap the Vendure server.
 */
export async function bootstrap(userConfig?: Partial<VendureConfig>) {
    if (userConfig) {
        setConfig(userConfig);
    }

    // Entities *must* be loaded after the user config is set in order for the
    // base VendureEntity to be correctly configured with the primary key type
    // specified in the EntityIdStrategy.
    // tslint:disable-next-line:whitespace
    const entities = await import('./entity/entities');
    setConfig({
        dbConnectionOptions: {
            entities: entities.coreEntities,
        },
    });

    // The AppModule *must* be loaded only after the entities have been set in the
    // config, so that they are available when the AppModule decorator is evaluated.
    // tslint:disable-next-line:whitespace
    const appModule = await import('./app.module');
    const config = getConfig();

    const app = await NestFactory.create(appModule.AppModule, { cors: config.cors });
    await app.listen(config.port);
}
