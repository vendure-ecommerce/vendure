import { Module, OnApplicationShutdown, OnModuleDestroy } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ConfigModule } from '../config/config.module';
import { Logger } from '../config/logger/vendure-logger';
import { PluginModule } from '../plugin/plugin.module';
import { ProcessContextModule } from '../process-context/process-context.module';
import { ServiceModule } from '../service/service.module';

import { MessageInterceptor } from './message-interceptor';
import { WorkerMonitor } from './worker-monitor';
import { WorkerServiceModule } from './worker-service.module';

@Module({
    imports: [
        ConfigModule,
        ServiceModule.forWorker(),
        PluginModule.forWorker(),
        WorkerServiceModule,
        ProcessContextModule.forWorker(),
    ],
    providers: [
        WorkerMonitor,
        {
            provide: APP_INTERCEPTOR,
            useClass: MessageInterceptor,
        },
    ],
})
export class WorkerModule implements OnModuleDestroy, OnApplicationShutdown {
    constructor(private monitor: WorkerMonitor) {}
    onModuleDestroy() {
        return this.monitor.waitForOpenTasksToComplete();
    }

    onApplicationShutdown(signal?: string) {
        if (signal) {
            Logger.info('Worker Received shutdown signal:' + signal);
        }
    }
}
