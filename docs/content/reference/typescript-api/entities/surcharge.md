---
title: "Surcharge"
weight: 10
date: 2023-07-14T16:57:50.025Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Surcharge
<div class="symbol">


# Surcharge

{{< generation-info sourceFile="packages/core/src/entity/surcharge/surcharge.entity.ts" sourceLine="20" packageName="@vendure/core">}}

A Surcharge represents an arbitrary extra item on an <a href='/typescript-api/entities/order#order'>Order</a> which is not
a ProductVariant. It can be used to e.g. represent payment-related surcharges.

## Signature

```TypeScript
class Surcharge extends VendureEntity {
  constructor(input?: DeepPartial<Surcharge>)
  @Column() @Column()
    description: string;
  @Money() @Money()
    listPrice: number;
  @Column() @Column()
    listPriceIncludesTax: boolean;
  @Column() @Column()
    sku: string;
  @Column('simple-json') @Column('simple-json')
    taxLines: TaxLine[];
  @Index() @ManyToOne(type => Order, order => order.surcharges, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, order => order.surcharges, { onDelete: 'CASCADE' })
    order: Order;
  @Index() @ManyToOne(type => OrderModification, orderModification => orderModification.surcharges) @Index()
    @ManyToOne(type => OrderModification, orderModification => orderModification.surcharges)
    orderModification: OrderModification;
  @Calculated() price: number
  @Calculated() priceWithTax: number
  @Calculated() taxRate: number
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>&#62;) => Surcharge"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### listPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### listPriceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### sku

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### taxLines

{{< member-info kind="property" type="TaxLine[]"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### orderModification

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### priceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxRate

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
