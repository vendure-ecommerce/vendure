import { GeneratedEmailContext } from '../../email/email-context';

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
    /** the hostname or IP address to connect to (defaults to ‘localhost’) */
    host: string;
    /** the port to connect to (defaults to 25 or 465) */
    port: number;
    /** defines authentication data */
    auth: SMTPCredentials;
    /** defines if the connection should use SSL (if true) or not (if false) */
    secure?: boolean;
    /** turns off STARTTLS support if true */
    ignoreTLS?: boolean;
    /** forces the client to use STARTTLS. Returns an error if upgrading the connection is not possible or fails. */
    requireTLS?: boolean;
    /** optional hostname of the client, used for identifying to the server */
    name?: string;
    /** the local interface to bind to for network connections */
    localAddress?: string;
    /** defines preferred authentication method, e.g. ‘PLAIN’ */
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
