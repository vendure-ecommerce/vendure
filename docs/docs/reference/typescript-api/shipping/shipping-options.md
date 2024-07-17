---
title: "ShippingOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="753" packageName="@vendure/core" />



```ts title="Signature"
interface ShippingOptions {
    shippingEligibilityCheckers?: Array<ShippingEligibilityChecker<any>>;
    shippingCalculators?: Array<ShippingCalculator<any>>;
    shippingLineAssignmentStrategy?: ShippingLineAssignmentStrategy;
    customFulfillmentProcess?: Array<FulfillmentProcess<any>>;
    process?: Array<FulfillmentProcess<any>>;
    fulfillmentHandlers?: Array<FulfillmentHandler<any>>;
}
```

<div className="members-wrapper">

### shippingEligibilityCheckers

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>&#60;any&#62;&#62;`}   />

An array of available ShippingEligibilityCheckers for use in configuring ShippingMethods
### shippingCalculators

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>&#60;any&#62;&#62;`}   />

An array of available ShippingCalculators for use in configuring ShippingMethods
### shippingLineAssignmentStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a>`}  since="2.0.0"  />

This strategy is used to assign a given <a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to one or more <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s of the Order.
This allows you to set multiple shipping methods for a single order, each assigned a different subset of
OrderLines.
### customFulfillmentProcess

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a>&#60;any&#62;&#62;`}   />

Allows the definition of custom states and transition logic for the fulfillment process state machine.
Takes an array of objects implementing the <a href='/reference/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a> interface.
### process

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a>&#60;any&#62;&#62;`} default={`<a href='/reference/typescript-api/fulfillment/fulfillment-process#defaultfulfillmentprocess'>defaultFulfillmentProcess</a>`}  since="2.0.0"  />

Allows the definition of custom states and transition logic for the fulfillment process state machine.
Takes an array of objects implementing the <a href='/reference/typescript-api/fulfillment/fulfillment-process#fulfillmentprocess'>FulfillmentProcess</a> interface.
### fulfillmentHandlers

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/fulfillment/fulfillment-handler#fulfillmenthandler'>FulfillmentHandler</a>&#60;any&#62;&#62;`}   />

An array of available FulfillmentHandlers.


</div>
