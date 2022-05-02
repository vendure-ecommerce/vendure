import { HealthIndicatorFunction } from '@nestjs/terminus';
import { HealthCheckStrategy, Injector } from '@vendure/core';

import { RedisHealthIndicator } from './redis-health-indicator';

let indicator: RedisHealthIndicator;

export class RedisHealthCheckStrategy implements HealthCheckStrategy {
    init(injector: Injector) {
        indicator = injector.get(RedisHealthIndicator);
    }
    getHealthIndicator(): HealthIndicatorFunction {
        return () => indicator.isHealthy('redis (job queue)');
    }
}
