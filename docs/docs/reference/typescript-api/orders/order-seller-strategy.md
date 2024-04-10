---
title: "OrderSellerStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderSellerStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/order-seller-strategy.ts" sourceLine="43" packageName="@vendure/core" since="2.0.0" />

This strategy defines how an Order can be split into multiple sub-orders for the use-case of
a multivendor application.

:::info

This is configured via the `orderOptions.orderSellerStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface OrderSellerStrategy extends InjectableStrategy {
    setOrderLineSellerChannel?(
        ctx: RequestContext,
        orderLine: OrderLine,
    ): Channel | undefined | Promise<Channel | undefined>;
    splitOrder?(ctx: RequestContext, order: Order): SplitOrderContents[] | Promise<SplitOrderContents[]>;
    afterSellerOrdersCreated?(
        ctx: RequestContext,
        aggregateOrder: Order,
        sellerOrders: Order[],
    ): void | Promise<void>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### setOrderLineSellerChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>) => <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | undefined | Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | undefined&#62;`}   />

This method is called whenever a new OrderLine is added to the Order via the `addItemToOrder` mutation or the
underlying `addItemToOrder()` method of the <a href='/reference/typescript-api/services/order-service#orderservice'>OrderService</a>.

It should return the ID of the Channel to which this OrderLine will be assigned, which will be used to set the
<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a> `sellerChannel` property.
### splitOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => <a href='/reference/typescript-api/orders/order-seller-strategy#splitordercontents'>SplitOrderContents</a>[] | Promise&#60;<a href='/reference/typescript-api/orders/order-seller-strategy#splitordercontents'>SplitOrderContents</a>[]&#62;`}   />

Upon checkout (by default, when the Order moves from "active" to "inactive" according to the <a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>),
this method will be called in order to split the Order into multiple Orders, one for each Seller.
### afterSellerOrdersCreated

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, aggregateOrder: <a href='/reference/typescript-api/entities/order#order'>Order</a>, sellerOrders: <a href='/reference/typescript-api/entities/order#order'>Order</a>[]) => void | Promise&#60;void&#62;`}   />

This method is called after splitting the orders, including calculating the totals for each of the seller Orders.
This method can be used to set platform fee surcharges on the seller Orders as well as perform any payment processing
needed.


</div>


## DefaultOrderSellerStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-order-seller-strategy.ts" sourceLine="11" packageName="@vendure/core" since="2.0.0" />

The DefaultOrderSellerStrategy treats the Order as single-vendor.

```ts title="Signature"
class DefaultOrderSellerStrategy implements OrderSellerStrategy {

}
```
* Implements: <code><a href='/reference/typescript-api/orders/order-seller-strategy#ordersellerstrategy'>OrderSellerStrategy</a></code>




## SplitOrderContents

<GenerationInfo sourceFile="packages/core/src/config/order/order-seller-strategy.ts" sourceLine="19" packageName="@vendure/core" since="2.0.0" />

The contents of the aggregate Order which make up a single seller Order.

```ts title="Signature"
interface SplitOrderContents {
    channelId: ID;
    state: OrderState;
    lines: OrderLine[];
    shippingLines: ShippingLine[];
}
```

<div className="members-wrapper">

### channelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]`}   />


### shippingLines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>[]`}   />




</div>
