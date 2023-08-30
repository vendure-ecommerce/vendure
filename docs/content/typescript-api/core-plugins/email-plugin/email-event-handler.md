---
title: "EmailEventHandler"
weight: 10
date: 2023-07-14T16:57:50.720Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailEventHandler
<div class="symbol">


# EmailEventHandler

{{< generation-info sourceFile="packages/email-plugin/src/event-handler.ts" sourceLine="131" packageName="@vendure/email-plugin">}}

The EmailEventHandler defines how the EmailPlugin will respond to a given event.

A handler is created by creating a new <a href='/typescript-api/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a> and calling the `.on()` method
to specify which event to respond to.

*Example*

```ts
const confirmationHandler = new EmailEventListener('order-confirmation')
  .on(OrderStateTransitionEvent)
  .filter(event => event.toState === 'PaymentSettled')
  .setRecipient(event => event.order.customer.emailAddress)
  .setSubject(`Order confirmation for #{{ order.code }}`)
  .setTemplateVars(event => ({ order: event.order }));
```

This example creates a handler which listens for the `OrderStateTransitionEvent` and if the Order has
transitioned to the `'PaymentSettled'` state, it will generate and send an email.

The string argument passed into the `EmailEventListener` constructor is used to identify the handler, and
also to locate the directory of the email template files. So in the example above, there should be a directory
`<app root>/static/email/templates/order-confirmation` which contains a Handlebars template named `body.hbs`.

## Handling other languages

By default, the handler will respond to all events on all channels and use the same subject ("Order confirmation for #12345" above)
and body template. Where the server is intended to support multiple languages, the `.addTemplate()` method may be used
to define the subject and body template for specific language and channel combinations.

The language is determined by looking at the `languageCode` property of the event's `ctx` (<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) object.

*Example*

```ts
const extendedConfirmationHandler = confirmationHandler
  .addTemplate({
    channelCode: 'default',
    languageCode: LanguageCode.de,
    templateFile: 'body.de.hbs',
    subject: 'Bestellbestätigung für #{{ order.code }}',
  })
```

## Defining a custom handler

Let's say you have a plugin which defines a new event type, `QuoteRequestedEvent`. In your plugin you have defined a mutation
which is executed when the customer requests a quote in your storefront, and in your resolver, you use the <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a> to publish a
new `QuoteRequestedEvent`.

You now want to email the customer with their quote. Here are the steps you would take to set this up:

### 1. Create a new handler

```TypeScript
import { EmailEventListener } from `@vendure/email-plugin`;
import { QuoteRequestedEvent } from `./events`;

const quoteRequestedHandler = new EmailEventListener('quote-requested')
  .on(QuoteRequestedEvent)
  .setRecipient(event => event.customer.emailAddress)
  .setSubject(`Here's the quote you requested`)
  .setTemplateVars(event => ({ details: event.details }));
