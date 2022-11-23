import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/orders/parameters';
import { Amount } from '@mollie/api-client/dist/types/src/data/global';
import { OrderAddress as MollieOrderAddress } from '@mollie/api-client/dist/types/src/data/orders/data';
import { Customer, Order } from '@vendure/core';

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
export function toMollieOrderLines(order: Order): CreateParameters['lines'] {
    // Add order lines
    const lines: CreateParameters['lines'] = order.lines.map(line => ({
        name: line.productVariant.name,
        quantity: line.quantity,
        unitPrice: toAmount(line.proratedUnitPriceWithTax, order.currencyCode), // totalAmount has to match unitPrice * quantity
        totalAmount: toAmount(line.proratedLinePriceWithTax, order.currencyCode),
        vatRate: String(line.taxRate),
        vatAmount: toAmount(line.lineTax, order.currencyCode),
    }));
    // Add shippingLines
    lines.push(...order.shippingLines.map(line => ({
        name: line.shippingMethod?.name || 'Shipping',
        quantity: 1,
        unitPrice: toAmount(line.priceWithTax, order.currencyCode),
        totalAmount: toAmount(line.discountedPriceWithTax, order.currencyCode),
        vatRate: String(line.taxRate),
        vatAmount: toAmount(line.discountedPriceWithTax - line.discountedPrice, order.currencyCode),
    })));
    // Add surcharges
    lines.push(...order.surcharges.map(surcharge => ({
        name: surcharge.description,
        quantity: 1,
        unitPrice: toAmount(surcharge.price, order.currencyCode),
        totalAmount: toAmount(surcharge.priceWithTax, order.currencyCode),
        vatRate: String(surcharge.taxRate),
        vatAmount: toAmount(surcharge.priceWithTax - surcharge.price, order.currencyCode),
    })));
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
 * Lookup one of Mollies allowed locales based on an orders countrycode or channel default.
 * If both lookups fail, resolve to en_US to prevent payment failure
 */
export function getLocale(countryCode: string, channelLanguage: string): string {
    const allowedLocales = ['en_US', 'en_GB', 'nl_NL', 'nl_BE', 'fr_FR', 'fr_BE', 'de_DE', 'de_AT', 'de_CH', 'es_ES', 'ca_ES', 'pt_PT', 'it_IT', 'nb_NO', 'sv_SE', 'fi_FI', 'da_DK', 'is_IS', 'hu_HU', 'pl_PL', 'lv_LV', 'lt_LT'];
    // Prefer order locale if possible
    const orderLocale = allowedLocales.find(locale => (locale.toLowerCase()).indexOf(countryCode.toLowerCase()) > -1);
    if (orderLocale) {
        return orderLocale;
    }
    // If no order locale, try channel default
    const channelLocale = allowedLocales.find(locale => (locale.toLowerCase()).indexOf(channelLanguage.toLowerCase()) > -1);
    if (channelLocale) {
        return channelLocale;
    }
    // If no order locale and no channel locale, return a default, otherwise order creation will fail
    return allowedLocales[0];
}
