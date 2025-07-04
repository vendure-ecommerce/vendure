---
title: 'EmailEventHandler'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## EmailEventHandler

<GenerationInfo sourceFile="packages/email-plugin/src/handler/event-handler.ts" sourceLine="136" packageName="@vendure/email-plugin" />

The EmailEventHandler defines how the EmailPlugin will respond to a given event.

A handler is created by creating a new <a href='/reference/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a> and calling the `.on()` method
to specify which event to respond to.

_Example_

```ts
const confirmationHandler = new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled')
    .setRecipient(event => event.order.customer.emailAddress)
    .setFrom('{{ fromAddress }}')
    .setSubject(`Order confirmation for #{{ order.code }}`)
    .setTemplateVars(event => ({ order: event.order }));
```

This example creates a handler which listens for the `OrderStateTransitionEvent` and if the Order has
transitioned to the `'PaymentSettled'` state, it will generate and send an email.

The string argument passed into the `EmailEventListener` constructor is used to identify the handler, and
also to locate the directory of the email template files. So in the example above, there should be a directory
`<app root>/static/email/templates/order-confirmation` which contains a Handlebars template named `body.hbs`.

## Handling other languages

By default, a handler will respond to all events on all channels and use the same subject ("Order confirmation for #12345" above)
and body template.

Since v2.0 the `.addTemplate()` method has been **deprecated**. To serve different templates—for example, based on the current
`languageCode`—implement a custom <a href='/reference/core-plugins/email-plugin/template-loader#templateloader'>TemplateLoader</a> and pass it to `EmailPlugin.init({ templateLoader: new MyTemplateLoader() })`.

The language is typically determined by the `languageCode` property of the event's `ctx` (<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) object, so the
`loadTemplate()` method can use that to locate the correct template file.

_Example_

```ts
import { EmailPlugin, TemplateLoader } from '@vendure/email-plugin';
import { readFileSync } from 'fs';
import path from 'path';

class CustomLanguageAwareTemplateLoader implements TemplateLoader {
    constructor(private templateDir: string) {}

    async loadTemplate(_injector, ctx, { type, templateName }) {
        // e.g. returns the content of "body.de.hbs" or "body.en.hbs" depending on ctx.languageCode
        const filePath = path.join(this.templateDir, type, `${templateName}.${ctx.languageCode}.hbs`);
        return readFileSync(filePath, 'utf-8');
    }
}

EmailPlugin.init({
    templateLoader: new CustomLanguageAwareTemplateLoader(path.join(__dirname, '../static/email/templates')),
    handlers: defaultEmailHandlers,
});
```

## Defining a custom handler

Let's say you have a plugin which defines a new event type, `QuoteRequestedEvent`. In your plugin you have defined a mutation
which is executed when the customer requests a quote in your storefront, and in your resolver, you use the <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a> to publish a
new `QuoteRequestedEvent`.

You now want to email the customer with their quote. Here are the steps you would take to set this up:

### 1. Create a new handler

```ts
import { EmailEventListener } from `@vendure/email-plugin`;
import { QuoteRequestedEvent } from `./events`;

const quoteRequestedHandler = new EmailEventListener('quote-requested')
  .on(QuoteRequestedEvent)
  .setRecipient(event => event.customer.emailAddress)
  .setSubject(`Here's the quote you requested`)
  .setFrom('{{ fromAddress }}')
  .setTemplateVars(event => ({ details: event.details }));
```

### 2. Create the email template

Next you need to make sure there is a template defined at `<app root>/static/email/templates/quote-requested/body.hbs`. The path
segment `quote-requested` must match the string passed to the `EmailEventListener` constructor.

The template would look something like this:

```handlebars
{{> header title="Here's the quote you requested" }}

<mj-section background-color="#fafafa">
    <mj-column>
        <mj-text color="#525252">
            Thank you for your interest in our products! Here's the details
            of the quote you recently requested:
        </mj-text>

        <--! your custom email layout goes here -->
    </mj-column>
</mj-section>


{{> footer }}
```

You can find pre-made templates on the [MJML website](https://mjml.io/templates/).

### 3. Register the handler

Finally, you need to register the handler with the EmailPlugin:

```ts {hl_lines=[8]}
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { quoteRequestedHandler } from './plugins/quote-plugin';

