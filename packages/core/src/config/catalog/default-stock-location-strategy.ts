import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { idsAreEqual, Injector } from '../../common/index';
import { TransactionalConnection } from '../../connection/index';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { StockLevel } from '../../entity/stock-level/stock-level.entity';
import { StockLocation } from '../../entity/stock-location/stock-location.entity';
import { Allocation } from '../../entity/stock-movement/allocation.entity';

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
    private connection: TransactionalConnection;

    init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

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
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]> {
        return [{ location: stockLocations[0], quantity }];
    }

    async forCancellation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.getLocationsBasedOnAllocations(ctx, stockLocations, orderLine, quantity);
    }

    async forRelease(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.getLocationsBasedOnAllocations(ctx, stockLocations, orderLine, quantity);
    }

    async forSale(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): Promise<LocationWithQuantity[]> {
        return this.getLocationsBasedOnAllocations(ctx, stockLocations, orderLine, quantity);
    }

    private async getLocationsBasedOnAllocations(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ) {
        const allocations = await this.connection.getRepository(ctx, Allocation).find({
            where: {
                orderLine: { id: orderLine.id },
            },
        });
        let unallocated = quantity;
        const quantityByLocationId = new Map<ID, number>();
        for (const allocation of allocations) {
            if (unallocated <= 0) {
                break;
            }
            const qtyAtLocation = quantityByLocationId.get(allocation.stockLocationId);
            const qtyToAdd = Math.min(allocation.quantity, unallocated);
            if (qtyAtLocation != null) {
                quantityByLocationId.set(allocation.stockLocationId, qtyAtLocation + qtyToAdd);
            } else {
                quantityByLocationId.set(allocation.stockLocationId, qtyToAdd);
            }
            unallocated -= qtyToAdd;
        }
        return [...quantityByLocationId.entries()].map(([locationId, qty]) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            location: stockLocations.find(l => idsAreEqual(l.id, locationId))!,
            quantity: qty,
        }));
    }
}
