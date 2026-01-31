import { Injectable } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Customer } from '../../entity/customer/customer.entity';
import { coreEntitiesMap } from '../../entity/entities';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { toRangeBucket } from '../helpers/range-bucket.helper';
import { TelemetryEntityMetrics } from '../telemetry.types';

export interface DatabaseInfo {
    databaseType: 'postgres' | 'mysql' | 'mariadb' | 'sqlite';
    metrics: TelemetryEntityMetrics;
}

/**
 * Collects database type and entity metrics for telemetry.
 */
@Injectable()
export class DatabaseCollector {
    constructor(
        private configService: ConfigService,
        private connection: TransactionalConnection,
    ) {}

    async collect(): Promise<DatabaseInfo> {
        const databaseType = this.getDatabaseType();
        const metrics = await this.collectEntityMetrics();

        return {
            databaseType,
            metrics,
        };
    }

    private getDatabaseType(): 'postgres' | 'mysql' | 'mariadb' | 'sqlite' {
        const dbType = this.configService.dbConnectionOptions.type;

        switch (dbType) {
            case 'postgres':
                return 'postgres';
            case 'mysql':
                return 'mysql';
            case 'mariadb':
                return 'mariadb';
            case 'better-sqlite3':
            case 'sqlite':
                return 'sqlite';
            default:
                // Default to postgres for unknown types
                return 'postgres';
        }
    }

    private async collectEntityMetrics(): Promise<TelemetryEntityMetrics> {
        const [productCount, orderCount, customerCount, variantCount] = await Promise.all([
            this.safeCount(Product),
            this.safeCount(Order),
            this.safeCount(Customer),
            this.safeCount(ProductVariant),
        ]);

        const customEntities = this.getCustomEntities();
        const customEntityCount = customEntities.length;

        // Only count custom entity records if there are custom entities
        let totalCustomRecords: number | undefined;
        if (customEntityCount > 0) {
            const counts = await Promise.all(customEntities.map(entity => this.safeCount(entity)));
            totalCustomRecords = counts.reduce((sum, count) => sum + count, 0);
        }

        return {
            entities: {
                product: toRangeBucket(productCount),
                order: toRangeBucket(orderCount),
                customer: toRangeBucket(customerCount),
                productVariant: toRangeBucket(variantCount),
            },
            custom: {
                entityCount: customEntityCount,
                ...(totalCustomRecords !== undefined && { totalRecords: toRangeBucket(totalCustomRecords) }),
            },
        };
    }

    private async safeCount(entity: new (...args: any[]) => any): Promise<number> {
        try {
            return await this.connection.rawConnection.getRepository(entity).count();
        } catch {
            return 0;
        }
    }

    private getCustomEntities(): Array<new (...args: any[]) => any> {
        const entities = this.configService.dbConnectionOptions.entities;
        if (!Array.isArray(entities)) {
            return [];
        }

        const coreEntityNames = new Set(Object.keys(coreEntitiesMap));
        const customEntities: Array<new (...args: any[]) => any> = [];

        for (const entity of entities) {
            if (typeof entity === 'function') {
                const entityName = entity.name;
                if (!coreEntityNames.has(entityName)) {
                    customEntities.push(entity as new (...args: any[]) => any);
                }
            }
        }

        return customEntities;
    }
}
