---
title: "ShippingEligibilityCheckerConfig"
weight: 10
date: 2023-07-20T13:56:14.765Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingEligibilityCheckerConfig

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="22" packageName="@vendure/core" />

Configuration passed into the constructor of a <a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> to
configure its behavior.

```ts title="Signature"
interface ShippingEligibilityCheckerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
  check: CheckShippingEligibilityCheckerFn<T>;
  shouldRunCheck?: ShouldRunCheckFn<T>;
}
```
Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;



### check

<MemberInfo kind="property" type="<a href='/typescript-api/shipping/check-shipping-eligibility-checker-fn#checkshippingeligibilitycheckerfn'>CheckShippingEligibilityCheckerFn</a>&#60;T&#62;"   />


### shouldRunCheck

<MemberInfo kind="property" type="<a href='/typescript-api/shipping/should-run-check-fn#shouldruncheckfn'>ShouldRunCheckFn</a>&#60;T&#62;"   />


