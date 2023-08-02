---
title: "ShippingEligibilityChecker"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingEligibilityChecker

<GenerationInfo sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="49" packageName="@vendure/core" />

The ShippingEligibilityChecker class is used to check whether an order qualifies for a
given <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>.

*Example*

```ts
const minOrderTotalEligibilityChecker = new ShippingEligibilityChecker({
    code: 'min-order-total-eligibility-checker',
    description: [{ languageCode: LanguageCode.en, value: 'Checks that the order total is above some minimum value' }],
    args: {
        orderMinimum: { type: 'int', ui: { component: 'currency-form-input' } },
    },
    check: (ctx, order, args) => {
        return order.totalWithTax >= args.orderMinimum;
    },
});
```

```ts title="Signature"
class ShippingEligibilityChecker<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: ShippingEligibilityCheckerConfig<T>)
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/shipping/shipping-eligibility-checker-config#shippingeligibilitycheckerconfig'>ShippingEligibilityCheckerConfig</a>&#60;T&#62;) => ShippingEligibilityChecker`}   />




</div>
