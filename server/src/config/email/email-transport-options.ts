/**
 * A subset of the SMTP transport options of Nodemailer (https://nodemailer.com/smtp/)
 */
export interface SMTPTransportOptions {
    type: 'smtp';
    /** the hostname or IP address to connect to (defaults to ‘localhost’) */
    host: string;
    /** the port to connect to (defaults to 25 or 465) */
    port: number;
    /** defines authentication data */
    auth: {
        /** the username */
        user: string;
        /** then password */
        pass: string;
    };
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

export interface SendmailTransportOptions {
    type: 'sendmail';
    /** path to the sendmail command (defaults to ‘sendmail’) */
    path?: string;
    /** either ‘windows’ or ‘unix’ (default). Forces all newlines in the output to either use Windows syntax <CR><LF> or Unix syntax <LF> */
    newline?: string;
}

export interface FileTransportOptions {
    type: 'file';
    outputPath: string;
}

export interface NoopTransportOptions {
    type: 'none';
}

export type EmailTransportOptions =
    | SMTPTransportOptions
    | SendmailTransportOptions
    | FileTransportOptions
    | NoopTransportOptions;
