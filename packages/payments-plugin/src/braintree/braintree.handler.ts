import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    Customer,
    EntityHydrator,
    Injector,
    Logger,
    Order,
    PaymentMethodHandler,
    RequestContext,
    TransactionalConnection,
} from '@vendure/core';
import { BraintreeGateway } from 'braintree';

import { defaultExtractMetadataFn, getGateway } from './braintree-common';
import { BRAINTREE_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { BraintreePluginOptions } from './types';

let options: BraintreePluginOptions;
let connection: TransactionalConnection;
let entityHydrator: EntityHydrator;

/**
 * The handler for Braintree payments.
 */
export const braintreePaymentMethodHandler = new PaymentMethodHandler({
    code: 'braintree',
    description: [{ languageCode: LanguageCode.en, value: 'Braintree payments' }],
    args: {
        merchantId: { type: 'string', label: [{ languageCode: LanguageCode.en, value: 'Merchant ID' }] },
        publicKey: { type: 'string', label: [{ languageCode: LanguageCode.en, value: 'Public Key' }] },
        privateKey: { type: 'string', label: [{ languageCode: LanguageCode.en, value: 'Private Key' }] },
    },
    init(injector: Injector) {
        options = injector.get<BraintreePluginOptions>(BRAINTREE_PLUGIN_OPTIONS);
        connection = injector.get(TransactionalConnection);
        entityHydrator = injector.get(EntityHydrator);
    },
    async createPayment(ctx, order, amount, args, metadata) {
        const gateway = getGateway(args, options);
        let customerId: string | undefined;
        try {
            await entityHydrator.hydrate(ctx, order, { relations: ['customer'] });
            const customer = order.customer;
            if (
                options.storeCustomersInBraintree &&
                ctx.activeUserId &&
                customer &&
                metadata.includeCustomerId !== false
            ) {
                customerId = await getBraintreeCustomerId(ctx, gateway, customer);
            }
            return processPayment(ctx, gateway, order, amount, metadata.nonce, customerId, options);
        } catch (e: any) {
            Logger.error(e, loggerCtx);
            return {
                amount,
                state: 'Error' as const,
                transactionId: '',
                errorMessage: e.toString(),
                metadata: e,
            };
        }
    },

    settlePayment() {
        return {
            success: true,
        };
    },

    async createRefund(ctx, input, total, order, payment, args) {
        const gateway = getGateway(args, options);
        const response = await gateway.transaction.refund(payment.transactionId, (total / 100).toString(10));
        if (!response.success) {
            return {
                state: 'Failed' as const,
                transactionId: response.transaction?.id,
                metadata: response,
            };
        }
        return {
            state: 'Settled' as const,
            transactionId: response.transaction.id,
            metadata: response,
        };
    },
});

async function processPayment(
    ctx: RequestContext,
    gateway: BraintreeGateway,
    order: Order,
    amount: number,
    paymentMethodNonce: any,
    customerId: string | undefined,
    pluginOptions: BraintreePluginOptions,
) {
    const response = await gateway.transaction.sale({
        customerId,
        amount: (amount / 100).toString(10),
        orderId: order.code,
        paymentMethodNonce,
        options: {
            submitForSettlement: true,
            storeInVaultOnSuccess: !!customerId,
        },
    });
    const extractMetadataFn = pluginOptions.extractMetadata ?? defaultExtractMetadataFn;
    const metadata = extractMetadataFn(response.transaction);
    if (!response.success) {
        return {
            amount,
            state: 'Declined' as const,
            transactionId: response.transaction.id,
            errorMessage: response.message,
            metadata,
        };
    }
    return {
        amount,
        state: 'Settled' as const,
        transactionId: response.transaction.id,
        metadata,
    };
}

/**
 * If the Customer has no braintreeCustomerId, create one, else return the existing braintreeCustomerId.
 */
async function getBraintreeCustomerId(
    ctx: RequestContext,
    gateway: BraintreeGateway,
    customer: Customer,
): Promise<string | undefined> {
    if (!customer.customFields.braintreeCustomerId) {
        try {
            const result = await gateway.customer.create({
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.emailAddress,
            });
            if (result.success) {
                const customerId = result.customer.id;
                Logger.verbose(`Created Braintree Customer record for customerId ${customer.id}`, loggerCtx);
                customer.customFields.braintreeCustomerId = customerId;
                await connection.getRepository(ctx, Customer).save(customer, { reload: false });
                return customerId;
            } else {
                Logger.error(
                    `Failed to create Braintree Customer record for customerId ${customer.id}. View Debug level logs for details.`,
                    loggerCtx,
                );
                Logger.debug(JSON.stringify(result.errors, null, 2), loggerCtx);
            }
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
    } else {
        return customer.customFields.braintreeCustomerId;
    }
}
