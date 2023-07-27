---
title: "StockLevel"
weight: 10
date: 2023-07-14T16:57:50.009Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockLevel
<div class="symbol">


# StockLevel

{{< generation-info sourceFile="packages/core/src/entity/stock-level/stock-level.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A StockLevel represents the number of a particular <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> which are available
at a particular <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.

## Signature

```TypeScript
class StockLevel extends VendureEntity {
  constructor(input: DeepPartial<StockLevel>)
  @Index() @ManyToOne(type => ProductVariant, productVariant => productVariant.stockLevels, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => ProductVariant, productVariant => productVariant.stockLevels, { onDelete: 'CASCADE' })
    productVariant: ProductVariant;
  @EntityId() @EntityId()
    productVariantId: ID;
  @Index() @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' })
    stockLocation: StockLocation;
  @EntityId() @EntityId()
    stockLocationId: ID;
  @Column() @Column()
    stockOnHand: number;
  @Column() @Column()
    stockAllocated: number;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>&#62;) => StockLevel"  >}}

{{< member-description >}}{{< /member-description >}}

### productVariant

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### productVariantId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### stockLocation

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### stockLocationId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### stockOnHand

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### stockAllocated

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
