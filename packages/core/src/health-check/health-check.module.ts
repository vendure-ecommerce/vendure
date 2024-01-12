import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { isInspectableJobQueueStrategy } from '../config/job-queue/inspectable-job-queue-strategy';
import { JobQueueModule } from '../job-queue/job-queue.module';

import { HealthCheckRegistryService } from './health-check-registry.service';
import { HealthController } from './health-check.controller';
import { CustomHttpHealthIndicator } from './http-health-check-strategy';

@Module({
    imports: [TerminusModule, ConfigModule, JobQueueModule],
    controllers: [HealthController],
    providers: [HealthCheckRegistryService, CustomHttpHealthIndicator],
    exports: [HealthCheckRegistryService],
})
export class HealthCheckModule {
    constructor(
        private configService: ConfigService,
        private healthCheckRegistryService: HealthCheckRegistryService,
    ) {
        // Register all configured health checks
        for (const strategy of this.configService.systemOptions.healthChecks) {
            this.healthCheckRegistryService.registerIndicatorFunction(strategy.getHealthIndicator());
        }
    }
}
