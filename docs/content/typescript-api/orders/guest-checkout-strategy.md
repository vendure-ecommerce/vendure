---
title: "GuestCheckoutStrategy"
weight: 10
date: 2023-07-14T16:57:49.610Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# GuestCheckoutStrategy
<div class="symbol">


# GuestCheckoutStrategy

{{< generation-info sourceFile="packages/core/src/config/order/guest-checkout-strategy.ts" sourceLine="25" packageName="@vendure/core" since="2.0.0">}}

A strategy that determines how to deal with guest checkouts - i.e. when a customer
checks out without being logged in. For example, a strategy could be used to implement
business rules such as:

- No guest checkouts allowed
- No guest checkouts allowed for customers who already have an account
- No guest checkouts allowed for customers who have previously placed an order
- Allow guest checkouts, but create a new Customer entity if the email address
  is already in use
- Allow guest checkouts, but update the existing Customer entity if the email address
  is already in use

## Signature

```TypeScript
interface GuestCheckoutStrategy extends InjectableStrategy {
  setCustomerForOrder(
        ctx: RequestContext,
        order: Order,
        input: CreateCustomerInput,
    ):
        | ErrorResultUnion<SetCustomerForOrderResult, Customer>
        | Promise<ErrorResultUnion<SetCustomerForOrderResult, Customer>>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### setCustomerForOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, input: CreateCustomerInput) => | ErrorResultUnion&#60;SetCustomerForOrderResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;         | Promise&#60;ErrorResultUnion&#60;SetCustomerForOrderResult, <a href='/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;"  >}}

{{< member-description >}}This method is called when the `setCustomerForOrder` mutation is executed.
It should return either a Customer object or an ErrorResult.{{< /member-description >}}


</div>
