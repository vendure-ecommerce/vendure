---
title: "Email Plugin Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EventWithContext

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="22" packageName="@vendure/email-plugin" />

A VendureEvent which also includes a `ctx` property containing the current
<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, which is used to determine the channel and language
to use when generating the email.

```ts title="Signature"
type EventWithContext = VendureEvent & { ctx: RequestContext }
```


## EventWithAsyncData

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="32" packageName="@vendure/email-plugin" />

A VendureEvent with a <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> and a `data` property which contains the
value resolved from the <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>`.loadData()` callback.

```ts title="Signature"
type EventWithAsyncData<Event extends EventWithContext, R> = Event & { data: R }
```


## EmailDetails

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="288" packageName="@vendure/email-plugin" />

The final, generated email details to be sent.

```ts title="Signature"
interface EmailDetails<Type extends 'serialized' | 'unserialized' = 'unserialized'> {
    from: string;
    recipient: string;
    subject: string;
    body: string;
    attachments: Array<Type extends 'serialized' ? SerializedAttachment : Attachment>;
    cc?: string;
    bcc?: string;
    replyTo?: string;
}
```

<div className="members-wrapper">

### from

<MemberInfo kind="property" type={`string`}   />


### recipient

<MemberInfo kind="property" type={`string`}   />


### subject

<MemberInfo kind="property" type={`string`}   />


### body

<MemberInfo kind="property" type={`string`}   />


### attachments

<MemberInfo kind="property" type={`Array&#60;Type extends 'serialized' ? SerializedAttachment : Attachment&#62;`}   />


### cc

<MemberInfo kind="property" type={`string`}   />


### bcc

<MemberInfo kind="property" type={`string`}   />


### replyTo

<MemberInfo kind="property" type={`string`}   />




</div>


## LoadDataFn

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="322" packageName="@vendure/email-plugin" />

A function used to load async data for use by an <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>.

```ts title="Signature"
type LoadDataFn<Event extends EventWithContext, R> = (context: {
    event: Event;
    injector: Injector;
}) => Promise<R>
```


## EmailAttachment

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="341" packageName="@vendure/email-plugin" />

An object defining a file attachment for an email. Based on the object described
[here in the Nodemailer docs](https://nodemailer.com/message/attachments/), but
only uses the `path` property to define a filesystem path or a URL pointing to
the attachment file.

```ts title="Signature"
type EmailAttachment = Omit<Attachment, 'raw'> & { path?: string }
```


## SetTemplateVarsFn

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="413" packageName="@vendure/email-plugin" />

A function used to define template variables available to email templates.
See <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>.setTemplateVars().

```ts title="Signature"
type SetTemplateVarsFn<Event> = (
    event: Event,
    globals: { [key: string]: any },
) => { [key: string]: any }
```


## SetAttachmentsFn

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="427" packageName="@vendure/email-plugin" />

A function used to define attachments to be sent with the email.
See https://nodemailer.com/message/attachments/ for more information about
how attachments work in Nodemailer.

```ts title="Signature"
type SetAttachmentsFn<Event> = (event: Event) => EmailAttachment[] | Promise<EmailAttachment[]>
```


## SetSubjectFn

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="435" packageName="@vendure/email-plugin" />

A function used to define the subject to be sent with the email.

```ts title="Signature"
type SetSubjectFn<Event> = (
    event: Event,
    ctx: RequestContext,
    injector: Injector,
) => string | Promise<string>
```


## OptionalAddressFields

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="449" packageName="@vendure/email-plugin" since="1.1.0" />

Optional address-related fields for sending the email.

```ts title="Signature"
interface OptionalAddressFields {
    cc?: string;
    bcc?: string;
    replyTo?: string;
}
```

<div className="members-wrapper">

### cc

<MemberInfo kind="property" type={`string`}   />

Comma separated list of recipients email addresses that will appear on the _Cc:_ field
### bcc

<MemberInfo kind="property" type={`string`}   />

Comma separated list of recipients email addresses that will appear on the _Bcc:_ field
### replyTo

<MemberInfo kind="property" type={`string`}   />

An email address that will appear on the _Reply-To:_ field


</div>


## SetOptionalAddressFieldsFn

<GenerationInfo sourceFile="packages/email-plugin/src/types.ts" sourceLine="475" packageName="@vendure/email-plugin" since="1.1.0" />

A function used to set the <a href='/reference/core-plugins/email-plugin/email-plugin-types#optionaladdressfields'>OptionalAddressFields</a>.

```ts title="Signature"
type SetOptionalAddressFieldsFn<Event> = (
    event: Event,
) => OptionalAddressFields | Promise<OptionalAddressFields>
```
