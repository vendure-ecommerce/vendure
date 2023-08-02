---
title: "ShippingEligibilityCheckerConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingEligibilityCheckerConfig

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="22" packageName="@vendure/core" />

Configuration passed into the constructor of a <a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> to
configure its behavior.

```ts title="Signature"
interface ShippingEligibilityCheckerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    check: CheckShippingEligibilityCheckerFn<T>;
    shouldRunCheck?: ShouldRunCheckFn<T>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### check

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/check-shipping-eligibility-checker-fn#checkshippingeligibilitycheckerfn'>CheckShippingEligibilityCheckerFn</a>&#60;T&#62;`}   />


### shouldRunCheck

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/should-run-check-fn#shouldruncheckfn'>ShouldRunCheckFn</a>&#60;T&#62;`}   />




</div>
