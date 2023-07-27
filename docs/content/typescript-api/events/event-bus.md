---
title: "EventBus"
weight: 10
date: 2023-07-14T16:57:50.048Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# EventBus
<div class="symbol">


# EventBus

{{< generation-info sourceFile="packages/core/src/event-bus/event-bus.ts" sourceLine="57" packageName="@vendure/core">}}

The EventBus is used to globally publish events which can then be subscribed to.

Events are published whenever certain actions take place within the Vendure server, for example:

* when a Product is updated (<a href='/typescript-api/events/event-types#productevent'>ProductEvent</a>)
* when an Order transitions state (<a href='/typescript-api/events/event-types#orderstatetransitionevent'>OrderStateTransitionEvent</a>)
* when a Customer registers a new account (<a href='/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>)

Using the EventBus it is possible to subscribe to an take action when these events occur.
This is done with the `.ofType()` method, which takes an event type and returns an rxjs observable
stream of events:

*Example*

```TypeScript
import { OnApplicationBootstrap } from '@nestjs/common';
import { EventBus, PluginCommonModule, VendurePlugin } from '@vendure/core';
import { filter } from 'rxjs/operators';

@VendurePlugin({
    imports: [PluginCommonModule]
})
export class MyPlugin implements OnApplicationBootstrap {

  constructor(private eventBus: EventBus) {}

  async onApplicationBootstrap() {

    this.eventBus
      .ofType(OrderStateTransitionEvent)
      .pipe(
        filter(event => event.toState === 'PaymentSettled'),
      )
      .subscribe((event) => {
        // do some action when this event fires
      });
  }
}
```

## Signature

```TypeScript
class EventBus implements OnModuleDestroy {
  constructor(transactionSubscriber: TransactionSubscriber)
  publish(event: T) => void;
  ofType(type: Type<T>) => Observable<T>;
  filter(predicate: (event: VendureEvent) => boolean) => Observable<T>;
}
```
## Implements

 * OnModuleDestroy


## Members

### constructor

{{< member-info kind="method" type="(transactionSubscriber: TransactionSubscriber) => EventBus"  >}}

{{< member-description >}}{{< /member-description >}}

### publish

{{< member-info kind="method" type="(event: T) => void"  >}}

{{< member-description >}}Publish an event which any subscribers can react to.{{< /member-description >}}

### ofType

{{< member-info kind="method" type="(type: Type&#60;T&#62;) => Observable&#60;T&#62;"  >}}

{{< member-description >}}Returns an RxJS Observable stream of events of the given type.
If the event contains a <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> object, the subscriber
will only get called after any active database transactions are complete.

This means that the subscriber function can safely access all updated
data related to the event.{{< /member-description >}}

### filter

{{< member-info kind="method" type="(predicate: (event: <a href='/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>) =&#62; boolean) => Observable&#60;T&#62;"  >}}

{{< member-description >}}Returns an RxJS Observable stream of events filtered by a custom predicate.
If the event contains a <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> object, the subscriber
will only get called after any active database transactions are complete.

This means that the subscriber function can safely access all updated
data related to the event.{{< /member-description >}}


</div>
