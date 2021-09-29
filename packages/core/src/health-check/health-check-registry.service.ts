import { HealthIndicatorFunction } from '@nestjs/terminus';

/**
 * @description
 * This service is used to register health indicator functions to be included in the
 * health check. Health checks can be used by automated services such as Kubernetes
 * to determine the state of applications it is running. They are also useful for
 * administrators to get an overview of the health of all the parts of the
 * Vendure stack.
 *
 * It wraps the [Nestjs Terminus module](https://docs.nestjs.com/recipes/terminus),
 * so see those docs for information on creating custom health checks.
 *
 * Plugins which rely on external services (web services, databases etc.) can make use of this
 * service to add a check for that dependency to the Vendure health check.
 *
 * To use it in your plugin, you'll need to import the {@link PluginCommonModule}:
 *
 * @example
 * ```TypeScript
 * import { HealthCheckRegistryService, PluginCommonModule, VendurePlugin } from '\@vendure/core';
 * import { TerminusModule } from '\@nestjs/terminus';
 *
 * \@VendurePlugin({
 *   imports: [PluginCommonModule, TerminusModule],
 * })
 * export class MyPlugin {
 *   constructor(
 *     private registry: HealthCheckRegistryService
 *     private httpIndicator: HttpHealthIndicator
 *   ) {
 *     registry.registerIndicatorFunction(
 *       () => this.httpIndicator.pingCheck('vendure-docs', 'https://www.vendure.io/docs/'),
 *     )
 *   }
 * }
 * ```
 *
 * @docsCategory health-check
 */
export class HealthCheckRegistryService {
    /** @internal */
    get healthIndicatorFunctions(): HealthIndicatorFunction[] {
        return this._healthIndicatorFunctions;
    }
    private _healthIndicatorFunctions: HealthIndicatorFunction[] = [];

    /**
     * @description
     * Registers one or more `HealthIndicatorFunctions` (see [Nestjs docs](https://docs.nestjs.com/recipes/terminus#setting-up-a-healthcheck))
     * to be added to the health check endpoint.
     * The indicator will also appear in the Admin UI's "system status" view.
     */
    registerIndicatorFunction(fn: HealthIndicatorFunction | HealthIndicatorFunction[]) {
        const fnArray = Array.isArray(fn) ? fn : [fn];
        this._healthIndicatorFunctions.push(...fnArray);
    }
}
