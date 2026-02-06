import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { TelemetryConfig } from '../telemetry.types';

/**
 * Collects configuration information for telemetry.
 * Only collects strategy class names and non-sensitive configuration values.
 */
@Injectable()
export class ConfigCollector {
    constructor(private readonly configService: ConfigService) {}

    collect(): TelemetryConfig {
        return {
            assetStorageType: this.getAssetStorageType(),
            jobQueueType: this.getJobQueueType(),
            entityIdStrategy: this.getEntityIdStrategy(),
            defaultLanguage: this.configService.defaultLanguageCode,
            customFieldsCount: this.countCustomFields(),
            authenticationMethods: this.getAuthenticationMethods(),
        };
    }

    private getAssetStorageType(): string {
        try {
            return getStrategyName(this.configService.assetOptions.assetStorageStrategy);
        } catch {
            return 'unknown';
        }
    }

    private getJobQueueType(): string {
        try {
            return getStrategyName(this.configService.jobQueueOptions.jobQueueStrategy);
        } catch {
            return 'unknown';
        }
    }

    private getEntityIdStrategy(): string {
        try {
            const strategy =
                this.configService.entityOptions.entityIdStrategy ?? this.configService.entityIdStrategy;
            return strategy ? getStrategyName(strategy) : 'unknown';
        } catch {
            return 'unknown';
        }
    }

    private countCustomFields(): number {
        try {
            const customFields = this.configService.customFields;
            let count = 0;

            for (const entityName of Object.keys(customFields)) {
                const fields = customFields[entityName as keyof typeof customFields];
                if (Array.isArray(fields)) {
                    count += fields.length;
                }
            }

            return count;
        } catch {
            return 0;
        }
    }

    private getAuthenticationMethods(): string[] {
        try {
            const methods = new Set<string>();

            const adminStrategies = this.configService.authOptions.adminAuthenticationStrategy;
            const shopStrategies = this.configService.authOptions.shopAuthenticationStrategy;

            for (const strategy of adminStrategies) {
                methods.add(getStrategyName(strategy));
            }

            for (const strategy of shopStrategies) {
                methods.add(getStrategyName(strategy));
            }

            return Array.from(methods).sort((a, b) => a.localeCompare(b));
        } catch {
            return [];
        }
    }
}

/**
 * Gets the name of a strategy, resilient to code minification.
 * Prefers an explicit `name` property (e.g. AuthenticationStrategy.name),
 * then falls back to `constructor.name`. Returns 'unknown' if the name
 * appears to be minified (single char or empty).
 */
function getStrategyName(strategy: { name?: string; constructor?: { name?: string } }): string {
    if (typeof strategy.name === 'string' && strategy.name.length > 1) {
        return strategy.name;
    }
    const ctorName = strategy.constructor?.name;
    if (ctorName && ctorName.length > 1) {
        return ctorName;
    }
    return 'unknown';
}
