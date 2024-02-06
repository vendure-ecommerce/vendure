import { PaymentMetadata } from '@vendure/core';
import { ConfigArgValues } from '@vendure/core/dist/common/configurable-operation';
import '@vendure/core/dist/entity/custom-entity-fields';
import { Environment, Transaction } from 'braintree';

import { braintreePaymentMethodHandler } from './braintree.handler';

export type PaymentMethodArgsHash = ConfigArgValues<(typeof braintreePaymentMethodHandler)['args']>;

// Note: deep import is necessary here because CustomCustomerFields is also extended in the Stripe
// plugin. Reference: https://github.com/microsoft/TypeScript/issues/46617
declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomCustomerFields {
        braintreeCustomerId?: string;
    }
}

/**
 * @description
 * Options for the Braintree plugin.
 *
 * @docsCategory core plugins/PaymentsPlugin
 * @docsPage BraintreePlugin
 */
export interface BraintreePluginOptions {
    /**
     * @description
     * The Braintree environment being targeted, e.g. sandbox or production.
     *
     * @default Environment.Sandbox
     */
    environment?: Environment;
    /**
     * @description
     * If set to `true`, a [Customer](https://developer.paypal.com/braintree/docs/guides/customers) object
     * will be created in Braintree, which allows the secure storage ("vaulting") of previously-used payment methods.
     * This is done by adding a custom field to the Customer entity to store the Braintree customer ID,
     * so switching this on will require a database migration / synchronization.
     *
     * Since v1.8, it is possible to override vaulting on a per-payment basis by passing `includeCustomerId: false` to the
     * `generateBraintreeClientToken` mutation.
     *
     * @default false
     */
    storeCustomersInBraintree?: boolean;
    /**
     * @description
     * Allows you to configure exactly what information from the Braintree
     * [Transaction object](https://developer.paypal.com/braintree/docs/reference/response/transaction#result-object) (which is returned by the
     * `transaction.sale()` method of the SDK) should be persisted to the resulting Payment entity metadata.
     *
     * By default, the built-in extraction function will return a metadata object that looks like this:
     *
     * @example
     * ```ts
     * const metadata = {
     *   "status": "settling",
     *   "currencyIsoCode": "GBP",
     *   "merchantAccountId": "my_account_id",
     *   "cvvCheck": "Not Applicable",
     *   "avsPostCodeCheck": "Not Applicable",
     *   "avsStreetAddressCheck": "Not Applicable",
     *   "processorAuthorizationCode": null,
     *   "processorResponseText": "Approved",
     *   // for Paypal payments
     *   "paymentMethod": "paypal_account",
     *   "paypalData": {
     *     "payerEmail": "michael-buyer@paypalsandbox.com",
     *     "paymentId": "PAYID-MLCXYNI74301746XK8807043",
     *     "authorizationId": "3BU93594D85624939",
     *     "payerStatus": "VERIFIED",
     *     "sellerProtectionStatus": "ELIGIBLE",
     *     "transactionFeeAmount": "0.54"
     *   },
     *   // for credit card payments
     *   "paymentMethod": "credit_card",
     *   "cardData": {
     *     "cardType": "MasterCard",
     *     "last4": "5454",
     *     "expirationDate": "02/2023"
     *   }
     *   // publicly-available metadata that will be
     *   // readable from the Shop API
     *   "public": {
     *     "cardData": {
     *       "cardType": "MasterCard",
     *       "last4": "5454",
     *       "expirationDate": "02/2023"
     *     },
     *     "paypalData": {
     *       "authorizationId": "3BU93594D85624939",
     *     }
     *   }
     * }
     * ```
     *
     * @since 1.7.0
     */
    extractMetadata?: (transaction: Transaction) => PaymentMetadata;
}
