import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { AvailableStock, ConfigService } from '../../config/index';
import { TransactionalConnection } from '../../connection/index';
import { ProductVariant, StockLevel } from '../../entity/index';

import { StockLocationService } from './stock-location.service';

/**
 * @description
 * The StockLevelService is responsible for managing the stock levels of ProductVariants.
 * Whenever you need to adjust the `stockOnHand` or `stockAllocated` for a ProductVariant,
 * you should use this service.
 *
 * @docsCategory services
 * @since 2.0.0
 */
@Injectable()
export class StockLevelService {
    constructor(
        private connection: TransactionalConnection,
        private stockLocationService: StockLocationService,
        private configService: ConfigService,
    ) {}

    /**
     * @description
     * Returns the StockLevel for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async getStockLevel(ctx: RequestContext, productVariantId: ID, stockLocationId: ID): Promise<StockLevel> {
        const stockLevel = await this.connection.getRepository(ctx, StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (stockLevel) {
            return stockLevel;
        }
        return this.connection.getRepository(ctx, StockLevel).save(
            new StockLevel({
                productVariantId,
                stockLocationId,
                stockOnHand: 0,
                stockAllocated: 0,
            }),
        );
    }

    async getStockLevelsForVariant(ctx: RequestContext, productVariantId: ID): Promise<StockLevel[]> {
        return this.connection.getRepository(ctx, StockLevel).find({
            where: {
                productVariantId,
            },
        });
    }

    /**
     * @description
     * Returns the available stock (on hand and allocated) for the given {@link ProductVariant}. This is determined
     * by the configured {@link StockLocationStrategy}.
     */
    async getAvailableStock(ctx: RequestContext, productVariantId: ID): Promise<AvailableStock> {
        const { stockLocationStrategy } = this.configService.catalogOptions;
        const stockLevels = await this.connection.getRepository(ctx, StockLevel).find({
            where: {
                productVariantId,
            },
        });
        return stockLocationStrategy.getAvailableStock(ctx, productVariantId, stockLevels);
    }

    /**
     * @description
     * Updates the `stockOnHand` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async updateStockOnHandForLocation(
        ctx: RequestContext,
        productVariantId: ID,
        stockLocationId: ID,
        change: number,
    ) {
        const stockLevel = await this.connection.getRepository(ctx, StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (!stockLevel) {
            await this.connection.getRepository(ctx, StockLevel).save(
                new StockLevel({
                    productVariantId,
                    stockLocationId,
                    stockOnHand: change,
                    stockAllocated: 0,
                }),
            );
        }
        if (stockLevel) {
            await this.connection
                .getRepository(ctx, StockLevel)
                .update(stockLevel.id, { stockOnHand: stockLevel.stockOnHand + change });
        }
    }

    /**
     * @description
     * Updates the `stockAllocated` for the given {@link ProductVariant} and {@link StockLocation}.
     */
    async updateStockAllocatedForLocation(
        ctx: RequestContext,
        productVariantId: ID,
        stockLocationId: ID,
        change: number,
    ) {
        const stockLevel = await this.connection.getRepository(ctx, StockLevel).findOne({
            where: {
                productVariantId,
                stockLocationId,
            },
        });
        if (stockLevel) {
            await this.connection
                .getRepository(ctx, StockLevel)
                .update(stockLevel.id, { stockAllocated: stockLevel.stockAllocated + change });
        }
    }
}
