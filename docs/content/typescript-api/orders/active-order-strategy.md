---
title: "ActiveOrderStrategy"
weight: 10
date: 2023-07-04T11:02:11.867Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ActiveOrderStrategy
<div class="symbol">


# ActiveOrderStrategy

{{< generation-info sourceFile="packages/core/src/config/order/active-order-strategy.ts" sourceLine="127" packageName="@vendure/core" since="1.9.0">}}

This strategy is used to determine the active Order for all order-related operations in
the Shop API. By default, all the Shop API operations that relate to the active Order (e.g.
`activeOrder`, `addItemToOrder`, `applyCouponCode` etc.) will implicitly create a new Order
and set it on the current Session, and then read the session to obtain the active Order.
This behaviour is defined by the <a href='/typescript-api/orders/default-active-order-strategy#defaultactiveorderstrategy'>DefaultActiveOrderStrategy</a>.

The `InputType` generic argument should correspond to the input type defined by the
`defineInputType()` method.

When `defineInputType()` is used, then the following Shop API operations will receive an additional
`activeOrderInput` argument allowing the active order input to be specified:

- `activeOrder`
- `eligibleShippingMethods`
- `eligiblePaymentMethods`
- `nextOrderStates`
- `addItemToOrder`
- `adjustOrderLine`
- `removeOrderLine`
- `removeAllOrderLines`
- `applyCouponCode`
- `removeCouponCode`
- `addPaymentToOrder`
- `setCustomerForOrder`
- `setOrderShippingAddress`
- `setOrderBillingAddress`
- `setOrderShippingMethod`
- `setOrderCustomFields`
- `transitionOrderToState`

*Example*

```GraphQL {hl_lines=[5]}
mutation AddItemToOrder {
  addItemToOrder(
    productVariantId: 42,
    quantity: 1,
    activeOrderInput: { token: "123456" }
  ) {
    ...on Order {
      id
      # ...etc
    }
  }
}
```

*Example*

```TypeScript
import { ID } from '@vendure/common/lib/shared-types';
import {
  ActiveOrderStrategy,
  CustomerService,
  idsAreEqual,
  Injector,
  Order,
  OrderService,
  RequestContext,
  TransactionalConnection,
} from '@vendure/core';
import gql from 'graphql-tag';

// This strategy assumes a "orderToken" custom field is defined on the Order
// entity, and uses that token to perform a lookup to determine the active Order.
//
// Additionally, it does _not_ define a `createActiveOrder()` method, which
// means that a custom mutation would be required to create the initial Order in
// the first place and set the "orderToken" custom field.
class TokenActiveOrderStrategy implements ActiveOrderStrategy<{ token: string }> {
  readonly name = 'orderToken';

  private connection: TransactionalConnection;
  private orderService: OrderService;

  init(injector: Injector) {
    this.connection = injector.get(TransactionalConnection);
    this.orderService = injector.get(OrderService);
  }

  defineInputType = () => gql`
    input OrderTokenActiveOrderInput {
      token: String
    }
  `;

  async determineActiveOrder(ctx: RequestContext, input: { token: string }) {
    const qb = this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .where('order.customFields.orderToken = :orderToken', { orderToken: input.token });

    const order = await qb.getOne();
    if (!order) {
      return;
    }
    // Ensure the active user is the owner of this Order
    const orderUserId = order.customer && order.customer.user && order.customer.user.id;
    if (order.customer && idsAreEqual(orderUserId, ctx.activeUserId)) {
      return order;
    }
  }
}

// in vendure-config.ts
export const config = {
  // ...
  orderOptions: {
    activeOrderStrategy: new TokenActiveOrderStrategy(),
  },
}
```

## Signature

```TypeScript
interface ActiveOrderStrategy<InputType extends Record<string, any> | void = void> extends InjectableStrategy {
  readonly name: string;
  defineInputType?: () => DocumentNode;
  createActiveOrder?: (ctx: RequestContext, input: InputType) => Promise<Order>;
  determineActiveOrder(ctx: RequestContext, input: InputType): Promise<Order | undefined>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}The name of the strategy, e.g. "orderByToken", which will also be used as the
field name in the ActiveOrderInput type.{{< /member-description >}}

### defineInputType

{{< member-info kind="property" type="() =&#62; DocumentNode"  >}}

{{< member-description >}}Defines the type of the GraphQL Input object expected by the `activeOrderInput`
input argument.

*Example*

For example, given the following:

```TypeScript
defineInputType() {
  return gql`
     input OrderTokenInput {
       token: String!
     }
  `;
}
```

assuming the strategy name is "orderByToken", then the resulting call to `activeOrder` (or any of the other
affected Shop API operations) would look like:

```GraphQL
activeOrder(activeOrderInput: {
  orderByToken: {
    token: "foo"
  }
}) {
  # ...
}
```

**Note:** if more than one graphql `input` type is being defined (as in a nested input type), then
the _first_ input will be assumed to be the top-level input.{{< /member-description >}}

### createActiveOrder

{{< member-info kind="property" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: InputType) =&#62; Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Certain mutations such as `addItemToOrder` can automatically create a new Order if one does not exist.
In these cases, this method will be called to create the new Order.

If automatic creation of an Order does not make sense in your strategy, then leave this method
undefined. You'll then need to take care of creating an order manually by defining a custom mutation.{{< /member-description >}}

### determineActiveOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: InputType) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}This method is used to determine the active Order based on the current RequestContext in addition to any
input values provided, as defined by the `defineInputType` method of this strategy.

Note that this method is invoked frequently, so you should aim to keep it efficient. The returned Order,
for example, does not need to have its various relations joined.{{< /member-description >}}


</div>
