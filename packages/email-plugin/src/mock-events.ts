import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    AccountRegistrationEvent,
    Channel,
    Customer,
    Order,
    OrderItem,
    OrderLine,
    OrderStateTransitionEvent, PasswordResetEvent,
    ProductVariant,
    RequestContext,
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
            emailAddress: 'test.customer@email.com',
        }),
        lines: [
            new OrderLine({
                id: '5',
                featuredAsset: {
                    preview: 'http://localhost:3000/assets/mikkel-bech-748940-unsplash__49__preview.jpg',
                },
                productVariant: new ProductVariant({
                    id: '3',
                    name: 'en Intelligent Cotton Salad Small',
                    sku: '5x7ss',
                }),
                items: [
                    new OrderItem({
                        id: '6',
                        unitPrice: 745,
                        unitPriceIncludesTax: false,
                        taxRate: 20,
                        pendingAdjustments: [],
                    }),
                ],
            }),
            new OrderLine({
                id: '6',
                featuredAsset: {
                    preview: 'http://localhost:3000/assets/mikkel-bech-748940-unsplash__49__preview.jpg',
                },
                productVariant: new ProductVariant({
                    id: '4',
                    name: 'en Intelligent Cotton Salad Large',
                    sku: '5x7ss',
                }),
                items: [
                    new OrderItem({
                        id: '7',
                        unitPrice: 745,
                        unitPriceIncludesTax: false,
                        taxRate: 20,
                        pendingAdjustments: [],
                    }),
                ],
            }),
        ],
        subTotal: 1788,
        subTotalBeforeTax: 1490,
        shipping: 1000,
        shippingMethod: {
            code: 'express-flat-rate',
            description: 'Express Shipping',
            id: '2',
        },
        shippingAddress: {
            fullName: 'Horacio Franecki',
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
        verificationToken: 'MjAxOC0xMS0xM1QxNToxNToxNC42ODda_US2U6UK1WZC7NDAX',
        identifier: 'test@test.com',
    }),
);

export const mockPasswordResetEvent = new PasswordResetEvent(
    {} as any,
    new User({
        identifier: 'test@test.com',
        passwordResetToken: 'MjAxOS0wNC0xNVQxMzozMDozOC43MjFa_MA2FR6HRZBW7JWD6',
    }),
);
