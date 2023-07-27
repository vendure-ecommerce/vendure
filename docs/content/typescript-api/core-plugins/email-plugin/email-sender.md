---
title: "EmailSender"
weight: 10
date: 2023-07-14T16:57:50.718Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailSender
<div class="symbol">


# EmailSender

{{< generation-info sourceFile="packages/email-plugin/src/email-sender.ts" sourceLine="45" packageName="@vendure/email-plugin">}}

An EmailSender is responsible for sending the email, e.g. via an SMTP connection
or using some other mail-sending API. By default, the EmailPlugin uses the
<a href='/typescript-api/core-plugins/email-plugin/email-sender#nodemaileremailsender'>NodemailerEmailSender</a>, but it is also possible to supply a custom implementation:

*Example*

```TypeScript
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class SendgridEmailSender implements EmailSender {
  async send(email: EmailDetails) {
    await sgMail.send({
      to: email.recipient,
      from: email.from,
      subject: email.subject,
      html: email.body,
    });
  }
}

const config: VendureConfig = {
  logger: new DefaultLogger({ level: LogLevel.Debug })
  // ...
  plugins: [
    EmailPlugin.init({
       // ... template, handlers config omitted
      transport: { type: 'none' },
       emailSender: new SendgridEmailSender(),
    }),
  ],
};
```

## Signature

```TypeScript
interface EmailSender extends InjectableStrategy {
  send: (email: EmailDetails, options: EmailTransportOptions) => void | Promise<void>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### send

{{< member-info kind="property" type="(email: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, options: <a href='/typescript-api/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>) =&#62; void | Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# NodemailerEmailSender

{{< generation-info sourceFile="packages/email-plugin/src/nodemailer-email-sender.ts" sourceLine="38" packageName="@vendure/email-plugin">}}

Uses the configured transport to send the generated email.

## Signature

```TypeScript
class NodemailerEmailSender implements EmailSender {
  async send(email: EmailDetails, options: EmailTransportOptions) => ;
}
```
## Implements

 * <a href='/typescript-api/core-plugins/email-plugin/email-sender#emailsender'>EmailSender</a>


## Members

### send

{{< member-info kind="method" type="(email: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, options: <a href='/typescript-api/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
