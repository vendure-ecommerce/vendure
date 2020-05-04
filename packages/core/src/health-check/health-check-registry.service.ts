import { HealthIndicatorFunction } from '@nestjs/terminus';

/**
 * @description
 * This service is used to register health indicator functions to be included in the
 * health check. It wraps the [Nestjs Terminus module](https://docs.nestjs.com/recipes/terminus),
 * so see those docs for information on creating custom health checks.
 *
 * Plugins which rely on external services (web services, databases etc.) can make use of this
 * service to add a check for that dependency to the Vendure health check.
 *
 * @docsCategory health-check
 */
export class HealthCheckRegistryService {
    get healthIndicatorFunctions(): HealthIndicatorFunction[] {
        return this._healthIndicatorFunctions;
    }
    private _healthIndicatorFunctions: HealthIndicatorFunction[] = [];

    /**
     * @description
     * Registers one or more `HealthIndicatorFunctions` (see [Nestjs docs](https://docs.nestjs.com/recipes/terminus#custom-health-indicator))
     * to be added to the health check endpoint.
     */
    registerIndicatorFunction(fn: HealthIndicatorFunction | HealthIndicatorFunction[]) {
        const fnArray = Array.isArray(fn) ? fn : [fn];
        this._healthIndicatorFunctions.push(...fnArray);
    }
}
