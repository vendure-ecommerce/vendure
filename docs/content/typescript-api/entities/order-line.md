---
title: "OrderLine"
weight: 10
date: 2023-07-14T16:57:49.902Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderLine
<div class="symbol">


# OrderLine

{{< generation-info sourceFile="packages/core/src/entity/order-line/order-line.entity.ts" sourceLine="29" packageName="@vendure/core">}}

A single line on an <a href='/typescript-api/entities/order#order'>Order</a> which contains information about the <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and
quantity ordered, as well as the price and tax information.

## Signature

```TypeScript
class OrderLine extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<OrderLine>)
  @Index() @ManyToOne(type => Channel, { nullable: true, onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => Channel, { nullable: true, onDelete: 'SET NULL' })
    sellerChannel?: Channel;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    sellerChannelId?: ID;
  @Index() @ManyToOne(type => ShippingLine, { nullable: true, onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => ShippingLine, { nullable: true, onDelete: 'SET NULL' })
    shippingLine?: ShippingLine;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    shippingLineId?: ID;
  @Index() @ManyToOne(type => ProductVariant) @Index()
    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;
  @EntityId() @EntityId()
    productVariantId: ID;
  @Index() @ManyToOne(type => TaxCategory) @Index()
    @ManyToOne(type => TaxCategory)
    taxCategory: TaxCategory;
  @Index() @ManyToOne(type => Asset) @Index()
    @ManyToOne(type => Asset)
    featuredAsset: Asset;
  @Index() @ManyToOne(type => Order, order => order.lines, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, order => order.lines, { onDelete: 'CASCADE' })
    order: Order;
  @Column() @Column()
    quantity: number;
  @Column({ default: 0 }) @Column({ default: 0 })
    orderPlacedQuantity: number;
  @Money({ nullable: true }) @Money({ nullable: true })
    initialListPrice: number;
  @Money() @Money()
    listPrice: number;
  @Column() @Column()
    listPriceIncludesTax: boolean;
  @Column('simple-json') @Column('simple-json')
    adjustments: Adjustment[];
  @Column('simple-json') @Column('simple-json')
    taxLines: TaxLine[];
  @OneToOne(type => Cancellation, cancellation => cancellation.orderLine) @OneToOne(type => Cancellation, cancellation => cancellation.orderLine)
    cancellation: Cancellation;
  @Column(type => CustomOrderLineFields) @Column(type => CustomOrderLineFields)
    customFields: CustomOrderLineFields;
  @Calculated() unitPrice: number
  @Calculated() unitPriceWithTax: number
  @Calculated() unitPriceChangeSinceAdded: number
  @Calculated() unitPriceWithTaxChangeSinceAdded: number
  @Calculated() discountedUnitPrice: number
  @Calculated() discountedUnitPriceWithTax: number
  @Calculated() proratedUnitPrice: number
  @Calculated() proratedUnitPriceWithTax: number
  @Calculated() unitTax: number
  @Calculated() proratedUnitTax: number
  @Calculated() taxRate: number
  @Calculated() linePrice: number
  @Calculated() linePriceWithTax: number
  @Calculated() discountedLinePrice: number
  @Calculated() discountedLinePriceWithTax: number
  @Calculated() discounts: Discount[]
  @Calculated() lineTax: number
  @Calculated() proratedLinePrice: number
  @Calculated() proratedLinePriceWithTax: number
  @Calculated() proratedLineTax: number
  addAdjustment(adjustment: Adjustment) => ;
  clearAdjustments(type?: AdjustmentType) => ;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>&#62;) => OrderLine"  >}}

{{< member-description >}}{{< /member-description >}}

### sellerChannel

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>"  >}}

{{< member-description >}}The <a href='/typescript-api/entities/channel#channel'>Channel</a> of the <a href='/typescript-api/entities/seller#seller'>Seller</a> for a multivendor setup.{{< /member-description >}}

### sellerChannelId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>"  >}}

{{< member-description >}}The <a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to which this line has been assigned.
This is determined by the configured <a href='/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a>.{{< /member-description >}}

### shippingLineId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### productVariant

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>"  >}}

{{< member-description >}}The <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> which is being ordered.{{< /member-description >}}

### productVariantId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### taxCategory

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### featuredAsset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### quantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### orderPlacedQuantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The quantity of this OrderLine at the time the order was placed (as per the <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>).{{< /member-description >}}

### initialListPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price as calculated when the OrderLine was first added to the Order. Usually will be identical to the
`listPrice`, except when the ProductVariant price has changed in the meantime and a re-calculation of
the Order has been performed.{{< /member-description >}}

### listPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}This is the price as listed by the ProductVariant (and possibly modified by the <a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>),
which, depending on the current Channel, may or may not include tax.{{< /member-description >}}

### listPriceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}Whether the listPrice includes tax, which depends on the settings of the current Channel.{{< /member-description >}}

### adjustments

{{< member-info kind="property" type="Adjustment[]"  >}}

{{< member-description >}}{{< /member-description >}}

### taxLines

{{< member-info kind="property" type="TaxLine[]"  >}}

{{< member-description >}}{{< /member-description >}}

### cancellation

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomOrderLineFields"  >}}

{{< member-description >}}{{< /member-description >}}

### unitPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of a single unit, excluding tax and discounts.{{< /member-description >}}

### unitPriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of a single unit, including tax but excluding discounts.{{< /member-description >}}

### unitPriceChangeSinceAdded

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}Non-zero if the `unitPrice` has changed since it was initially added to Order.{{< /member-description >}}

### unitPriceWithTaxChangeSinceAdded

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}Non-zero if the `unitPriceWithTax` has changed since it was initially added to Order.{{< /member-description >}}

### discountedUnitPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.{{< /member-description >}}

### discountedUnitPriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of a single unit including discounts and tax{{< /member-description >}}

### proratedUnitPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of a single unit in this OrderLine, and is used in tax
and refund calculations.{{< /member-description >}}

### proratedUnitPriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The `proratedUnitPrice` including tax.{{< /member-description >}}

### unitTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### proratedUnitTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxRate

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### linePrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The total price of the line excluding tax and discounts.{{< /member-description >}}

### linePriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The total price of the line including tax but excluding discounts.{{< /member-description >}}

### discountedLinePrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of the line including discounts, excluding tax.{{< /member-description >}}

### discountedLinePriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The price of the line including discounts and tax.{{< /member-description >}}

### discounts

{{< member-info kind="property" type="Discount[]"  >}}

{{< member-description >}}{{< /member-description >}}

### lineTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The total tax on this line.{{< /member-description >}}

### proratedLinePrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.{{< /member-description >}}

### proratedLinePriceWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The `proratedLinePrice` including tax.{{< /member-description >}}

### proratedLineTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### addAdjustment

{{< member-info kind="method" type="(adjustment: Adjustment) => "  >}}

{{< member-description >}}{{< /member-description >}}

### clearAdjustments

{{< member-info kind="method" type="(type?: AdjustmentType) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
