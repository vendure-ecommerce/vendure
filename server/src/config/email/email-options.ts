import { LanguageCode } from '../../../../shared/generated-types';
import { Type } from '../../../../shared/shared-types';
import { EmailContext, GeneratedEmailContext } from '../../email/email-context';
import { VendureEvent } from '../../event-bus/vendure-event';
import { ConfigService } from '../config.service';

export type TemplateConfig<C = any, R = any> = {
    /**
     * A function which uses the EmailContext to provide a context object for the
     * template engine. That is, the templates will have access to the object
     * returned by this function.
     */
    templateContext: (emailContext: C) => R;
    /**
     * The subject line for the email.
     */
    subject: string;
    /**
     * The path to the template file for the body of the email.
     */
    templatePath: string;
};

export type TemplateByLanguage<C = any> = { defaultLanguage: TemplateConfig<C> } & {
    [languageCode: string]: TemplateConfig<C>;
};

export type TemplateByChannel<C = any> = { defaultChannel: TemplateByLanguage<C> } & {
    [channelCode: string]: TemplateByLanguage<C>;
};

export type CreateContextResult = {
    recipient: string;
    languageCode: LanguageCode;
    channelCode: string;
};

export type EmailTypeConfig<T extends string, E extends VendureEvent = any> = {
    triggerEvent: Type<E>;
    createContext: (event: E) => CreateContextResult | undefined;
    templates: TemplateByChannel<EmailContext<T, E>>;
};

/**
 * @description
 * An object describing each possible type of transactional email, plus which events
 * trigger those emails, as well as the location of the templates to handle each
 * email type. Search the repo for the `default-email-types.ts` file for an example of how
 * the email types are defined.
 *
 * @docsCategory email
 */
export type EmailTypes<T extends string> = { [emailType in T]: EmailTypeConfig<T> };

export function configEmailType<T extends string, E extends VendureEvent = VendureEvent>(
    config: EmailTypeConfig<T, E>,
) {
    return config;
}

/**
 * @description
 * The EmailGenerator uses the {@link EmailContext} and template to generate the email body
 *
 * @docsCategory email
 */
export interface EmailGenerator<T extends string = any, E extends VendureEvent = any> {
    /**
     * @description
     * Any neccesary setup can be performed here.
     */
    onInit?(config: ConfigService): void | Promise<void>;

    /**
     * @description
     * Given a subject and body from an email template, this method generates the final
     * interpolated email text.
     */
    generate(
        subject: string,
        body: string,
        templateContext: any,
        emailContext: EmailContext<T, E>,
    ): GeneratedEmailContext<T, E> | Promise<GeneratedEmailContext<T, E>>;
}
