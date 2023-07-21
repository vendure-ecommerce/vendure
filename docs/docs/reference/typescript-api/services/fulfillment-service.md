---
title: "FulfillmentService"
weight: 10
date: 2023-07-21T07:17:01.836Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FulfillmentService

<GenerationInfo sourceFile="packages/core/src/service/services/fulfillment.service.ts" sourceLine="33" packageName="@vendure/core" />

Contains methods relating to <a href='/docs/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> entities.

```ts title="Signature"
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

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type="(connection: <a href='/docs/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, fulfillmentStateMachine: FulfillmentStateMachine, eventBus: <a href='/docs/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService) => FulfillmentService"   />


### create

<MemberInfo kind="method" type="(ctx: <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orders: <a href='/docs/reference/typescript-api/entities/order#order'>Order</a>[], lines: OrderLineInput[], handler: ConfigurableOperationInput) => Promise&#60;<a href='/docs/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> | InvalidFulfillmentHandlerError | CreateFulfillmentError&#62;"   />

Creates a new Fulfillment for the given Orders and OrderItems, using the specified
<a href='/docs/reference/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>.
### getFulfillmentLines

<MemberInfo kind="method" type="(ctx: <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/docs/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/docs/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;"   />


### getFulfillmentsLinesForOrderLine

<MemberInfo kind="method" type="(ctx: <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/docs/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/docs/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;"   />


### transitionToState

<MemberInfo kind="method" type="(ctx: <a href='/docs/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillmentId: <a href='/docs/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/docs/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>) => Promise&#60;         | {               fulfillment: <a href='/docs/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>;               orders: <a href='/docs/reference/typescript-api/entities/order#order'>Order</a>[];               fromState: <a href='/docs/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;               toState: <a href='/docs/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;           }         | FulfillmentStateTransitionError     &#62;"   />

Transitions the specified Fulfillment to a new state and upon successful transition
publishes a <a href='/docs/reference/typescript-api/events/event-types#fulfillmentstatetransitionevent'>FulfillmentStateTransitionEvent</a>.
### getNextStates

<MemberInfo kind="method" type="(fulfillment: <a href='/docs/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>) => readonly <a href='/docs/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>[]"   />

Returns an array of the next valid states for the Fulfillment.


</div>
