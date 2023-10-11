---
title: "ShouldRunCheckFn"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShouldRunCheckFn

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="158" packageName="@vendure/core" />

An optional method which is used to decide whether to run the `check()` function.
Returns a JSON-compatible object which is cached and compared between calls.
If the value is the same, then the `check()` function is not called.

Use of this function is an optimization technique which can be useful when
the `check()` function is expensive and should be kept to an absolute minimum.

*Example*

```ts
const optimizedChecker = new ShippingEligibilityChecker({
  code: 'example',
  description: [],
  args: {},
  check: async (ctx, order) => {
    // some slow, expensive function here
  },
  shouldRunCheck: (ctx, order) => {
    // Will only run the `check()` function any time
    // the shippingAddress object has changed.
    return order.shippingAddress;
  },
});
```

```ts title="Signature"
type ShouldRunCheckFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: ShippingMethod,
) => Json | Promise<Json>
```
