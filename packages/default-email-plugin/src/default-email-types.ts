import { AccountRegistrationEvent, OrderStateTransitionEvent, PasswordResetEvent } from '@vendure/core';

import { configEmailType, EmailTypes } from './types';

/**
 * @description
 * The possible types of email which are configured by default. These define the keys of the
 * {@link EmailTypes} object.
 *
 * @docsCategory email
 */
export type DefaultEmailType = 'order-confirmation' | 'email-verification' | 'password-reset';

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
                    templatePath: 'order-confirmation/order-confirmation.hbs',
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
                        verifyUrl: emailContext.templateVars.shopUrl + 'verify',
                    }),
                    subject: `Please verify your email address`,
                    templatePath: 'email-verification/email-verification.hbs',
                },
            },
        },
    }),
    'password-reset': configEmailType({
        triggerEvent: PasswordResetEvent,
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
                        passwordResetUrl: emailContext.templateVars.shopUrl + 'reset-password',
                    }),
                    subject: `Forgotten password reset`,
                    templatePath: 'password-reset/password-reset.hbs',
                },
            },
        },
    }),
};
