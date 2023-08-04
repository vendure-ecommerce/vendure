---
title: "OrderSellerStrategy"
weight: 10
date: 2023-07-14T16:57:49.602Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderSellerStrategy
<div class="symbol">


# OrderSellerStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-seller-strategy.ts" sourceLine="38" packageName="@vendure/core" since="2.0.0">}}

This strategy defines how an Order can be split into multiple sub-orders for the use-case of
a multivendor application.

## Signature

```TypeScript
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
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### setOrderLineSellerChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>) => <a href='/typescript-api/entities/channel#channel'>Channel</a> | undefined | Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a> | undefined&#62;"  >}}

{{< member-description >}}This method is called whenever a new OrderLine is added to the Order via the `addItemToOrder` mutation or the
underlying `addItemToOrder()` method of the <a href='/typescript-api/services/order-service#orderservice'>OrderService</a>.

It should return the ID of the Channel to which this OrderLine will be assigned, which will be used to set the
<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a> `sellerChannel` property.{{< /member-description >}}

### splitOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => <a href='/typescript-api/orders/order-seller-strategy#splitordercontents'>SplitOrderContents</a>[] | Promise&#60;<a href='/typescript-api/orders/order-seller-strategy#splitordercontents'>SplitOrderContents</a>[]&#62;"  >}}

{{< member-description >}}Upon checkout (by default, when the Order moves from "active" to "inactive" according to the <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>),
this method will be called in order to split the Order into multiple Orders, one for each Seller.{{< /member-description >}}

### afterSellerOrdersCreated

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, aggregateOrder: <a href='/typescript-api/entities/order#order'>Order</a>, sellerOrders: <a href='/typescript-api/entities/order#order'>Order</a>[]) => void | Promise&#60;void&#62;"  >}}

{{< member-description >}}This method is called after splitting the orders, including calculating the totals for each of the seller Orders.
This method can be used to set platform fee surcharges on the seller Orders as well as perform any payment processing
needed.{{< /member-description >}}


</div>
<div class="symbol">


# DefaultOrderSellerStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-order-seller-strategy.ts" sourceLine="11" packageName="@vendure/core" since="2.0.0">}}

The DefaultOrderSellerStrategy treats the Order as single-vendor.

## Signature

```TypeScript
class DefaultOrderSellerStrategy implements OrderSellerStrategy {

}
```
## Implements

 * <a href='/typescript-api/orders/order-seller-strategy#ordersellerstrategy'>OrderSellerStrategy</a>


</div>
<div class="symbol">


# SplitOrderContents

{{< generation-info sourceFile="packages/core/src/config/order/order-seller-strategy.ts" sourceLine="21" packageName="@vendure/core" since="2.0.0">}}

The contents of the aggregate Order which make up a single seller Order.

## Signature

```TypeScript
interface SplitOrderContents {
  channelId: ID;
  state: OrderState;
  lines: OrderLine[];
  shippingLines: ShippingLine[];
}
```
## Members

### channelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="<a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### lines

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingLines

{{< member-info kind="property" type="<a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
