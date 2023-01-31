import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { OrderLine, StockLevel, StockLocation } from '../../entity/index';

import { AvailableStock, LocationWithQuantity, StockLocationStrategy } from './stock-location-strategy';

/**
 * @description
 * The DefaultStockLocationStrategy is the default implementation of the {@link StockLocationStrategy}.
 * It assumes only a single StockLocation and that all stock is allocated from that location.
 *
 * @docsCategory catalog
 * @since 2.0.0
 */
export class DefaultStockLocationStrategy implements StockLocationStrategy {
    getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]): AvailableStock {
        let stockOnHand = 0;
        let stockAllocated = 0;
        for (const stockLevel of stockLevels) {
            stockOnHand += stockLevel.stockOnHand;
            stockAllocated += stockLevel.stockAllocated;
        }
        return { stockOnHand, stockAllocated };
    }

    forAllocation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ) {
        return [{ location: stockLocations[0], quantity }];
    }

    forRelease(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]> {
        return [{ location: stockLocations[0], quantity }];
    }

    forSale(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]> {
        return [{ location: stockLocations[0], quantity }];
    }

    forCancellation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]> {
        return [{ location: stockLocations[0], quantity }];
    }
}
