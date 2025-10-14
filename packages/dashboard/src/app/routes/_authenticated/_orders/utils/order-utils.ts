import { DEFAULT_CHANNEL_CODE } from '@/vdb/constants.js';
import { VariablesOf } from 'gql.tada';

import { modifyOrderDocument } from '../orders.graphql.js';

import { Fulfillment, Order, Payment } from './order-types.js';
import { ProductVariantInfo } from './use-modify-order.js';

type ModifyOrderInput = VariablesOf<typeof modifyOrderDocument>['input'];

/**
 * Calculates the outstanding payment amount for an order
 */
export function calculateOutstandingPaymentAmount(order: Order): number {
    if (!order) return 0;

    const paymentIsValid = (p: Payment): boolean =>
        p.state !== 'Cancelled' && p.state !== 'Declined' && p.state !== 'Error';

    let amountCovered = 0;
    for (const payment of order.payments?.filter(paymentIsValid) ?? []) {
        const refunds = payment.refunds.filter(r => r.state !== 'Failed') ?? [];
        const refundsTotal = refunds.reduce((sum, refund) => sum + (refund.total || 0), 0);
        amountCovered += payment.amount - refundsTotal;
    }
    return order.totalWithTax - amountCovered;
}

/**
 * Checks if an order has unsettled modifications
 */
export function hasUnsettledModifications(order: Order): boolean {
    if (!order) return false;
    return order.modifications.some(m => !m.isSettled);
}

/**
 * Determines if the add manual payment button should be displayed
 */
export function shouldShowAddManualPaymentButton(order: Order): boolean {
    if (!order) return false;

    return (
        order.type !== 'Aggregate' &&
        (order.state === 'ArrangingPayment' || order.state === 'ArrangingAdditionalPayment') &&
        (hasUnsettledModifications(order) || calculateOutstandingPaymentAmount(order) > 0)
    );
}

/**
 * Determines if we can add a fulfillment to an order
 */
export function canAddFulfillment(order: Order): boolean {
    if (!order) return false;

    // Get all fulfillment lines from non-cancelled fulfillments
    const allFulfillmentLines: Fulfillment['lines'] = (order.fulfillments ?? [])
        .filter(fulfillment => fulfillment.state !== 'Cancelled')
        .reduce((all, fulfillment) => [...all, ...fulfillment.lines], [] as Fulfillment['lines']);

    // Check if all items are already fulfilled
    let allItemsFulfilled = true;
    for (const line of order.lines) {
        const totalFulfilledCount = allFulfillmentLines
            .filter(row => row.orderLineId === line.id)
            .reduce((sum, row) => sum + row.quantity, 0);
        if (totalFulfilledCount < line.quantity) {
            allItemsFulfilled = false;
            break;
        }
    }

    // Check if order is in a fulfillable state
    const isFulfillableState =
        (order.nextStates.includes('Shipped') ||
            order.nextStates.includes('PartiallyShipped') ||
            order.nextStates.includes('Delivered')) &&
        order.state !== 'ArrangingAdditionalPayment';

    return (
        !allItemsFulfilled &&
        !hasUnsettledModifications(order) &&
        calculateOutstandingPaymentAmount(order) === 0 &&
        isFulfillableState
    );
}

export function getSeller<T>(order: { channels: Array<{ code: string; seller: T }> }) {
    // Find the seller channel (non-default channel)
    const sellerChannel = order.channels.find(channel => channel.code !== DEFAULT_CHANNEL_CODE);
    return sellerChannel?.seller;
}

/**
 * Computes a pending order based on the current order and modification input
 */
export function computePendingOrder(
    order: Order,
    input: ModifyOrderInput,
    addedVariants: Map<string, ProductVariantInfo>,
    eligibleShippingMethods?: Array<{ id: string; name: string; priceWithTax: number }>,
): Order {
    // Adjust lines
    const lines = order.lines.map(line => {
        const adjust = input.adjustOrderLines?.find(l => l.orderLineId === line.id);
        return adjust
            ? { ...line, quantity: adjust.quantity, customFields: (adjust as any).customFields }
            : line;
    });

    // Add new items (as AddedLine)
    const addedLines = input.addItems
        ?.map(item => {
            const variantInfo = addedVariants.get(item.productVariantId);
            return variantInfo
                ? ({
                      id: `added-${item.productVariantId}`,
                      featuredAsset: variantInfo.productAsset ?? null,
                      productVariant: {
                          id: variantInfo.productVariantId,
                          name: variantInfo.productVariantName,
                          sku: variantInfo.sku,
                      },
                      unitPrice: variantInfo.price ?? 0,
                      unitPriceWithTax: variantInfo.priceWithTax ?? 0,
                      quantity: item.quantity,
                      linePrice: (variantInfo.price ?? 0) * item.quantity,
                      linePriceWithTax: (variantInfo.priceWithTax ?? 0) * item.quantity,
                  } as unknown as Order['lines'][number])
                : null;
        })
        .filter(x => x != null);

    return {
        ...order,
        lines: [...lines, ...(addedLines ?? [])],
        couponCodes: input.couponCodes ?? [],
        shippingLines: input.shippingMethodIds
            ? input.shippingMethodIds
                  .map(shippingMethodId => {
                      const shippingMethod = eligibleShippingMethods?.find(
                          method => method.id === shippingMethodId,
                      );
                      if (!shippingMethod) {
                          return;
                      }
                      return {
                          shippingMethod: {
                              ...shippingMethod,
                              fulfillmentHandlerCode: 'manual',
                          },
                          discountedPriceWithTax: shippingMethod?.priceWithTax ?? 0,
                          id: shippingMethodId,
                      } as any;
                  })
                  .filter(x => x !== undefined)
            : order.shippingLines,
    };
}