const config: VendureConfig = {
    // Add an instance of the plugin to the plugins array
    plugins: [
        EmailPlugin.init({
            handler: [...defaultEmailHandlers, quoteRequestedHandler],
            // ... etc
        }),
    ],
};
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(listener: <a href='/reference/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a>&#60;T&#62;, event: Type&#60;Event&#62;) => EmailEventHandler`} />

### filter

<MemberInfo kind="method" type={`(filterFn: (event: Event) =&#62; boolean) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

Defines a predicate function which is used to determine whether the event will trigger an email.
Multiple filter functions may be defined.

### setRecipient

<MemberInfo kind="method" type={`(setRecipientFn: (event: Event) =&#62; string) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

A function which defines how the recipient email address should be extracted from the incoming event.

The recipient can be a plain email address: `'foobar@example.com'`
Or with a formatted name (includes unicode support): `'Ноде Майлер <foobar@example.com>'`
Or a comma-separated list of addresses: `'foobar@example.com, "Ноде Майлер" <bar@example.com>'`

### setLanguageCode

<MemberInfo kind="method" type={`(setLanguageCodeFn: (event: Event) =&#62; <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a> | undefined) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} since="1.8.0" />

A function which allows to override the language of the email. If not defined, the language from the context will be used.

### setTemplateVars

<MemberInfo kind="method" type={`(templateVarsFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#settemplatevarsfn'>SetTemplateVarsFn</a>&#60;Event&#62;) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

A function which returns an object hash of variables which will be made available to the Handlebars template
and subject line for interpolation.

### setSubject

<MemberInfo kind="method" type={`(defaultSubject: string | <a href='/reference/core-plugins/email-plugin/email-plugin-types#setsubjectfn'>SetSubjectFn</a>&#60;Event&#62;) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

Sets the default subject of the email. The subject string may use Handlebars variables defined by the
setTemplateVars() method.

### setFrom

<MemberInfo kind="method" type={`(from: string) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

Sets the default from field of the email. The from string may use Handlebars variables defined by the
setTemplateVars() method.

### setOptionalAddressFields

<MemberInfo kind="method" type={`(optionalAddressFieldsFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#setoptionaladdressfieldsfn'>SetOptionalAddressFieldsFn</a>&#60;Event&#62;) => `} since="1.1.0" />

A function which allows <a href='/reference/core-plugins/email-plugin/email-plugin-types#optionaladdressfields'>OptionalAddressFields</a> to be specified such as "cc" and "bcc".

### setMetadata

<MemberInfo kind="method" type={`(optionalSetMetadataFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#setmetadatafn'>SetMetadataFn</a>&#60;Event&#62;) => `} since="3.1.0" />

A function which allows <a href='/reference/core-plugins/email-plugin/email-plugin-types#emailmetadata'>EmailMetadata</a> to be specified for the email. This can be used
to store arbitrary data about the email which can be used for tracking or other purposes.

It will be exposed in the <a href='/reference/core-plugins/email-plugin/email-send-event#emailsendevent'>EmailSendEvent</a> as `event.metadata`. Here's an example of usage:

- An <a href='/reference/typescript-api/events/event-types#orderstatetransitionevent'>OrderStateTransitionEvent</a> occurs, and the EmailEventListener starts processing it.
- The EmailEventHandler attaches metadata to the email:
    ```ts
    new EmailEventListener(EventType.ORDER_CONFIRMATION).on(OrderStateTransitionEvent).setMetadata(event => ({
        type: EventType.ORDER_CONFIRMATION,
        orderId: event.order.id,
    }));
    ```
- Then, the EmailPlugin tries to send the email and publishes <a href='/reference/core-plugins/email-plugin/email-send-event#emailsendevent'>EmailSendEvent</a>,
  passing `ctx`, emailDetails, error or success, and this metadata.
- In another part of the server, we have an eventBus that subscribes to EmailSendEvent. We can use
  `metadata.type` and `metadata.orderId` to identify the related order. For example, we can indicate on the
  order that the email was successfully sent, or in case of an error, send a notification confirming
  the order in another available way.

### setAttachments

<MemberInfo kind="method" type={`(setAttachmentsFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#setattachmentsfn'>SetAttachmentsFn</a>&#60;Event&#62;) => `} />

Defines one or more files to be attached to the email. An attachment can be specified
as either a `path` (to a file or URL) or as `content` which can be a string, Buffer or Stream.

**Note:** When using the `content` to pass a Buffer or Stream, the raw data will get serialized
into the job queue. For this reason the total size of all attachments passed as `content` should kept to
**less than ~50k**. If the attachments are greater than that limit, a warning will be logged and
errors may result if using the DefaultJobQueuePlugin with certain DBs such as MySQL/MariaDB.

_Example_

```ts
const testAttachmentHandler = new EmailEventListener('activate-voucher')
    .on(ActivateVoucherEvent)
    // ... omitted some steps for brevity
    .setAttachments(async event => {
        const { imageUrl, voucherCode } = await getVoucherDataForUser(event.user.id);
        return [
            {
                filename: `voucher-${voucherCode}.jpg`,
                path: imageUrl,
            },
        ];
    });
```

### addTemplate

<MemberInfo kind="method" deprecated="Define a custom TemplateLoader on plugin initalization to define templates based on the RequestContext.
E.g. `EmailPlugin.init({ templateLoader: new CustomTemplateLoader() })`" type={`(config: EmailTemplateConfig) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

Add configuration for another template other than the default `"body.hbs"`. Use this method to define specific
templates for channels or languageCodes other than the default.

### loadData

<MemberInfo kind="method" type={`(loadDataFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#loaddatafn'>LoadDataFn</a>&#60;Event, R&#62;) => <a href='/reference/core-plugins/email-plugin/email-event-handler-with-async-data#emaileventhandlerwithasyncdata'>EmailEventHandlerWithAsyncData</a>&#60;R, T, Event, <a href='/reference/core-plugins/email-plugin/email-plugin-types#eventwithasyncdata'>EventWithAsyncData</a>&#60;Event, R&#62;&#62;`} />

Allows data to be loaded asynchronously which can then be used as template variables.
The `loadDataFn` has access to the event, the TypeORM `Connection` object, and an
`inject()` function which can be used to inject any of the providers exported
by the <a href='/reference/typescript-api/plugin/plugin-common-module#plugincommonmodule'>PluginCommonModule</a>. The return value of the `loadDataFn` will be
added to the `event` as the `data` property.

_Example_

```ts
new EmailEventListener('order-confirmation')
    .on(OrderStateTransitionEvent)
    .filter(event => event.toState === 'PaymentSettled' && !!event.order.customer)
    .loadData(({ event, injector }) => {
        const orderService = injector.get(OrderService);
        return orderService.getOrderPayments(event.order.id);
    })
    .setTemplateVars(event => ({
        order: event.order,
        payments: event.data,
    }));
// ...
```

### setMockEvent

<MemberInfo kind="method" type={`(event: Omit&#60;Event, 'ctx' | 'data'&#62;) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`} />

Optionally define a mock Event which is used by the dev mode mailbox app for generating mock emails
from this handler, which is useful when developing the email templates.

</div>
