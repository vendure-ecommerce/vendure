import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/orders/parameters';
import { Amount } from '@mollie/api-client/dist/types/src/data/global';
import { OrderAddress as MollieOrderAddress } from '@mollie/api-client/dist/types/src/data/orders/data';
import { CurrencyCode, Customer, Order } from '@vendure/core';
import currency from 'currency.js';

import { OrderAddress } from './graphql/generated-shop-types';

/**
 * Check if given address has mandatory fields for Mollie Order and map to a MollieOrderAddress.
 * Returns undefined if address doesn't have all mandatory fields
 */
export function toMollieAddress(address: OrderAddress, customer: Customer): MollieOrderAddress | undefined {
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
 * Map all order and shipping lines to a single array of Mollie order lines
 */
export function toMollieOrderLines(order: Order, alreadyPaid: number): CreateParameters['lines'] {
    // Add order lines
    const lines: CreateParameters['lines'] = order.lines.map(line => ({
        name: line.productVariant.name,
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
            name: line.shippingMethod?.name || 'Shipping',
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
            name: surcharge.description,
            quantity: 1,
            unitPrice: toAmount(surcharge.priceWithTax, order.currencyCode),
            totalAmount: toAmount(surcharge.priceWithTax, order.currencyCode),
            vatRate: String(surcharge.taxRate),
            vatAmount: toAmount(surcharge.priceWithTax - surcharge.price, order.currencyCode),
        })),
    );
    // Deduct amount already paid
    if (alreadyPaid) {
        lines.push({
            name: 'Already paid',
            quantity: 1,
            unitPrice: toAmount(-alreadyPaid, order.currencyCode),
            totalAmount: toAmount(-alreadyPaid, order.currencyCode),
            vatRate: String(0),
            vatAmount: toAmount(0, order.currencyCode),
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

/**
 * Lookup one of Mollies allowed locales based on an orders countrycode or channel default.
 * If both lookups fail, resolve to en_US to prevent payment failure
 */
export function getLocale(countryCode: string, channelLanguage: string): string {
    const allowedLocales = [
        'en_US',
        'en_GB',
        'nl_NL',
        'nl_BE',
        'fr_FR',
        'fr_BE',
        'de_DE',
        'de_AT',
        'de_CH',
        'es_ES',
        'ca_ES',
        'pt_PT',
        'it_IT',
        'nb_NO',
        'sv_SE',
        'fi_FI',
        'da_DK',
        'is_IS',
        'hu_HU',
        'pl_PL',
        'lv_LV',
        'lt_LT',
    ];
    // Prefer order locale if possible
    const orderLocale = allowedLocales.find(
        locale => locale.toLowerCase().indexOf(countryCode.toLowerCase()) > -1,
    );
    if (orderLocale) {
        return orderLocale;
    }
    // If no order locale, try channel default
    const channelLocale = allowedLocales.find(
        locale => locale.toLowerCase().indexOf(channelLanguage.toLowerCase()) > -1,
    );
    if (channelLocale) {
        return channelLocale;
    }
    // If no order locale and no channel locale, return a default, otherwise order creation will fail
    return allowedLocales[0];
}
