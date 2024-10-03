import { Controller, Get, Header, Inject, Type } from '@nestjs/common';
import { Ctx, RequestContext } from '@vendure/core';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { DocumentNode, print } from 'graphql';

import { ADD_PAYMENT_TO_ORDER, CREATE_PAYPAL_ORDER } from './payment-helpers';

const PAYPAL_SDK_PAYMENT_PLUGIN_OPTIONS = Symbol('PAYPAL_SDK_PAYMENT_PLUGIN_OPTIONS');
export interface PayPalSdkPluginOptions {
    apiUrl: string;
    clientId: string;
}

// @ts-ignore
function html(strings, ...values) {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
}

function formatQuery(gql: DocumentNode): string {
    return print(gql).replace(/\n|\r/g, '');
}

@Controller('paypal-sdk')
export class PayPalSdkController {
    constructor(
        @Inject(PAYPAL_SDK_PAYMENT_PLUGIN_OPTIONS) private readonly options: PayPalSdkPluginOptions,
    ) {}

    @Get()
    @Header('Access-Control-Allow-Origin', 'https://www.sandbox.paypal.com')
    @Header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    @Header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    get(@Ctx() ctx: RequestContext) {
        const sdkUrl = `https://www.sandbox.paypal.com/sdk/js?client-id=${this.options.clientId}&intent=authorize&currency=EUR`;

        return html`<!DOCTYPE html>
            <h1>PayPal SDK Demo Page</h1>
            <head>
                <script src="${sdkUrl}" data-sdk-integration-source="developer-studio"></script>
                <script>
                    const apiUrl = document.location.origin + '/shop-api';

                    window.paypal
                        .Buttons({
                            style: {
                                shape: 'rect',
                                layout: 'vertical',
                                color: 'gold',
                                label: 'paypal',
                            },
                            message: {
                                amount: 100,
                            },

                            async createOrder() {
                                console.log('Creating order...');

                                const rawResponse = await fetch(apiUrl, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        operationName: 'CreatePayPalOrder',
                                        query: '${formatQuery(CREATE_PAYPAL_ORDER)}',
                                    }),
                                    headers: {
                                        Authorization: "Bearer " + document.querySelector('#authToken').value,
                                        'Content-Type': 'application/json; charset=utf-8',
                                    },
                                });

                                const response = await rawResponse.json();

                                if (response.errors?.length > 0) {
                                    alert(
                                        'Error while creating PayPal order. See console for more information.',
                                    );
                                    console.error(...response.errors);
                                    return;
                                }

                                console.log('Order created', response);
                                return response.data.createPayPalOrder.id;
                            },

                            async onApprove(data, actions) {
                                console.log('Adding Payment...', data, actions);

                                const orderId = data.orderID;

                                const rawResponse = await fetch(apiUrl, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                        operationName: 'AddPaymentToOrder',
                                        query: '${formatQuery(ADD_PAYMENT_TO_ORDER)}',
                                        variables: {
                                            input: {
                                                method: "paypal",
                                                metadata: {
                                                    orderId: orderId
                                                }
                                            }
                                        },
                                    }),
                                    headers: {
                                        Authorization: "Bearer " + document.querySelector('#authToken').value,
                                        'Content-Type': 'application/json; charset=utf-8',
                                    },
                                });
                            },
                        })
                        .render('#paypal-button-container');
                </script>
            </head>
            <label for="authToken">Auth Token</label>
            <input id="authToken" name="authToken" />
            <hr />
            <div id="paypal-button-container"></div>
            <p id="result-message"></p>
        </html>`;
    }
}

@VendurePlugin({
    providers: [{ provide: PAYPAL_SDK_PAYMENT_PLUGIN_OPTIONS, useFactory: () => PayPalSdkPlugin.options }],
    imports: [PluginCommonModule],
    controllers: [PayPalSdkController],
})
export class PayPalSdkPlugin {
    static options: PayPalSdkPluginOptions;

    static init(options: PayPalSdkPluginOptions): Type<PayPalSdkPlugin> {
        this.options = options;
        return PayPalSdkPlugin;
    }
}
