---
title: "PaymentMethodEligibilityChecker"
weight: 10
date: 2023-07-14T16:57:49.648Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentMethodEligibilityChecker
<div class="symbol">


# PaymentMethodEligibilityChecker

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="47" packageName="@vendure/core">}}

The PaymentMethodEligibilityChecker class is used to check whether an order qualifies for a
given <a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>.

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

## Signature

```TypeScript
class PaymentMethodEligibilityChecker<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<T> {
  constructor(config: PaymentMethodEligibilityCheckerConfig<T>)
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;T&#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitycheckerconfig'>PaymentMethodEligibilityCheckerConfig</a>&#60;T&#62;) => PaymentMethodEligibilityChecker"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# PaymentMethodEligibilityCheckerConfig

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="20" packageName="@vendure/core">}}

Configuration passed into the constructor of a <a href='/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitychecker'>PaymentMethodEligibilityChecker</a> to
configure its behavior.

## Signature

```TypeScript
interface PaymentMethodEligibilityCheckerConfig<T extends ConfigArgs> extends ConfigurableOperationDefOptions<T> {
  check: CheckPaymentMethodEligibilityCheckerFn<T>;
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/configurable-operation-def-options#configurableoperationdefoptions'>ConfigurableOperationDefOptions</a>&#60;T&#62;


## Members

### check

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-eligibility-checker#checkpaymentmethodeligibilitycheckerfn'>CheckPaymentMethodEligibilityCheckerFn</a>&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# CheckPaymentMethodEligibilityCheckerFn

{{< generation-info sourceFile="packages/core/src/config/payment/payment-method-eligibility-checker.ts" sourceLine="83" packageName="@vendure/core">}}

A function which implements logic to determine whether a given <a href='/typescript-api/entities/order#order'>Order</a> is eligible for
a particular payment method. If the function resolves to `false` or a string, the check is
considered to have failed. A string result can be used to provide information about the
reason for ineligibility, if desired.

## Signature

```TypeScript
type CheckPaymentMethodEligibilityCheckerFn<T extends ConfigArgs> = (
    ctx: RequestContext,
    order: Order,
    args: ConfigArgValues<T>,
    method: PaymentMethod,
) => boolean | string | Promise<boolean | string>
```
</div>
