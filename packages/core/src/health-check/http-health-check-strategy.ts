import { HealthIndicatorFunction, HttpHealthIndicator } from '@nestjs/terminus';

import { Injector } from '../common/index';
import { HealthCheckStrategy } from '../config/system/health-check-strategy';

let indicator: HttpHealthIndicator;

export interface HttpHealthCheckOptions {
    key: string;
    url: string;
    timeout?: number;
}

/**
 * @description
 * A {@link HealthCheckStrategy} used to check health by pinging a url. Internally it uses
 * the [NestJS HttpHealthIndicator](https://docs.nestjs.com/recipes/terminus#http-healthcheck).
 *
 * @example
 * ```TypeScript
 * import { HttpHealthCheckStrategy, TypeORMHealthCheckStrategy } from '\@vendure/core';
 *
 * export const config = {
 *   // ...
 *   systemOptions: {
 *     healthChecks: [
 *       new TypeORMHealthCheckStrategy(),
 *       new HttpHealthCheckStrategy({ key: 'my-service', url: 'https://my-service.com' }),
 *     ]
 *   },
 * };
 * ```
 *
 * @docsCategory health-check
 */
export class HttpHealthCheckStrategy implements HealthCheckStrategy {
    constructor(private options: HttpHealthCheckOptions) {}

    async init(injector: Injector) {
        indicator = await injector.get(HttpHealthIndicator);
    }

    getHealthIndicator(): HealthIndicatorFunction {
        const { key, url, timeout } = this.options;
        return () => indicator.pingCheck(key, url, { timeout });
    }
}
