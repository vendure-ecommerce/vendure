/* tslint:disable:no-non-null-assertion */
import {
    AccountRegistrationEvent,
    EntityHydrator,
    IdentifierChangeRequestEvent,
    Injector,
    NativeAuthenticationMethod,
    Order,
    OrderStateTransitionEvent,
    PasswordResetEvent,
    RequestContext,
    ShippingLine,
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
    .filter(
        event =>
            event.toState === 'PaymentSettled' && event.fromState !== 'Modifying' && !!event.order.customer,
    )
    .loadData(async ({ event, injector }) => {
        const shippingLines = await hydrateShippingLines(event.ctx, event.order, injector);
        return { shippingLines };
    })
    .setRecipient(event => event.order.customer!.emailAddress)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Order confirmation for #{{ order.code }}`)
    .setTemplateVars(event => ({ order: event.order, shippingLines: event.data.shippingLines }))
    .setMockEvent(mockOrderStateTransitionEvent);

export const emailVerificationHandler = new EmailEventListener('email-verification')
    .on(AccountRegistrationEvent)
    .filter(event => !!event.user.getNativeAuthenticationMethod().identifier)
    .filter(event => {
        const nativeAuthMethod = event.user.authenticationMethods.find(
            m => m instanceof NativeAuthenticationMethod,
        ) as NativeAuthenticationMethod | undefined;
        return (nativeAuthMethod && !!nativeAuthMethod.identifier) || false;
    })
    .setRecipient(event => event.user.identifier)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Please verify your email address`)
    .setTemplateVars(event => ({
        verificationToken: event.user.getNativeAuthenticationMethod().verificationToken,
    }))
    .setMockEvent(mockAccountRegistrationEvent);

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .setRecipient(event => event.user.identifier)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Forgotten password reset`)
    .setTemplateVars(event => ({
        passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
    }))
    .setMockEvent(mockPasswordResetEvent);

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
    .on(IdentifierChangeRequestEvent)
    .setRecipient(event => event.user.getNativeAuthenticationMethod().pendingIdentifier!)
    .setFrom(`{{ fromAddress }}`)
    .setSubject(`Please verify your change of email address`)
    .setTemplateVars(event => ({
        identifierChangeToken: event.user.getNativeAuthenticationMethod().identifierChangeToken,
    }))
    .setMockEvent(mockEmailAddressChangeEvent);

export const defaultEmailHandlers: Array<EmailEventHandler<any, any>> = [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
];

export async function hydrateShippingLines(
    ctx: RequestContext,
    order: Order,
    injector: Injector,
): Promise<ShippingLine[]> {
    const shippingLines: ShippingLine[] = [];
    const entityHydrator = injector.get(EntityHydrator);

    for (const line of order.shippingLines || []) {
        await entityHydrator.hydrate(ctx, line, {
            relations: ['shippingMethod'],
        });
        if (line.shippingMethod) {
            shippingLines.push(line);
        }
    }
    return shippingLines;
}
