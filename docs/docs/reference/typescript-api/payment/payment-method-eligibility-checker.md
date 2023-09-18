---
title: "PaymentMethodEligibilityChecker"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PaymentMethodEligibilityChecker

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="47" packageName="@vendure/core" />

The PaymentMethodEligibilityChecker class is used to check whether an order qualifies for a
given <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>.

*Example*

```ts
const ccPaymentEligibilityChecker = new PaymentMethodEligibilityChecker({
    code: 'order-total-payment-eligibility-checker',
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
class PaymentMethodEligibilityChecker<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
    constructor(config: PaymentMethodEligibilityCheckerConfig<T>)
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitycheckerconfig'>PaymentMethodEligibilityCheckerConfig</a>&#60;T&#62;) => PaymentMethodEligibilityChecker`}   />




</div>


## PaymentMethodEligibilityCheckerConfig

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="20" packageName="@vendure/core" />

Configuration passed into the constructor of a <a href='/reference/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitychecker'>PaymentMethodEligibilityChecker</a> to
configure its behavior.

```ts title="Signature"
interface PaymentMethodEligibilityCheckerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
    check: CheckPaymentMethodEligibilityCheckerFn<T>;
}
```
* Extends: <code><a href='/reference/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;</code>



<div className="members-wrapper">

### check

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-method-eligibility-checker#checkpaymentmethodeligibilitycheckerfn'>CheckPaymentMethodEligibilityCheckerFn</a>&#60;T&#62;`}   />




</div>


## CheckPaymentMethodEligibilityCheckerFn

<GenerationInfo sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="83" packageName="@vendure/core" />

A function which implements logic to determine whether a given <a href='/reference/typescript-api/entities/order#order'>Order</a> is eligible for
a particular payment method. If the function resolves to `false` or a string, the check is
considered to have failed. A string result can be used to provide information about the
reason for ineligibility, if desired.

```ts title="Signature"
type CheckPaymentMethodEligibilityCheckerFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => boolean | string | Promise<boolean | string>
```
