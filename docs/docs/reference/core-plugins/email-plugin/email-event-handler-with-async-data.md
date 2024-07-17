---
title: "EmailEventHandlerWithAsyncData"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailEventHandlerWithAsyncData

<GenerationInfo sourceFile="packages/email-plugin/src/handler/event-handler.ts" sourceLine="456" packageName="@vendure/email-plugin" />

Identical to the <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> but with a `data` property added to the `event` based on the result
of the `.loadData()` function.

```ts title="Signature"
class EmailEventHandlerWithAsyncData<Data, T extends string = string, InputEvent extends EventWithContext = EventWithContext, Event extends EventWithAsyncData<InputEvent, Data> = EventWithAsyncData<InputEvent, Data>> extends EmailEventHandler<T, Event> {
    constructor(_loadDataFn: LoadDataFn<InputEvent, Data>, listener: EmailEventListener<T>, event: Type<InputEvent>)
}
```
* Extends: <code><a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(_loadDataFn: <a href='/reference/core-plugins/email-plugin/email-plugin-types#loaddatafn'>LoadDataFn</a>&#60;InputEvent, Data&#62;, listener: <a href='/reference/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a>&#60;T&#62;, event: Type&#60;InputEvent&#62;) => EmailEventHandlerWithAsyncData`}   />




</div>
