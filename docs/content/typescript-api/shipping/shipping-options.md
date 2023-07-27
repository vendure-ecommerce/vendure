---
title: "ShippingOptions"
weight: 10
date: 2023-07-14T16:57:49.759Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingOptions
<div class="symbol">


# ShippingOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="720" packageName="@vendure/core">}}



## Signature

```TypeScript
interface ShippingOptions {
  shippingEligibilityCheckers?: Array<ShippingEligibilityChecker<any>>;
  shippingCalculators?: Array<ShippingCalculator<any>>;
  shippingLineAssignmentStrategy?: ShippingLineAssignmentStrategy;
  customFulfillmentProcess?: Array<FulfillmentProcess<any>>;
  process?: Array<FulfillmentProcess<any>>;
  fulfillmentHandlers?: Array<FulfillmentHandler<any>>;
}
```
## Members

### shippingEligibilityCheckers

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}An array of available ShippingEligibilityCheckers for use in configuring ShippingMethods{{< /member-description >}}

### shippingCalculators

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}An array of available ShippingCalculators for use in configuring ShippingMethods{{< /member-description >}}

### shippingLineAssignmentStrategy

{{< member-info kind="property" type="<a href='/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a>"  since="2.0.0" >}}

{{< member-description >}}This strategy is used to assign a given <a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to one or more <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>s of the Order.
This allows you to set multiple shipping methods for a single order, each assigned a different subset of
OrderLines.{{< /member-description >}}

### customFulfillmentProcess

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}Allows the definition of custom states and transition logic for the fulfillment process state machine.
Takes an array of objects implementing the <a href='/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a> interface.{{< /member-description >}}

### process

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a>&#60;any&#62;&#62;" default="<a href='/typescript-api/fulfillment/fulfillment-process#defaultfulfillmentprocess'>defaultFulfillmentProcess</a>"  since="2.0.0" >}}

{{< member-description >}}Allows the definition of custom states and transition logic for the fulfillment process state machine.
Takes an array of objects implementing the <a href='/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a> interface.{{< /member-description >}}

### fulfillmentHandlers

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>&#60;any&#62;&#62;"  >}}

{{< member-description >}}An array of available FulfillmentHandlers.{{< /member-description >}}


</div>
