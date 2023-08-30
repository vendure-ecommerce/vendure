---
title: "CheckShippingEligibilityCheckerFn"
weight: 10
date: 2023-07-14T16:57:49.705Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CheckShippingEligibilityCheckerFn
<div class="symbol">


# CheckShippingEligibilityCheckerFn

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="108" packageName="@vendure/core">}}

A function which implements logic to determine whether a given <a href='/typescript-api/entities/order#order'>Order</a> is eligible for
a particular shipping method. Once a ShippingMethod has been assigned to an Order, this
function will be called on every change to the Order (e.g. updating quantities, adding/removing
items etc).

If the code running in this function is expensive, then consider also defining
a <a href='/typescript-api/shipping/should-run-check-fn#shouldruncheckfn'>ShouldRunCheckFn</a> to avoid unnecessary calls.

## Signature

```TypeScript
type CheckShippingEligibilityCheckerFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: ShippingMethod
) => boolean | Promise<boolean>
```
</div>
