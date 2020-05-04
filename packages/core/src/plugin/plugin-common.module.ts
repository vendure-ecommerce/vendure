import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { EventBusModule } from '../event-bus/event-bus.module';
import { HealthCheckModule } from '../health-check/health-check.module';
import { JobQueueModule } from '../job-queue/job-queue.module';
import { ServiceModule } from '../service/service.module';
import { WorkerServiceModule } from '../worker/worker-service.module';

/**
 * @description
 * This module provides the common services, configuration, and event bus capabilities
 * required by a typical plugin. It should be imported into plugins to avoid having to
 * repeat the same boilerplate for each individual plugin.
 *
 * The PluginCommonModule exports:
 *
 * * `EventBusModule`, allowing the injection of the {@link EventBus} service.
 * * `ServiceModule` allowing the injection of any of the various entity services such as ProductService, OrderService etc.
 * * `ConfigModule`, allowing the injection of the ConfigService.
 * * `WorkerServiceModule`, allowing the injection of the {@link WorkerService}.
 * * `JobQueueModule`, allowing the injection of the {@link JobQueueService}.
 * * `HealthCheckModule`, allowing the injection of the {@link HealthCheckRegistryService}.
 *
 * @docsCategory plugin
 */
@Module({
    imports: [
        EventBusModule,
        ConfigModule,
        ServiceModule.forPlugin(),
        WorkerServiceModule,
        JobQueueModule,
        HealthCheckModule,
    ],
    exports: [
        EventBusModule,
        ConfigModule,
        ServiceModule.forPlugin(),
        WorkerServiceModule,
        JobQueueModule,
        HealthCheckModule,
    ],
})
export class PluginCommonModule {}
