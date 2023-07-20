---
title: "TaxRate"
weight: 10
date: 2023-07-14T16:57:50.032Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxRate
<div class="symbol">


# TaxRate

{{< generation-info sourceFile="packages/core/src/entity/tax-rate/tax-rate.entity.ts" sourceLine="25" packageName="@vendure/core">}}

A TaxRate defines the rate of tax to apply to a <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> based on three factors:

1. the ProductVariant's <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>
2. the applicable <a href='/typescript-api/entities/zone#zone'>Zone</a> ("applicable" being defined by the configured <a href='/typescript-api/tax/tax-zone-strategy#taxzonestrategy'>TaxZoneStrategy</a>)
3. the <a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a> of the current Customer

## Signature

```TypeScript
class TaxRate extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<TaxRate>)
  @Column() @Column() name: string;
  @Column() @Column() enabled: boolean;
  @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() }) @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() }) value: number;
  @Index() @ManyToOne(type => TaxCategory) @Index()
    @ManyToOne(type => TaxCategory)
    category: TaxCategory;
  @Index() @ManyToOne(type => Zone) @Index()
    @ManyToOne(type => Zone)
    zone: Zone;
  @Index() @ManyToOne(type => CustomerGroup, { nullable: true }) @Index()
    @ManyToOne(type => CustomerGroup, { nullable: true })
    customerGroup?: CustomerGroup;
  @Column(type => CustomTaxRateFields) @Column(type => CustomTaxRateFields)
    customFields: CustomTaxRateFields;
  taxComponentOf(grossPrice: number) => number;
  netPriceOf(grossPrice: number) => number;
  taxPayableOn(netPrice: number) => number;
  grossPriceOf(netPrice: number) => number;
  apply(price: number) => TaxLine;
  test(zone: Zone, taxCategory: TaxCategory) => boolean;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => TaxRate"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### value

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### category

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### zone

{{< member-info kind="property" type="<a href='/typescript-api/entities/zone#zone'>Zone</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customerGroup

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer-group#customergroup'>CustomerGroup</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomTaxRateFields"  >}}

{{< member-description >}}{{< /member-description >}}

### taxComponentOf

{{< member-info kind="method" type="(grossPrice: number) => number"  >}}

{{< member-description >}}{{< /member-description >}}

### netPriceOf

{{< member-info kind="method" type="(grossPrice: number) => number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxPayableOn

{{< member-info kind="method" type="(netPrice: number) => number"  >}}

{{< member-description >}}{{< /member-description >}}

### grossPriceOf

{{< member-info kind="method" type="(netPrice: number) => number"  >}}

{{< member-description >}}{{< /member-description >}}

### apply

{{< member-info kind="method" type="(price: number) => TaxLine"  >}}

{{< member-description >}}{{< /member-description >}}

### test

{{< member-info kind="method" type="(zone: <a href='/typescript-api/entities/zone#zone'>Zone</a>, taxCategory: <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>) => boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
