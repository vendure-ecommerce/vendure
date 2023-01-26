import { Injectable } from '@nestjs/common';
import { GlobalFlag, OrderLineInput, StockMovementListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { idsAreEqual } from '../../common/index';
import { ShippingCalculator } from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { ShippingMethod } from '../../entity/shipping-method/shipping-method.entity';
import { Allocation } from '../../entity/stock-movement/allocation.entity';
import { Cancellation } from '../../entity/stock-movement/cancellation.entity';
import { Release } from '../../entity/stock-movement/release.entity';
import { Sale } from '../../entity/stock-movement/sale.entity';
import { StockAdjustment } from '../../entity/stock-movement/stock-adjustment.entity';
import { StockMovement } from '../../entity/stock-movement/stock-movement.entity';
import { EventBus } from '../../event-bus/event-bus';
import { StockMovementEvent } from '../../event-bus/events/stock-movement-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';

import { GlobalSettingsService } from './global-settings.service';

/**
 * @description
 * Contains methods relating to {@link StockMovement} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class StockMovementService {
    shippingEligibilityCheckers: ShippingEligibilityChecker[];
    shippingCalculators: ShippingCalculator[];
    private activeShippingMethods: ShippingMethod[];

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private globalSettingsService: GlobalSettingsService,
        private eventBus: EventBus,
    ) {}

    /**
     * @description
     * Returns a {@link PaginatedList} of all StockMovements associated with the specified ProductVariant.
     */
    getStockMovementsByProductVariantId(
        ctx: RequestContext,
        productVariantId: ID,
        options: StockMovementListOptions,
    ): Promise<PaginatedList<StockMovement>> {
        return this.listQueryBuilder
            .build<StockMovement>(StockMovement as any, options, { ctx })
            .leftJoin('stockmovement.productVariant', 'productVariant')
            .andWhere('productVariant.id = :productVariantId', { productVariantId })
            .getManyAndCount()
            .then(async ([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    /**
     * @description
     * Adjusts the stock level of the ProductVariant, creating a new {@link StockAdjustment} entity
     * in the process.
     */
    async adjustProductVariantStock(
        ctx: RequestContext,
        productVariantId: ID,
        oldStockLevel: number,
        newStockLevel: number,
    ): Promise<StockAdjustment | undefined> {
        if (oldStockLevel === newStockLevel) {
            return;
        }
        const delta = newStockLevel - oldStockLevel;

        const adjustment = await this.connection.getRepository(ctx, StockAdjustment).save(
            new StockAdjustment({
                quantity: delta,
                productVariant: { id: productVariantId },
            }),
        );
        this.eventBus.publish(new StockMovementEvent(ctx, [adjustment]));
        return adjustment;
    }

    /**
     * @description
     * Creates a new {@link Allocation} for each OrderLine in the Order. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * increased, indicating that this quantity of stock is allocated and cannot be sold.
     */
    async createAllocationsForOrder(ctx: RequestContext, order: Order): Promise<Allocation[]> {
        if (order.active !== false) {
            throw new InternalServerError('error.cannot-create-allocations-for-active-order');
        }
        const lines = order.lines.map(orderLine => ({
            orderLineId: orderLine.id,
            quantity: orderLine.quantity,
        }));
        return this.createAllocationsForOrderLines(ctx, lines);
    }

    /**
     * @description
     * Creates a new {@link Allocation} for each of the given OrderLines. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * increased, indicating that this quantity of stock is allocated and cannot be sold.
     */
    async createAllocationsForOrderLines(
        ctx: RequestContext,
        lines: OrderLineInput[],
    ): Promise<Allocation[]> {
        const allocations: Allocation[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        for (const { orderLineId, quantity } of lines) {
            const orderLine = await this.connection.getEntityOrThrow(ctx, OrderLine, orderLineId);
            const productVariant = await this.connection.getEntityOrThrow(
                ctx,
                ProductVariant,
                orderLine.productVariantId,
            );
            const allocation = new Allocation({
                productVariant,
                quantity,
                orderLine,
            });
            allocations.push(allocation);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockAllocated += quantity;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        const savedAllocations = await this.connection.getRepository(ctx, Allocation).save(allocations);
        if (savedAllocations.length) {
            this.eventBus.publish(new StockMovementEvent(ctx, savedAllocations));
        }
        return savedAllocations;
    }

    /**
     * @description
     * Creates {@link Sale}s for each OrderLine in the Order. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * reduced and the `stockOnHand` value is also reduced by the OrderLine quantity, indicating
     * that the stock is no longer allocated, but is actually sold and no longer available.
     */
    async createSalesForOrder(ctx: RequestContext, lines: OrderLineInput[]): Promise<Sale[]> {
        const sales: Sale[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        const orderLines = await this.connection
            .getRepository(ctx, OrderLine)
            .findByIds(lines.map(line => line.orderLineId));
        for (const lineRow of lines) {
            const orderLine = orderLines.find(line => idsAreEqual(line.id, lineRow.orderLineId));
            if (!orderLine) {
                continue;
            }
            const productVariant = await this.connection.getEntityOrThrow(
                ctx,
                ProductVariant,
                orderLine.productVariantId,
            );
            const sale = new Sale({
                productVariant,
                quantity: lineRow.quantity * -1,
                orderLine,
            });
            sales.push(sale);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockOnHand -= lineRow.quantity;
                productVariant.stockAllocated -= lineRow.quantity;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        const savedSales = await this.connection.getRepository(ctx, Sale).save(sales);
        if (savedSales.length) {
            this.eventBus.publish(new StockMovementEvent(ctx, savedSales));
        }
        return savedSales;
    }

    /**
     * @description
     * Creates a {@link Cancellation} for each of the specified OrderItems. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockOnHand` value is
     * increased for each Cancellation, allowing that stock to be sold again.
     */
    async createCancellationsForOrderLines(
        ctx: RequestContext,
        lineInputs: OrderLineInput[],
    ): Promise<Cancellation[]> {
        const orderLines = await this.connection.getRepository(ctx, OrderLine).findByIds(
            lineInputs.map(line => line.orderLineId),
            {
                relations: ['productVariant'],
            },
        );

        const cancellations: Cancellation[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        for (const line of orderLines) {
            const lineInput = lineInputs.find(l => idsAreEqual(l.orderLineId, line.id));
            if (!lineInput) {
                continue;
            }
            const cancellation = new Cancellation({
                productVariant: line.productVariant,
                quantity: lineInput.quantity,
                orderLine: line,
            });
            cancellations.push(cancellation);

            if (this.trackInventoryForVariant(line.productVariant, globalTrackInventory)) {
                line.productVariant.stockOnHand += lineInput.quantity;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(line.productVariant, { reload: false });
            }
        }
        const savedCancellations = await this.connection.getRepository(ctx, Cancellation).save(cancellations);
        if (savedCancellations.length) {
            this.eventBus.publish(new StockMovementEvent(ctx, savedCancellations));
        }
        return savedCancellations;
    }

    /**
     * @description
     * Creates a {@link Release} for each of the specified OrderItems. For ProductVariants
     * which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
     * reduced, indicating that this stock is once again available to buy.
     */
    async createReleasesForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]): Promise<Release[]> {
        const releases: Release[] = [];
        const orderLines = await this.connection.getRepository(ctx, OrderLine).findByIds(
            lineInputs.map(line => line.orderLineId),
            {
                relations: ['productVariant'],
            },
        );
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        const variantsMap = new Map<ID, ProductVariant>();
        for (const line of orderLines) {
            const lineInput = lineInputs.find(l => idsAreEqual(l.orderLineId, line.id));
            if (!lineInput) {
                continue;
            }
            const release = new Release({
                productVariant: line.productVariant,
                quantity: lineInput.quantity,
                orderLine: line,
            });
            releases.push(release);

            if (this.trackInventoryForVariant(line.productVariant, globalTrackInventory)) {
                line.productVariant.stockAllocated -= lineInput.quantity;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(line.productVariant, { reload: false });
            }
        }
        const savedReleases = await this.connection.getRepository(ctx, Release).save(releases);
        if (savedReleases.length) {
            this.eventBus.publish(new StockMovementEvent(ctx, savedReleases));
        }
        return savedReleases;
    }

    private trackInventoryForVariant(variant: ProductVariant, globalTrackInventory: boolean): boolean {
        return (
            variant.trackInventory === GlobalFlag.TRUE ||
            (variant.trackInventory === GlobalFlag.INHERIT && globalTrackInventory)
        );
    }
}
