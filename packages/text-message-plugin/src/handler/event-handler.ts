import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';
import { Injector, Logger } from '@vendure/core';

import { serializeAttachments } from '../attachment-utils';
import { loggerCtx } from '../constants';
import { TextMessageEventListener } from '../event-listener';
import {
    TextMessageAttachment,
    TextMessageTemplateConfig,
    EventWithAsyncData,
    EventWithContext,
    IntermediateTextMessageDetails,
    LoadDataFn,
    SetAttachmentsFn,
    SetOptionalRecipientsFieldsFn,
    SetSubjectFn,
    SetTemplateVarsFn,
} from '../types';

/**
 * @description
 * The TextMessageEventHandler defines how the TextMessagePlugin will respond to a given event.
 *
 * A handler is created by creating a new {@link TextMessageEventListener} and calling the `.on()` method
 * to specify which event to respond to.
 *
 * @example
 * ```ts
 * const confirmationHandler = new TextMessageEventListener('order-confirmation')
 *   .on(OrderStateTransitionEvent)
 *   .filter(event => event.toState === 'PaymentSettled')
 *   .setRecipient(event => event.order.customer.phoneNumber)
 *   .setFrom('{{ fromNumber }}')
 *   .setTemplateVars(event => ({ order: event.order }));
 * ```
 *
 * This example creates a handler which listens for the `OrderStateTransitionEvent` and if the Order has
 * transitioned to the `'PaymentSettled'` state, it will generate and send a text message.
 *
 * The string argument passed into the `TextMessageEventListener` constructor is used to identify the handler, and
 * also to locate the directory of the email template files. So in the example above, there should be a directory
 * `<app root>/static/text-message/templates/order-confirmation` which contains a Handlebars template named `body.hbs`.
 *
 * ## Handling other languages
 *
 * By default, the handler will respond to all events on all channels and use the same subject ("Order confirmation for #12345" above)
 * and body template. Where the server is intended to support multiple languages, the `.addTemplate()` method may be used
 * to define the body template for specific language and channel combinations.
 *
 * The language is determined by looking at the `languageCode` property of the event's `ctx` ({@link RequestContext}) object.
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
 * ## Defining a custom handler
 *
 * Let's say you have a plugin which defines a new event type, `QuoteRequestedEvent`. In your plugin you have defined a mutation
 * which is executed when the customer requests a quote in your storefront, and in your resolver, you use the {@link EventBus} to publish a
 * new `QuoteRequestedEvent`.
 *
 * You now want to send a text message to the customer with their quote. Here are the steps you would take to set this up:
 *
 * ### 1. Create a new handler
 *
 * ```ts
 * import { TextMessageEventListener } from `\@vendure/text-message--plugin`;
 * import { QuoteRequestedEvent } from `./events`;
 *
 * const quoteRequestedHandler = new TextMessageEventListener('quote-requested')
 *   .on(QuoteRequestedEvent)
 *   .setRecipient(event => event.customer.phoneNumber)
 *   .setFrom('{{ fromNumber }}')
 *   .setTemplateVars(event => ({ details: event.details }));
 * ```
 *
 * ### 2. Create the text message template
 *
 * Next you need to make sure there is a template defined at `<app root>/static/text-message/templates/quote-requested/body.hbs`. The path
 * segment `quote-requested` must match the string passed to the `TextMessageEventListener` constructor.
 *
 * The template would look something like this:
 *
 * ```handlebars
 * Thank you for your interest in our products! Here's the details
 * of the quote you recently requested:
 * ```
 *
 * ### 3. Register the handler
 *
 * Finally, you need to register the handler with the TextMessagePlugin:
 *
 * ```ts {hl_lines=[8]}
 * import { TextMessagePlugin } from '\@vendure/text-message-plugin';
 * import { quoteRequestedHandler } from './plugins/quote-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     TextMessagePlugin.init({
 *       handler: [quoteRequestedHandler],
 *       // ... etc
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory core plugins/TextMessagePlugin
 */
