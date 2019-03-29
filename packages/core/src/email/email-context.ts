import { LanguageCode } from '@vendure/common/lib/generated-types';

import { VendureEvent } from '../event-bus/vendure-event';

/**
 * @description
 * The EmailContext contains all the neccesary data required to generate an email.
 * It is used in the `templateContext` method of the {@link TemplateConfig} object
 * to define which data get passed to the email template engine for interpolation.
 *
 * @docsCategory email
 */
export class EmailContext<T extends string = any, E extends VendureEvent = any> {
    /**
     * @description
     * A string defining the type of email, e.g. "order-confirmation". See {@link DefaultEmailType}
     * for the default types available.
     */
    public readonly type: T;
    /**
     * @description
     * The email address of the email recipient.
     */
    public readonly recipient: string;
    /**
     * @description
     * The {@link VendureEvent} which triggered this email
     */
    public readonly event: E;
    /**
     * @description
     * The code of the active language when the even was fired.
     */
    public readonly languageCode: LanguageCode;
    /**
     * @description
     * The code of the Channel from which the event triggering the email was
     * fired.
     */
    public readonly channelCode: string;
    /**
     * @description
     * The variables defined in the {@link EmailOptions} which can be used in
     * the email templates.
     */
    public readonly templateVars: { [name: string]: any };

    constructor(options: {
        type: T;
        languageCode: LanguageCode;
        channelCode: string;
        recipient: string;
        event: E;
        templateVars: { [name: string]: any };
    }) {
        const { type, recipient, event, languageCode, channelCode, templateVars } = options;
        this.type = type;
        this.languageCode = languageCode;
        this.channelCode = channelCode;
        this.recipient = recipient;
        this.event = event;
        this.templateVars = templateVars;
    }
}

/**
 *
 *
 * @docsCateogry email
 */
export class GeneratedEmailContext<T extends string = any, E extends VendureEvent = any> extends EmailContext<
    T,
    E
> {
    public readonly subject: string;
    public readonly body: string;

    constructor(context: EmailContext<T, E>, subject: string, body: string) {
        super(context);
        this.subject = subject;
        this.body = body;
    }
}
