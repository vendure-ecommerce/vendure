import { OrderTaxSummary } from '@vendure/common/lib/generated-types';

import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Order } from '../../entity/order/order.entity';

/**
 * @description
 * The result of an {@link OrderTaxSummaryCalculationStrategy}'s `calculateOrderTotals` method.
 *
 * @docsCategory tax
 * @docsPage OrderTaxSummaryCalculationStrategy
 * @since 3.6.0
 */
export interface OrderTotalsResult {
    subTotal: number;
    subTotalWithTax: number;
    shipping: number;
    shippingWithTax: number;
}

/**
 * @description
 * Defines how order-level tax totals and the tax summary are calculated.
 *
 * The default implementation ({@link DefaultOrderTaxSummaryCalculationStrategy}) rounds
 * tax at the individual line level and then sums. This is the standard Vendure behaviour.
 *
 * An alternative implementation ({@link OrderLevelTaxSummaryCalculationStrategy}) groups
 * net subtotals by tax rate and rounds once per group, which eliminates per-line rounding
 * accumulation errors. This approach is required by certain jurisdictions and ERP systems.
 *
 * :::info
 *
 * This is configured via the `taxOptions.orderTaxSummaryCalculationStrategy` property of
 * your VendureConfig.
 *
 * :::
 *
 * @docsCategory tax
 * @docsPage OrderTaxSummaryCalculationStrategy
 * @docsWeight 0
 * @since 3.6.0
 */
export interface OrderTaxSummaryCalculationStrategy extends InjectableStrategy {
    /**
     * @description
     * Calculates the order totals (subTotal, subTotalWithTax, shipping, shippingWithTax)
     * for the given Order. This is called frequently during promotion application, so
     * it should be as cheap as possible - avoid building tax summary data here.
     *
     * The Order's `lines` and `surcharges` relations must be loaded.
     * `shippingLines` may be empty/unloaded, in which case shipping is treated as zero.
     */
    calculateOrderTotals(order: Order): OrderTotalsResult;

    /**
     * @description
     * Calculates the full tax summary for the given Order. This is called once
     * when the `taxSummary` getter is accessed on the Order entity.
     *
     * This method must be synchronous, as it is called from the `taxSummary` getter
     * on the Order entity.
     *
     * The Order's `lines`, `surcharges`, and `shippingLines` relations must be loaded.
     */
    calculateTaxSummary(order: Order): OrderTaxSummary[];
}
