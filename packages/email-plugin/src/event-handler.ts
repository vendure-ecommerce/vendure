import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';
import { Injector, Logger } from '@vendure/core';

import { serializeAttachments } from './attachment-utils';
import { loggerCtx } from './constants';
import { EmailEventListener } from './event-listener';
import {
    EmailTemplateConfig,
    EventWithAsyncData,
    EventWithContext,
    IntermediateEmailDetails,
    LoadDataFn,
    SetAttachmentsFn,
    SetTemplateVarsFn,
} from './types';

/**
 * @description
 * The EmailEventHandler defines how the EmailPlugin will respond to a given event.
 *
 * A handler is created by creating a new {@link EmailEventListener} and calling the `.on()` method
 * to specify which event to respond to.
 *
 * @example
 * ```ts
 * const confirmationHandler = new EmailEventListener('order-confirmation')
 *   .on(OrderStateTransitionEvent)
 *   .filter(event => event.toState === 'PaymentSettled')
 *   .setRecipient(event => event.order.customer.emailAddress)
 *   .setSubject(`Order confirmation for #{{ order.code }}`)
 *   .setTemplateVars(event => ({ order: event.order }));
 * ```
 *
 * This example creates a handler which listens for the `OrderStateTransitionEvent` and if the Order has
 * transitioned to the `'PaymentSettled'` state, it will generate and send an email.
 *
 * ## Handling other languages
 *
 * By default, the handler will respond to all events on all channels and use the same subject ("Order confirmation for #12345" above)
 * and body template. Where the server is intended to support multiple languages, the `.addTemplate()` method may be used
 * to defined the subject and body template for specific language and channel combinations.
 *
 * @example
 * ```ts
 * const extendedConfirmationHandler = confirmationHandler
 *   .addTemplate({
 *     channelCode: 'default',
 *     languageCode: LanguageCode.de,
 *     templateFile: 'body.de.hbs',
 *     subject: 'Bestellbestätigung für #{{ order.code }}',
 *   })
 * ```
 *
 * @docsCategory EmailPlugin
 */
export class EmailEventHandler<T extends string = string, Event extends EventWithContext = EventWithContext> {
    private setRecipientFn: (event: Event) => string;
    private setTemplateVarsFn: SetTemplateVarsFn<Event>;
    private setAttachmentsFn?: SetAttachmentsFn<Event>;
    private filterFns: Array<(event: Event) => boolean> = [];
    private configurations: EmailTemplateConfig[] = [];
    private defaultSubject: string;
    private from: string;
    private _mockEvent: Omit<Event, 'ctx' | 'data'> | undefined;

    constructor(public listener: EmailEventListener<T>, public event: Type<Event>) {}

    /** @internal */
    get type(): T {
        return this.listener.type;
    }

    /** @internal */
    get mockEvent(): Omit<Event, 'ctx' | 'data'> | undefined {
        return this._mockEvent;
    }

    /**
     * @description
     * Defines a predicate function which is used to determine whether the event will trigger an email.
     * Multiple filter functions may be defined.
     */
    filter(filterFn: (event: Event) => boolean): EmailEventHandler<T, Event> {
        this.filterFns.push(filterFn);
        return this;
    }

    /**
     * @description
     * A function which defines how the recipient email address should be extracted from the incoming event.
     */
    setRecipient(setRecipientFn: (event: Event) => string): EmailEventHandler<T, Event> {
        this.setRecipientFn = setRecipientFn;
        return this;
    }

    /**
     * @description
     * A function which returns an object hash of variables which will be made available to the Handlebars template
     * and subject line for interpolation.
     */
    setTemplateVars(templateVarsFn: SetTemplateVarsFn<Event>): EmailEventHandler<T, Event> {
        this.setTemplateVarsFn = templateVarsFn;
        return this;
    }

    /**
     * @description
     * Sets the default subject of the email. The subject string may use Handlebars variables defined by the
     * setTemplateVars() method.
     */
    setSubject(defaultSubject: string): EmailEventHandler<T, Event> {
        this.defaultSubject = defaultSubject;
        return this;
    }

    /**
     * @description
     * Sets the default from field of the email. The from string may use Handlebars variables defined by the
     * setTemplateVars() method.
     */
    setFrom(from: string): EmailEventHandler<T, Event> {
        this.from = from;
        return this;
    }

    /**
     * @description
     * Defines one or more files to be attached to the email. An attachment _must_ specify
     * a `path` property which can be either a file system path _or_ a URL to the file.
     *
     * @example
     * ```TypeScript
     * const testAttachmentHandler = new EmailEventListener('activate-voucher')
     *   .on(ActivateVoucherEvent)
     *   // ... omitted some steps for brevity
     *   .setAttachments(async (event) => {
     *     const { imageUrl, voucherCode } = await getVoucherDataForUser(event.user.id);
     *     return [
     *       {
     *         filename: `voucher-${voucherCode}.jpg`,
     *         path: imageUrl,
     *       },
     *     ];
     *   });
     * ```
     */
    setAttachments(setAttachmentsFn: SetAttachmentsFn<Event>) {
        this.setAttachmentsFn = setAttachmentsFn;
        return this;
    }

    /**
     * @description
     * Add configuration for another template other than the default `"body.hbs"`. Use this method to define specific
     * templates for channels or languageCodes other than the default.
     */
    addTemplate(config: EmailTemplateConfig): EmailEventHandler<T, Event> {
        this.configurations.push(config);
        return this;
    }

