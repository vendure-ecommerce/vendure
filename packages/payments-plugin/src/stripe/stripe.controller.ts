import { Controller, Headers, HttpStatus, Post, Req, Res } from '@nestjs/common';
import {
    InternalServerError,
    LanguageCode,
    Logger,
    Order,
    OrderService,
    PaymentMethod,
    PaymentMethodService,
    RequestContext,
    RequestContextService,
} from '@vendure/core';
import { OrderStateTransitionError } from '@vendure/core/dist/common/error/generated-graphql-shop-errors';
import { Response } from 'express';
import Stripe from 'stripe';

import { loggerCtx } from './constants';
import { stripePaymentMethodHandler } from './stripe.handler';
import { StripeService } from './stripe.service';
import { RequestWithRawBody } from './types';

const missingHeaderErrorMessage = 'Missing stripe-signature header';
const signatureErrorMessage = 'Error verifying Stripe webhook signature';
const noPaymentIntentErrorMessage = 'No payment intent in the event payload';

@Controller('payments')
export class StripeController {
    constructor(
        private paymentMethodService: PaymentMethodService,
        private orderService: OrderService,
        private stripeService: StripeService,
        private requestContextService: RequestContextService,
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
        const event = request.body as Stripe.Event;
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        if (!paymentIntent) {
            Logger.error(noPaymentIntentErrorMessage, loggerCtx);
            response.status(HttpStatus.BAD_REQUEST).send(noPaymentIntentErrorMessage);
            return;
        }
        const { metadata: { channelToken, orderCode, orderId } = {} } = paymentIntent;
        const ctx = await this.createContext(channelToken, request);
        const order = await this.orderService.findOneByCode(ctx, orderCode);
        if (!order) {
            throw Error(`Unable to find order ${orderCode}, unable to settle payment ${paymentIntent.id}!`);
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
            const transitionToStateResult = await this.orderService.transitionToState(
                ctx,
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

        Logger.info(`Stripe payment intent id ${paymentIntent.id} added to order ${orderCode}`, loggerCtx);
        response.status(HttpStatus.OK).send('Ok');
    }

    private async createContext(channelToken: string, req: RequestWithRawBody): Promise<RequestContext> {
        return this.requestContextService.create({
            apiType: 'admin',
            channelOrToken: channelToken,
            req,
            languageCode: LanguageCode.en,
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
