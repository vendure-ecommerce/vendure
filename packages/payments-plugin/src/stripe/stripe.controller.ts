import { Controller, Headers, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common';
import type { PaymentMethod, RequestContext } from '@vendure/core';
import {
    ChannelService,
    InternalServerError,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    PaymentMethodService,
    RequestContextService,
    TransactionalConnection,
} from '@vendure/core';
import { OrderStateTransitionError } from '@vendure/core/dist/common/error/generated-graphql-shop-errors';
import type { Response } from 'express';
import type Stripe from 'stripe';

import { loggerCtx, STRIPE_PLUGIN_OPTIONS } from './constants';
import { isExpectedVendureStripeEventMetadata } from './stripe-utils';
import { stripePaymentMethodHandler } from './stripe.handler';
import { StripeService } from './stripe.service';
import { RequestWithRawBody, StripePluginOptions } from './types';

const missingHeaderErrorMessage = 'Missing stripe-signature header';
const signatureErrorMessage = 'Error verifying Stripe webhook signature';
const noPaymentIntentErrorMessage = 'No payment intent in the event payload';
const ignorePaymentIntentEvent = 'Event has no Vendure metadata, skipped.';

@Controller('payments')
export class StripeController {
    constructor(
        @Inject(STRIPE_PLUGIN_OPTIONS) private options: StripePluginOptions,
        private paymentMethodService: PaymentMethodService,
        private orderService: OrderService,
        private stripeService: StripeService,
        private requestContextService: RequestContextService,
        private connection: TransactionalConnection,
        private channelService: ChannelService,
    ) {}

    @Post('stripe')
    async webhook(
        @Headers('stripe-signature') signature: string | undefined,
        @Req() request: RequestWithRawBody,
        @Res() response: Response,
    ): Promise<void> {
        if (!signature) {
            Logger.error(missingHeaderErrorMessage, loggerCtx);
            response.status(HttpStatus.BAD_REQUEST).send(missingHeaderErrorMessage);
            return;
        }

        const event = JSON.parse(request.body.toString()) as Stripe.Event;
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        if (!paymentIntent) {
            Logger.error(noPaymentIntentErrorMessage, loggerCtx);
            response.status(HttpStatus.BAD_REQUEST).send(noPaymentIntentErrorMessage);
            return;
        }

        const { metadata } = paymentIntent;

        if (!isExpectedVendureStripeEventMetadata(metadata)) {
            if (this.options.skipPaymentIntentsWithoutExpectedMetadata) {
                response.status(HttpStatus.OK).send(ignorePaymentIntentEvent);
                return;
            }
            throw new Error(
                `Missing expected payment intent metadata, unable to settle payment ${paymentIntent.id}!`,
            );
        }

        const { channelToken, orderCode, orderId, languageCode } = metadata;

        const outerCtx = await this.createContext(channelToken, languageCode, request);

        await this.connection.withTransaction(outerCtx, async (ctx: RequestContext) => {
            const order = await this.orderService.findOneByCode(ctx, orderCode);

            if (!order) {
                throw new Error(
                    `Unable to find order ${orderCode}, unable to settle payment ${paymentIntent.id}!`,
                );
            }

            try {
                // Throws an error if the signature is invalid
                await this.stripeService.constructEventFromPayload(ctx, order, request.rawBody, signature);
            } catch (e: any) {
                Logger.error(`${signatureErrorMessage} ${signature}: ${(e as Error)?.message}`, loggerCtx);
                response.status(HttpStatus.BAD_REQUEST).send(signatureErrorMessage);
                return;
            }

            if (event.type === 'payment_intent.payment_failed') {
                const message = paymentIntent.last_payment_error?.message ?? 'unknown error';
                Logger.warn(`Payment for order ${orderCode} failed: ${message}`, loggerCtx);
                response.status(HttpStatus.OK).send('Ok');
                return;
            }

            if (event.type !== 'payment_intent.succeeded') {
                // This should never happen as the webhook is configured to receive
                // payment_intent.succeeded and payment_intent.payment_failed events only
                Logger.info(`Received ${event.type} status update for order ${orderCode}`, loggerCtx);
                return;
            }

            if (order.state !== 'ArrangingPayment') {
                // Orders can switch channels (e.g., global to UK store), causing lookups by the original
                // channel to fail. Using a default channel avoids "entity-with-id-not-found" errors.
                // See https://github.com/vendure-ecommerce/vendure/issues/3072
                const defaultChannel = await this.channelService.getDefaultChannel(ctx);
                const ctxWithDefaultChannel = await this.createContext(defaultChannel.token, languageCode, request);
                const transitionToStateResult = await this.orderService.transitionToState(
                    ctxWithDefaultChannel,
                    orderId,
                    'ArrangingPayment',
                );

                if (transitionToStateResult instanceof OrderStateTransitionError) {
                    Logger.error(
                        `Error transitioning order ${orderCode} to ArrangingPayment state: ${transitionToStateResult.message}`,
                        loggerCtx,
                    );
                    return;
                }
            }

            const paymentMethod = await this.getPaymentMethod(ctx);

            const addPaymentToOrderResult = await this.orderService.addPaymentToOrder(ctx, orderId, {
                method: paymentMethod.code,
                metadata: {
                    paymentIntentAmountReceived: paymentIntent.amount_received,
                    paymentIntentId: paymentIntent.id,
                },
            });

            if (!(addPaymentToOrderResult instanceof Order)) {
                Logger.error(
                    `Error adding payment to order ${orderCode}: ${addPaymentToOrderResult.message}`,
                    loggerCtx,
                );
                return;
            }

            // The payment intent ID is added to the order only if we can reach this point.
            Logger.info(
                `Stripe payment intent id ${paymentIntent.id} added to order ${orderCode}`,
                loggerCtx,
            );
        });

        // Send the response status only if we didn't sent anything yet.
        if (!response.headersSent) {
            response.status(HttpStatus.OK).send('Ok');
        }
    }

    private async createContext(channelToken: string, languageCode: LanguageCode, req: RequestWithRawBody): Promise<RequestContext> {
        return this.requestContextService.create({
            apiType: 'admin',
            channelOrToken: channelToken,
            req,
            languageCode,
        });
    }

    private async getPaymentMethod(ctx: RequestContext): Promise<PaymentMethod> {
        const method = (await this.paymentMethodService.findAll(ctx)).items.find(
            m => m.handler.code === stripePaymentMethodHandler.code,
        );

        if (!method) {
            throw new InternalServerError(`[${loggerCtx}] Could not find Stripe PaymentMethod`);
        }

        return method;
    }
}
