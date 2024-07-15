---
title: "EmailSendEvent"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailSendEvent

<GenerationInfo sourceFile="packages/email-plugin/src/email-send-event.ts" sourceLine="14" packageName="@vendure/email-plugin" since="2.2.0" />

This event is fired when an email sending attempt has been made. If the sending was successful,
the `success` property will be `true`, and if not, the `error` property will contain the error
which occurred.

```ts title="Signature"
class EmailSendEvent extends VendureEvent {
    constructor(ctx: RequestContext, details: EmailDetails, success: boolean, error?: Error)
}
```
* Extends: <code><a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, details: <a href='/reference/core-plugins/email-plugin/email-plugin-types#emaildetails'>EmailDetails</a>, success: boolean, error?: Error) => EmailSendEvent`}   />




</div>
