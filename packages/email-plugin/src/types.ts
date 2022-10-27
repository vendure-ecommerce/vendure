import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { Injector, RequestContext, VendureEvent } from '@vendure/core';
import { Attachment } from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

import { EmailGenerator } from './email-generator';
import { EmailSender } from './email-sender';
import { EmailEventHandler } from './event-handler';

/**
 * @description
 * A VendureEvent which also includes a `ctx` property containing the current
 * {@link RequestContext}, which is used to determine the channel and language
 * to use when generating the email.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type EventWithContext = VendureEvent & { ctx: RequestContext };

/**
 * @description
 * A VendureEvent with a {@link RequestContext} and a `data` property which contains the
 * value resolved from the {@link EmailEventHandler}`.loadData()` callback.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type EventWithAsyncData<Event extends EventWithContext, R> = Event & { data: R };

/**
 * @description
 * Configuration for the EmailPlugin.
 *
 * @docsCategory EmailPlugin
 * @docsPage EmailPluginOptions
 * */
export interface EmailPluginOptions {
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
     * An array of {@link EmailEventHandler}s which define which Vendure events will trigger
     * emails, and how those emails are generated.
     */
    handlers: Array<EmailEventHandler<string, any>>;
    /**
     * @description
     * An object containing variables which are made available to all templates. For example,
     * the storefront URL could be defined here and then used in the "email address verification"
     * email.
     */
    globalTemplateVars?: { [key: string]: any };
    /**
     * @description
     * An optional allowed EmailSender, used to allow custom implementations of the send functionality
     * while still utilizing the existing emailPlugin functionality.
     *
     * @default NodemailerEmailSender
     */
    emailSender?: EmailSender;
    /**
     * @description
     * An optional allowed EmailGenerator, used to allow custom email generation functionality to
     * better match with custom email sending functionality.
     *
     * @default HandlebarsMjmlGenerator
     */
    emailGenerator?: EmailGenerator;
}

/**
 * @description
 * Configuration for running the EmailPlugin in development mode.
 *
 * @docsCategory EmailPlugin
 * @docsPage EmailPluginOptions
 */
export interface EmailPluginDevModeOptions extends Omit<EmailPluginOptions, 'transport'> {
    devMode: true;
    /**
     * @description
     * The path to which html email files will be saved rather than being sent.
     */
    outputPath: string;
    /**
     * @description
     * The route to the dev mailbox server.
     */
    route: string;
}

/**
 * @description
 * A union of all the possible transport options for sending emails.
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
 */
export type EmailTransportOptions =
    | SMTPTransportOptions
    | SendmailTransportOptions
    | FileTransportOptions
    | NoopTransportOptions
    | TestingTransportOptions;

/**
 * @description
 * The SMTP transport options of [Nodemailer](https://nodemailer.com/smtp/)
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
 */
export interface SMTPTransportOptions extends SMTPTransport.Options {
    type: 'smtp';
    /**
     * @description
     * If true, uses the configured {@link VendureLogger} to log messages from Nodemailer as it interacts with
     * the SMTP server.
     *
     * @default false
     */
    logging?: boolean;
}

/**
 * @description
 * Uses the local Sendmail program to send the email.
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
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
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
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
 * Does nothing with the generated email. Intended for use in testing where we don't care about the email transport,
 * or when using a custom {@link EmailSender} which does not require transport options.
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
 */
export interface NoopTransportOptions {
    type: 'none';
}

/**
 * @description
 * The final, generated email details to be sent.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export interface EmailDetails<Type extends 'serialized' | 'unserialized' = 'unserialized'> {
    from: string;
    recipient: string;
    subject: string;
    body: string;
    attachments: Array<Type extends 'serialized' ? SerializedAttachment : Attachment>;
    cc?: string;
    bcc?: string;
    replyTo?: string;
}

/**
 * @description
 * Forwards the raw GeneratedEmailContext object to a provided callback, for use in testing.
 *
 * @docsCategory EmailPlugin
 * @docsPage Transport Options
 */
export interface TestingTransportOptions {
    type: 'testing';
    /**
     * @description
     * Callback to be invoked when an email would be sent.
     */
    onSend: (details: EmailDetails) => void;
}

/**
 * @description
 * A function used to load async data for use by an {@link EmailEventHandler}.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type LoadDataFn<Event extends EventWithContext, R> = (context: {
    event: Event;
    injector: Injector;
}) => Promise<R>;

export type OptionalToNullable<O> = {
    [K in keyof O]-?: undefined extends O[K] ? NonNullable<O[K]> | null : O[K];
};

/**
 * @description
 * An object defining a file attachment for an email. Based on the object described
 * [here in the Nodemailer docs](https://nodemailer.com/message/attachments/), but
 * only uses the `path` property to define a filesystem path or a URL pointing to
 * the attachment file.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type EmailAttachment = Omit<Attachment, 'raw'> & { path?: string };

export type SerializedAttachment = OptionalToNullable<
    Omit<EmailAttachment, 'content'> & { content: string | null }
>;

export type IntermediateEmailDetails = {
    type: string;
    from: string;
    recipient: string;
    templateVars: any;
    subject: string;
    templateFile: string;
    attachments: SerializedAttachment[];
    cc?: string;
    bcc?: string;
    replyTo?: string;
};

/**
 * @description
 * Configures the {@link EmailEventHandler} to handle a particular channel & languageCode
 * combination.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
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
 * A function used to define attachments to be sent with the email.
 * See https://nodemailer.com/message/attachments/ for more information about
 * how attachments work in Nodemailer.
 *
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type SetAttachmentsFn<Event> = (event: Event) => EmailAttachment[] | Promise<EmailAttachment[]>;

/**
 * @description
 * Optional address-related fields for sending the email.
 *
 * @since 1.1.0
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export interface OptionalAddressFields {
    /**
     * @description
     * Comma separated list of recipients email addresses that will appear on the _Cc:_ field
     */
    cc?: string;
    /**
     * @description
     * Comma separated list of recipients email addresses that will appear on the _Bcc:_ field
     */
    bcc?: string;
    /**
     * @description
     * An email address that will appear on the _Reply-To:_ field
     */
    replyTo?: string;
}

/**
 * @description
 * A function used to set the {@link OptionalAddressFields}.
 *
 * @since 1.1.0
 * @docsCategory EmailPlugin
 * @docsPage Email Plugin Types
 */
export type SetOptionalAddressFieldsFn<Event> = (
    event: Event,
) => OptionalAddressFields | Promise<OptionalAddressFields>;
