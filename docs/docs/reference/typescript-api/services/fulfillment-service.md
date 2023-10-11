---
title: "FulfillmentService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FulfillmentService

<GenerationInfo sourceFile="packages/core/src/service/services/fulfillment.service.ts" sourceLine="34" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> entities.

```ts title="Signature"
class FulfillmentService {
    constructor(connection: TransactionalConnection, fulfillmentStateMachine: FulfillmentStateMachine, eventBus: EventBus, configService: ConfigService, customFieldRelationService: CustomFieldRelationService)
    create(ctx: RequestContext, orders: Order[], lines: OrderLineInput[], handler: ConfigurableOperationInput) => Promise<Fulfillment | InvalidFulfillmentHandlerError | CreateFulfillmentError>;
    getFulfillmentLines(ctx: RequestContext, id: ID) => Promise<FulfillmentLine[]>;
    getFulfillmentsLinesForOrderLine(ctx: RequestContext, orderLineId: ID, relations: RelationPaths<FulfillmentLine> = []) => Promise<FulfillmentLine[]>;
    transitionToState(ctx: RequestContext, fulfillmentId: ID, state: FulfillmentState) => Promise<
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

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, fulfillmentStateMachine: FulfillmentStateMachine, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService) => FulfillmentService`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orders: <a href='/reference/typescript-api/entities/order#order'>Order</a>[], lines: OrderLineInput[], handler: ConfigurableOperationInput) => Promise&#60;<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> | InvalidFulfillmentHandlerError | CreateFulfillmentError&#62;`}   />

Creates a new Fulfillment for the given Orders and OrderItems, using the specified
<a href='/reference/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>.
### getFulfillmentLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;`}   />


### getFulfillmentsLinesForOrderLine

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]&#62;`}   />


### transitionToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillmentId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>) => Promise&#60;         | {               fulfillment: <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>;               orders: <a href='/reference/typescript-api/entities/order#order'>Order</a>[];               fromState: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;               toState: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>;           }         | FulfillmentStateTransitionError     &#62;`}   />

Transitions the specified Fulfillment to a new state and upon successful transition
publishes a <a href='/reference/typescript-api/events/event-types#fulfillmentstatetransitionevent'>FulfillmentStateTransitionEvent</a>.
### getNextStates

<MemberInfo kind="method" type={`(fulfillment: <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>) => readonly <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>[]`}   />

Returns an array of the next valid states for the Fulfillment.


</div>
