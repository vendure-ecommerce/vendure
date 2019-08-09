import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { filterAsync } from '@vendure/common/lib/filter-async';
import { AdjustmentType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { idsAreEqual } from '../../../common/utils';
import { PromotionUtils, ShippingCalculationResult } from '../../../config';
import { ConfigService } from '../../../config/config.service';
import { OrderLine, ProductVariant } from '../../../entity';
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
     */
    async applyPriceAdjustments(ctx: RequestContext, order: Order, promotions: Promotion[]): Promise<Order> {
        const { taxZoneStrategy } = this.configService.taxOptions;
        const zones = this.zoneService.findAll(ctx);
        const activeTaxZone = taxZoneStrategy.determineTaxZone(zones, ctx.channel, order);
        order.clearAdjustments();
        if (order.lines.length) {
            // First apply taxes to the non-discounted prices
            this.applyTaxes(ctx, order, activeTaxZone);
            // Then test and apply promotions
            await this.applyPromotions(order, promotions);
            // Finally, re-calculate taxes because the promotions may have
            // altered the unit prices, which in turn will alter the tax payable.
            this.applyTaxes(ctx, order, activeTaxZone);
            await this.applyShipping(ctx, order);
        } else {
            this.calculateOrderTotals(order);
        }
        return order;
    }

    /**
     * Applies the correct TaxRate to each OrderItem in the order.
     */
    private applyTaxes(ctx: RequestContext, order: Order, activeZone: Zone) {
        for (const line of order.lines) {
            line.clearAdjustments(AdjustmentType.TAX);

            const applicableTaxRate = this.taxRateService.getApplicableTaxRate(activeZone, line.taxCategory);
            const { price, priceIncludesTax, priceWithTax, priceWithoutTax } = this.taxCalculator.calculate(
                line.unitPrice,
                line.taxCategory,
                activeZone,
                ctx,
            );

            line.setUnitPriceIncludesTax(priceIncludesTax);
            line.setTaxRate(applicableTaxRate.value);

            if (!priceIncludesTax) {
                for (const item of line.items) {
                    item.pendingAdjustments = item.pendingAdjustments.concat(
                        applicableTaxRate.apply(item.unitPriceWithPromotions),
                    );
                }
            }
            this.calculateOrderTotals(order);
        }
    }

    /**
     * Applies any eligible promotions to each OrderItem in the order.
     */
    private async applyPromotions(order: Order, promotions: Promotion[]) {
        const utils = this.createPromotionUtils();
        for (const line of order.lines) {
            // Must be re-calculated for each line, since the previous lines may have triggered promotions
            // which affected the order price.
            const applicablePromotions = await filterAsync(promotions, p => p.test(order, utils));

            line.clearAdjustments(AdjustmentType.PROMOTION);

            for (const promotion of applicablePromotions) {
                if (await promotion.test(order, utils)) {
                    for (const item of line.items) {
                        if (applicablePromotions) {
                            const adjustment = await promotion.apply({
                                orderItem: item,
                                orderLine: line,
                                utils,
                            });
                            if (adjustment) {
                                item.pendingAdjustments = item.pendingAdjustments.concat(adjustment);
                            }
                        }
                    }
                }
                this.calculateOrderTotals(order);
            }
        }

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
