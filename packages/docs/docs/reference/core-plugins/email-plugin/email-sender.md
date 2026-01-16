---
title: "EmailSender"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailSender

<GenerationInfo sourceFile="packages/email-plugin/src/sender/email-sender.ts" sourceLine="45" packageName="@vendure/email-plugin" />

An EmailSender is responsible for sending the email, e.g. via an SMTP connection
or using some other mail-sending API. By default, the EmailPlugin uses the
<a href='/reference/core-plugins/email-plugin/email-sender#nodemaileremailsender'>NodemailerEmailSender</a>, but it is also possible to supply a custom implementation:

*Example*

```ts
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
       // ... template, handler config omitted
      transport: { type: 'none' },
       emailSender: new SendgridEmailSender(),
    }),
  ],
};
```

```ts title="Signature"
interface EmailSender extends InjectableStrategy {
    send: (email: EmailDetails, options: EmailTransportOptions) => void | Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### send

<MemberInfo kind="property" type={`(email: <a href='/reference/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, options: <a href='/reference/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>) =&#62; void | Promise&#60;void&#62;`}   />




</div>


## NodemailerEmailSender

<GenerationInfo sourceFile="packages/email-plugin/src/sender/nodemailer-email-sender.ts" sourceLine="39" packageName="@vendure/email-plugin" />

Uses the configured transport to send the generated email.

```ts title="Signature"
class NodemailerEmailSender implements EmailSender {
    send(email: EmailDetails, options: EmailTransportOptions) => ;
}
```
* Implements: <code><a href='/reference/core-plugins/email-plugin/email-sender#emailsender'>EmailSender</a></code>



<div className="members-wrapper">

### send

<MemberInfo kind="method" type={`(email: <a href='/reference/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, options: <a href='/reference/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>) => `}   />




</div>
