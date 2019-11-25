import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';

import { EmailEventHandler } from './event-handler';
import { EventWithContext } from './types';

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
 * A function used to define template variables available to email templates.
 * See {@link EmailEventHandler}.setTemplateVars().
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type SetTemplateVarsFn<Event> = (
    event: Event,
    globals: { [key: string]: any },
) => { [key: string]: any };

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
