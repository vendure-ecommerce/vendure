---
title: "PaymentTransitionData"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentTransitionData

<GenerationInfo sourceFile="packages/core/src/service/helpers/payment-state-machine/payment-state.ts" sourceLine="41" packageName="@vendure/core" />

The data which is passed to the `onStateTransitionStart` function configured when constructing
a new `PaymentMethodHandler`

```ts title="Signature"
interface PaymentTransitionData {
    ctx: RequestContext;
    payment: Payment;
    order: Order;
}
```

<div className="members-wrapper">

### ctx

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />


### payment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />




</div>