export class TextMessageEventHandler<T extends string = string, Event extends EventWithContext = EventWithContext> {
    private setRecipientFn: (event: Event) => string;
    private setLanguageCodeFn: (event: Event) => LanguageCode | undefined;
    private setTemplateVarsFn: SetTemplateVarsFn<Event>;
    private setAttachmentsFn?: SetAttachmentsFn<Event>;
    private setOptionalRecipientsFieldsFn?: SetOptionalRecipientsFieldsFn<Event>;
    private filterFns: Array<(event: Event) => boolean> = [];
    private configurations: TextMessageTemplateConfig[] = [];
    private defaultSubject = 'EMPTY'
    private from: string;
    private _mockEvent: Omit<Event, 'ctx' | 'data'> | undefined;

    constructor(
        public listener: TextMessageEventListener<T>,
        public event: Type<Event>,
    ) {}

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
     * Defines a predicate function which is used to determine whether the event will trigger a text message.
     * Multiple filter functions may be defined.
     */
    filter(filterFn: (event: Event) => boolean): TextMessageEventHandler<T, Event> {
        this.filterFns.push(filterFn);
        return this;
    }

    /**
     * @description
     * A function which defines how the recipient should be extracted from the incoming event.
     *
     * The recipient has to be a E.164 formatted phone number: +14155552671
     */
    setRecipient(setRecipientFn: (event: Event) => string): TextMessageEventHandler<T, Event> {
        this.setRecipientFn = setRecipientFn;
        return this;
    }

    /**
     * @description
     * A function which allows to override the language of the text message. If not defined, the language from the context will be used.
     *
     * @since 1.8.0
     */
    setLanguageCode(setLanguageCodeFn: (event: Event) => LanguageCode | undefined): TextMessageEventHandler<T, Event> {
        this.setLanguageCodeFn = setLanguageCodeFn;
        return this;
    }

    /**
     * @description
     * A function which returns an object hash of variables which will be made available to the Handlebars template for interpolation.
     */
    setTemplateVars(templateVarsFn: SetTemplateVarsFn<Event>): TextMessageEventHandler<T, Event> {
        this.setTemplateVarsFn = templateVarsFn;
        return this;
    }

    /**
     * @description
     * Sets the default from field of the text message. The from string may use Handlebars variables defined by the
     * setTemplateVars() method.
     */
    setFrom(from: string): TextMessageEventHandler<T, Event> {
        this.from = from;
        return this;
    }

    /**
     * @description
     * A function which allows {@link OptionalRecipientsFields} to be specified.
     *
     * @since 1.1.0
     */
    setOptionalRecipientsFields(setOptionalRecipientsFieldsFn: SetOptionalRecipientsFieldsFn<Event>) {
        this.setOptionalRecipientsFieldsFn = setOptionalRecipientsFieldsFn;
        return this;
    }

