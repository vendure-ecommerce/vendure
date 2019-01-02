import { Module } from '@nestjs/common';

import { notNullOrUndefined } from '../../../shared/shared-utils';
import { getConfig } from '../config/config-helpers';
import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { ServiceModule } from '../service/service.module';

const pluginProviders = getConfig()
    .plugins.map(p => (p.defineProviders ? p.defineProviders() : undefined))
    .filter(notNullOrUndefined)
    .reduce((flattened, providers) => flattened.concat(providers), []);

/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules (e.g. providing customer resolvers to the ApiModule)
 */
@Module({
    imports: [ServiceModule, EventBusModule, ConfigModule],
    providers: pluginProviders,
    exports: pluginProviders,
})
export class PluginModule {}
