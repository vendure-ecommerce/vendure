---
title: "TaxCategory"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxCategory

<GenerationInfo sourceFile="packages/core/src/entity/tax-category/tax-category.entity.ts" sourceLine="16" packageName="@vendure/core" />

A TaxCategory defines what type of taxes to apply to a <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.

```ts title="Signature"
class TaxCategory extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<TaxCategory>)
    @Column() name: string;
    @Column({ default: false }) isDefault: boolean;
    @Column(type => CustomTaxCategoryFields)
    customFields: CustomTaxCategoryFields;
    @OneToMany(type => ProductVariant, productVariant => productVariant.taxCategory)
    productVariants: ProductVariant[];
    @OneToMany(type => TaxRate, taxRate => taxRate.category)
    taxRates: TaxRate[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;) => TaxCategory`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### isDefault

<MemberInfo kind="property" type={`boolean`}   />


### customFields

<MemberInfo kind="property" type={`CustomTaxCategoryFields`}   />


### productVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### taxRates

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>[]`}   />




</div>
