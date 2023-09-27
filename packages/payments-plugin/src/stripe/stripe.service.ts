import { Inject, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigArg } from '@vendure/common/lib/generated-types';
import {
    Customer,
    Injector,
    Logger,
    Order,
    Payment,
    PaymentMethodService,
    RequestContext,
    TransactionalConnection,
    UserInputError,
} from '@vendure/core';
import Stripe from 'stripe';

import { loggerCtx, STRIPE_PLUGIN_OPTIONS } from './constants';
import { sanitizeMetadata } from './metadata-sanitize';
import { VendureStripeClient } from './stripe-client';
import { getAmountInStripeMinorUnits } from './stripe-utils';
import { stripePaymentMethodHandler } from './stripe.handler';
import { StripePluginOptions } from './types';

@Injectable()
export class StripeService {
    constructor(
        @Inject(STRIPE_PLUGIN_OPTIONS) private options: StripePluginOptions,
        private connection: TransactionalConnection,
        private paymentMethodService: PaymentMethodService,
        private moduleRef: ModuleRef,
    ) {}

    async createPaymentIntent(ctx: RequestContext, order: Order): Promise<string> {
        let customerId: string | undefined;
        const stripe = await this.getStripeClient(ctx, order);

        if (this.options.storeCustomersInStripe && ctx.activeUserId) {
            customerId = await this.getStripeCustomerId(ctx, order);
        }
        const amountInMinorUnits = getAmountInStripeMinorUnits(order);

        const additionalParams = await this.options.paymentIntentCreateParams?.(
            new Injector(this.moduleRef),
            ctx,
            order,
        );
        const metadata = sanitizeMetadata({
            ...(typeof this.options.metadata === 'function'
                ? await this.options.metadata(new Injector(this.moduleRef), ctx, order)
                : {}),
            channelToken: ctx.channel.token,
            orderId: order.id,
            orderCode: order.code,
        });

        const allMetadata = {
            ...metadata,
            ...sanitizeMetadata(additionalParams?.metadata ?? {}),
        };

        const { client_secret } = await stripe.paymentIntents.create(
            {
                amount: amountInMinorUnits,
                currency: order.currencyCode.toLowerCase(),
                customer: customerId,
                automatic_payment_methods: {
                    enabled: true,
                },
                ...(additionalParams ?? {}),
                metadata: allMetadata,
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

    async constructEventFromPayload(
        ctx: RequestContext,
        order: Order,
        payload: Buffer,
        signature: string,
    ): Promise<Stripe.Event> {
        const stripe = await this.getStripeClient(ctx, order);
        return stripe.webhooks.constructEvent(payload, signature, stripe.webhookSecret);
    }

    async createRefund(
        ctx: RequestContext,
        order: Order,
        payment: Payment,
        amount: number,
    ): Promise<Stripe.Response<Stripe.Refund>> {
        const stripe = await this.getStripeClient(ctx, order);
        return stripe.refunds.create({
            payment_intent: payment.transactionId,
            amount,
        });
    }

    /**
     * Get Stripe client based on eligible payment methods for order
     */
    async getStripeClient(ctx: RequestContext, order: Order): Promise<VendureStripeClient> {
        const [eligiblePaymentMethods, paymentMethods] = await Promise.all([
            this.paymentMethodService.getEligiblePaymentMethods(ctx, order),
            this.paymentMethodService.findAll(ctx, {
                filter: {
                    enabled: { eq: true },
                },
            }),
        ]);
        const stripePaymentMethod = paymentMethods.items.find(
            pm => pm.handler.code === stripePaymentMethodHandler.code,
        );
        if (!stripePaymentMethod) {
            throw new UserInputError('No enabled Stripe payment method found');
        }
        const isEligible = eligiblePaymentMethods.some(pm => pm.code === stripePaymentMethod.code);
        if (!isEligible) {
            throw new UserInputError(`Stripe payment method is not eligible for order ${order.code}`);
        }
        const apiKey = this.findOrThrowArgValue(stripePaymentMethod.handler.args, 'apiKey');
        const webhookSecret = this.findOrThrowArgValue(stripePaymentMethod.handler.args, 'webhookSecret');
        return new VendureStripeClient(apiKey, webhookSecret);
    }

    private findOrThrowArgValue(args: ConfigArg[], name: string): string {
        const value = args.find(arg => arg.name === name)?.value;
        if (!value) {
            throw Error(`No argument named '${name}' found!`);
        }
        return value;
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
            this.connection.getRepository(ctx, Order).findOne({
                where: { id: activeOrder.id },
                relations: ['customer'],
            }),
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
            const additionalParams = await this.options.customerCreateParams?.(
                new Injector(this.moduleRef),
                ctx,
                order,
            );
            const newStripeCustomer = await stripe.customers.create({
                email: customer.emailAddress,
                name: `${customer.firstName} ${customer.lastName}`,
                ...(additionalParams ?? {}),
                ...(additionalParams?.metadata
                    ? { metadata: sanitizeMetadata(additionalParams.metadata) }
                    : {}),
            });

            stripeCustomerId = newStripeCustomer.id;

            Logger.info(`Created Stripe Customer record for customerId ${customer.id}`, loggerCtx);
        }

        customer.customFields.stripeCustomerId = stripeCustomerId;
        await this.connection.getRepository(ctx, Customer).save(customer, { reload: false });

        return stripeCustomerId;
    }
}
