---
title: "ShippingEligibilityChecker"
weight: 10
date: 2023-07-14T16:57:49.704Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingEligibilityChecker
<div class="symbol">


# ShippingEligibilityChecker

{{< generation-info sourceFile="packages/core/src/config/shipping-method/shipping-eligibility-checker.ts" sourceLine="49" packageName="@vendure/core">}}

The ShippingEligibilityChecker class is used to check whether an order qualifies for a
given <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>.

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

## Signature

```TypeScript
class ShippingEligibilityChecker<T extends ConfigArgs = ConfigArgs> extends ConfigurableOperationDef<
    T
> {
  constructor(config: ShippingEligibilityCheckerConfig<T>)
}
```
## Extends

 * <a href='/typescript-api/configurable-operation-def/#configurableoperationdef'>ConfigurableOperationDef</a>&#60;     T &#62;


## Members

### constructor

{{< member-info kind="method" type="(config: <a href='/typescript-api/shipping/shipping-eligibility-checker-config#shippingeligibilitycheckerconfig'>ShippingEligibilityCheckerConfig</a>&#60;T&#62;) => ShippingEligibilityChecker"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
