/* tslint:disable:no-non-null-assertion */
import {
    AccountRegistrationEvent,
    IdentifierChangeRequestEvent,
    OrderStateTransitionEvent,
    PasswordResetEvent,
} from '@vendure/core';

import { EmailEventHandler } from './event-handler';
import { EmailEventListener } from './event-listener';
import {
    mockAccountRegistrationEvent,
    mockEmailAddressChangeEvent,
    mockOrderStateTransitionEvent,
    mockPasswordResetEvent,
} from './mock-events';

export const orderConfirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter((event) => event.toState === 'PaymentSettled' && !!event.order.customer)
    .setRecipient((event) => event.order.customer!.emailAddress)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Order confirmation for #{{ order.code }}`)
    .setTemplateVars((event) => ({ order: event.order }))
    .setMockEvent(mockOrderStateTransitionEvent);

export const emailVerificationHandler = new EmailEventListener('email-verification')
    .on(AccountRegistrationEvent)
    .setRecipient((event) => event.user.identifier)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Please verify your email address`)
    .setTemplateVars((event) => ({
        verificationToken: event.user.getNativeAuthenticationMethod().verificationToken,
    }))
    .setMockEvent(mockAccountRegistrationEvent);

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .setRecipient((event) => event.user.identifier)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Forgotten password reset`)
    .setTemplateVars((event) => ({
        passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
    }))
    .setMockEvent(mockPasswordResetEvent);

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
    .on(IdentifierChangeRequestEvent)
    .setRecipient((event) => event.user.getNativeAuthenticationMethod().pendingIdentifier!)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Please verify your change of email address`)
    .setTemplateVars((event) => ({
        identifierChangeToken: event.user.getNativeAuthenticationMethod().identifierChangeToken,
    }))
    .setMockEvent(mockEmailAddressChangeEvent);

export const defaultEmailHandlers: Array<EmailEventHandler<any, any>> = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
];
