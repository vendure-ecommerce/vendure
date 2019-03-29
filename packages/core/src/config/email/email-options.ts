import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';

import { EmailContext, GeneratedEmailContext } from '../../email/email-context';
import { VendureEvent } from '../../event-bus/vendure-event';
import { ConfigService } from '../config.service';

/**
 * @description
 * This object defines the template location and context data used for interpolation
 * of an email for a particular language of a particular channel.
 *
 * @docsCategory email
 */
export type TemplateConfig<C = any, R = any> = {
    /**
     * @description
     * A function which uses the {@link EmailContext} to provide a context object for the
     * template engine. That is, the templates will have access to the object
     * returned by this function.
     */
    templateContext: (emailContext: C) => R;
    /**
     * @description
     * The subject line for the email.
     */
    subject: string;
    /**
     * @description
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

/**
 * @description
 * An object which configures an particular type of transactional email.
 *
 * @docsCategory email
 */
export type EmailTypeConfig<T extends string, E extends VendureEvent = any> = {
    /**
     * @description
     * Specifies the {@link VendureEvent} which triggers this type of email.
     */
    triggerEvent: Type<E>;
    /**
     * @description
     * A function which creates a context object for the email, specifying the recipient
     * email address, the languageCode of the email and the current Channel.
     *
     * A return value of `undefined` means that no email will be generated and sent.
     */
    createContext: (event: E) => CreateContextResult | undefined;
    /**
     * @description
     * An object which describes how to resolve the template for the email depending on
     * the current Channel and LanguageCode.
     */
    templates: TemplateByChannel<EmailContext<T, E>>;
};

/**
 * @description
 * An object describing each possible type of transactional email, plus which events
 * trigger those emails, as well as the location of the templates to handle each
 * email type. Search the repo for the `default-email-types.ts` file for an example of how
 * the email types are defined.
 *
 * When defining an email type, the helper function `configEmailType` may be used to
 * provide better type-safety.
 *
 * @example
 * ```ts
 * export const defaultEmailTypes: EmailTypes<DefaultEmailType> = {
 *  'order-confirmation': configEmailType({
 *    triggerEvent: OrderStateTransitionEvent,
 *    createContext: e => {
 *      const customer = e.order.customer;
 *      if (customer && e.toState === 'PaymentSettled') {
 *        return {
 *          recipient: customer.emailAddress,
 *          languageCode: e.ctx.languageCode,
 *          channelCode: e.ctx.channel.code,
 *        };
 *      }
 *    },
 *    templates: {
 *      defaultChannel: {
 *        defaultLanguage: {
 *          templateContext: emailContext => ({ order: emailContext.event.order }),
 *          subject: `Order confirmation for #{{ order.code }}`,
 *          templatePath: 'order-confirmation/order-confirmation.hbs',
 *        },
 *        de: {
 *          // config for German-language templates
 *        }
 *      },
 *      'other-channel-code': {
 *        // config for a different Channel
 *      }
 *    },
 *  }),
 * ```
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
