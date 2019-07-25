import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { EventBusModule } from '../event-bus/event-bus.module';
import { ServiceModule } from '../service/service.module';
import { VENDURE_WORKER_CLIENT } from '../worker/constants';

/**
 * @description
 * This module provides the common services, configuration, and event bus capabilities
 * required by a typical plugin. It should be imported into plugins to avoid having to
 * repeat the same boilerplate for each individual plugin.
 *
 * The PluginCommonModule exports:
 *
 * * EventBusModule, allowing the injection of the {@link EventBus} service.
 * * ServiceModule allowing the injection of any of the various entity services such as ProductService, OrderService etc.
 * * ConfigModule, allowing the injection of the ConfigService.
 * * The `VENDURE_WORKER_CLIENT` token, allowing the injection of the Nest microservice ClientProxy.
 * @docsCategory plugin
 */
@Module({
    imports: [EventBusModule, ConfigModule, ServiceModule.forPlugin()],
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
        // TODO: Provide an injectable which defines whether in main or worker context
    ],
    exports: [EventBusModule, ConfigModule, ServiceModule.forPlugin(), VENDURE_WORKER_CLIENT],
})
export class PluginCommonModule {}
