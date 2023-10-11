import { HealthIndicatorFunction, TypeOrmHealthIndicator } from '@nestjs/terminus';

import { Injector } from '../common/index';
import { HealthCheckStrategy } from '../config/system/health-check-strategy';

let indicator: TypeOrmHealthIndicator;

export interface TypeORMHealthCheckOptions {
    key?: string;
    timeout?: number;
}

/**
 * @description
 * A {@link HealthCheckStrategy} used to check the health of the database. This health
 * check is included by default, but can be customized by explicitly adding it to the
 * `systemOptions.healthChecks` array:
 *
 * @example
 * ```ts
 * import { TypeORMHealthCheckStrategy } from '\@vendure/core';
 *
 * export const config = {
 *   // ...
 *   systemOptions: [
 *     // The default key is "database" and the default timeout is 1000ms
 *     // Sometimes this is too short and leads to false negatives in the
 *     // /health endpoint.
 *     new TypeORMHealthCheckStrategy({ key: 'postgres-db', timeout: 5000 }),
 *   ]
 * }
 * ```
 *
 * @docsCategory health-check
 */
export class TypeORMHealthCheckStrategy implements HealthCheckStrategy {
    constructor(private options?: TypeORMHealthCheckOptions) {}

    async init(injector: Injector) {
        indicator = await injector.resolve(TypeOrmHealthIndicator);
    }

    getHealthIndicator(): HealthIndicatorFunction {
        const key = this.options?.key || 'database';
        const timeout = this.options?.timeout ?? 1000;
        return () => indicator.pingCheck(key, { timeout });
    }
}
