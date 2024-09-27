import { Inject } from '@nestjs/common';
import {
    ConfigService,
    CreatePaymentErrorResult,
    EntityHydrator,
    InternalServerError,
    Order,
    RequestContext,
} from '@vendure/core';

import { PAYPAL_PAYMENT_PLUGIN_OPTIONS } from './constants';
import { convertAmount, createAmount, createItem } from './paypal-order.helpers';
import {
    CreatePayPalOrderRequest,
    PayPalAuthorizationResponse,
    PayPalOrderInformation,
    PayPalPluginOptions,
} from './types';

export class PayPalService {
    private readonly precision: number;
    private readonly merchantId: string;
    private readonly authorizationToken: string;

    constructor(
        @Inject(PAYPAL_PAYMENT_PLUGIN_OPTIONS) private options: PayPalPluginOptions,
        private readonly configService: ConfigService,
        private readonly entityHydrator: EntityHydrator,
    ) {
        if (!this.configService.entityOptions.moneyStrategy) {
            throw new Error('No MoneyStrategy configured. Please check your VendureConfig.');
        }
        if (!this.configService.entityOptions.moneyStrategy.precision) {
            throw new Error('MoneyStrategy precision is not provided.');
        }
        if (!options.merchantId) {
            throw new Error('PayPal Merchant ID is not provided.');
        }
        if (!options.clientId) {
            throw new Error('PayPal Client ID is not provided.');
        }
        if (!options.clientSecret) {
            throw new Error('PayPal Client Secret is not provided.');
        }

        this.authorizationToken = Buffer.from(`${options.clientId}:${options.clientSecret}`).toString(
            'base64',
        );
        this.merchantId = options.merchantId;
        this.precision = this.configService.entityOptions.moneyStrategy.precision;
    }

    async createOrder(ctx: RequestContext, order: Order): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

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
                    Authorization: `Bearer ${authResponse.access_token}`,
                },
                method: 'POST',
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error();
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error) {
            throw new InternalServerError('PayPal integration failed');
        }
    }

    async authorizationDetails(authorizationId: string): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${authorizationId}`, {
                headers: {
                    Authorization: `Bearer ${authResponse.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get PayPal order details.');
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error) {
            throw new InternalServerError('PayPal integration failed');
        }
    }

    async orderDetails(paypalOrderId: string): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

        try {
            const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${paypalOrderId}`, {
                headers: {
                    Authorization: `Bearer ${authResponse.access_token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to get PayPal order details.');
            }

            return (await response.json()) as PayPalOrderInformation;
        } catch (error) {
            throw new InternalServerError('PayPal integration failed');
        }
    }

    async reauthorizeOrder(authorizationId: string): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

        const response = await fetch(
            `${this.options.apiUrl}/v2/payments/authorizations/${authorizationId}/reauthorize`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authResponse.access_token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to reauthorize PayPal order.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }

    async authorizeOrder(paypalOrderId: string): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

        const response = await fetch(`${this.options.apiUrl}/v2/checkout/orders/${paypalOrderId}/authorize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authResponse.access_token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to authorize PayPal order.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }

    async capturePayment(authorizationId: string): Promise<PayPalOrderInformation> {
        const authResponse = await this.authorize();

        const response = await fetch(
            `${this.options.apiUrl}/v2/payments/authorizations/${authorizationId}/capture`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authResponse.access_token}`,
                },
            },
        );

        if (!response.ok) {
            throw new Error('Failed to capture payment.');
        }

        return (await response.json()) as PayPalOrderInformation;
    }

    async authorize(): Promise<PayPalAuthorizationResponse> {
        try {
            const response = await fetch(`${this.options.apiUrl}/v1/oauth2/token`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${this.authorizationToken}`,
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    response_type: 'id_token',
                    intent: 'sdk_init',
                }),
            });
            return (await response.json()) as PayPalAuthorizationResponse;
        } catch (error) {
            throw new InternalServerError('PayPal integration failed');
        }
    }

    validatePayPalOrder(
        internalOrder: Order,
        paypalOrder: PayPalOrderInformation,
    ): CreatePaymentErrorResult | undefined {
        if (paypalOrder.status !== 'APPROVED') {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: "PayPal order must be in 'APPROVED' state.",
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

        if (purchaseUnit.payee?.merchant_id !== this.merchantId) {
            return {
                state: 'Error' as const,
                amount: 0,
                errorMessage: `Payee mismatch.`,
            };
        }
    }
}
