---
title: "ShippingEligibilityCheckerConfig"
weight: 10
date: 2023-07-14T16:57:49.703Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingEligibilityCheckerConfig
<div class="symbol">


# ShippingEligibilityCheckerConfig

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="22" packageName="@vendure/core">}}

Configuration passed into the constructor of a <a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> to
configure its behavior.

## Signature

```TypeScript
interface ShippingEligibilityCheckerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
  check: CheckShippingEligibilityCheckerFn<T>;
  shouldRunCheck?: ShouldRunCheckFn<T>;
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;


## Members

### check

{{< member-info kind="property" type="<a href='/typescript-api/shipping/check-shipping-eligibility-checker-fn#checkshippingeligibilitycheckerfn'>CheckShippingEligibilityCheckerFn</a>&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### shouldRunCheck

{{< member-info kind="property" type="<a href='/typescript-api/shipping/should-run-check-fn#shouldruncheckfn'>ShouldRunCheckFn</a>&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
