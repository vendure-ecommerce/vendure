import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { HEALTH_CHECK_ROUTE } from './constants';
import { HealthCheckRegistryService } from './health-check-registry.service';

@Controller(HEALTH_CHECK_ROUTE)
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private healthCheckRegistryService: HealthCheckRegistryService,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check(this.healthCheckRegistryService.healthIndicatorFunctions);
    }
}
