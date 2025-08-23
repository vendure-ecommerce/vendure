import { E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';

export const mollieMockData = {
    host: 'https://my-vendure.io',
    redirectUrl: 'https://fallback-redirect/order',
    apiKey: 'myApiKey',
    methodCode: `mollie-payment-${E2E_DEFAULT_CHANNEL_TOKEN}`,
    methodCodeBroken: `mollie-payment-broken-${E2E_DEFAULT_CHANNEL_TOKEN}`,
    molliePaymentResponse: {
        resource: 'payment',
        id: 'tr_mockPayment',
        mode: 'test',
        amount: {
            value: '10.00',
            currency: 'EUR',
        },
        description: 'Order #mockOrder',
        sequenceType: 'oneoff',
        redirectUrl: 'https://webshop.example.org/order/mockOrder/',
        webhookUrl: 'https://webshop.example.org/payments/webhook/',
        metadata: { languageCode: 'nl' },
        profileId: 'pfl_mockProfile',
        status: 'paid',
        isCancelable: false,
        createdAt: '2024-03-20T09:13:37.0Z',
        expiresAt: '2024-03-20T09:28:37.0Z',
        paidAt: '2024-03-20T09:28:37.0Z',
        authorizedAt: '2024-03-20T09:28:37.0Z',
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/payments/tr_mockPayment',
                type: 'application/hal+json',
            },
            checkout: {
                href: 'https://www.mollie.com/checkout/select-method/mock-payment',
                type: 'text/html',
            },
        },
    },
    molliePaymentMethodsResponse: {
        count: 1,
        _embedded: {
            methods: [
                {
                    resource: 'method',
                    id: 'ideal',
                    description: 'iDEAL',
                    minimumAmount: {
                        value: '0.01',
                        currency: 'EUR',
                    },
                    maximumAmount: {
                        value: '50000.00',
                        currency: 'EUR',
                    },
                    image: {
                        size1x: 'https://www.mollie.com/external/icons/payment-methods/ideal.png',
                        size2x: 'https://www.mollie.com/external/icons/payment-methods/ideal%402x.png',
                        svg: 'https://www.mollie.com/external/icons/payment-methods/ideal.svg',
                    },
                    _links: {
                        self: {
                            href: 'https://api.mollie.com/v2/methods/ideal',
                            type: 'application/hal+json',
                        },
                    },
                },
            ],
        },
        _links: {
            self: {
                href: 'https://api.mollie.com/v2/methods',
                type: 'application/hal+json',
            },
            documentation: {
                href: 'https://docs.mollie.com/reference/v2/methods-api/list-methods',
                type: 'text/html',
            },
        },
    },
};