    /**
     * @description
     * Allows data to be loaded asynchronously which can then be used as template variables.
     * The `loadDataFn` has access to the event, the TypeORM `Connection` object, and an
     * `inject()` function which can be used to inject any of the providers exported
     * by the {@link PluginCommonModule}. The return value of the `loadDataFn` will be
     * added to the `event` as the `data` property.
     *
     * @example
     * ```TypeScript
     * new EmailEventListener('order-confirmation')
     *   .on(OrderStateTransitionEvent)
     *   .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
     *   .loadData(({ event, injector }) => {
     *     const orderService = injector.get(OrderService);
     *     return orderService.getOrderPayments(event.order.id);
     *   })
     *   .setTemplateVars(event => ({
     *     order: event.order,
     *     payments: event.data,
     *   }));
     * ```
     */
    loadData<R>(
        loadDataFn: LoadDataFn<Event, R>,
    ): EmailEventHandlerWithAsyncData<R, T, Event, EventWithAsyncData<Event, R>> {
        const asyncHandler = new EmailEventHandlerWithAsyncData(loadDataFn, this.listener, this.event);
        asyncHandler.setRecipientFn = this.setRecipientFn;
        asyncHandler.setTemplateVarsFn = this.setTemplateVarsFn;
        asyncHandler.setAttachmentsFn = this.setAttachmentsFn;
        asyncHandler.filterFns = this.filterFns;
        asyncHandler.configurations = this.configurations;
        asyncHandler.defaultSubject = this.defaultSubject;
        asyncHandler.from = this.from;
        asyncHandler._mockEvent = this._mockEvent as any;
        return asyncHandler;
    }

    /**
     * @description
     * Used internally by the EmailPlugin to handle incoming events.
     *
     * @internal
     */
    async handle(
        event: Event,
        globals: { [key: string]: any } = {},
        injector: Injector,
    ): Promise<IntermediateEmailDetails | undefined> {
        for (const filterFn of this.filterFns) {
            if (!filterFn(event)) {
                return;
            }
        }
        if (this instanceof EmailEventHandlerWithAsyncData) {
            try {
                (event as EventWithAsyncData<Event, any>).data = await this._loadDataFn({
                    event,
                    injector,
                });
            } catch (err: unknown) {
                if (err instanceof Error) {
                    Logger.error(err.message, loggerCtx, err.stack);
                } else {
                    Logger.error(String(err), loggerCtx);
                }
                return;
            }
        }
        if (!this.setRecipientFn) {
            throw new Error(
                `No setRecipientFn has been defined. ` +
                    `Remember to call ".setRecipient()" when setting up the EmailEventHandler for ${this.type}`,
            );
        }
        if (this.from === undefined) {
            throw new Error(
                `No from field has been defined. ` +
                    `Remember to call ".setFrom()" when setting up the EmailEventHandler for ${this.type}`,
            );
        }
        const { ctx } = event;
        const configuration = this.getBestConfiguration(ctx.channel.code, ctx.languageCode);
        const subject = configuration ? configuration.subject : this.defaultSubject;
        if (subject == null) {
            throw new Error(
                `No subject field has been defined. ` +
                    `Remember to call ".setSubject()" when setting up the EmailEventHandler for ${this.type}`,
            );
        }
        const recipient = this.setRecipientFn(event);
        const templateVars = this.setTemplateVarsFn ? this.setTemplateVarsFn(event, globals) : {};
        const attachments = await serializeAttachments((await this.setAttachmentsFn?.(event)) ?? []);
        return {
            type: this.type,
            recipient,
            from: this.from,
            templateVars: { ...globals, ...templateVars },
            subject,
            templateFile: configuration ? configuration.templateFile : 'body.hbs',
            attachments,
        };
    }

    /**
     * @description
     * Optionally define a mock Event which is used by the dev mode mailbox app for generating mock emails
     * from this handler, which is useful when developing the email templates.
     */
    setMockEvent(event: Omit<Event, 'ctx' | 'data'>): EmailEventHandler<T, Event> {
        this._mockEvent = event;
        return this;
    }

    private getBestConfiguration(
        channelCode: string,
        languageCode: LanguageCode,
    ): EmailTemplateConfig | undefined {
        if (this.configurations.length === 0) {
            return;
        }
        const exactMatch = this.configurations.find(c => {
            return (
                (c.channelCode === channelCode || c.channelCode === 'default') &&
                c.languageCode === languageCode
            );
        });
        if (exactMatch) {
            return exactMatch;
        }
        const channelMatch = this.configurations.find(
            c => c.channelCode === channelCode && c.languageCode === 'default',
        );
        if (channelMatch) {
            return channelMatch;
        }
        return;
    }
}

/**
 * @description
 * Identical to the {@link EmailEventHandler} but with a `data` property added to the `event` based on the result
 * of the `.loadData()` function.
 *
 * @docsCategory EmailPlugin
 */
export class EmailEventHandlerWithAsyncData<
    Data,
    T extends string = string,
    InputEvent extends EventWithContext = EventWithContext,
    Event extends EventWithAsyncData<InputEvent, Data> = EventWithAsyncData<InputEvent, Data>
> extends EmailEventHandler<T, Event> {
    constructor(
        public _loadDataFn: LoadDataFn<InputEvent, Data>,
        listener: EmailEventListener<T>,
        event: Type<InputEvent>,
    ) {
        super(listener, event as any);
    }
}
