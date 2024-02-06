---
title: "ActiveOrderService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ActiveOrderService

<GenerationInfo sourceFile="packages/core/src/service/helpers/active-order/active-order.service.ts" sourceLine="17" packageName="@vendure/core" />

This helper class is used to get a reference to the active Order from the current RequestContext.

```ts title="Signature"
class ActiveOrderService {
    constructor(sessionService: SessionService, orderService: OrderService, connection: TransactionalConnection, configService: ConfigService)
    getOrderFromContext(ctx: RequestContext) => Promise<Order | undefined>;
    getOrderFromContext(ctx: RequestContext, createIfNotExists: true) => Promise<Order>;
    getOrderFromContext(ctx: RequestContext, createIfNotExists:  = false) => Promise<Order | undefined>;
    getActiveOrder(ctx: RequestContext, input: { [strategyName: string]: any } | undefined) => Promise<Order | undefined>;
    getActiveOrder(ctx: RequestContext, input: { [strategyName: string]: any } | undefined, createIfNotExists: true) => Promise<Order>;
    getActiveOrder(ctx: RequestContext, input: { [strategyName: string]: Record<string, any> | undefined } | undefined, createIfNotExists:  = false) => Promise<Order | undefined>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(sessionService: <a href='/reference/typescript-api/services/session-service#sessionservice'>SessionService</a>, orderService: <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a>, connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService) => ActiveOrderService`}   />


### getOrderFromContext

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />

Gets the active Order object from the current Session. Optionally can create a new Order if
no active Order exists.

Intended to be used at the Resolver layer for those resolvers that depend upon an active Order
being present.
### getOrderFromContext

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, createIfNotExists: true) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />


### getOrderFromContext

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, createIfNotExists:  = false) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />


### getActiveOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: { [strategyName: string]: any } | undefined) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}  since="1.9.0"  />

Retrieves the active Order based on the configured <a href='/reference/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>.
### getActiveOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: { [strategyName: string]: any } | undefined, createIfNotExists: true) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />


### getActiveOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: { [strategyName: string]: Record&#60;string, any&#62; | undefined } | undefined, createIfNotExists:  = false) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />




</div>
