---
title: "ProductPriceApplicator"
weight: 10
date: 2023-07-20T13:56:15.924Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductPriceApplicator

<GenerationInfo sourceFile="packages/core/src/service/helpers/product-price-applicator/product-price-applicator.ts" sourceLine="41" packageName="@vendure/core" />

This helper is used to apply the correct price to a ProductVariant based on the current context
including active Channel, any current Order, etc. If you use the <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> to
directly query ProductVariants, you will find that the `price` and `priceWithTax` properties will
always be `0` until you use the `applyChannelPriceAndTax()` method:

*Example*

```TypeScript
export class MyCustomService {
  constructor(private connection: TransactionalConnection,
              private productPriceApplicator: ProductPriceApplicator) {}

  getVariant(ctx: RequestContext, id: ID) {
    const productVariant = await this.connection
      .getRepository(ctx, ProductVariant)
      .findOne(id, { relations: ['taxCategory'] });

    await this.productPriceApplicator
      .applyChannelPriceAndTax(productVariant, ctx);

    return productVariant;
  }
}
```

```ts title="Signature"
class ProductPriceApplicator {
  constructor(configService: ConfigService, taxRateService: TaxRateService, zoneService: ZoneService, requestCache: RequestContextCacheService)
  async applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order) => Promise<ProductVariant>;
}
```

### constructor

<MemberInfo kind="method" type="(configService: ConfigService, taxRateService: <a href='/typescript-api/services/tax-rate-service#taxrateservice'>TaxRateService</a>, zoneService: <a href='/typescript-api/services/zone-service#zoneservice'>ZoneService</a>, requestCache: RequestContextCacheService) => ProductPriceApplicator"   />


### applyChannelPriceAndTax

<MemberInfo kind="method" type="(variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order?: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;"   />

Populates the `price` field with the price for the specified channel. Make sure that
the ProductVariant being passed in has its `taxCategory` relation joined.
