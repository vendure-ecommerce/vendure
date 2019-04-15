/* tslint:disable:no-non-null-assertion */
import { AccountRegistrationEvent, OrderStateTransitionEvent, PasswordResetEvent } from '@vendure/core';

import { EmailEventListener } from './event-listener';

export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .configure({
        setRecipient: event => event.order.customer!.emailAddress,
        subject: `Order confirmation for #{{ order.code }}`,
        templateVars: event => ({ order: event.order }),
    });

export const emailVerificationHandler = new EmailEventListener('email-verification')
    .on(AccountRegistrationEvent)
    .configure({
        setRecipient: event => event.user.identifier,
        subject: `Please verify your email address`,
        templateVars: event => ({
            user: event.user,
            verifyUrl: 'verify',
        }),
    });

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .configure({
        setRecipient: event => event.user.identifier,
        subject: `Forgotten password reset`,
        templateVars: event => ({
            user: event.user,
            passwordResetUrl: 'reset-password',
        }),
    });

export const defaultEmailHandlers = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
];
