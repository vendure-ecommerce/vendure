/* tslint:disable:no-non-null-assertion */
import { AccountRegistrationEvent, OrderStateTransitionEvent, PasswordResetEvent } from '@vendure/core';

import { EmailEventListener } from './event-listener';
import { mockAccountRegistrationEvent, mockOrderStateTransitionEvent, mockPasswordResetEvent } from './mock-events';

export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .setRecipient(event => event.order.customer!.emailAddress)
    .setSubject(`Order confirmation for #{{ order.code }}`)
    .setTemplateVars(event => ({ order: event.order }))
    .setMockEvent(mockOrderStateTransitionEvent);

export const emailVerificationHandler = new EmailEventListener('email-verification')
    .on(AccountRegistrationEvent)
    .setRecipient(event => event.user.identifier)
    .setSubject(`Please verify your email address`)
    .setTemplateVars(event => ({
        user: event.user,
        verifyUrl: 'verify',
    }))
    .setMockEvent(mockAccountRegistrationEvent);

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .setRecipient(event => event.user.identifier)
    .setSubject(`Forgotten password reset`)
    .setTemplateVars(event => ({
        user: event.user,
        passwordResetUrl: 'reset-password',
    }))
    .setMockEvent(mockPasswordResetEvent);

export const defaultEmailHandlers = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
];
