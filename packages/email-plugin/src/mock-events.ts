import {
    AccountRegistrationEvent,
    Customer,
    IdentifierChangeRequestEvent,
    NativeAuthenticationMethod,
    Order,
    OrderItem,
    OrderLine,
    OrderStateTransitionEvent,
    PasswordResetEvent,
    ProductVariant,
    User,
} from '@vendure/core';

export const mockOrderStateTransitionEvent = new OrderStateTransitionEvent(
    'ArrangingPayment',
    'PaymentSettled',
    {} as any,
    new Order({
        id: '6',
        createdAt: '2018-10-31T15:18:29.261Z',
        updatedAt: '2018-10-31T15:24:17.000Z',
        code: 'T3EPGJKTVZPBD6Z9',
        state: 'ArrangingPayment',
        active: true,
        customer: new Customer({
            id: '3',
            firstName: 'Test',
            lastName: 'Customer',
            emailAddress: 'test@test.com',
        }),
        lines: [
            new OrderLine({
                id: '5',
                featuredAsset: {
                    preview: 'http://localhost:3000/assets/alexandru-acea-686569-unsplash__preview.jpg',
                },
                productVariant: new ProductVariant({
                    id: '2',
                    name: 'Curvy Monitor 24 inch',
                    sku: 'C24F390',
                }),
                items: [
                    new OrderItem({
                        id: '6',
                        unitPrice: 14374,
                        unitPriceIncludesTax: true,
                        adjustments: [],
                        taxLines: [],
                    }),
                ],
            }),
            new OrderLine({
                id: '6',
                featuredAsset: {
                    preview: 'http://localhost:3000/assets/vincent-botta-736919-unsplash__preview.jpg',
                },
                productVariant: new ProductVariant({
                    id: '4',
                    name: 'Hard Drive 1TB',
                    sku: 'IHD455T1',
                }),
                items: [
                    new OrderItem({
                        id: '7',
                        unitPrice: 3799,
                        unitPriceIncludesTax: true,
                        adjustments: [],
                        taxLines: [],
                    }),
                ],
            }),
        ],
        subTotal: 18173,
        subTotalBeforeTax: 15144,
        shipping: 1000,
        shippingMethod: {
            code: 'express-flat-rate',
            description: 'Express Shipping',
            id: '2',
        },
        shippingAddress: {
            fullName: 'Test Customer',
            company: '',
            streetLine1: '6000 Pagac Land',
            streetLine2: '',
            city: 'Port Kirsten',
            province: 'Avon',
            postalCode: 'ZU32 9CP',
            country: 'Cabo Verde',
            phoneNumber: '',
        },
        payments: [],
        pendingAdjustments: [],
    }),
);

export const mockAccountRegistrationEvent = new AccountRegistrationEvent(
    {} as any,
    new User({
        verified: false,
        authenticationMethods: [
            new NativeAuthenticationMethod({
                verificationToken: 'MjAxOC0xMS0xM1QxNToxNToxNC42ODda_US2U6UK1WZC7NDAX',
            }),
        ],
        identifier: 'test@test.com',
    }),
);

export const mockPasswordResetEvent = new PasswordResetEvent(
    {} as any,
    new User({
        identifier: 'test@test.com',
        authenticationMethods: [
            new NativeAuthenticationMethod({
                passwordResetToken: 'MjAxOS0wNC0xNVQxMzozMDozOC43MjFa_MA2FR6HRZBW7JWD6',
            }),
        ],
    }),
);

export const mockEmailAddressChangeEvent = new IdentifierChangeRequestEvent(
    {} as any,
    new User({
        identifier: 'old-address@test.com',
        authenticationMethods: [
            new NativeAuthenticationMethod({
                pendingIdentifier: 'new-address@test.com',
                identifierChangeToken: 'MjAxOS0wNC0xNVQxMzozMDozOC43MjFa_MA2FR6HRZBW7JWD6',
            }),
        ],
    }),
);
