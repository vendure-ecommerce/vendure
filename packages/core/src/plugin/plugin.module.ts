import { DynamicModule, Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { Type } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { getConfig } from '../config/config-helpers';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { EventBusModule } from '../event-bus/event-bus.module';
import { ServiceModule } from '../service/service.module';
import { VENDURE_WORKER_CLIENT } from '../worker/constants';

import { getPluginAPIExtensions } from './plugin-utils';

const pluginProviders = getPluginProviders();

/**
 * This module collects and re-exports all providers defined in plugins so that they can be used in other
 * modules.
 */
@Module({
    imports: [
        EventBusModule,
        ConfigModule,
    ],
    providers: [
        {
            provide: VENDURE_WORKER_CLIENT,
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: configService.workerOptions.transport as any,
                    options: configService.workerOptions.options as any,
                });
            },
            inject: [ConfigService],
        },
        ...pluginProviders,
    ],
    exports: pluginProviders,
})
export class PluginModule {
    static shopApiResolvers(): Array<Type<any>> {
        return graphQLResolversFor('shop');
    }

    static adminApiResolvers(): Array<Type<any>> {
        return graphQLResolversFor('admin');
    }

    static forRoot(): DynamicModule {
        return {
            module: PluginModule,
            imports: [ServiceModule.forRoot()],
        };
    }

    static forWorker(): DynamicModule {
        const controllers = getWorkerControllers();
        return {
            module: PluginModule,
            imports: [ServiceModule.forWorker()],
            controllers,
        };
    }
}

function getPluginProviders() {
    const plugins = getConfig().plugins;
    return plugins
        .map(p => (p.defineProviders ? p.defineProviders() : undefined))
        .filter(notNullOrUndefined)
        .reduce((flattened, providers) => flattened.concat(providers), []);
}

function getWorkerControllers() {
    const plugins = getConfig().plugins;
    return plugins
        .map(p => (p.defineWorkers ? p.defineWorkers() : undefined))
        .filter(notNullOrUndefined)
        .reduce((flattened, providers) => flattened.concat(providers), []);
}

function graphQLResolversFor(apiType: 'shop' | 'admin'): Array<Type<any>> {
    const plugins = getConfig().plugins;
    return getPluginAPIExtensions(plugins, apiType)
        .map(extension => extension.resolvers)
        .reduce((flattened, r) => [...flattened, ...r], []);
}
