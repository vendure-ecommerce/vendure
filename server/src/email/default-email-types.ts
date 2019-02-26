import { configEmailType, EmailTypes } from '../config/email/email-options';
import { AccountRegistrationEvent } from '../event-bus/events/account-registration-event';
import { OrderStateTransitionEvent } from '../event-bus/events/order-state-transition-event';
import { PasswordResetEvent } from '../event-bus/events/password-reset-event';

export type DefaultEmailType = 'order-confirmation' | 'email-verification' | 'password-reset';

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
                        verifyUrl: SHOPFRONT_URL + 'verify',
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
                        passwordResetUrl: SHOPFRONT_URL + 'reset-password',
                    }),
                    subject: `Forgotten password reset`,
                    templatePath: 'password-reset/password-reset.hbs',
                },
            },
        },
    }),
};
