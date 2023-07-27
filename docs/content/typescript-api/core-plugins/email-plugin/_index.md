---
title: "EmailPlugin"
weight: 10
date: 2023-07-14T16:57:50.733Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailPlugin
<div class="symbol">


# EmailPlugin

{{< generation-info sourceFile="packages/email-plugin/src/plugin.ts" sourceLine="277" packageName="@vendure/email-plugin">}}

The EmailPlugin creates and sends transactional emails based on Vendure events. By default, it uses an [MJML](https://mjml.io/)-based
email generator to generate the email body and [Nodemailer](https://nodemailer.com/about/) to send the emails.

## High-level description
Vendure has an internal events system (see <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) that allows plugins to subscribe to events. The EmailPlugin is configured with
<a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>s that listen for a specific event and when it is published, the handler defines which template to use to generate
the resulting email.

The plugin comes with a set of default handlers for the following events:
- Order confirmation
- New customer email address verification
- Password reset request
- Email address change request

You can also create your own handlers and register them with the plugin - see the <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> docs for more details.

## Installation

`yarn add @vendure/email-plugin`

or

`npm install @vendure/email-plugin`

*Example*

```ts
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    EmailPlugin.init({
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, 'static/email/templates'),
      transport: {
        type: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        }
      },
    }),
  ],
};
```

## Email templates

In the example above, the plugin has been configured to look in `<app-root>/static/email/templates`
for the email template files. If you used `@vendure/create` to create your application, the templates will have
been copied to that location during setup.

If you are installing the EmailPlugin separately, then you'll need to copy the templates manually from
`node_modules/@vendure/email-plugin/templates` to a location of your choice, and then point the `templatePath` config
property at that directory.

* ### Dynamic Email Templates
Instead of passing a static value to `templatePath`, use `templateLoader` to define a template path.
```ts
  EmailPlugin.init({
   ...,
   templateLoader: new FileBasedTemplateLoader(my/order-confirmation/templates)
  })
```
## Customizing templates

Emails are generated from templates which use [MJML](https://mjml.io/) syntax. MJML is an open-source HTML-like markup
language which makes the task of creating responsive email markup simple. By default, the templates are installed to
`<project root>/vendure/email/templates` and can be freely edited.

Dynamic data such as the recipient's name or order items are specified using [Handlebars syntax](https://handlebarsjs.com/):

```HTML
<p>Dear {{ order.customer.firstName }} {{ order.customer.lastName }},</p>

<p>Thank you for your order!</p>

<mj-table cellpadding="6px">
  {{#each order.lines }}
    <tr class="order-row">
      <td>{{ quantity }} x {{ productVariant.name }}</td>
      <td>{{ productVariant.quantity }}</td>
      <td>{{ formatMoney totalPrice }}</td>
    </tr>
  {{/each}}
</mj-table>
```

### Handlebars helpers

The following helper functions are available for use in email templates:

* `formatMoney`: Formats an amount of money (which are always stored as integers in Vendure) as a decimal, e.g. `123` => `1.23`
* `formatDate`: Formats a Date value with the [dateformat](https://www.npmjs.com/package/dateformat) package.

## Extending the default email handlers

The `defaultEmailHandlers` array defines the default handlers such as for handling new account registration, order confirmation, password reset
etc. These defaults can be extended by adding custom templates for languages other than the default, or even completely new types of emails
which respond to any of the available [VendureEvents](/docs/typescript-api/events/).

A good way to learn how to create your own email handlers is to take a look at the
[source code of the default handlers](https://github.com/vendure-ecommerce/vendure/blob/master/packages/email-plugin/src/default-email-handlers.ts).
New handlers are defined in exactly the same way.

It is also possible to modify the default handlers:

```TypeScript
// Rather than importing `defaultEmailHandlers`, you can
// import the handlers individually
import {
  orderConfirmationHandler,
  emailVerificationHandler,
  passwordResetHandler,
  emailAddressChangeHandler,
} from '@vendure/email-plugin';
import { CustomerService } from '@vendure/core';

// This allows you to then customize each handler to your needs.
// For example, let's set a new subject line to the order confirmation:
orderConfirmationHandler
  .setSubject(`We received your order!`);

// Another example: loading additional data and setting new
// template variables.
passwordResetHandler
  .loadData(async ({ event, injector }) => {
    const customerService = injector.get(CustomerService);
    const customer = await customerService.findOneByUserId(event.ctx, event.user.id);
    return { customer };
  })
  .setTemplateVars(event => ({
    passwordResetToken: event.user.getNativeAuthenticationMethod().passwordResetToken,
    customer: event.data.customer,
  }));

// Then you pass the handlers to the EmailPlugin init method
// individually
EmailPlugin.init({
  handlers: [
    orderConfirmationHandler,
    emailVerificationHandler,
    passwordResetHandler,
    emailAddressChangeHandler,
  ],
  // ...
}),
```

For all available methods of extending a handler, see the <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> documentation.

## Dynamic SMTP settings

Instead of defining static transport settings, you can also provide a function that dynamically resolves
channel aware transport settings.

*Example*

```ts
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { MyTransportService } from './transport.services.ts';
const config: VendureConfig = {
  plugins: [
    EmailPlugin.init({
      handlers: defaultEmailHandlers,
      templatePath: path.join(__dirname, 'static/email/templates'),
      transport: (injector, ctx) => {
        if (ctx) {
          return injector.get(MyTransportService).getSettings(ctx);
        } else {
          return {
             type: 'smtp',
             host: 'smtp.example.com',
             // ... etc.
           }
        }
      }
    }),
  ],
};
```

## Dev mode

For development, the `transport` option can be replaced by `devMode: true`. Doing so configures Vendure to use the
file transport (See <a href='/typescript-api/core-plugins/email-plugin/transport-options#filetransportoptions'>FileTransportOptions</a>) and outputs emails as rendered HTML files in the directory specified by the
`outputPath` property.

```TypeScript
EmailPlugin.init({
  devMode: true,
  route: 'mailbox',
  handlers: defaultEmailHandlers,
  templatePath: path.join(__dirname, 'vendure/email/templates'),
  outputPath: path.join(__dirname, 'test-emails'),
})
```

### Dev mailbox

In dev mode, a webmail-like interface available at the `/mailbox` path, e.g.
http://localhost:3000/mailbox. This is a simple way to view the output of all emails generated by the EmailPlugin while in dev mode.

## Troubleshooting SMTP Connections

If you are having trouble sending email over and SMTP connection, set the `logging` and `debug` options to `true`. This will
send detailed information from the SMTP transporter to the configured logger (defaults to console). For maximum detail combine
this with a detail log level in the configured VendureLogger:

```TypeScript
const config: VendureConfig = {
  logger: new DefaultLogger({ level: LogLevel.Debug })
  // ...
  plugins: [
    EmailPlugin.init({
      // ...
      transport: {
        type: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        auth: {
          user: 'username',
          pass: 'password',
        },
        logging: true,
        debug: true,
      },
    }),
  ],
};
```

## Signature

```TypeScript
class EmailPlugin implements OnApplicationBootstrap, OnApplicationShutdown, NestModule {
  static init(options: EmailPluginOptions | EmailPluginDevModeOptions) => Type<EmailPlugin>;
  async onApplicationShutdown() => ;
  configure(consumer: MiddlewareConsumer) => ;
}
```
## Implements

 * OnApplicationBootstrap
 * OnApplicationShutdown
 * NestModule


## Members

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a> | <a href='/typescript-api/core-plugins/email-plugin/email-plugin-options#emailplugindevmodeoptions'>EmailPluginDevModeOptions</a>) => Type&#60;<a href='/typescript-api/core-plugins/email-plugin/#emailplugin'>EmailPlugin</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### onApplicationShutdown

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### configure

{{< member-info kind="method" type="(consumer: MiddlewareConsumer) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
