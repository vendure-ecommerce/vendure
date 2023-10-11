---
title: "OrderByCodeAccessStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderByCodeAccessStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-by-code-access-strategy.ts" sourceLine="38" packageName="@vendure/core" since="1.1.0" />

The OrderByCodeAccessStrategy determines how access to a placed Order via the
orderByCode query is granted.
With a custom strategy anonymous access could be made permanent or tied to specific
conditions like IP range or an Order status.

*Example*

This example grants access to the requested Order to anyone – unless it's Monday.
```ts
export class NotMondayOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
    canAccessOrder(ctx: RequestContext, order: Order): boolean {
        const MONDAY = 1;
        const today = (new Date()).getDay();

        return today !== MONDAY;
    }
}
```

:::info

This is configured via the `orderOptions.orderByCodeAccessStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface OrderByCodeAccessStrategy extends InjectableStrategy {
    canAccessOrder(ctx: RequestContext, order: Order): boolean | Promise<boolean>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### canAccessOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean | Promise&#60;boolean&#62;`}   />

Gives or denies permission to access the requested Order


</div>


## DefaultOrderByCodeAccessStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-by-code-access-strategy.ts" sourceLine="57" packageName="@vendure/core" />

The default OrderByCodeAccessStrategy used by Vendure. It permitts permanent access to
the Customer owning the Order and anyone within a given time period after placing the Order
(defaults to 2h).

```ts title="Signature"
class DefaultOrderByCodeAccessStrategy implements OrderByCodeAccessStrategy {
    constructor(anonymousAccessDuration: string)
    canAccessOrder(ctx: RequestContext, order: Order) => boolean;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-by-code-access-strategy#orderbycodeaccessstrategy'>OrderByCodeAccessStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(anonymousAccessDuration: string) => DefaultOrderByCodeAccessStrategy`}   />


### canAccessOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => boolean`}   />




</div>
