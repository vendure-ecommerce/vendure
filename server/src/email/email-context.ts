import { LanguageCode } from '../../../shared/generated-types';

import { VendureEvent } from '../event-bus/vendure-event';

/**
 * @description
 * The EmailContext contains all the neccesary data required to generate an email
 * (subject, body).
 *
 * @docsCategory email
 */
export class EmailContext<T extends string = any, E extends VendureEvent = any> {
    public readonly type: T;
    public readonly recipient: string;
    /**
     * @description
     * The {@link VendureEvent} which triggered this email
     */
    public readonly event: E;
    public readonly languageCode: LanguageCode;
    public readonly channelCode: string;

    constructor(options: {
        type: T;
        languageCode: LanguageCode;
        channelCode: string;
        recipient: string;
        event: E;
    }) {
        const { type, recipient, event, languageCode, channelCode } = options;
        this.type = type;
        this.languageCode = languageCode;
        this.channelCode = channelCode;
        this.recipient = recipient;
        this.event = event;
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
