---
title: "Transport Options"
weight: 10
date: 2023-07-14T16:57:50.749Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Transport Options
<div class="symbol">


# EmailTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="131" packageName="@vendure/email-plugin">}}

A union of all the possible transport options for sending emails.

## Signature

```TypeScript
type EmailTransportOptions = | SMTPTransportOptions
    | SendmailTransportOptions
    | FileTransportOptions
    | NoopTransportOptions
    | SESTransportOptions
    | TestingTransportOptions
```
</div>
<div class="symbol">


# SMTPTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="146" packageName="@vendure/email-plugin">}}

The SMTP transport options of [Nodemailer](https://nodemailer.com/smtp/)

## Signature

```TypeScript
interface SMTPTransportOptions extends SMTPTransport.Options {
  type: 'smtp';
  logging?: boolean;
}
```
## Extends

 * SMTPTransport.Options


## Members

### type

{{< member-info kind="property" type="'smtp'"  >}}

{{< member-description >}}{{< /member-description >}}

### logging

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}If true, uses the configured <a href='/typescript-api/logger/vendure-logger#vendurelogger'>VendureLogger</a> to log messages from Nodemailer as it interacts with
the SMTP server.{{< /member-description >}}


</div>
<div class="symbol">


# SESTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="195" packageName="@vendure/email-plugin">}}

The SES transport options of [Nodemailer](https://nodemailer.com/transports/ses//)

See [Nodemailers's SES docs](https://nodemailer.com/transports/ses/) for more details

*Example*

```TypeScript
 import { SES, SendRawEmailCommand } from '@aws-sdk/client-ses'

 const ses = new SES({
    apiVersion: '2010-12-01',
    region: 'eu-central-1',
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY || '',
        secretAccessKey: process.env.SES_SECRET_KEY || '',
    },
 })

 const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    EmailPlugin.init({
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, 'static/email/templates'),
      transport: {
        type: 'ses',
        SES: { ses, aws: { SendRawEmailCommand } },
        sendingRate: 10, // optional messages per second sending rate
      },
    }),
  ],
};
 ```

## Signature

```TypeScript
interface SESTransportOptions extends SESTransport.Options {
  type: 'ses';
}
```
## Extends

 * SESTransport.Options


## Members

### type

{{< member-info kind="property" type="'ses'"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# SendmailTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="206" packageName="@vendure/email-plugin">}}

Uses the local Sendmail program to send the email.

## Signature

```TypeScript
interface SendmailTransportOptions {
  type: 'sendmail';
  path?: string;
  newline?: string;
}
```
## Members

### type

{{< member-info kind="property" type="'sendmail'"  >}}

{{< member-description >}}{{< /member-description >}}

### path

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### newline

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# FileTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="221" packageName="@vendure/email-plugin">}}

Outputs the email as an HTML file for development purposes.

## Signature

```TypeScript
interface FileTransportOptions {
  type: 'file';
  outputPath: string;
  raw?: boolean;
}
```
## Members

### type

{{< member-info kind="property" type="'file'"  >}}

{{< member-description >}}{{< /member-description >}}

### outputPath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### raw

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# NoopTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="237" packageName="@vendure/email-plugin">}}

Does nothing with the generated email. Intended for use in testing where we don't care about the email transport,
or when using a custom <a href='/typescript-api/core-plugins/email-plugin/email-sender#emailsender'>EmailSender</a> which does not require transport options.

## Signature

```TypeScript
interface NoopTransportOptions {
  type: 'none';
}
```
## Members

### type

{{< member-info kind="property" type="'none'"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# TestingTransportOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="266" packageName="@vendure/email-plugin">}}

Forwards the raw GeneratedEmailContext object to a provided callback, for use in testing.

## Signature

```TypeScript
interface TestingTransportOptions {
  type: 'testing';
  onSend: (details: EmailDetails) => void;
}
```
## Members

### type

{{< member-info kind="property" type="'testing'"  >}}

{{< member-description >}}{{< /member-description >}}

### onSend

{{< member-info kind="property" type="(details: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>) =&#62; void"  >}}

{{< member-description >}}Callback to be invoked when an email would be sent.{{< /member-description >}}


</div>
