---
title: "FulfillmentService"
weight: 10
date: 2023-07-14T16:57:50.394Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FulfillmentService
<div class="symbol">


# FulfillmentService

{{< generation-info sourceFile="packages/core/src/service/services/fulfillment.service.ts" sourceLine="33" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> entities.

## Signature

```TypeScript
class FulfillmentService {
  constructor(connection: TransactionalConnection, fulfillmentStateMachine: FulfillmentStateMachine, eventBus: EventBus, configService: ConfigService, customFieldRelationService: CustomFieldRelationService)
  async create(ctx: RequestContext, orders: Order[], lines: OrderLineInput[], handler: ConfigurableOperationInput) => Promise<Fulfillment | InvalidFulfillmentHandlerError | CreateFulfillmentError>;
  async getFulfillmentLines(ctx: RequestContext, id: ID) => Promise<FulfillmentLine[]>;
  async getFulfillmentsLinesForOrderLine(ctx: RequestContext, orderLineId: ID) => Promise<FulfillmentLine[]>;
  async transitionToState(ctx: RequestContext, fulfillmentId: ID, state: FulfillmentState) => Promise<
        | {
              fulfillment: Fulfillment;
              orders: Order[];
              fromState: FulfillmentState;
              toState: FulfillmentState;
          }
        | FulfillmentStateTransitionError
    >;
  getNextStates(fulfillment: Fulfillment) => readonly FulfillmentState[];
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, fulfillmentStateMachine: FulfillmentStateMachine, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService) => FulfillmentService"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orders: <a href='/typescript-api/entities/order#order'>Order</a>[], lines: OrderLineInput[], handler: ConfigurableOperationInput) => Promise&#60;<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> | InvalidFulfillmentHandlerError | CreateFulfillmentError&#62;"  >}}

{{< member-description >}}Creates a new Fulfillment for the given Orders and OrderItems, using the specified
<a href='/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>.{{< /member-description >}}

### getFulfillmentLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getFulfillmentsLinesForOrderLine

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### transitionToState

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillmentId: <a href='/typescript-api/common/id#id'>ID</a>, state: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>) => Promise&#60;         | {               fulfillment: <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>;               orders: <a href='/typescript-api/entities/order#order'>Order</a>[];               fromState: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;               toState: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;           }         | FulfillmentStateTransitionError     &#62;"  >}}

{{< member-description >}}Transitions the specified Fulfillment to a new state and upon successful transition
publishes a <a href='/typescript-api/events/event-types#fulfillmentstatetransitionevent'>FulfillmentStateTransitionEvent</a>.{{< /member-description >}}

### getNextStates

{{< member-info kind="method" type="(fulfillment: <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>) => readonly <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>[]"  >}}

{{< member-description >}}Returns an array of the next valid states for the Fulfillment.{{< /member-description >}}


</div>
