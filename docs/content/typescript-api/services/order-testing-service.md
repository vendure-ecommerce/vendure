---
title: "OrderTestingService"
weight: 10
date: 2023-07-14T16:57:50.412Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderTestingService
<div class="symbol">


# OrderTestingService

{{< generation-info sourceFile="packages/core/src/service/services/order-testing.service.ts" sourceLine="34" packageName="@vendure/core">}}

This service is responsible for creating temporary mock Orders against which tests can be run, such as
testing a ShippingMethod or Promotion.

## Signature

```TypeScript
class OrderTestingService {
  constructor(connection: TransactionalConnection, orderCalculator: OrderCalculator, shippingCalculator: ShippingCalculator, configArgService: ConfigArgService, configService: ConfigService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
  async testShippingMethod(ctx: RequestContext, input: TestShippingMethodInput) => Promise<TestShippingMethodResult>;
  async testEligibleShippingMethods(ctx: RequestContext, input: TestEligibleShippingMethodsInput) => Promise<ShippingMethodQuote[]>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, orderCalculator: <a href='/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, shippingCalculator: <a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, configArgService: ConfigArgService, configService: ConfigService, productPriceApplicator: <a href='/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: TranslatorService) => OrderTestingService"  >}}

{{< member-description >}}{{< /member-description >}}

### testShippingMethod

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: TestShippingMethodInput) => Promise&#60;TestShippingMethodResult&#62;"  >}}

{{< member-description >}}Runs a given ShippingMethod configuration against a mock Order to test for eligibility and resulting
price.{{< /member-description >}}

### testEligibleShippingMethods

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: TestEligibleShippingMethodsInput) => Promise&#60;ShippingMethodQuote[]&#62;"  >}}

{{< member-description >}}Tests all available ShippingMethods against a mock Order and return those which are eligible. This
is intended to simulate a call to the `eligibleShippingMethods` query of the Shop API.{{< /member-description >}}


</div>
