import { OrderAddress } from '@vendure/common/lib/generated-types';
import { Order } from '@vendure/core';
import { CreateParameters } from '@mollie/api-client/dist/types/src/binders/orders/parameters';
import { Amount } from '@mollie/api-client/dist/types/src/data/global';

/**
 * Address with mandatory Mollie fields
 */
export type RequiredMollieAddress =
    OrderAddress
    & Required<Pick<OrderAddress, 'city' | 'countryCode' | 'streetLine1' | 'postalCode'>>;

/**
 * Check if given address has required fields for Mollie Order and map to required object.
 * Returns undefined if address doesn't have all mandatory fields
 */
export function getRequiredAddress(address: OrderAddress): RequiredMollieAddress | undefined {
    if (address.city && address.countryCode && address.streetLine1 && address.postalCode) {
        return {
            ...address,
            countryCode: address.countryCode.toUpperCase(),
        } as RequiredMollieAddress;
    }
}

/**
 * Map all order and shipping lines to a single array of Mollie order lines
 */
export function toMollieOrderLines(order: Order): CreateParameters['lines'] {
    // TODO Dont like recreating logic, but its a common use case (also for fulfilment handlers). Maybe a helper function on an order? order.getCompleteOrderLines()
    const lines: CreateParameters['lines'] = order.lines.map(line => ({
        name: line.productVariant.name,
        quantity: line.quantity,
        unitPrice: toAmount(line.proratedLinePriceWithTax / line.quantity, order.currencyCode), // totalAmount has to match unitPrice * quantity
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
    return lines;
}

/**
 * Stringify and fixed decimals
 * @param value
 */
export function toAmount(value: number, orderCurrency: string): Amount {
    return {
        value: (value / 100).toFixed(2),
        currency: orderCurrency,
    };
}

/**
 * Get one of Mollies allowed locales based on an orders countrycode
 */
export function getLocale(countryCode: string, channelLanguage: string): string {
    const allowedLocales = ['en_US', 'en_GB', 'nl_NL', 'nl_BE', 'fr_FR', 'fr_BE', 'de_DE', 'de_AT', 'de_CH', 'es_ES', 'ca_ES', 'pt_PT', 'it_IT', 'nb_NO', 'sv_SE', 'fi_FI', 'da_DK', 'is_IS', 'hu_HU', 'pl_PL', 'lv_LV', 'lt_LT'];
    // Prefer order locale if possible
    const orderLocale = allowedLocales.find(locale => (locale.toLowerCase()).indexOf(countryCode.toLowerCase()) > -1 );
    if (orderLocale) {
        return orderLocale;
    }
    // If no order locale, try channel default
    const channelLocale = allowedLocales.find(locale => (locale.toLowerCase()).indexOf(channelLanguage.toLowerCase()) > -1 );
    if (channelLocale) {
        return channelLocale;
    }
    // If no order locale and no channel locale, return a default, otherwise order creation will fail
    return allowedLocales[0];
}
