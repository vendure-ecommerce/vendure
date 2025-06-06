---
title: "EventBus"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## EventBus

<GenerationInfo sourceFile="packages/core/src/event-bus/event-bus.ts" sourceLine="98" packageName="@vendure/core" />

The EventBus is used to globally publish events which can then be subscribed to.

Events are published whenever certain actions take place within the Vendure server, for example:

* when a Product is updated (<a href='/reference/typescript-api/events/event-types#productevent'>ProductEvent</a>)
* when an Order transitions state (<a href='/reference/typescript-api/events/event-types#orderstatetransitionevent'>OrderStateTransitionEvent</a>)
* when a Customer registers a new account (<a href='/reference/typescript-api/events/event-types#accountregistrationevent'>AccountRegistrationEvent</a>)

Using the EventBus it is possible to subscribe to an take action when these events occur.
This is done with the `.ofType()` method, which takes an event type and returns an rxjs observable
stream of events:

*Example*

```ts
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

```ts title="Signature"
class EventBus implements OnModuleDestroy {
    constructor(transactionSubscriber: TransactionSubscriber)
    publish(event: T) => Promise<void>;
    ofType(type: Type<T>) => Observable<T>;
    filter(predicate: (event: VendureEvent) => boolean) => Observable<T>;
    registerBlockingEventHandler(handlerOptions: BlockingEventHandlerOptions<T>) => ;
}
```
* Implements: <code>OnModuleDestroy</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(transactionSubscriber: TransactionSubscriber) => EventBus`}   />


### publish

<MemberInfo kind="method" type={`(event: T) => Promise&#60;void&#62;`}   />

Publish an event which any subscribers can react to.

*Example*

```ts
await eventBus.publish(new SomeEvent());
```
### ofType

<MemberInfo kind="method" type={`(type: Type&#60;T&#62;) => Observable&#60;T&#62;`}   />

Returns an RxJS Observable stream of events of the given type.
If the event contains a <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> object, the subscriber
will only get called after any active database transactions are complete.

This means that the subscriber function can safely access all updated
data related to the event.
### filter

<MemberInfo kind="method" type={`(predicate: (event: <a href='/reference/typescript-api/events/vendure-event#vendureevent'>VendureEvent</a>) =&#62; boolean) => Observable&#60;T&#62;`}   />

Returns an RxJS Observable stream of events filtered by a custom predicate.
If the event contains a <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> object, the subscriber
will only get called after any active database transactions are complete.

This means that the subscriber function can safely access all updated
data related to the event.
### registerBlockingEventHandler

<MemberInfo kind="method" type={`(handlerOptions: <a href='/reference/typescript-api/events/blocking-event-handler-options#blockingeventhandleroptions'>BlockingEventHandlerOptions</a>&#60;T&#62;) => `}  since="2.2.0"  />

Register an event handler function which will be executed when an event of the given type is published,
and will block execution of the code which published the event until the handler has completed.

This is useful when you need assurance that the event handler has successfully completed, and you want
the triggering code to fail if the handler fails.

::: warning
This API should be used with caution, as errors or performance issues in the handler can cause the
associated operation to be slow or fail entirely. For this reason, any handler which takes longer than
100ms to execute will log a warning. Any non-trivial task to be performed in a blocking event handler
should be offloaded to a background job using the <a href='/reference/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>.

Also, be aware that the handler will be executed in the _same database transaction_ as the code which published
the event (as long as you pass the `ctx` object from the event to any TransactionalConnection calls).
:::

*Example*

```ts
eventBus.registerBlockingEventHandler({
  event: OrderStateTransitionEvent,
  id: 'my-order-state-transition-handler',
  handler: async (event) => {
    // perform some synchronous task
  }
});
```


</div>
