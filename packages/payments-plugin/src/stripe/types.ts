import '@vendure/core/dist/entity/custom-entity-fields';
import type { Injector, Order, RequestContext } from '@vendure/core';
import type { Request } from 'express';
import type Stripe from 'stripe';

// Note: deep import is necessary here because CustomCustomerFields is also extended in the Braintree
// plugin. Reference: https://github.com/microsoft/TypeScript/issues/46617
declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomCustomerFields {
        stripeCustomerId?: string;
    }
}

type AdditionalPaymentIntentCreateParams = Partial<
    Omit<Stripe.PaymentIntentCreateParams, 'amount' | 'currency' | 'customer'>
>;

type AdditionalCustomerCreateParams = Partial<Omit<Stripe.CustomerCreateParams, 'email'>>;

/**
 * @description
 * Configuration options for the Stripe payments plugin.
 *
 * @docsCategory core plugins/PaymentsPlugin
 * @docsPage StripePlugin
 */
export interface StripePluginOptions {
    /**
     * @description
     * If set to `true`, a [Customer](https://stripe.com/docs/api/customers) object will be created in Stripe - if
     * it doesn't already exist - for authenticated users, which prevents payment methods attached to other Customers
     * to be used with the same PaymentIntent. This is done by adding a custom field to the Customer entity to store
     * the Stripe customer ID, so switching this on will require a database migration / synchronization.
     *
     * @default false
     */
    storeCustomersInStripe?: boolean;

    /**
     * @description
     * Attach extra metadata to Stripe payment intent creation call.
     *
     * @example
     * ```ts
     * import { EntityHydrator, VendureConfig } from '\@vendure/core';
     * import { StripePlugin } from '\@vendure/payments-plugin/package/stripe';
     *
     * export const config: VendureConfig = {
     *   // ...
     *   plugins: [
     *     StripePlugin.init({
     *       metadata: async (injector, ctx, order) => {
     *         const hydrator = injector.get(EntityHydrator);
     *         await hydrator.hydrate(ctx, order, { relations: ['customer'] });
     *         return {
     *           description: `Order #${order.code} for ${order.customer!.emailAddress}`
     *         },
     *       }
     *     }),
     *   ],
     * };
     * ```
     *
     * Note: If the `paymentIntentCreateParams` is also used and returns a `metadata` key, then the values
     * returned by both functions will be merged.
     *
     * @since 1.9.7
     */
    metadata?: (
        injector: Injector,
        ctx: RequestContext,
        order: Order,
    ) => Stripe.MetadataParam | Promise<Stripe.MetadataParam>;

    /**
     * @description
     * Provide additional parameters to the Stripe payment intent creation. By default,
     * the plugin will already pass the `amount`, `currency`, `customer` and `automatic_payment_methods: { enabled: true }` parameters.
     *
     * For example, if you want to provide a `description` for the payment intent, you can do so like this:
     *
     * @example
     * ```ts
     * import { VendureConfig } from '\@vendure/core';
     * import { StripePlugin } from '\@vendure/payments-plugin/package/stripe';
     *
     * export const config: VendureConfig = {
     *   // ...
     *   plugins: [
     *     StripePlugin.init({
     *       paymentIntentCreateParams: (injector, ctx, order) => {
     *         return {
     *           description: `Order #${order.code} for ${order.customer?.emailAddress}`
     *         },
     *       }
     *     }),
     *   ],
     * };
     * ```
     *
     * @since 2.1.0
     *
     */
    paymentIntentCreateParams?: (
        injector: Injector,
        ctx: RequestContext,
        order: Order,
    ) => AdditionalPaymentIntentCreateParams | Promise<AdditionalPaymentIntentCreateParams>;

    /**
     * @description
     * Provide additional parameters to the Stripe customer creation. By default,
     * the plugin will already pass the `email` and `name` parameters.
     *
     * For example, if you want to provide an address for the customer:
     *
     * @example
     * ```ts
     * import { EntityHydrator, VendureConfig } from '\@vendure/core';
     * import { StripePlugin } from '\@vendure/payments-plugin/package/stripe';
     *
     * export const config: VendureConfig = {
     *   // ...
     *   plugins: [
     *     StripePlugin.init({
     *       storeCustomersInStripe: true,
     *       customerCreateParams: async (injector, ctx, order) => {
     *         const entityHydrator = injector.get(EntityHydrator);
     *         const customer = order.customer;
     *         await entityHydrator.hydrate(ctx, customer, { relations: ['addresses'] });
     *         const defaultBillingAddress = customer.addresses.find(a => a.defaultBillingAddress) ?? customer.addresses[0];
     *         return {
     *           address: {
     *               line1: defaultBillingAddress.streetLine1 || order.shippingAddress?.streetLine1,
     *               postal_code: defaultBillingAddress.postalCode || order.shippingAddress?.postalCode,
     *               city: defaultBillingAddress.city || order.shippingAddress?.city,
     *               state: defaultBillingAddress.province || order.shippingAddress?.province,
     *               country: defaultBillingAddress.country.code || order.shippingAddress?.countryCode,
     *           },
     *         },
     *       }
     *     }),
     *   ],
     * };
     * ```
     *
     * @since 2.1.0
     */
    customerCreateParams?: (
        injector: Injector,
        ctx: RequestContext,
        order: Order,
    ) => AdditionalCustomerCreateParams | Promise<AdditionalCustomerCreateParams>;
}

export interface RequestWithRawBody extends Request {
    rawBody: Buffer;
}
