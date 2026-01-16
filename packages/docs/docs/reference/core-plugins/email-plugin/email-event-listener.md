---
title: "EmailEventListener"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EmailEventListener

<GenerationInfo sourceFile="packages/email-plugin/src/event-listener.ts" sourceLine="13" packageName="@vendure/email-plugin" />

An EmailEventListener is used to listen for events and set up a <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> which
defines how an email will be generated from this event.

```ts title="Signature"
class EmailEventListener<T extends string> {
    public type: T;
    constructor(type: T)
    on(event: Type<Event>) => EmailEventHandler<T, Event>;
}
```

<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`T`}   />


### constructor

<MemberInfo kind="method" type={`(type: T) => EmailEventListener`}   />


### on

<MemberInfo kind="method" type={`(event: Type&#60;Event&#62;) => <a href='/reference/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;`}   />

Defines the event to listen for.


</div>
