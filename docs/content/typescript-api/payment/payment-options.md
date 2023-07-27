---
title: "PaymentOptions"
weight: 10
date: 2023-07-14T16:57:49.763Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PaymentOptions
<div class="symbol">


# PaymentOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="793" packageName="@vendure/core">}}

Defines payment-related options in the <a href='/typescript-api/configuration/vendure-config#vendureconfig'>VendureConfig</a>.

## Signature

```TypeScript
interface PaymentOptions {
  paymentMethodHandlers: PaymentMethodHandler[];
  paymentMethodEligibilityCheckers?: PaymentMethodEligibilityChecker[];
  customPaymentProcess?: Array<PaymentProcess<any>>;
  process?: Array<PaymentProcess<any>>;
}
```
## Members

### paymentMethodHandlers

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>[]"  >}}

{{< member-description >}}Defines which <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>s are available when configuring
<a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>s{{< /member-description >}}

### paymentMethodEligibilityCheckers

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitychecker'>PaymentMethodEligibilityChecker</a>[]"  >}}

{{< member-description >}}Defines which <a href='/typescript-api/payment/payment-method-eligibility-checker#paymentmethodeligibilitychecker'>PaymentMethodEligibilityChecker</a>s are available when configuring
<a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>s{{< /member-description >}}

### customPaymentProcess

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/payment/payment-process#paymentprocess'>PaymentProcess</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### process

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/payment/payment-process#paymentprocess'>PaymentProcess</a>&#60;any&#62;&#62;" default="<a href='/typescript-api/payment/default-payment-process#defaultpaymentprocess'>defaultPaymentProcess</a>"  since="2.0.0" >}}

{{< member-description >}}Allows the definition of custom states and transition logic for the payment process state machine.
Takes an array of objects implementing the <a href='/typescript-api/payment/payment-process#paymentprocess'>PaymentProcess</a> interface.{{< /member-description >}}


</div>
