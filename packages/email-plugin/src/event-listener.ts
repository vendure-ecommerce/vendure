import { Type } from '@vendure/common/lib/shared-types';
import { LanguageCode } from '@vendure/common/src/generated-types';

import { EmailDetails, EventWithContext } from './types';

/**
 * @description
 * Configures the {@link EmailEventHandler} to handle a particular channel & languageCode
 * combination.
 *
 * @docsCategory EmailPlugin
 */
export interface EmailTemplateConfig {
    /**
     * @description
     * Specifies the channel to which this configuration will apply. If set to `'default'`, it will be applied to all
     * channels.
     */
    channelCode: string | 'default';
    /**
     * @description
     * Specifies the languageCode to which this configuration will apply. If set to `'default'`, it will be applied to all
     * languages.
     */
    languageCode: LanguageCode | 'default';
    /**
     * @description
     * Defines the file name of the Handlebars template file to be used to when generating this email.
     */
    templateFile: string;
    /**
     * @description
     * A string defining the email subject line. Handlebars variables defined in the `templateVars` object may
     * be used inside the subject.
     */
    subject: string;
}

/**
 * @description
 * An EmailEventListener is used to listen for events and set up a {@link EmailEventHandler} which
 * defines how an email will be generated from this event.
 *
 * @docsCategory EmailPlugin
 */
export class EmailEventListener<T extends string> {
    public type: T;
    constructor(type: T) {
        this.type = type;
    }

    /**
     * @description
     * Defines the event to listen for.
     */
    on<Event extends EventWithContext>(event: Type<Event>): EmailEventHandler<T, Event> {
        return new EmailEventHandler<T, Event>(this, event);
    }
}

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
    private setTemplateVarsFn: (event: Event) => { [key: string]: any; };
    private filterFns: Array<(event: Event) => boolean> = [];
    private configurations: EmailTemplateConfig[] = [];
    private defaultSubject: string;

    constructor(public listener: EmailEventListener<T>, public event: Type<Event>) {}

    get type(): T {
        return this.listener.type;
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
    setTemplateVars(templateVarsFn: (event: Event) => { [key: string]: any; }): EmailEventHandler<T, Event> {
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
     * Add configuration for another template other than the default `"body.hbs"`. Use this method to define specific
     * templates for channels or languageCodes other than the default.
     */
    addTemplate(config: EmailTemplateConfig): EmailEventHandler<T, Event> {
        this.configurations.push(config);
        return this;
    }

    /**
     * @description
     * Used internally by the EmailPlugin to handle incoming events.
     */
    handle(event: Event): { recipient: string; templateVars: any; subject: string; templateFile: string; } | undefined {
        for (const filterFn of this.filterFns) {
            if (!filterFn(event)) {
                return;
            }
        }
        if (!this.setRecipientFn) {
            throw new Error(`No setRecipientFn has been defined. ` +
            `Remember to call ".setRecipient()" when setting up the EmailEventHandler for ${this.type}`);
        }
        const { ctx } = event;
        const configuration = this.getBestConfiguration(ctx.channel.code, ctx.languageCode);
        const recipient = this.setRecipientFn(event);
        const templateVars = this.setTemplateVarsFn ? this.setTemplateVarsFn(event) : {};
        return {
            recipient,
            templateVars,
            subject: configuration ? configuration.subject : this.defaultSubject,
            templateFile: configuration ? configuration.templateFile : 'body.hbs',
        };
    }

    private getBestConfiguration(channelCode: string, languageCode: LanguageCode): EmailTemplateConfig | undefined {
        if ( this.configurations.length === 0) {
            return;
        }
        const exactMatch = this.configurations.find(c => {
            return (c.channelCode === channelCode || c.channelCode === 'default') && c.languageCode === languageCode;
        });
        if (exactMatch) {
            return exactMatch;
        }
        const channelMatch = this.configurations.find(c => c.channelCode === channelCode && c.languageCode === 'default');
        if (channelMatch) {
            return channelMatch;
        }
        return;
    }
}
