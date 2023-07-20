---
title: "DummyPaymentHandler"
weight: 10
date: 2023-07-14T16:57:49.648Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# dummyPaymentHandler
<div class="symbol">


# dummyPaymentHandler

{{< generation-info sourceFile="packages/core/src/config/payment/dummy-payment-method-handler.ts" sourceLine="27" packageName="@vendure/core">}}

A dummy PaymentMethodHandler which simply creates a Payment without any integration
with an external payment provider. Intended only for use in development.

By specifying certain metadata keys, failures can be simulated:

*Example*

```GraphQL
addPaymentToOrder(input: {
  method: 'dummy-payment-method',
  metadata: {
    shouldDecline: false,
    shouldError: false,
    shouldErrorOnSettle: true,
  }
}) {
  # ...
}
```

</div>
