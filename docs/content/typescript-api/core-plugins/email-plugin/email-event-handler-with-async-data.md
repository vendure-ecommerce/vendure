---
title: "EmailEventHandlerWithAsyncData"
weight: 10
date: 2023-07-14T16:57:50.730Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailEventHandlerWithAsyncData
<div class="symbol">


# EmailEventHandlerWithAsyncData

{{< generation-info sourceFile="packages/email-plugin/src/event-handler.ts" sourceLine="438" packageName="@vendure/email-plugin">}}

Identical to the <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> but with a `data` property added to the `event` based on the result
of the `.loadData()` function.

## Signature

```TypeScript
class EmailEventHandlerWithAsyncData<Data, T extends string = string, InputEvent extends EventWithContext = EventWithContext, Event extends EventWithAsyncData<InputEvent, Data> = EventWithAsyncData<InputEvent, Data>> extends EmailEventHandler<T, Event> {
  constructor(_loadDataFn: LoadDataFn<InputEvent, Data>, listener: EmailEventListener<T>, event: Type<InputEvent>)
}
```
## Extends

 * <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;


## Members

### constructor

{{< member-info kind="method" type="(_loadDataFn: <a href='/typescript-api/core-plugins/email-plugin/email-plugin-types#loaddatafn'>LoadDataFn</a>&#60;InputEvent, Data&#62;, listener: <a href='/typescript-api/core-plugins/email-plugin/email-event-listener#emaileventlistener'>EmailEventListener</a>&#60;T&#62;, event: Type&#60;InputEvent&#62;) => EmailEventHandlerWithAsyncData"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
