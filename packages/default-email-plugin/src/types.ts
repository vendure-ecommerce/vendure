import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Type } from '@vendure/common/lib/shared-types';
import { ConfigService, VendureEvent } from '@vendure/core';

import { EmailContext, GeneratedEmailContext } from './email-context';

/**
 * @description
 * Defines how transactional emails (account verification, order confirmation etc) are generated and sent.
 *
 * {{% alert %}}
 * It is usually not recommended to configure these yourself.
 * You should use the `DefaultEmailPlugin`.
 * {{% /alert %}}
 *
 * @docsCategory email
 * @docsWeight 0
 */
export interface EmailOptions<EmailType extends string> {
    /**
     * @description
     * Path to the email template files.
     *
     * @default __dirname
     */
    emailTemplatePath: string;
    /**
     * @description
     * Configuration for the creation and templating of each email type
     *
     * @default {}
     */
    emailTypes: EmailTypes<EmailType>;
    /**
     * @description
     * The EmailGenerator uses the EmailContext and template to generate the email body
     *
     * @default NoopEmailGenerator
     */
    generator: EmailGenerator;
    /**
     * @description
     * Configuration for the transport (email sending) method
     *
     * @default NoopTransportOptions
     */
    transport: EmailTransportOptions;
    /**
     * @description
     * An object containing any extra variables for use in email templates. For example,
     * the storefront URL could be defined here for use in password reset emails.
     *
     * @default {}
     */
    templateVars?: { [name: string]: any };
}

/**
 * @description
 * Configuration for the DefaultEmailPlugin.
 *
 * @docsCategory plugin
 */
export interface DefaultEmailPluginOptions {
    /**
     * @description
     * The path to the location of the email templates. In a default Vendure installation,
     * the templates are installed to `<project root>/vendure/email/templates`.
     */
    templatePath: string;
    /**
     * @description
     * Configures how the emails are sent.
     */
    transport: EmailTransportOptions;
    /**
     * @description
     * Variables for use in email templates
     */
    templateVars: { [name: string]: any };
}

export interface DefaultEmailPluginDevModeOptions {
    templatePath: string;
    outputPath: string;
    devMode: true;
    templateVars?: { [name: string]: any };
}

export interface SMTPCredentials {
    /** the username */
    user: string;
    /** then password */
    pass: string;
}

/**
 * @description
 * A subset of the SMTP transport options of [Nodemailer](https://nodemailer.com/smtp/)
 *
 * @docsCategory email
 */
export interface SMTPTransportOptions {
    type: 'smtp';
    /**
     * @description
     * the hostname or IP address to connect to (defaults to ‘localhost’)
     */
    host: string;
    /**
     * @description
     * The port to connect to (defaults to 25 or 465)
     */
    port: number;
    /**
     * @description
     * Defines authentication data
     */
    auth: SMTPCredentials;
    /**
     * @description
     * Defines if the connection should use SSL (if true) or not (if false)
     */
    secure?: boolean;
    /**
     * @description
     * Turns off STARTTLS support if true
     */
    ignoreTLS?: boolean;
    /**
     * @description
     * Forces the client to use STARTTLS. Returns an error if upgrading the connection is not possible or fails.
     */
    requireTLS?: boolean;
    /**
     * @description
     * Optional hostname of the client, used for identifying to the server
     */
    name?: string;
    /**
     * @description
     * The local interface to bind to for network connections
     */
    localAddress?: string;
    /**
     * @description
     * Defines preferred authentication method, e.g. ‘PLAIN’
     */
    authMethod?: string;
}

/**
 * @description
 * Uses the local Sendmail program to send the email.
 *
 * @docsCategory email
 */
export interface SendmailTransportOptions {
    type: 'sendmail';
    /** path to the sendmail command (defaults to ‘sendmail’) */
    path?: string;
    /** either ‘windows’ or ‘unix’ (default). Forces all newlines in the output to either use Windows syntax <CR><LF> or Unix syntax <LF> */
    newline?: string;
}

/**
 * @description
 * Outputs the email as an HTML file for development purposes.
 *
 * @docsCategory email
 */
export interface FileTransportOptions {
    type: 'file';
    /** The directory in which the emails will be saved */
    outputPath: string;
    /** When set to true, a raw text file will be output rather than an HTML file */
    raw?: boolean;
}

/**
 * @description
 * Does nothing with the generated email. Mainly intended for use in testing where we don't care about the email transport.
 *
 * @docsCategory email
 */
export interface NoopTransportOptions {
    type: 'none';
}

/**
 * @description
 * Forwards the raw GeneratedEmailContext object to a provided callback, for use in testing.
 *
 * @docsCategory email
 */
export interface TestingTransportOptions {
    type: 'testing';
    /**
     * @description
     * Callback to be invoked when an email would be sent.
     */
    onSend: (context: GeneratedEmailContext) => void;
}

/**
 * @description
 * A union of all the possible transport options for sending emails.
 *
 * @docsCategory email
 */
export type EmailTransportOptions =
    | SMTPTransportOptions
    | SendmailTransportOptions
    | FileTransportOptions
    | NoopTransportOptions
    | TestingTransportOptions;

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
    onInit?(options: EmailOptions<any>): void | Promise<void>;

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
