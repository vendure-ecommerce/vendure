---
title: "ProductPriceApplicator"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductPriceApplicator

<GenerationInfo sourceFile="packages/core/src/service/helpers/product-price-applicator/product-price-applicator.ts" sourceLine="41" packageName="@vendure/core" />

This helper is used to apply the correct price to a ProductVariant based on the current context
including active Channel, any current Order, etc. If you use the <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a> to
directly query ProductVariants, you will find that the `price` and `priceWithTax` properties will
always be `0` until you use the `applyChannelPriceAndTax()` method:

*Example*

```ts
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
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order, throwIfNoPriceFound:  = false) => Promise<ProductVariant>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, taxRateService: <a href='/reference/typescript-api/services/tax-rate-service#taxrateservice'>TaxRateService</a>, zoneService: <a href='/reference/typescript-api/services/zone-service#zoneservice'>ZoneService</a>, requestCache: RequestContextCacheService) => ProductPriceApplicator`}   />


### applyChannelPriceAndTax

<MemberInfo kind="method" type={`(variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order?: <a href='/reference/typescript-api/entities/order#order'>Order</a>, throwIfNoPriceFound:  = false) => Promise&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;`}   />

Populates the `price` field with the price for the specified channel. Make sure that
the ProductVariant being passed in has its `taxCategory` relation joined.

If the `throwIfNoPriceFound` option is set to `true`, then an error will be thrown if no
price is found for the given Channel.


</div>
