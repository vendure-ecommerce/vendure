---
title: "EmailPluginOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailPluginOptions

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="40" packageName="@vendure/email-plugin" />

Configuration for the EmailPlugin.

```ts title="Signature"
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

<div className="members-wrapper">

### templatePath

<MemberInfo kind="property" type={`string`}   />

The path to the location of the email templates. In a default Vendure installation,
the templates are installed to `<project root>/vendure/email/templates`.
### templateLoader

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/email-plugin/template-loader#templateloader'>TemplateLoader</a>`}  since="2.0.0"  />

An optional TemplateLoader which can be used to load templates from a custom location or async service.
The default uses the FileBasedTemplateLoader which loads templates from `<project root>/vendure/email/templates`
### transport

<MemberInfo kind="property" type={`| <a href='/reference/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>         | ((               injector?: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>,               ctx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>,           ) =&#62; <a href='/reference/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a> | Promise&#60;<a href='/reference/core-plugins/email-plugin/transport-options#emailtransportoptions'>EmailTransportOptions</a>&#62;)`}   />

Configures how the emails are sent.
### handlers

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;string, any&#62;&#62;`}   />

An array of <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>s which define which Vendure events will trigger
emails, and how those emails are generated.
### globalTemplateVars

<MemberInfo kind="property" type={`{ [key: string]: any }`}   />

An object containing variables which are made available to all templates. For example,
the storefront URL could be defined here and then used in the "email address verification"
email.
### emailSender

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/email-plugin/email-sender#emailsender'>EmailSender</a>`} default="<a href='/reference/core-plugins/email-plugin/email-sender#nodemaileremailsender'>NodemailerEmailSender</a>"   />

An optional allowed EmailSender, used to allow custom implementations of the send functionality
while still utilizing the existing emailPlugin functionality.
### emailGenerator

<MemberInfo kind="property" type={`<a href='/reference/core-plugins/email-plugin/email-generator#emailgenerator'>EmailGenerator</a>`} default="<a href='/reference/core-plugins/email-plugin/email-generator#handlebarsmjmlgenerator'>HandlebarsMjmlGenerator</a>"   />

An optional allowed EmailGenerator, used to allow custom email generation functionality to
better match with custom email sending functionality.


</div>


## EmailPluginDevModeOptions

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="110" packageName="@vendure/email-plugin" />

Configuration for running the EmailPlugin in development mode.

```ts title="Signature"
interface EmailPluginDevModeOptions extends Omit<EmailPluginOptions, 'transport'> {
    devMode: true;
    outputPath: string;
    route: string;
}
```
* Extends: <code>Omit&#60;<a href='/reference/core-plugins/email-plugin/email-plugin-options#emailpluginoptions'>EmailPluginOptions</a>, 'transport'&#62;</code>



<div className="members-wrapper">

### devMode

<MemberInfo kind="property" type={`true`}   />


### outputPath

<MemberInfo kind="property" type={`string`}   />

The path to which html email files will be saved rather than being sent.
### route

<MemberInfo kind="property" type={`string`}   />

The route to the dev mailbox server.


</div>
