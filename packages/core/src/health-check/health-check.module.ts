import { Module } from '@nestjs/common';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { isInspectableJobQueueStrategy } from '../config/job-queue/inspectable-job-queue-strategy';
import { JobQueueModule } from '../job-queue/job-queue.module';

import { HealthCheckRegistryService } from './health-check-registry.service';
import { HealthController } from './health-check.controller';
import { WorkerHealthIndicator } from './worker-health-indicator';

@Module({
    imports: [TerminusModule, ConfigModule, JobQueueModule],
    controllers: [HealthController],
    providers: [HealthCheckRegistryService, WorkerHealthIndicator],
    exports: [HealthCheckRegistryService],
})
export class HealthCheckModule {
    constructor(
        private configService: ConfigService,
        private healthCheckRegistryService: HealthCheckRegistryService,
        private typeOrm: TypeOrmHealthIndicator,
        private worker: WorkerHealthIndicator,
    ) {
        // Register the default health checks for database and worker
        this.healthCheckRegistryService.registerIndicatorFunction([() => this.typeOrm.pingCheck('database')]);
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        if (isInspectableJobQueueStrategy(jobQueueStrategy)) {
            this.healthCheckRegistryService.registerIndicatorFunction([() => this.worker.isHealthy()]);
        }
    }
}
