import { CreateParameters } from '@mollie/api-client/dist/types/binders/payments/parameters';
import { Amount, Address as MollieAddress } from '@mollie/api-client/dist/types/data/global';
import { PaymentLine, PaymentLineType } from '@mollie/api-client/dist/types/data/payments/data';
import { Customer, Order } from '@vendure/core';
import currency from 'currency.js';

import { OrderAddress } from './graphql/generated-shop-types';

/**
 * Check if given address has mandatory fields for Mollie and map to a MollieAddress.
 * Returns undefined if address doesn't have all mandatory fields
 */
export function toMollieAddress(address: OrderAddress, customer: Customer): MollieAddress | undefined {
    if (address.city && address.countryCode && address.streetLine1 && address.postalCode) {
        return {
            streetAndNumber: `${address.streetLine1} ${address.streetLine2 || ''}`,
            postalCode: address.postalCode,
            city: address.city,
            country: address.countryCode.toUpperCase(),
            givenName: customer.firstName,
            familyName: customer.lastName,
            email: customer.emailAddress,
        };
    }
}

/**
 * Map all order and shipping lines to a single array of Mollie payment lines
 */
export function toMolliePaymentLines(order: Order, alreadyPaid: number): CreateParameters['lines'] {
    // Add lines
    const lines: PaymentLine[] = order.lines.map(line => ({
        description: line.productVariant.name,
        quantity: line.quantity,
        unitPrice: toAmount(line.proratedLinePriceWithTax / line.quantity, order.currencyCode), // totalAmount has to match unitPrice * quantity
        totalAmount: toAmount(line.proratedLinePriceWithTax, order.currencyCode),
        vatRate: line.taxRate.toFixed(2),
        vatAmount: toAmount(
            calculateLineTaxAmount(line.taxRate, line.proratedLinePriceWithTax),
            order.currencyCode,
        ),
    }));
    // Add shippingLines
    lines.push(
        ...order.shippingLines.map(line => ({
            description: line.shippingMethod?.name || 'Shipping',
            quantity: 1,
            unitPrice: toAmount(line.discountedPriceWithTax, order.currencyCode),
            totalAmount: toAmount(line.discountedPriceWithTax, order.currencyCode),
            vatRate: String(line.taxRate),
            vatAmount: toAmount(line.discountedPriceWithTax - line.discountedPrice, order.currencyCode),
        })),
    );
    // Add surcharges
    lines.push(
        ...order.surcharges.map(surcharge => ({
            description: surcharge.description,
            quantity: 1,
            unitPrice: toAmount(surcharge.priceWithTax, order.currencyCode),
            totalAmount: toAmount(surcharge.priceWithTax, order.currencyCode),
            vatRate: String(surcharge.taxRate),
            vatAmount: toAmount(surcharge.priceWithTax - surcharge.price, order.currencyCode),
            type: surcharge.priceWithTax < 0 ? ('store_credit' as PaymentLineType) : undefined,
        })),
    );
    // Deduct amount already paid
    if (alreadyPaid) {
        lines.push({
            description: 'Already paid',
            quantity: 1,
            unitPrice: toAmount(-alreadyPaid, order.currencyCode),
            totalAmount: toAmount(-alreadyPaid, order.currencyCode),
            vatRate: String(0),
            vatAmount: toAmount(0, order.currencyCode),
            type: 'store_credit' as PaymentLineType, // Needed to allow negative unitPrice
        });
    }
    return lines;
}

/**
 * Stringify and fixed decimals
 */
export function toAmount(value: number, orderCurrency: string): Amount {
    return {
        value: (value / 100).toFixed(2),
        currency: orderCurrency,
    };
}

/**
 * Return to number of cents. E.g. '10.00' => 1000
 */
export function amountToCents(amount: Amount): number {
    return currency(amount.value).intValue;
}

/**
 * Recalculate tax amount per order line instead of per unit for Mollie.
 * Vendure calculates tax per unit, but Mollie expects the tax to be calculated per order line (the total of the quantities).
 * See https://github.com/vendure-ecommerce/vendure/issues/1939#issuecomment-1362962133 for more information on the rounding issue.
 */
export function calculateLineTaxAmount(taxRate: number, orderLinePriceWithTax: number): number {
    const taxMultiplier = taxRate / 100;
    return orderLinePriceWithTax * (taxMultiplier / (1 + taxMultiplier)); // I.E. €99,99 * (0,2 ÷ 1,2) with a 20% taxrate
}
