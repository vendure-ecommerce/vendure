import * as path from 'path';
import { LanguageCode } from 'shared/generated-types';
import { DEFAULT_CHANNEL_CODE } from 'shared/shared-constants';

import { configEmailType, EmailTypes } from '../config/email/email-options';

import { AccountRegistrationEvent } from '../event-bus/events/account-registration-event';
import { OrderStateTransitionEvent } from '../event-bus/events/order-state-transition-event';

export type DefaultEmailType = 'order-confirmation' | 'email-verification';

const SHOPFRONT_URL = 'http://localhost:4201/';

export const defaultEmailTypes: EmailTypes<DefaultEmailType> = {
    'order-confirmation': configEmailType({
        triggerEvent: OrderStateTransitionEvent,
        createContext: e => {
            const customer = e.order.customer;
            if (customer && e.toState === 'PaymentSettled') {
                return {
                    recipient: customer.emailAddress,
                    languageCode: e.ctx.languageCode,
                    channelCode: e.ctx.channel.code,
                };
            }
        },
        templates: {
            defaultChannel: {
                defaultLanguage: {
                    templateContext: emailContext => ({ order: emailContext.event.order }),
                    subject: `Order confirmation for #{{ order.code }}`,
                    templatePath: path.join(
                        __dirname,
                        'templates',
                        'order-confirmation',
                        'order-confirmation.hbs',
                    ),
                },
            },
        },
    }),
    'email-verification': configEmailType({
        triggerEvent: AccountRegistrationEvent,
        createContext: e => {
            return {
                recipient: e.user.identifier,
                languageCode: e.ctx.languageCode,
                channelCode: e.ctx.channel.code,
            };
        },
        templates: {
            defaultChannel: {
                defaultLanguage: {
                    templateContext: emailContext => ({
                        user: emailContext.event.user,
                        verifyUrl: SHOPFRONT_URL + 'verify',
                    }),
                    subject: `Please verify your email address`,
                    templatePath: path.join(
                        __dirname,
                        'templates',
                        'email-verification',
                        'email-verification.hbs',
                    ),
                },
            },
        },
    }),
};
