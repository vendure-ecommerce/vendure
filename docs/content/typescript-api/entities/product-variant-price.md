---
title: "ProductVariantPrice"
weight: 10
date: 2023-07-14T16:57:49.953Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductVariantPrice
<div class="symbol">


# ProductVariantPrice

{{< generation-info sourceFile="packages/core/src/entity/product-variant/product-variant-price.entity.ts" sourceLine="18" packageName="@vendure/core">}}

A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.

## Signature

```TypeScript
class ProductVariantPrice extends VendureEntity {
  constructor(input?: DeepPartial<ProductVariantPrice>)
  @Money() @Money() price: number;
  @EntityId({ nullable: true }) @EntityId({ nullable: true }) channelId: ID;
  @Column('varchar') @Column('varchar')
    currencyCode: CurrencyCode;
  @Index() @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices, { onDelete: 'CASCADE' })
    variant: ProductVariant;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>&#62;) => ProductVariantPrice"  >}}

{{< member-description >}}{{< /member-description >}}

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### channelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode

{{< member-info kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### variant

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
