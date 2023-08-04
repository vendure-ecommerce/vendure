---
title: "TaxCategory"
weight: 10
date: 2023-07-14T16:57:50.030Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxCategory
<div class="symbol">


# TaxCategory

{{< generation-info sourceFile="packages/core/src/entity/tax-category/tax-category.entity.ts" sourceLine="14" packageName="@vendure/core">}}

A TaxCategory defines what type of taxes to apply to a <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.

## Signature

```TypeScript
class TaxCategory extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<TaxCategory>)
  @Column() @Column() name: string;
  @Column({ default: false }) @Column({ default: false }) isDefault: boolean;
  @Column(type => CustomTaxCategoryFields) @Column(type => CustomTaxCategoryFields)
    customFields: CustomTaxCategoryFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;) => TaxCategory"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### isDefault

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomTaxCategoryFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
