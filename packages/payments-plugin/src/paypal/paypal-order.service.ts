import { Inject } from '@nestjs/common';
import {
    ConfigService,
    CreatePaymentErrorResult,
    EntityHydrator,
    InternalServerError,
    Order,
    PaymentMethodService,
    RequestContext,
    Logger,
} from '@vendure/core';

import { loggerCtx, PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { PayPalBaseService } from './paypal-base.service';
import { convertAmount, createAmount, createItem } from './paypal-order.helpers';
import { CreatePayPalOrderRequest, PayPalOrderInformation, PayPalPluginOptions } from './types';

export class PayPalOrderService extends PayPalBaseService {
    private readonly precision: number;

    constructor(
        @Inject(PAYPAL_PAYMENT_PLUGIN_OPTIONS) options: PayPalPluginOptions,
        paymentMethodService: PaymentMethodService,
        private readonly configService: ConfigService,
        private readonly entityHydrator: EntityHydrator,
    ) {
        super(paymentMethodService, options);

        if (!this.configService.entityOptions.moneyStrategy) {
            throw new Error('No MoneyStrategy configured. Please check your Vendure configuration.');
        }
        if (!this.configService.entityOptions.moneyStrategy.precision) {
            throw new Error('MoneyStrategy precision is not provided.');
        }

        this.precision = this.configService.entityOptions.moneyStrategy.precision;
    }

    async createOrder(ctx: RequestContext, order: Order): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        await this.entityHydrator.hydrate(ctx, order, { relations: ['lines', 'lines.productVariant'] });
        const items = order.lines.map(line => createItem(order, line, this.precision));

        const payload: CreatePayPalOrderRequest = {
            intent: 'AUTHORIZE',
            purchase_units: [
                {
                    reference_id: order.code,
                    amount: createAmount(order, this.precision),
                    items,
                },
            ],
        };

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'Failed to create PayPal order';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }

    async orderDetails(ctx: RequestContext, paypalOrderId: string): Promise<PayPalOrderInformation> {
        const accessToken = (await this.authenticate(ctx)).access_token;

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${paypalOrderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw response;
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error: any) {
            const message = 'Failed to get PayPal order details';
            if (error instanceof Response) {
                const responseClone = error.clone();
                Logger.error(message, loggerCtx, await responseClone.text());
            }

            Logger.error(message, loggerCtx, error?.stack);
            // Throw a generic error to avoid leaking sensitive information
            throw new InternalServerError(message);
        }
    }

    async validateOrderMatch(
        ctx: RequestContext,
        internalOrder: Order,
        paypalOrder: PayPalOrderInformation,
    ): Promise<CreatePaymentErrorResult | undefined> {
        const args = await this.getPaymentHandlerArgs(ctx);

        if (args.length <= 0) {
            throw new InternalServerError('PayPal payment method is not configured correctly.');
        }

        const merchantId = args.find(arg => arg.name === 'merchantId')?.value;
        if (!merchantId) {
            throw new InternalServerError(
                'PayPal payment method is not configured correctly. Please set merchantId.',
            );
        }

        if (paypalOrder.status !== 'APPROVED') {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: 'PayPal order must be in "APPROVED" state.',
            };
        }

        if (paypalOrder.purchase_units.length !== 1) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage:
                    "PayPal order must have exactly one purchase_unit assigned. Please use 'createPayPalOrder' to create a new order.",
            };
        }

        const purchaseUnit = paypalOrder.purchase_units[0];
        if (purchaseUnit.amount.currency_code !== internalOrder.currencyCode) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: `Currency mismatch. Expected ${internalOrder.currencyCode}, got ${purchaseUnit.amount.currency_code}`,
            };
        }

        if (purchaseUnit.reference_id !== internalOrder.code) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: `Reference ID mismatch. Expected ${internalOrder.code}, got ${purchaseUnit.reference_id ?? 'no reference id.'}`,
            };
        }

        const orderTotal = convertAmount(internalOrder.totalWithTax, this.precision);
        if (purchaseUnit.amount.value !== orderTotal) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: `Amount mismatch. Expected ${orderTotal}, got ${purchaseUnit.amount.value}`,
            };
        }

        if (purchaseUnit.payee?.merchant_id !== merchantId) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: `Payee mismatch.`,
            };
        }
    }
}
