import { LanguageCode } from 'shared/generated-types';
import { Type } from 'shared/shared-types';

import { EmailContext, GeneratedEmailContext } from '../../email/email-context';
import { VendureEvent } from '../../event-bus/vendure-event';

export type TemplateConfig<R = any> = {
    subject: (data: R) => string;
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
    generate(context: EmailContext<T, E>): GeneratedEmailContext<T, E> | Promise<GeneratedEmailContext<T, E>>;
}
