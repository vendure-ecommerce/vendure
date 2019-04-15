import { LanguageCode } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { Type } from '@vendure/common/lib/shared-types';
import { RequestContext, VendureEvent } from '@vendure/core';

import { EmailEventHandler } from './event-listener';

/**
 * @description
 * A VendureEvent which also includes a `ctx` property containing the current
 * {@link RequestContext}, which is used to determine the channel and language
 * to use when generating the email.
 *
 * @docsCategory EmailPlugin
 */
export type EventWithContext = VendureEvent & { ctx: RequestContext; };

/**
 * @description
 * Configuration for the EmailPlugin.
 *
 * @docsCategory EmailPlugin
 * @docsWeight 0
 */
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
    handlers: EmailEventHandler[];
}

/**
 * @description
 * Configuration for running the EmailPlugin in development mode.
 *
 * @docsCategory EmailPlugin
 */
export interface EmailPluginDevModeOptions extends Omit<EmailPluginOptions, 'transport'> {
    outputPath: string;
    devMode: true;
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
 * @docsCategory EmailPlugin
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
 * @docsCategory EmailPlugin
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
 * @docsCategory EmailPlugin
 */
export interface NoopTransportOptions {
    type: 'none';
}

/**
 * The final, generated email details to be sent.
 */
export interface EmailDetails {
    recipient: string;
    subject: string;
    body: string;
}

/**
 * @description
 * Forwards the raw GeneratedEmailContext object to a provided callback, for use in testing.
 *
 * @docsCategory EmailPlugin
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
 * A union of all the possible transport options for sending emails.
 *
 * @docsCategory EmailPlugin
 */
export type EmailTransportOptions =
    | SMTPTransportOptions
    | SendmailTransportOptions
    | FileTransportOptions
    | NoopTransportOptions
    | TestingTransportOptions;

/**
 * @description
 * An EmailGenerator generates the subject and body details of an email.
 */
export interface EmailGenerator<T extends string = any, E extends VendureEvent = any> {
    /**
     * @description
     * Any neccesary setup can be performed here.
     */
    onInit?(options: EmailPluginOptions): void | Promise<void>;

    /**
     * @description
     * Given a subject and body from an email template, this method generates the final
     * interpolated email text.
     */
    generate(
        subject: string,
        body: string,
        templateVars: { [key: string]: any; },
    ): Omit<EmailDetails, 'recipient'>;
}
