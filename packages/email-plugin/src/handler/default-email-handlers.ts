/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    AccountRegistrationEvent,
    ConfigService,
    EntityHydrator,
    IdentifierChangeRequestEvent,
    Injector,
    LanguageCode,
    NativeAuthenticationMethod,
    Order,
    OrderService,
    OrderStateTransitionEvent,
    PasswordResetEvent,
    RequestContext,
    ShippingLine,
} from '@vendure/core';
import { Request } from 'express';

import { EmailEventListener } from '../event-listener';

import { EmailEventHandler } from './event-handler';
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
    .setResendOptions({
        entityType: Order,
        label: [
            {
                value: 'Order confirmation.',
                languageCode: LanguageCode.en,
            },
        ],
        description: [
            {
                value: 'Order confirmation can be send only for specific reasons.',
                languageCode: LanguageCode.en,
            },
        ],
        operationDefinitions: {
            code: 'order-confirmation',
            description: [
                {
                    languageCode: LanguageCode.en,
                    value: 'Resend order confirmation',
                },
            ],
            args: {
                emailEventTemplateId: {
                    type: 'boolean',
                    ui: { component: 'boolean-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test boolean' }],
                },
                testNumber: {
                    type: 'int',
                    ui: { component: 'number-form-input' },
                    label: [{ languageCode: LanguageCode.en, value: 'Test number' }],
                },
            },
        },
        canResend: (_ctx, _injector, _entity) => {
            return true;
        },
        createEvent: async (ctx, injector, entity, _args) => {
            const completeOrderEntity = await injector.get(OrderService).findOne(ctx, entity.id);
            if (!completeOrderEntity) {
                throw new Error('Order not found');
            }
            return new OrderStateTransitionEvent(
                'ArrangingPayment',
                'PaymentSettled',
                ctx,
                completeOrderEntity,
            );
        },
    })
    .loadData(async ({ event, injector }) => {
        transformOrderLineAssetUrls(event.ctx, event.order, injector);
        const shippingLines = await hydrateShippingLines(event.ctx, event.order, injector);
        return { shippingLines };
    })
    .setRecipient(event => event.order.customer!.emailAddress)
    .setFrom('{{ fromAddress }}')
    .setSubject('Order confirmation for #{{ order.code }}')
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
    .setFrom('{{ fromAddress }}')
    .setSubject('Please verify your email address')
    .setTemplateVars(event => ({
        verificationToken: event.user.getNativeAuthenticationMethod().verificationToken,
    }))
    .setMockEvent(mockAccountRegistrationEvent);

export const passwordResetHandler = new EmailEventListener('password-reset')
    .on(PasswordResetEvent)
    .setRecipient(event => event.user.identifier)
    .setFrom('{{ fromAddress }}')
    .setSubject('Forgotten password reset')
    .setTemplateVars(event => ({
        passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
    }))
    .setMockEvent(mockPasswordResetEvent);

export const emailAddressChangeHandler = new EmailEventListener('email-address-change')
    .on(IdentifierChangeRequestEvent)
    .setRecipient(event => event.user.getNativeAuthenticationMethod().pendingIdentifier!)
    .setFrom('{{ fromAddress }}')
    .setSubject('Please verify your change of email address')
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

/**
 * @description
 * Applies the configured `AssetStorageStrategy.toAbsoluteUrl()` function to each of the
 * OrderLine's `featuredAsset.preview` properties, so that they can be correctly displayed
 * in the email template.
 * This is required since that step usually happens at the API in middleware, which is not
 * applicable in this context. So we need to do it manually.
 *
 * **Note: Mutates the Order object**
 *
 * @docsCategory core plugins/EmailPlugin
 * @docsPage Email utils
 */
export function transformOrderLineAssetUrls(ctx: RequestContext, order: Order, injector: Injector): Order {
    const { assetStorageStrategy } = injector.get(ConfigService).assetOptions;
    if (assetStorageStrategy.toAbsoluteUrl) {
        const toAbsoluteUrl = assetStorageStrategy.toAbsoluteUrl.bind(assetStorageStrategy);
        for (const line of order.lines) {
            if (line.featuredAsset) {
                line.featuredAsset.preview = toAbsoluteUrl(ctx.req as Request, line.featuredAsset.preview);
            }
        }
    }
    return order;
}

/**
 * @description
 * Ensures that the ShippingLines are hydrated so that we can use the
 * `shippingMethod.name` property in the email template.
 *
 * @docsCategory core plugins/EmailPlugin
 * @docsPage Email utils
 */
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
