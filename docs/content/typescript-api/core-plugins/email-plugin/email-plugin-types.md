---
title: "Email Plugin Types"
weight: 10
date: 2023-07-14T16:57:50.737Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Email Plugin Types
<div class="symbol">


# EventWithContext

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="21" packageName="@vendure/email-plugin">}}

A VendureEvent which also includes a `ctx` property containing the current
<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, which is used to determine the channel and language
to use when generating the email.

## Signature

```TypeScript
type EventWithContext = VendureEvent & { ctx: RequestContext }
```
</div>
<div class="symbol">


# EventWithAsyncData

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="31" packageName="@vendure/email-plugin">}}

A VendureEvent with a <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> and a `data` property which contains the
value resolved from the <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>`.loadData()` callback.

## Signature

```TypeScript
type EventWithAsyncData<Event extends EventWithContext, R> = Event & { data: R }
```
</div>
<div class="symbol">


# EmailDetails

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="248" packageName="@vendure/email-plugin">}}

The final, generated email details to be sent.

## Signature

```TypeScript
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
## Members

### from

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### recipient

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### subject

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### body

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### attachments

{{< member-info kind="property" type="Array&#60;Type extends 'serialized' ? SerializedAttachment : Attachment&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### cc

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### bcc

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### replyTo

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# LoadDataFn

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="282" packageName="@vendure/email-plugin">}}

A function used to load async data for use by an <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>.

## Signature

```TypeScript
type LoadDataFn<Event extends EventWithContext, R> = (context: {
    event: Event;
    injector: Injector;
}) => Promise<R>
```
</div>
<div class="symbol">


# EmailAttachment

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="301" packageName="@vendure/email-plugin">}}

An object defining a file attachment for an email. Based on the object described
[here in the Nodemailer docs](https://nodemailer.com/message/attachments/), but
only uses the `path` property to define a filesystem path or a URL pointing to
the attachment file.

## Signature

```TypeScript
type EmailAttachment = Omit<Attachment, 'raw'> & { path?: string }
```
</div>
<div class="symbol">


# SetTemplateVarsFn

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="410" packageName="@vendure/email-plugin">}}

A function used to define template variables available to email templates.
See <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>.setTemplateVars().

## Signature

```TypeScript
type SetTemplateVarsFn<Event> = (
    event: Event,
    globals: { [key: string]: any },
) => { [key: string]: any }
```
</div>
<div class="symbol">


# SetAttachmentsFn

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="424" packageName="@vendure/email-plugin">}}

A function used to define attachments to be sent with the email.
See https://nodemailer.com/message/attachments/ for more information about
how attachments work in Nodemailer.

## Signature

```TypeScript
type SetAttachmentsFn<Event> = (event: Event) => EmailAttachment[] | Promise<EmailAttachment[]>
```
</div>
<div class="symbol">


# OptionalAddressFields

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="434" packageName="@vendure/email-plugin" since="1.1.0">}}

Optional address-related fields for sending the email.

## Signature

```TypeScript
interface OptionalAddressFields {
  cc?: string;
  bcc?: string;
  replyTo?: string;
}
```
## Members

### cc

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}Comma separated list of recipients email addresses that will appear on the _Cc:_ field{{< /member-description >}}

### bcc

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}Comma separated list of recipients email addresses that will appear on the _Bcc:_ field{{< /member-description >}}

### replyTo

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}An email address that will appear on the _Reply-To:_ field{{< /member-description >}}


</div>
<div class="symbol">


# SetOptionalAddressFieldsFn

{{< generation-info sourceFile="packages/email-plugin/src/types.ts" sourceLine="460" packageName="@vendure/email-plugin" since="1.1.0">}}

A function used to set the <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#optionaladdressfields'>OptionalAddressFields</a>.

## Signature

```TypeScript
type SetOptionalAddressFieldsFn<Event> = (
    event: Event,
) => OptionalAddressFields | Promise<OptionalAddressFields>
```
</div>
