import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { filterAsync } from '@vendure/common/lib/filter-async';
import { AdjustmentType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { InternalServerError } from '../../../common/error/errors';
import { idsAreEqual } from '../../../common/utils';
import { PromotionUtils, ShippingCalculationResult } from '../../../config';
import { ConfigService } from '../../../config/config.service';
import { OrderItem, OrderLine, ProductVariant, TaxCategory, TaxRate } from '../../../entity';
import { Order } from '../../../entity/order/order.entity';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { ShippingMethod } from '../../../entity/shipping-method/shipping-method.entity';
import { Zone } from '../../../entity/zone/zone.entity';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
import { ShippingCalculator } from '../shipping-calculator/shipping-calculator';
import { TaxCalculator } from '../tax-calculator/tax-calculator';

@Injectable()
export class OrderCalculator {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private zoneService: ZoneService,
        private taxRateService: TaxRateService,
        private taxCalculator: TaxCalculator,
        private shippingCalculator: ShippingCalculator,
    ) {}

    /**
     * Applies taxes and promotions to an Order. Mutates the order object.
     * Returns an array of any OrderItems which had new adjustments
     * applied, either tax or promotions.
     */
    async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        promotions: Promotion[],
        updatedOrderLine?: OrderLine,
    ): Promise<OrderItem[]> {
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = this.zoneService.findAll(ctx);
        const activeTaxZone = taxZoneStrategy.determineTaxZone(zones, ctx.channel, order);
        let taxZoneChanged = false;
        if (!activeTaxZone) {
            throw new InternalServerError(`error.no-active-tax-zone`);
        }
        if (!order.taxZoneId || !idsAreEqual(order.taxZoneId, activeTaxZone.id)) {
            order.taxZoneId = activeTaxZone.id;
            taxZoneChanged = true;
        }
        const updatedOrderItems = new Set<OrderItem>();
        if (updatedOrderLine) {
            this.applyTaxesToOrderLine(
                ctx,
                updatedOrderLine,
                activeTaxZone,
                this.createTaxRateGetter(activeTaxZone),
            );
            updatedOrderLine.activeItems.forEach(item => updatedOrderItems.add(item));
        }
        order.clearAdjustments();
        this.calculateOrderTotals(order);
        if (order.lines.length) {
            if (taxZoneChanged) {
                // First apply taxes to the non-discounted prices
                this.applyTaxes(ctx, order, activeTaxZone);
            }

            // Then test and apply promotions
            const totalBeforePromotions = order.total;
            const itemsModifiedByPromotions = await this.applyPromotions(order, promotions);
            itemsModifiedByPromotions.forEach(item => updatedOrderItems.add(item));

            if (order.total !== totalBeforePromotions || itemsModifiedByPromotions.length) {
                // Finally, re-calculate taxes because the promotions may have
                // altered the unit prices, which in turn will alter the tax payable.
                this.applyTaxes(ctx, order, activeTaxZone);
            }
            await this.applyShipping(ctx, order);
        }
        this.calculateOrderTotals(order);
        return taxZoneChanged ? order.getOrderItems() : Array.from(updatedOrderItems);
    }

    /**
     * Applies the correct TaxRate to each OrderItem in the order.
     */
    private applyTaxes(ctx: RequestContext, order: Order, activeZone: Zone) {
        const getTaxRate = this.createTaxRateGetter(activeZone);
        for (const line of order.lines) {
            this.applyTaxesToOrderLine(ctx, line, activeZone, getTaxRate);
        }
        this.calculateOrderTotals(order);
    }

    /**
     * Applies the correct TaxRate to an OrderLine
     */
    private applyTaxesToOrderLine(
        ctx: RequestContext,
        line: OrderLine,
        activeZone: Zone,
        getTaxRate: (taxCategory: TaxCategory) => TaxRate,
    ) {
        line.clearAdjustments(AdjustmentType.TAX);

        const applicableTaxRate = getTaxRate(line.taxCategory);
        const { price, priceIncludesTax, priceWithTax, priceWithoutTax } = this.taxCalculator.calculate(
            line.unitPrice,
            line.taxCategory,
            activeZone,
            ctx,
        );

        for (const item of line.activeItems) {
            item.unitPriceIncludesTax = priceIncludesTax;
            item.taxRate = applicableTaxRate.value;
            if (!priceIncludesTax) {
                item.pendingAdjustments = item.pendingAdjustments.concat(
                    applicableTaxRate.apply(item.unitPriceWithPromotions),
                );
            }
        }
    }

    /**
     * Returns a memoized function for performing an efficient
     * lookup of the correct TaxRate for a given TaxCategory.
     */
    private createTaxRateGetter(activeZone: Zone): (taxCategory: TaxCategory) => TaxRate {
        const taxRateCache = new Map<TaxCategory, TaxRate>();

        return (taxCategory: TaxCategory): TaxRate => {
            const cached = taxRateCache.get(taxCategory);
            if (cached) {
                return cached;
            }
            const rate = this.taxRateService.getApplicableTaxRate(activeZone, taxCategory);
            taxRateCache.set(taxCategory, rate);
            return rate;
        };
    }

    /**
     * Applies any eligible promotions to each OrderItem in the order. Returns an array of
     * any OrderItems which had their Adjustments modified.
     */
    private async applyPromotions(order: Order, promotions: Promotion[]): Promise<OrderItem[]> {
        const utils = this.createPromotionUtils();
        const updatedItems = await this.applyOrderItemPromotions(order, promotions, utils);
        await this.applyOrderPromotions(order, promotions, utils);
        return updatedItems;
    }

    /**
     * Applies promotions to OrderItems. This is a quite complex function, due to the inherent complexity
     * of applying the promotions, and also due to added complexity in the name of performance
     * optimization. Therefore it is heavily annotated so that the purpose of each step is clear.
     */
    private async applyOrderItemPromotions(order: Order, promotions: Promotion[], utils: PromotionUtils) {
        // The naive implementation updates *every* OrderItem after this function is run.
        // However, on a very large order with hundreds or thousands of OrderItems, this results in
        // very poor performance. E.g. updating a single quantity of an OrderLine results in saving
        // all 1000 (for example) OrderItems to the DB.
        // The solution is to try to be smart about tracking exactly which OrderItems have changed,
        // so that we only update those.
        const updatedOrderItems = new Set<OrderItem>();

        for (const line of order.lines) {
            // Must be re-calculated for each line, since the previous lines may have triggered promotions
            // which affected the order price.
            const applicablePromotions = await filterAsync(promotions, p => p.test(order, utils));

            const forceUpdateItems = this.orderLineHasInapplicablePromotions(applicablePromotions, line);
            if (forceUpdateItems) {
                // This OrderLine contains Promotion adjustments for Promotions that are no longer
                // applicable. So we know for sure we will need to update these OrderItems in the
                // DB. Therefore add them to the `updatedOrderItems` set.
                line.clearAdjustments(AdjustmentType.PROMOTION);
                line.items.forEach(i => updatedOrderItems.add(i));
            }

            for (const promotion of applicablePromotions) {
                let priceAdjusted = false;
                // We need to test the promotion *again*, even though we've tested them for the line.
                // This is because the previous Promotions may have adjusted the Order in such a way
                // as to render later promotions no longer applicable.
                if (await promotion.test(order, utils)) {
                    for (const item of line.items) {
                        const itemHasPromotions =
                            item.pendingAdjustments &&
                            !!item.pendingAdjustments.find(a => a.type === AdjustmentType.PROMOTION);
                        if (itemHasPromotions) {
                            item.clearAdjustments(AdjustmentType.PROMOTION);
                        }
                        const adjustment = await promotion.apply({
                            orderItem: item,
                            orderLine: line,
                            utils,
                        });
                        if (adjustment) {
                            item.pendingAdjustments = item.pendingAdjustments.concat(adjustment);
                            priceAdjusted = true;
                            updatedOrderItems.add(item);
                        } else if (itemHasPromotions) {
                            updatedOrderItems.add(item);
                        }
                    }
                    if (priceAdjusted) {
                        this.calculateOrderTotals(order);
                        priceAdjusted = false;
                    }
                }
            }
            if (forceUpdateItems) {
                // If we are forcing an update, we need to ensure that totals get
                // re-calculated *even if* there are no applicable promotions (i.e.
                // the other call to `this.calculateOrderTotals()` inside the `for...of`
                // loop was never invoked).
                this.calculateOrderTotals(order);
            }
        }
        return Array.from(updatedOrderItems.values());
    }

    /**
     * An OrderLine may have promotion adjustments from Promotions which are no longer applicable.
     * For example, a coupon code might have caused a discount to be applied, and now that code has
     * been removed from the order. The adjustment will still be there on each OrderItem it was applied
     * to, even though that Promotion is no longer found in the `applicablePromotions` array.
     *
     * We need to know about this because it means that all OrderItems in the OrderLine must be
     * updated.
     */
    private orderLineHasInapplicablePromotions(applicablePromotions: Promotion[], line: OrderLine) {
        const applicablePromotionIds = applicablePromotions.map(p => p.getSourceId());

        const linePromotionIds = line.adjustments
            .filter(a => a.type === AdjustmentType.PROMOTION)
            .map(a => a.adjustmentSource);
        const hasPromotionsThatAreNoLongerApplicable = !linePromotionIds.every(id =>
            applicablePromotionIds.includes(id),
        );
        return hasPromotionsThatAreNoLongerApplicable;
    }

    private async applyOrderPromotions(order: Order, promotions: Promotion[], utils: PromotionUtils) {
        order.clearAdjustments(AdjustmentType.PROMOTION);
        const applicableOrderPromotions = await filterAsync(promotions, p => p.test(order, utils));
        if (applicableOrderPromotions.length) {
            for (const promotion of applicableOrderPromotions) {
                // re-test the promotion on each iteration, since the order total
                // may be modified by a previously-applied promotion
                if (await promotion.test(order, utils)) {
                    const adjustment = await promotion.apply({ order, utils });
                    if (adjustment) {
                        order.pendingAdjustments = order.pendingAdjustments.concat(adjustment);
                    }
                }
            }
            this.calculateOrderTotals(order);
        }
    }

    private async applyShipping(ctx: RequestContext, order: Order) {
        const results = await this.shippingCalculator.getEligibleShippingMethods(ctx, order);
        const currentShippingMethod = order.shippingMethod;
        if (results && results.length && currentShippingMethod) {
            let selected: { method: ShippingMethod; result: ShippingCalculationResult } | undefined;
            selected = results.find(r => idsAreEqual(r.method.id, currentShippingMethod.id));
            if (!selected) {
                selected = results[0];
            }
            order.shipping = selected.result.price;
            order.shippingWithTax = selected.result.priceWithTax;
        }
    }

    private calculateOrderTotals(order: Order) {
        let totalPrice = 0;
        let totalTax = 0;

        for (const line of order.lines) {
            totalPrice += line.totalPrice;
            totalTax += line.lineTax;
        }
        const totalPriceBeforeTax = totalPrice - totalTax;

        order.subTotalBeforeTax = totalPriceBeforeTax;
        order.subTotal = totalPrice;
    }

    /**
     * Creates a new PromotionUtils object with a cache which lives as long as the created object.
     */
    private createPromotionUtils(): PromotionUtils {
        const variantCache = new Map<ID, ProductVariant>();

        return {
            hasFacetValues: async (orderLine: OrderLine, facetValueIds: ID[]): Promise<boolean> => {
                let variant = variantCache.get(orderLine.productVariant.id);
                if (!variant) {
                    variant = await this.connection
                        .getRepository(ProductVariant)
                        .findOne(orderLine.productVariant.id, {
                            relations: ['product', 'product.facetValues', 'facetValues'],
                        });
                    if (!variant) {
                        return false;
                    }
                    variantCache.set(variant.id, variant);
                }
                const allFacetValues = unique([...variant.facetValues, ...variant.product.facetValues], 'id');
                return facetValueIds.reduce(
                    (result, id) => result && !!allFacetValues.find(fv => idsAreEqual(fv.id, id)),
                    true as boolean,
                );
            },
        };
    }
}
