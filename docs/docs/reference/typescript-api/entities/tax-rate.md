---
title: "TaxRate"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxRate

<GenerationInfo sourceFile="packages/core/src/entity/tax-rate/tax-rate.entity.ts" sourceLine="25" packageName="@vendure/core" />

A TaxRate defines the rate of tax to apply to a <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> based on three factors:

1. the ProductVariant's <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>
2. the applicable <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> ("applicable" being defined by the configured <a href='/reference/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a>)
3. the <a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> of the current Customer

```ts title="Signature"
class TaxRate extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<TaxRate>)
    @Column() name: string;
    @Column() enabled: boolean;
    @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() }) value: number;
    @Index()
    @ManyToOne(type => TaxCategory, taxCategory => taxCategory.taxRates)
    category: TaxCategory;
    @Index()
    @ManyToOne(type => Zone, zone => zone.taxRates)
    zone: Zone;
    @Index()
    @ManyToOne(type => CustomerGroup, customerGroup => customerGroup.taxRates, { nullable: true })
    customerGroup?: CustomerGroup;
    @Column(type => CustomTaxRateFields)
    customFields: CustomTaxRateFields;
    taxComponentOf(grossPrice: number) => number;
    netPriceOf(grossPrice: number) => number;
    taxPayableOn(netPrice: number) => number;
    grossPriceOf(netPrice: number) => number;
    apply(price: number) => TaxLine;
    test(zone: Zone, taxCategory: TaxCategory) => boolean;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => TaxRate`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />


### value

<MemberInfo kind="property" type={`number`}   />


### category

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>`}   />


### zone

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />


### customerGroup

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomTaxRateFields`}   />


### taxComponentOf

<MemberInfo kind="method" type={`(grossPrice: number) => number`}   />


### netPriceOf

<MemberInfo kind="method" type={`(grossPrice: number) => number`}   />


### taxPayableOn

<MemberInfo kind="method" type={`(netPrice: number) => number`}   />


### grossPriceOf

<MemberInfo kind="method" type={`(netPrice: number) => number`}   />


### apply

<MemberInfo kind="method" type={`(price: number) => TaxLine`}   />


### test

<MemberInfo kind="method" type={`(zone: <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>, taxCategory: <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>) => boolean`}   />




</div>
