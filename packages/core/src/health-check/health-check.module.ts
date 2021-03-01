import { Module } from '@nestjs/common';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

import { HealthCheckRegistryService } from './health-check-registry.service';
import { HealthController } from './health-check.controller';

@Module({
    imports: [TerminusModule, ConfigModule],
    controllers: [HealthController],
    providers: [HealthCheckRegistryService],
    exports: [HealthCheckRegistryService],
})
export class HealthCheckModule {
    constructor(
        private configService: ConfigService,
        private healthCheckRegistryService: HealthCheckRegistryService,
        private typeOrm: TypeOrmHealthIndicator,
    ) {
        // Register the default health checks for database and worker
        this.healthCheckRegistryService.registerIndicatorFunction([() => this.typeOrm.pingCheck('database')]);
    }
}
