---
title: "OrderTestingService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderTestingService

<GenerationInfo sourceFile="packages/core/src/service/services/order-testing.service.ts" sourceLine="34" packageName="@vendure/core" />

This service is responsible for creating temporary mock Orders against which tests can be run, such as
testing a ShippingMethod or Promotion.

```ts title="Signature"
class OrderTestingService {
    constructor(connection: TransactionalConnection, orderCalculator: OrderCalculator, shippingCalculator: ShippingCalculator, configArgService: ConfigArgService, configService: ConfigService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
    testShippingMethod(ctx: RequestContext, input: TestShippingMethodInput) => Promise<TestShippingMethodResult>;
    testEligibleShippingMethods(ctx: RequestContext, input: TestEligibleShippingMethodsInput) => Promise<ShippingMethodQuote[]>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, orderCalculator: <a href='/reference/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, shippingCalculator: <a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, configArgService: ConfigArgService, configService: ConfigService, productPriceApplicator: <a href='/reference/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => OrderTestingService`}   />


### testShippingMethod

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: TestShippingMethodInput) => Promise&#60;TestShippingMethodResult&#62;`}   />

Runs a given ShippingMethod configuration against a mock Order to test for eligibility and resulting
price.
### testEligibleShippingMethods

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: TestEligibleShippingMethodsInput) => Promise&#60;ShippingMethodQuote[]&#62;`}   />

Tests all available ShippingMethods against a mock Order and return those which are eligible. This
is intended to simulate a call to the `eligibleShippingMethods` query of the Shop API.


</div>
