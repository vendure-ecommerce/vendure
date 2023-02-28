import { Inject, Injectable } from '@nestjs/common';
import { Ctx, Customer, Logger, Order, PaymentMethodService, RequestContext, TransactionalConnection } from '@vendure/core';
import Stripe from 'stripe';

import { loggerCtx, STRIPE_PLUGIN_OPTIONS } from './constants';
import { VendureStripeClient } from './stripe-client';
import { getAmountInStripeMinorUnits } from './stripe-utils';
import { StripePluginOptions } from './types';

@Injectable()
export class StripeService {

    constructor(
        private connection: TransactionalConnection,
        private paymentMethodService: PaymentMethodService,
        @Inject(STRIPE_PLUGIN_OPTIONS) private options: StripePluginOptions,
    ) {
    }

    async createPaymentIntent(ctx: RequestContext, order: Order): Promise<string> {
        let customerId: string | undefined;
        const stripe = await this.getStripeClient(ctx, order);

        if (this.options.storeCustomersInStripe && ctx.activeUserId) {
            customerId = await this.getStripeCustomerId(ctx, order);
        }
        const amountInMinorUnits = getAmountInStripeMinorUnits(order);
        const { client_secret } = await stripe.paymentIntents.create(
            {
                amount: amountInMinorUnits,
                currency: order.currencyCode.toLowerCase(),
                customer: customerId,
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    channelToken: ctx.channel.token,
                    orderId: order.id,
                    orderCode: order.code,
                },
            },
            { idempotencyKey: `${order.code}_${amountInMinorUnits}` },
        );

        if (!client_secret) {
            // This should never happen
            Logger.warn(
                `Payment intent creation for order ${order.code} did not return client secret`,
                loggerCtx,
            );
            throw Error('Failed to create payment intent');
        }

        return client_secret ?? undefined;
    }

    async constructEventFromPayload(ctx: RequestContext, order: Order, payload: Buffer, signature: string): Promise<Stripe.Event> {
        const stripe = await this.getStripeClient(ctx, order)
        return stripe.webhooks.constructEvent(payload, signature, stripe.webhookSecret);
    }

    async getStripeClient(ctx: RequestContext, order: Order): Promise<VendureStripeClient> {
        const methods = await this.paymentMethodService.getEligiblePaymentMethods(ctx, order);
        console.log('methods', JSON.stringify(methods));
        // TODO Find stripe methods
        if (!methods) {
            throw Error(`No eligible Stripe payment method found for order ${order.code}`);
        }
        const apiKey = undefined;
        const webhookSecret = undefined;
        if (!apiKey || !webhookSecret) {
            throw Error(`Stripe payment method is missing ApiKey or WebhookSecret`);
        }
        return new VendureStripeClient(apiKey, webhookSecret);
    }

    /**
     * Returns the stripeCustomerId if the Customer has one. If that's not the case, queries Stripe to check
     * if the customer is already registered, in which case it saves the id as stripeCustomerId and returns it.
     * Otherwise, creates a new Customer record in Stripe and returns the generated id.
     */
    private async getStripeCustomerId(ctx: RequestContext, activeOrder: Order): Promise<string | undefined> {
        const [stripe, order] = await Promise.all([
            this.getStripeClient(ctx, activeOrder),
            // Load relation with customer not available in the response from activeOrderService.getOrderFromContext()
            this.connection.getRepository(ctx, Order).findOne(activeOrder.id, {
                relations: ['customer'],
            })
        ]);

        if (!order || !order.customer) {
            // This should never happen
            return undefined;
        }

        const { customer } = order;

        if (customer.customFields.stripeCustomerId) {
            return customer.customFields.stripeCustomerId;
        }

        let stripeCustomerId;

        const stripeCustomers = await stripe.customers.list({ email: customer.emailAddress });
        if (stripeCustomers.data.length > 0) {
            stripeCustomerId = stripeCustomers.data[0].id;
        } else {
            const newStripeCustomer = await stripe.customers.create({
                email: customer.emailAddress,
                name: `${customer.firstName} ${customer.lastName}`,
            });

            stripeCustomerId = newStripeCustomer.id;

            Logger.info(`Created Stripe Customer record for customerId ${customer.id}`, loggerCtx);
        }

        customer.customFields.stripeCustomerId = stripeCustomerId;
        await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });

        return stripeCustomerId;
    }
}
