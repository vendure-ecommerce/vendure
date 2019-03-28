import { LanguageCode } from '@vendure/common/generated-types';

import { RequestContext } from '../../api/common/request-context';
import { Channel } from '../../entity/channel/channel.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { User } from '../../entity/user/user.entity';
import { AccountRegistrationEvent } from '../../event-bus/events/account-registration-event';
import { OrderStateTransitionEvent } from '../../event-bus/events/order-state-transition-event';
import { defaultEmailTypes } from '../default-email-types';
import { EmailContext } from '../email-context';

export function getOrderReceiptContext():
    | EmailContext<'order-confirmation', OrderStateTransitionEvent>
    | undefined {
    const event = new OrderStateTransitionEvent(
        'ArrangingPayment',
        'PaymentSettled',
        createRequestContext(),
        new Order({
            id: '6',
            createdAt: '2018-10-31T15:18:29.261Z',
            updatedAt: '2018-10-31T15:24:17.000Z',
            code: 'T3EPGJKTVZPBD6Z9',
            state: 'ArrangingPayment',
            active: true,
            customer: new Customer({
                id: '3',
                firstName: 'Horacio',
                lastName: 'Franecki',
                emailAddress: 'Horacio.Franecki23@hotmail.com',
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

    const contextConfig = defaultEmailTypes['order-confirmation'].createContext(event);
    if (contextConfig) {
        return new EmailContext({
            ...contextConfig,
            type: 'order-confirmation',
            event,
            templateVars: {},
        });
    }
}

export function getEmailVerificationContext():
    | EmailContext<'email-verification', AccountRegistrationEvent>
    | undefined {
    const event = new AccountRegistrationEvent(
        createRequestContext(),
        new User({
            verified: false,
            verificationToken: 'MjAxOC0xMS0xM1QxNToxNToxNC42ODda_US2U6UK1WZC7NDAX',
            identifier: 'Rhoda_Ebert@yahoo.com',
        }),
    );
    const contextConfig = defaultEmailTypes['email-verification'].createContext(event);
    if (contextConfig) {
        return new EmailContext({
            ...contextConfig,
            type: 'email-verification',
            event,
            templateVars: {},
        });
    }
}

function createRequestContext(): RequestContext {
    return new RequestContext({
        languageCode: LanguageCode.en,
        session: {} as any,
        isAuthorized: false,
        authorizedAsOwnerOnly: true,
        channel: new Channel(),
    });
}
