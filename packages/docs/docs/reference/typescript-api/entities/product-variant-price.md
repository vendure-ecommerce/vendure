---
title: "ProductVariantPrice"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPrice

<GenerationInfo sourceFile="packages/core/src/entity/product-variant/product-variant-price.entity.ts" sourceLine="20" packageName="@vendure/core" />

A ProductVariantPrice is a Channel-specific price for a ProductVariant. For every Channel to
which a ProductVariant is assigned, there will be a corresponding ProductVariantPrice entity.

```ts title="Signature"
class ProductVariantPrice extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ProductVariantPrice>)
    @Money() price: number;
    @EntityId({ nullable: true }) channelId: ID;
    @Column('varchar')
    currencyCode: CurrencyCode;
    @Index()
    @ManyToOne(type => ProductVariant, variant => variant.productVariantPrices, { onDelete: 'CASCADE' })
    variant: ProductVariant;
    @Column(type => CustomProductVariantPriceFields)
    customFields: CustomProductVariantPriceFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>&#62;) => ProductVariantPrice`}   />


### price

<MemberInfo kind="property" type={`number`}   />


### channelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### currencyCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>`}   />


### variant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomProductVariantPriceFields`}   />




</div>
