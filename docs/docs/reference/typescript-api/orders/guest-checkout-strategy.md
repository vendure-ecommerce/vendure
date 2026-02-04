---
title: "GuestCheckoutStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## GuestCheckoutStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/guest-checkout-strategy.ts" sourceLine="33" packageName="@vendure/core" since="2.0.0" />

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

:::info

This is configured via the `orderOptions.guestCheckoutStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
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
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### setCustomerForOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, input: CreateCustomerInput) => | <a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;SetCustomerForOrderResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;         | Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;SetCustomerForOrderResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />

This method is called when the `setCustomerForOrder` mutation is executed.
It should return either a Customer object or an ErrorResult.


</div>
