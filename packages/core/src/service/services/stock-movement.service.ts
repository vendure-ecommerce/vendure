import { Injectable } from '@nestjs/common';
import { GlobalFlag, StockMovementListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { ShippingCalculator } from '../../config/shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from '../../config/shipping-method/shipping-eligibility-checker';
import { OrderItem } from '../../entity/order-item/order-item.entity';
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
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { GlobalSettingsService } from './global-settings.service';

@Injectable()
export class StockMovementService {
    shippingEligibilityCheckers: ShippingEligibilityChecker[];
    shippingCalculators: ShippingCalculator[];
    private activeShippingMethods: ShippingMethod[];

    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private globalSettingsService: GlobalSettingsService,
    ) {}

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

        const adjustment = new StockAdjustment({
            quantity: delta,
            productVariant: { id: productVariantId },
        });
        return this.connection.getRepository(ctx, StockAdjustment).save(adjustment);
    }

    async createAllocationsForOrder(ctx: RequestContext, order: Order): Promise<Allocation[]> {
        if (order.active !== false) {
            throw new InternalServerError('error.cannot-create-allocations-for-active-order');
        }
        const allocations: Allocation[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        for (const line of order.lines) {
            const { productVariant } = line;
            const allocation = new Allocation({
                productVariant,
                quantity: line.quantity,
                orderLine: line,
            });
            allocations.push(allocation);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockAllocated += line.quantity;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        return this.connection.getRepository(ctx, Allocation).save(allocations);
    }

    async createSalesForOrder(ctx: RequestContext, orderItems: OrderItem[]): Promise<Sale[]> {
        const sales: Sale[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        const orderItemsWithVariants = await this.connection.getRepository(ctx, OrderItem).findByIds(
            orderItems.map(i => i.id),
            {
                relations: ['line', 'line.productVariant'],
            },
        );
        const orderLinesMap = new Map<ID, { line: OrderLine; items: OrderItem[] }>();

        for (const orderItem of orderItemsWithVariants) {
            let value = orderLinesMap.get(orderItem.line.id);
            if (!value) {
                value = { line: orderItem.line, items: [] };
                orderLinesMap.set(orderItem.line.id, value);
            }
            value.items.push(orderItem);
        }
        for (const lineRow of orderLinesMap.values()) {
            const { productVariant } = lineRow.line;
            const sale = new Sale({
                productVariant,
                quantity: lineRow.items.length * -1,
                orderLine: lineRow.line,
            });
            sales.push(sale);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockOnHand -= lineRow.items.length;
                productVariant.stockAllocated -= lineRow.items.length;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        return this.connection.getRepository(ctx, Sale).save(sales);
    }

    async createCancellationsForOrderItems(ctx: RequestContext, items: OrderItem[]): Promise<Cancellation[]> {
        const orderItems = await this.connection.getRepository(ctx, OrderItem).findByIds(
            items.map(i => i.id),
            {
                relations: ['line', 'line.productVariant'],
            },
        );
        const cancellations: Cancellation[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        const variantsMap = new Map<ID, ProductVariant>();
        for (const item of orderItems) {
            let productVariant: ProductVariant;
            const productVariantId = item.line.productVariant.id;
            if (variantsMap.has(productVariantId)) {
                // tslint:disable-next-line:no-non-null-assertion
                productVariant = variantsMap.get(productVariantId)!;
            } else {
                productVariant = item.line.productVariant;
                variantsMap.set(productVariantId, productVariant);
            }
            const cancellation = new Cancellation({
                productVariant,
                quantity: 1,
                orderItem: item,
            });
            cancellations.push(cancellation);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockOnHand += 1;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        return this.connection.getRepository(ctx, Cancellation).save(cancellations);
    }

    async createReleasesForOrderItems(ctx: RequestContext, items: OrderItem[]): Promise<Release[]> {
        const orderItems = await this.connection.getRepository(ctx, OrderItem).findByIds(
            items.map(i => i.id),
            {
                relations: ['line', 'line.productVariant'],
            },
        );
        const releases: Release[] = [];
        const globalTrackInventory = (await this.globalSettingsService.getSettings(ctx)).trackInventory;
        const variantsMap = new Map<ID, ProductVariant>();
        for (const item of orderItems) {
            let productVariant: ProductVariant;
            const productVariantId = item.line.productVariant.id;
            if (variantsMap.has(productVariantId)) {
                // tslint:disable-next-line:no-non-null-assertion
                productVariant = variantsMap.get(productVariantId)!;
            } else {
                productVariant = item.line.productVariant;
                variantsMap.set(productVariantId, productVariant);
            }
            const release = new Release({
                productVariant,
                quantity: 1,
                orderItem: item,
            });
            releases.push(release);

            if (this.trackInventoryForVariant(productVariant, globalTrackInventory)) {
                productVariant.stockAllocated -= 1;
                await this.connection
                    .getRepository(ctx, ProductVariant)
                    .save(productVariant, { reload: false });
            }
        }
        return this.connection.getRepository(ctx, Release).save(releases);
    }

    private trackInventoryForVariant(variant: ProductVariant, globalTrackInventory: boolean): boolean {
        return (
            variant.trackInventory === GlobalFlag.TRUE ||
            (variant.trackInventory === GlobalFlag.INHERIT && globalTrackInventory)
        );
    }
}
