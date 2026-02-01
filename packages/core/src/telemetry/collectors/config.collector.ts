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
            return this.configService.assetOptions.assetStorageStrategy.constructor.name;
        } catch {
            return 'unknown';
        }
    }

    private getJobQueueType(): string {
        try {
            return this.configService.jobQueueOptions.jobQueueStrategy.constructor.name;
        } catch {
            return 'unknown';
        }
    }

    private getEntityIdStrategy(): string {
        try {
            const strategy =
                this.configService.entityOptions.entityIdStrategy ?? this.configService.entityIdStrategy;
            return strategy?.constructor.name ?? 'unknown';
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
                methods.add(strategy.constructor.name);
            }

            for (const strategy of shopStrategies) {
                methods.add(strategy.constructor.name);
            }

            return Array.from(methods).sort((a, b) => a.localeCompare(b));
        } catch {
            return [];
        }
    }
}
