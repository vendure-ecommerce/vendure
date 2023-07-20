---
title: "ShippingLine"
weight: 10
date: 2023-07-14T16:57:49.995Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ShippingLine
<div class="symbol">


# ShippingLine

{{< generation-info sourceFile="packages/core/src/entity/shipping-line/shipping-line.entity.ts" sourceLine="23" packageName="@vendure/core">}}

A ShippingLine is created when a <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> is applied to an <a href='/typescript-api/entities/order#order'>Order</a>.
It contains information about the price of the shipping method, any discounts that were
applied, and the resulting tax on the shipping method.

## Signature

```TypeScript
class ShippingLine extends VendureEntity {
  constructor(input?: DeepPartial<ShippingLine>)
  @EntityId() @EntityId()
    shippingMethodId: ID | null;
  @Index() @ManyToOne(type => ShippingMethod) @Index()
    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod;
  @Index() @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' })
    order: Order;
  @Money() @Money()
    listPrice: number;
  @Column() @Column()
    listPriceIncludesTax: boolean;
  @Column('simple-json') @Column('simple-json')
    adjustments: Adjustment[];
  @Column('simple-json') @Column('simple-json')
    taxLines: TaxLine[];
  @Calculated() price: number
  @Calculated() priceWithTax: number
  @Calculated() discountedPrice: number
  @Calculated() discountedPriceWithTax: number
  @Calculated() taxRate: number
  @Calculated() discounts: Discount[]
  addAdjustment(adjustment: Adjustment) => ;
  clearAdjustments() => ;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>&#62;) => ShippingLine"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingMethodId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingMethod

{{< member-info kind="property" type="<a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### listPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### listPriceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### adjustments

{{< member-info kind="property" type="Adjustment[]"  >}}

{{< member-description >}}{{< /member-description >}}

### taxLines

{{< member-info kind="property" type="TaxLine[]"  >}}

{{< member-description >}}{{< /member-description >}}

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### priceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### discountedPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### discountedPriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxRate

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### discounts

{{< member-info kind="property" type="Discount[]"  >}}

{{< member-description >}}{{< /member-description >}}

### addAdjustment

{{< member-info kind="method" type="(adjustment: Adjustment) => "  >}}

{{< member-description >}}{{< /member-description >}}

### clearAdjustments

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
