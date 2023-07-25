---
title: "EmailPluginOptions"
weight: 10
date: 2023-07-14T16:57:50.744Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailPluginOptions
<div class="symbol">


# EmailPluginOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="40" packageName="@vendure/email-plugin">}}

Configuration for the EmailPlugin.

## Signature

```TypeScript
interface EmailPluginOptions {
  templatePath?: string;
  templateLoader?: TemplateLoader;
  transport:
        | EmailTransportOptions
        | ((
              injector?: Injector,
              ctx?: RequestContext,
          ) => EmailTransportOptions | Promise<EmailTransportOptions>);
  handlers: Array<EmailEventHandler<string, any>>;
  globalTemplateVars?: { [key: string]: any };
  emailSender?: EmailSender;
  emailGenerator?: EmailGenerator;
}
```
## Members

### templatePath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to the location of the email templates. In a default Vendure installation,
the templates are installed to `<project root>/vendure/email/templates`.{{< /member-description >}}

### templateLoader

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/email-plugin/custom-template-loader#templateloader'>TemplateLoader</a>"  since="2.0.0" >}}

{{< member-description >}}An optional TemplateLoader which can be used to load templates from a custom location or async service.
The default uses the FileBasedTemplateLoader which loads templates from `<project root>/vendure/email/templates`{{< /member-description >}}

### transport

{{< member-info kind="property" type="| <a href='/typescript-api/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>         | ((               injector?: <a href='/typescript-api/common/injector#injector'>Injector</a>,               ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>,           ) =&#62; <a href='/typescript-api/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a> | Promise&#60;<a href='/typescript-api/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>&#62;)"  >}}

{{< member-description >}}Configures how the emails are sent.{{< /member-description >}}

### handlers

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;string, any&#62;&#62;"  >}}

{{< member-description >}}An array of <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>s which define which Vendure events will trigger
emails, and how those emails are generated.{{< /member-description >}}

### globalTemplateVars

{{< member-info kind="property" type="{ [key: string]: any }"  >}}

{{< member-description >}}An object containing variables which are made available to all templates. For example,
the storefront URL could be defined here and then used in the "email address verification"
email.{{< /member-description >}}

### emailSender

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/email-plugin/email-sender#emailsender'>EmailSender</a>" default="<a href='/typescript-api/core-plugins/email-plugin/email-sender#nodemaileremailsender'>NodemailerEmailSender</a>"  >}}

{{< member-description >}}An optional allowed EmailSender, used to allow custom implementations of the send functionality
while still utilizing the existing emailPlugin functionality.{{< /member-description >}}

### emailGenerator

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/email-plugin/email-generator#emailgenerator'>EmailGenerator</a>" default="<a href='/typescript-api/core-plugins/email-plugin/email-generator#handlebarsmjmlgenerator'>HandlebarsMjmlGenerator</a>"  >}}

{{< member-description >}}An optional allowed EmailGenerator, used to allow custom email generation functionality to
better match with custom email sending functionality.{{< /member-description >}}


</div>
<div class="symbol">


# EmailPluginDevModeOptions

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="110" packageName="@vendure/email-plugin">}}

Configuration for running the EmailPlugin in development mode.

## Signature

```TypeScript
interface EmailPluginDevModeOptions extends Omit<EmailPluginOptions, 'transport'> {
  devMode: true;
  outputPath: string;
  route: string;
}
```
## Extends

 * Omit&#60;<a href='/typescript-api/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a>, 'transport'&#62;


## Members

### devMode

{{< member-info kind="property" type="true"  >}}

{{< member-description >}}{{< /member-description >}}

### outputPath

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The path to which html email files will be saved rather than being sent.{{< /member-description >}}

### route

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The route to the dev mailbox server.{{< /member-description >}}


</div>
