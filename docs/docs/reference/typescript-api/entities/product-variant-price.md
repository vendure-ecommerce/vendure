---
title: "ProductVariantPrice"
weight: 10
date: 2023-07-21T07:17:01.016Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPrice

<GenerationInfo sourceFile="packages/core/src/entity/product-variant/product-variant-price.entity.ts" sourceLine="18" packageName="@vendure/core" />

A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.

```ts title="Signature"
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
* Extends: <code><a href='/docs/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/docs/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>&#62;) => ProductVariantPrice"   />


### price

<MemberInfo kind="property" type="number"   />


### channelId

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/common/id#id'>ID</a>"   />


### currencyCode

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"   />


### variant

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>"   />




</div>