```

### 2. Create the email template

Next you need to make sure there is a template defined at `<app root>/static/email/templates/quote-requested/body.hbs`. The template
would look something like this:

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

```TypeScript {hl_lines=[8]}
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { quoteRequestedHandler } from './plugins/quote-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    EmailPlugin.init({
      handlers: [...defaultEmailHandlers, quoteRequestedHandler],
      templatePath: path.join(__dirname, 'vendure/email/templates'),
      // ... etc
    }),
  ],
};
```

## Signature

```TypeScript
class EmailEventHandler<T extends string = string, Event extends EventWithContext = EventWithContext> {
  constructor(listener: EmailEventListener<T>, event: Type<Event>)
  filter(filterFn: (event: Event) => boolean) => EmailEventHandler<T, Event>;
  setRecipient(setRecipientFn: (event: Event) => string) => EmailEventHandler<T, Event>;
  setLanguageCode(setLanguageCodeFn: (event: Event) => LanguageCode | undefined) => EmailEventHandler<T, Event>;
  setTemplateVars(templateVarsFn: SetTemplateVarsFn<Event>) => EmailEventHandler<T, Event>;
  setSubject(defaultSubject: string) => EmailEventHandler<T, Event>;
  setFrom(from: string) => EmailEventHandler<T, Event>;
  setOptionalAddressFields(optionalAddressFieldsFn: SetOptionalAddressFieldsFn<Event>) => ;
  setAttachments(setAttachmentsFn: SetAttachmentsFn<Event>) => ;
  addTemplate(config: EmailTemplateConfig) => EmailEventHandler<T, Event>;
  loadData(loadDataFn: LoadDataFn<Event, R>) => EmailEventHandlerWithAsyncData<R, T, Event, EventWithAsyncData<Event, R>>;
  setMockEvent(event: Omit<Event, 'ctx' | 'data'>) => EmailEventHandler<T, Event>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(listener: <a href='/typescript-api/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a>&#60;T&#62;, event: Type&#60;Event&#62;) => EmailEventHandler"  >}}

{{< member-description >}}{{< /member-description >}}

### filter

{{< member-info kind="method" type="(filterFn: (event: Event) =&#62; boolean) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Defines a predicate function which is used to determine whether the event will trigger an email.
Multiple filter functions may be defined.{{< /member-description >}}

### setRecipient

{{< member-info kind="method" type="(setRecipientFn: (event: Event) =&#62; string) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}A function which defines how the recipient email address should be extracted from the incoming event.

The recipient can be a plain email address: `'foobar@example.com'`
Or with a formatted name (includes unicode support): `'Ноде Майлер <foobar@example.com>'`
Or a comma-separated list of addresses: `'foobar@example.com, "Ноде Майлер" <bar@example.com>'`{{< /member-description >}}

### setLanguageCode

{{< member-info kind="method" type="(setLanguageCodeFn: (event: Event) =&#62; <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a> | undefined) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  since="1.8.0" >}}

{{< member-description >}}A function which allows to override the language of the email. If not defined, the language from the context will be used.{{< /member-description >}}

### setTemplateVars

{{< member-info kind="method" type="(templateVarsFn: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#settemplatevarsfn'>SetTemplateVarsFn</a>&#60;Event&#62;) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}A function which returns an object hash of variables which will be made available to the Handlebars template
and subject line for interpolation.{{< /member-description >}}

### setSubject

{{< member-info kind="method" type="(defaultSubject: string) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Sets the default subject of the email. The subject string may use Handlebars variables defined by the
setTemplateVars() method.{{< /member-description >}}

### setFrom

{{< member-info kind="method" type="(from: string) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Sets the default from field of the email. The from string may use Handlebars variables defined by the
setTemplateVars() method.{{< /member-description >}}

### setOptionalAddressFields

{{< member-info kind="method" type="(optionalAddressFieldsFn: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#setoptionaladdressfieldsfn'>SetOptionalAddressFieldsFn</a>&#60;Event&#62;) => "  since="1.1.0" >}}

{{< member-description >}}A function which allows <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#optionaladdressfields'>OptionalAddressFields</a> to be specified such as "cc" and "bcc".{{< /member-description >}}

### setAttachments

{{< member-info kind="method" type="(setAttachmentsFn: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#setattachmentsfn'>SetAttachmentsFn</a>&#60;Event&#62;) => "  >}}

{{< member-description >}}Defines one or more files to be attached to the email. An attachment can be specified
as either a `path` (to a file or URL) or as `content` which can be a string, Buffer or Stream.

**Note:** When using the `content` to pass a Buffer or Stream, the raw data will get serialized
into the job queue. For this reason the total size of all attachments passed as `content` should kept to
**less than ~50k**. If the attachments are greater than that limit, a warning will be logged and
errors may result if using the DefaultJobQueuePlugin with certain DBs such as MySQL/MariaDB.

*Example*

```TypeScript
const testAttachmentHandler = new EmailEventListener('activate-voucher')
  .on(ActivateVoucherEvent)
  // ... omitted some steps for brevity
  .setAttachments(async (event) => {
    const { imageUrl, voucherCode } = await getVoucherDataForUser(event.user.id);
    return [
      {
        filename: `voucher-${voucherCode}.jpg`,
        path: imageUrl,
      },
    ];
  });
```{{< /member-description >}}

### addTemplate

{{< member-info kind="method" type="(config: EmailTemplateConfig) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Add configuration for another template other than the default `"body.hbs"`. Use this method to define specific
templates for channels or languageCodes other than the default.{{< /member-description >}}

### loadData

{{< member-info kind="method" type="(loadDataFn: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#loaddatafn'>LoadDataFn</a>&#60;Event, R&#62;) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler-with-async-data#emaileventhandlerwithasyncdata'>EmailEventHandlerWithAsyncData</a>&#60;R, T, Event, <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#eventwithasyncdata'>EventWithAsyncData</a>&#60;Event, R&#62;&#62;"  >}}

{{< member-description >}}Allows data to be loaded asynchronously which can then be used as template variables.
The `loadDataFn` has access to the event, the TypeORM `Connection` object, and an
`inject()` function which can be used to inject any of the providers exported
by the <a href='/typescript-api/plugin/plugin-common-module#plugincommonmodule'>PluginCommonModule</a>. The return value of the `loadDataFn` will be
added to the `event` as the `data` property.

*Example*

```TypeScript
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
```{{< /member-description >}}

### setMockEvent

{{< member-info kind="method" type="(event: Omit&#60;Event, 'ctx' | 'data'&#62;) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Optionally define a mock Event which is used by the dev mode mailbox app for generating mock emails
from this handler, which is useful when developing the email templates.{{< /member-description >}}


</div>
