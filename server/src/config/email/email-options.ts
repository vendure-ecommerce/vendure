import { LanguageCode } from '../../../../shared/generated-types';
import { Type } from '../../../../shared/shared-types';

import { ReadOnlyRequired } from '../../common/types/common-types';
import { EmailContext, GeneratedEmailContext } from '../../email/email-context';
import { VendureEvent } from '../../event-bus/vendure-event';
import { VendureConfig } from '../vendure-config';

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

export type EmailTypes<T extends string> = { [emailType in T]: EmailTypeConfig<T> };

export function configEmailType<T extends string, E extends VendureEvent = VendureEvent>(
    config: EmailTypeConfig<T, E>,
) {
    return config;
}

export interface EmailGenerator<T extends string = any, E extends VendureEvent = any> {
    onInit?(config: ReadOnlyRequired<VendureConfig>): void | Promise<void>;
    generate(
        subject: string,
        body: string,
        templateContext: any,
        emailContext: EmailContext<T, E>,
    ): GeneratedEmailContext<T, E> | Promise<GeneratedEmailContext<T, E>>;
}
