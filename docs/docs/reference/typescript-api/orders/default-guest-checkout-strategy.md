---
title: "DefaultGuestCheckoutStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultGuestCheckoutStrategy

<GenerationInfo sourceFile="packages/core/src/config/order/default-guest-checkout-strategy.ts" sourceLine="64" packageName="@vendure/core" since="2.0.0" />

The default implementation of the <a href='/reference/typescript-api/orders/guest-checkout-strategy#guestcheckoutstrategy'>GuestCheckoutStrategy</a>. This strategy allows
guest checkouts by default, but can be configured to disallow them.

*Example*

```ts
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

```ts title="Signature"
class DefaultGuestCheckoutStrategy implements GuestCheckoutStrategy {
    init(injector: Injector) => ;
    constructor(options?: DefaultGuestCheckoutStrategyOptions)
    setCustomerForOrder(ctx: RequestContext, order: Order, input: CreateCustomerInput) => Promise<ErrorResultUnion<SetCustomerForOrderResult, Customer>>;
}
```
* Implements: <code><a href='/reference/typescript-api/orders/guest-checkout-strategy#guestcheckoutstrategy'>GuestCheckoutStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### constructor

<MemberInfo kind="method" type={`(options?: <a href='/reference/typescript-api/orders/default-guest-checkout-strategy#defaultguestcheckoutstrategyoptions'>DefaultGuestCheckoutStrategyOptions</a>) => DefaultGuestCheckoutStrategy`}   />


### setCustomerForOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, input: CreateCustomerInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;SetCustomerForOrderResult, <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>&#62;&#62;`}   />




</div>


## DefaultGuestCheckoutStrategyOptions

<GenerationInfo sourceFile="packages/core/src/config/order/default-guest-checkout-strategy.ts" sourceLine="20" packageName="@vendure/core" since="2.0.0" />

Options available for the <a href='/reference/typescript-api/orders/default-guest-checkout-strategy#defaultguestcheckoutstrategy'>DefaultGuestCheckoutStrategy</a>.

```ts title="Signature"
interface DefaultGuestCheckoutStrategyOptions {
    allowGuestCheckouts?: boolean;
    allowGuestCheckoutForRegisteredCustomers?: boolean;
}
```

<div className="members-wrapper">

### allowGuestCheckouts

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Whether to allow guest checkouts.
### allowGuestCheckoutForRegisteredCustomers

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

Whether to allow guest checkouts for customers who already have an account.
Note that when this is enabled, the details provided in the `CreateCustomerInput`
will overwrite the existing customer details of the registered customer.


</div>
