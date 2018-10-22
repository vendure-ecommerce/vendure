import { Injectable } from '@nestjs/common';
import { AdjustmentType } from 'shared/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { Order } from '../../../entity/order/order.entity';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { Zone } from '../../../entity/zone/zone.entity';

import { TaxRateService } from '../../services/tax-rate.service';
import { TaxCalculator } from '../tax-calculator/tax-calculator';

@Injectable()
export class OrderCalculator {
    constructor(private taxRateService: TaxRateService, private taxCalculator: TaxCalculator) {}

    /**
     * Applies taxes and promotions to an Order. Mutates the order object.
     */
    applyTaxesAndPromotions(ctx: RequestContext, order: Order, promotions: Promotion[]): Order {
        const activeZone = ctx.channel.defaultTaxZone;
        order.clearAdjustments();
        if (order.lines.length) {
            // First apply taxes to the non-discounted prices
            this.applyTaxes(order, activeZone, ctx);
            // Then test and apply promotions
            this.applyPromotions(order, promotions);
            // Finally, re-calculate taxes because the promotions may have
            // altered the unit prices, which in turn will alter the tax payable.
            this.applyTaxes(order, activeZone, ctx);
        } else {
            this.calculateOrderTotals(order);
        }
        return order;
    }

    /**
     * Applies the correct TaxRate to each OrderItem in the order.
     */
    private applyTaxes(order: Order, activeZone: Zone, ctx: RequestContext) {
        for (const line of order.lines) {
            line.clearAdjustments(AdjustmentType.TAX);

            const applicableTaxRate = this.taxRateService.getApplicableTaxRate(activeZone, line.taxCategory);
            const { price, priceIncludesTax, priceWithTax, priceWithoutTax } = this.taxCalculator.calculate(
                line.unitPrice,
                line.taxCategory,
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
    private applyPromotions(order: Order, promotions: Promotion[]) {
        for (const line of order.lines) {
            const applicablePromotions = promotions.filter(p => p.test(order));

            line.clearAdjustments(AdjustmentType.PROMOTION);

            for (const item of line.items) {
                if (applicablePromotions) {
                    for (const promotion of applicablePromotions) {
                        const adjustment = promotion.apply(item, line);
                        if (adjustment) {
                            item.pendingAdjustments = item.pendingAdjustments.concat(adjustment);
                        }
                    }
                }
            }
            this.calculateOrderTotals(order);
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

        order.totalPriceBeforeTax = totalPriceBeforeTax;
        order.totalPrice = totalPrice;
    }
}
