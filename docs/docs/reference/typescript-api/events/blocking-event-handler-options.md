---
title: "BlockingEventHandlerOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BlockingEventHandlerOptions

<GenerationInfo sourceFile="packages/core/src/event-bus/event-bus.ts" sourceLine="22" packageName="@vendure/core" since="2.2.0" />

Options for registering a blocking event handler.

```ts title="Signature"
type BlockingEventHandlerOptions<T extends VendureEvent> = {
    event: Type<T> | Array<Type<T>>;
    handler: (event: T) => void | Promise<void>;
    id: string;
    before?: string;
    after?: string;
}
```

<div className="members-wrapper">

### event

<MemberInfo kind="property" type={`Type&#60;T&#62; | Array&#60;Type&#60;T&#62;&#62;`}   />

The event type to which the handler should listen.
Can be a single event type or an array of event types.
### handler

<MemberInfo kind="property" type={`(event: T) =&#62; void | Promise&#60;void&#62;`}   />

The handler function which will be executed when the event is published.
If the handler returns a Promise, the event publishing code will wait for the Promise to resolve
before continuing. Any errors thrown by the handler will cause the event publishing code to fail.
### id

<MemberInfo kind="property" type={`string`}   />

A unique identifier for the handler. This can then be used to specify the order in which
handlers should be executed using the `before` and `after` options in other handlers.
### before

<MemberInfo kind="property" type={`string`}   />

The ID of another handler which this handler should execute before.
### after

<MemberInfo kind="property" type={`string`}   />

The ID of another handler which this handler should execute after.


</div>
