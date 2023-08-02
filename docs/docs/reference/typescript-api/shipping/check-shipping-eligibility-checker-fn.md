---
title: "CheckShippingEligibilityCheckerFn"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CheckShippingEligibilityCheckerFn

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="123" packageName="@vendure/core" />

A function which implements logic to determine whether a given <a href='/reference/typescript-api/entities/order#order'>Order</a> is eligible for
a particular shipping method. Once a ShippingMethod has been assigned to an Order, this
function will be called on every change to the Order (e.g. updating quantities, adding/removing
items etc).

If the code running in this function is expensive, then consider also defining
a <a href='/reference/typescript-api/shipping/should-run-check-fn#shouldruncheckfn'>ShouldRunCheckFn</a> to avoid unnecessary calls.

```ts title="Signature"
type CheckShippingEligibilityCheckerFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: ShippingMethod,
) => boolean | Promise<boolean>
```