    /**
     * @description
     * Defines one or more files to be attached to the email. An attachment can be specified
     * as either a `path` (to a file or URL) or as `content` which can be a string, Buffer or Stream.
     *
     * **Note:** When using the `content` to pass a Buffer or Stream, the raw data will get serialized
     * into the job queue. For this reason the total size of all attachments passed as `content` should kept to
     * **less than ~50k**. If the attachments are greater than that limit, a warning will be logged and
     * errors may result if using the DefaultJobQueuePlugin with certain DBs such as MySQL/MariaDB.
     *
     * @example
     * ```ts
     * const testAttachmentHandler = new TextMessageEventListener('activate-voucher')
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
     *
     * @deprecated Define a custom TemplateLoader on plugin initialization to define templates based on the RequestContext.
     * E.g. `TextMessagePlugin.init({ templateLoader: new CustomTemplateLoader() })`
     */
    addTemplate(config: TextMessageTemplateConfig): TextMessageEventHandler<T, Event> {
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
     * ```ts
     * new TextMessageEventListener('order-confirmation')
     *   .on(OrderStateTransitionEvent)
     *   .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
     *   .loadData(({ event, injector }) => {
     *     const orderService = injector.get(OrderService);
     *     return orderService.getOrderPayments(event.order.id);
     *   })
     *   .setTemplateVars(event => ({
     *     order: event.order,
     *     payments: event.data,
     *   }))
     *   // ...
     * ```
     */
    loadData<R>(
        loadDataFn: LoadDataFn<Event, R>,
    ): TextMessageEventHandlerWithAsyncData<R, T, Event, EventWithAsyncData<Event, R>> {
        const asyncHandler = new TextMessageEventHandlerWithAsyncData(loadDataFn, this.listener, this.event);
        asyncHandler.setRecipientFn = this.setRecipientFn;
        asyncHandler.setTemplateVarsFn = this.setTemplateVarsFn;
        asyncHandler.setAttachmentsFn = this.setAttachmentsFn;
        asyncHandler.setOptionalRecipientsFieldsFn = this.setOptionalRecipientsFieldsFn;
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
    ): Promise<IntermediateTextMessageDetails | undefined> {
        for (const filterFn of this.filterFns) {
            if (!filterFn(event)) {
                return;
            }
        }
        if (this instanceof TextMessageEventHandlerWithAsyncData) {
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
                    `Remember to call ".setRecipient()" when setting up the TextMessageEventHandler for ${this.type}`,
            );
        }
        if (this.from === undefined) {
            throw new Error(
                `No from field has been defined. ` +
                    `Remember to call ".setFrom()" when setting up the TextMessageEventHandler for ${this.type}`,
            );
        }
        const { ctx } = event;
        const languageCode = this.setLanguageCodeFn?.(event) || ctx.languageCode;
        const configuration = this.getBestConfiguration(ctx.channel.code, languageCode);
        const recipient = this.setRecipientFn(event);
        const templateVars = this.setTemplateVarsFn ? this.setTemplateVarsFn(event, globals) : {};
        let attachmentsArray: TextMessageAttachment[] = [];
        try {
            attachmentsArray = (await this.setAttachmentsFn?.(event)) ?? [];
        } catch (e: any) {
            Logger.error(e, loggerCtx, e.stack);
        }
        const attachments = await serializeAttachments(attachmentsArray);
        const optionalAddressFields = (await this.setOptionalRecipientsFieldsFn?.(event)) ?? {};
        return {
            ctx: event.ctx.serialize(),
            type: this.type,
            recipient,
            to: recipient,
            from: this.from,
            templateVars: { ...globals, ...templateVars },
            templateFile: configuration ? configuration.templateFile : 'body.hbs',
            attachments,
            ...optionalAddressFields,
        };
    }

    /**
     * @description
     * Optionally define a mock Event which is used by the dev mode mailbox app for generating mock emails
     * from this handler, which is useful when developing the email templates.
     */
    setMockEvent(event: Omit<Event, 'ctx' | 'data'>): TextMessageEventHandler<T, Event> {
        this._mockEvent = event;
        return this;
    }

    private getBestConfiguration(
        channelCode: string,
        languageCode: LanguageCode,
    ): TextMessageTemplateConfig | undefined {
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
 * Identical to the {@link TextMessageEventHandler} but with a `data` property added to the `event` based on the result
 * of the `.loadData()` function.
 *
 * @docsCategory core plugins/EmailPlugin
 */
export class TextMessageEventHandlerWithAsyncData<
    Data,
    T extends string = string,
    InputEvent extends EventWithContext = EventWithContext,
    Event extends EventWithAsyncData<InputEvent, Data> = EventWithAsyncData<InputEvent, Data>,
> extends TextMessageEventHandler<T, Event> {
    constructor(
        public _loadDataFn: LoadDataFn<InputEvent, Data>,
        listener: TextMessageEventListener<T>,
        event: Type<InputEvent>,
    ) {
        super(listener, event as any);
    }
}