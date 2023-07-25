---
title: "DefaultGuestCheckoutStrategy"
weight: 10
date: 2023-07-14T16:57:49.584Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultGuestCheckoutStrategy
<div class="symbol">


# DefaultGuestCheckoutStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-guest-checkout-strategy.ts" sourceLine="64" packageName="@vendure/core" since="2.0.0">}}

The default implementation of the <a href='/typescript-api/orders/guest-checkout-strategy#guestcheckoutstrategy'>GuestCheckoutStrategy</a>. This strategy allows
guest checkouts by default, but can be configured to disallow them.

*Example*

```TypeScript
import { DefaultGuestCheckoutStrategy, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  orderOptions: {
    guestCheckoutStrategy: new DefaultGuestCheckoutStrategy({
      allowGuestCheckouts: false,
      allowGuestCheckoutForRegisteredCustomers: false,
    }),
  },
  // ...
};
```

## Signature

```TypeScript
class DefaultGuestCheckoutStrategy implements GuestCheckoutStrategy {
  init(injector: Injector) => ;
  constructor(options?: DefaultGuestCheckoutStrategyOptions)
  async setCustomerForOrder(ctx: RequestContext, order: Order, input: CreateCustomerInput) => Promise<ErrorResultUnion<SetCustomerForOrderResult, Customer>>;
}
```
## Implements

 * <a href='/typescript-api/orders/guest-checkout-strategy#guestcheckoutstrategy'>GuestCheckoutStrategy</a>


## Members

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(options?: <a href='/typescript-api/orders/default-guest-checkout-strategy#defaultguestcheckoutstrategyoptions'>DefaultGuestCheckoutStrategyOptions</a>) => DefaultGuestCheckoutStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### setCustomerForOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, input: CreateCustomerInput) => Promise&#60;ErrorResultUnion&#60;SetCustomerForOrderResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# DefaultGuestCheckoutStrategyOptions

{{< generation-info sourceFile="packages/core/src/config/order/default-guest-checkout-strategy.ts" sourceLine="20" packageName="@vendure/core" since="2.0.0">}}

Options available for the <a href='/typescript-api/orders/default-guest-checkout-strategy#defaultguestcheckoutstrategy'>DefaultGuestCheckoutStrategy</a>.

## Signature

```TypeScript
interface DefaultGuestCheckoutStrategyOptions {
  allowGuestCheckouts?: boolean;
  allowGuestCheckoutForRegisteredCustomers?: boolean;
}
```
## Members

### allowGuestCheckouts

{{< member-info kind="property" type="boolean" default="true"  >}}

{{< member-description >}}Whether to allow guest checkouts.{{< /member-description >}}

### allowGuestCheckoutForRegisteredCustomers

{{< member-info kind="property" type="boolean" default="false"  >}}

{{< member-description >}}Whether to allow guest checkouts for customers who already have an account.
Note that when this is enabled, the details provided in the `CreateCustomerInput`
will overwrite the existing customer details of the registered customer.{{< /member-description >}}


</div>
