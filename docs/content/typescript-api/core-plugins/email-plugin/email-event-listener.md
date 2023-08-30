---
title: "EmailEventListener"
weight: 10
date: 2023-07-14T16:57:50.731Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EmailEventListener
<div class="symbol">


# EmailEventListener

{{< generation-info sourceFile="packages/email-plugin/src/event-listener.ts" sourceLine="13" packageName="@vendure/email-plugin">}}

An EmailEventListener is used to listen for events and set up a <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a> which
defines how an email will be generated from this event.

## Signature

```TypeScript
class EmailEventListener<T extends string> {
  public public type: T;
  constructor(type: T)
  on(event: Type<Event>) => EmailEventHandler<T, Event>;
}
```
## Members

### type

{{< member-info kind="property" type="T"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(type: T) => EmailEventListener"  >}}

{{< member-description >}}{{< /member-description >}}

### on

{{< member-info kind="method" type="(event: Type&#60;Event&#62;) => <a href='/typescript-api/core-plugins/email-plugin/email-event-handler#emaileventhandler'>EmailEventHandler</a>&#60;T, Event&#62;"  >}}

{{< member-description >}}Defines the event to listen for.{{< /member-description >}}


</div>
