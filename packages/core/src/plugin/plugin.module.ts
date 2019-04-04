import { Module } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { getConfig } from '../config/config-helpers';
import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { ServiceModule } from '../service/service.module';

import { getPluginAPIExtensions } from './plugin-utils';

const plugins = getConfig().plugins;
const pluginProviders = plugins
    .map(p => (p.defineProviders ? p.defineProviders() : undefined))
    .filter(notNullOrUndefined)
    .reduce((flattened, providers) => flattened.concat(providers), []);

/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules.
 */
@Module({
    imports: [ServiceModule, EventBusModule, ConfigModule],
    providers: pluginProviders,
    exports: pluginProviders,
})
export class PluginModule {
    static shopApiResolvers(): Array<Type<any>> {
        return graphQLResolversFor('shop');
    }

    static adminApiResolvers(): Array<Type<any>> {
        return graphQLResolversFor('admin');
    }
}

function graphQLResolversFor(apiType: 'shop' | 'admin'): Array<Type<any>> {
    return getPluginAPIExtensions(plugins, apiType)
        .map(extension => extension.resolvers)
        .reduce((flattened, r) => [...flattened, ...r], []);
}
