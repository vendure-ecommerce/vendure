---
title: "OrderLine"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderLine

<GenerationInfo sourceFile="packages/core/src/entity/order-line/order-line.entity.ts" sourceLine="29" packageName="@vendure/core" />

A single line on an <a href='/reference/typescript-api/entities/order#order'>Order</a> which contains information about the <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and
quantity ordered, as well as the price and tax information.

```ts title="Signature"
class OrderLine extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<OrderLine>)
    @Index()
    @ManyToOne(type => Channel, { nullable: true, onDelete: 'SET NULL' })
    sellerChannel?: Channel;
    @EntityId({ nullable: true })
    sellerChannelId?: ID;
    @Index()
    @ManyToOne(type => ShippingLine, { nullable: true, onDelete: 'SET NULL' })
    shippingLine?: ShippingLine;
    @EntityId({ nullable: true })
    shippingLineId?: ID;
    @Index()
    @ManyToOne(type => ProductVariant)
    productVariant: ProductVariant;
    @EntityId()
    productVariantId: ID;
    @Index()
    @ManyToOne(type => TaxCategory)
    taxCategory: TaxCategory;
    @Index()
    @ManyToOne(type => Asset)
    featuredAsset: Asset;
    @Index()
    @ManyToOne(type => Order, order => order.lines, { onDelete: 'CASCADE' })
    order: Order;
    @Column()
    quantity: number;
    @Column({ default: 0 })
    orderPlacedQuantity: number;
    @Money({ nullable: true })
    initialListPrice: number;
    @Money()
    listPrice: number;
    @Column()
    listPriceIncludesTax: boolean;
    @Column('simple-json')
    adjustments: Adjustment[];
    @Column('simple-json')
    taxLines: TaxLine[];
    @OneToOne(type => Cancellation, cancellation => cancellation.orderLine)
    cancellation: Cancellation;
    @Column(type => CustomOrderLineFields)
    customFields: CustomOrderLineFields;
    unitPrice: number
    unitPriceWithTax: number
    unitPriceChangeSinceAdded: number
    unitPriceWithTaxChangeSinceAdded: number
    discountedUnitPrice: number
    discountedUnitPriceWithTax: number
    proratedUnitPrice: number
    proratedUnitPriceWithTax: number
    unitTax: number
    proratedUnitTax: number
    taxRate: number
    linePrice: number
    linePriceWithTax: number
    discountedLinePrice: number
    discountedLinePriceWithTax: number
    discounts: Discount[]
    lineTax: number
    proratedLinePrice: number
    proratedLinePriceWithTax: number
    proratedLineTax: number
    addAdjustment(adjustment: Adjustment) => ;
    clearAdjustments(type?: AdjustmentType) => ;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>&#62;) => OrderLine`}   />


### sellerChannel

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>`}   />

The <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> of the <a href='/reference/typescript-api/entities/seller#seller'>Seller</a> for a multivendor setup.
### sellerChannelId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### shippingLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>`}   />

The <a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a> to which this line has been assigned.
This is determined by the configured <a href='/reference/typescript-api/shipping/shipping-line-assignment-strategy#shippinglineassignmentstrategy'>ShippingLineAssignmentStrategy</a>.
### shippingLineId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### productVariant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>`}   />

The <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> which is being ordered.
### productVariantId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### taxCategory

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>`}   />


### featuredAsset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### quantity

<MemberInfo kind="property" type={`number`}   />


### orderPlacedQuantity

<MemberInfo kind="property" type={`number`}   />

The quantity of this OrderLine at the time the order was placed (as per the <a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>).
### initialListPrice

<MemberInfo kind="property" type={`number`}   />

The price as calculated when the OrderLine was first added to the Order. Usually will be identical to the
`listPrice`, except when the ProductVariant price has changed in the meantime and a re-calculation of
the Order has been performed.
### listPrice

<MemberInfo kind="property" type={`number`}   />

This is the price as listed by the ProductVariant (and possibly modified by the <a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>),
which, depending on the current Channel, may or may not include tax.
### listPriceIncludesTax

<MemberInfo kind="property" type={`boolean`}   />

Whether the listPrice includes tax, which depends on the settings of the current Channel.
### adjustments

<MemberInfo kind="property" type={`Adjustment[]`}   />


### taxLines

<MemberInfo kind="property" type={`TaxLine[]`}   />


### cancellation

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomOrderLineFields`}   />


### unitPrice

<MemberInfo kind="property" type={`number`}   />

The price of a single unit, excluding tax and discounts.
### unitPriceWithTax

<MemberInfo kind="property" type={`number`}   />

The price of a single unit, including tax but excluding discounts.
### unitPriceChangeSinceAdded

<MemberInfo kind="property" type={`number`}   />

Non-zero if the `unitPrice` has changed since it was initially added to Order.
### unitPriceWithTaxChangeSinceAdded

<MemberInfo kind="property" type={`number`}   />

Non-zero if the `unitPriceWithTax` has changed since it was initially added to Order.
### discountedUnitPrice

<MemberInfo kind="property" type={`number`}   />

The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.
### discountedUnitPriceWithTax

<MemberInfo kind="property" type={`number`}   />

The price of a single unit including discounts and tax
### proratedUnitPrice

<MemberInfo kind="property" type={`number`}   />

The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of a single unit in this OrderLine, and is used in tax
and refund calculations.
### proratedUnitPriceWithTax

<MemberInfo kind="property" type={`number`}   />

The `proratedUnitPrice` including tax.
### unitTax

<MemberInfo kind="property" type={`number`}   />


### proratedUnitTax

<MemberInfo kind="property" type={`number`}   />


### taxRate

<MemberInfo kind="property" type={`number`}   />


### linePrice

<MemberInfo kind="property" type={`number`}   />

The total price of the line excluding tax and discounts.
### linePriceWithTax

<MemberInfo kind="property" type={`number`}   />

The total price of the line including tax but excluding discounts.
### discountedLinePrice

<MemberInfo kind="property" type={`number`}   />

The price of the line including discounts, excluding tax.
### discountedLinePriceWithTax

<MemberInfo kind="property" type={`number`}   />

The price of the line including discounts and tax.
### discounts

<MemberInfo kind="property" type={`Discount[]`}   />


### lineTax

<MemberInfo kind="property" type={`number`}   />

The total tax on this line.
### proratedLinePrice

<MemberInfo kind="property" type={`number`}   />

The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.
### proratedLinePriceWithTax

<MemberInfo kind="property" type={`number`}   />

The `proratedLinePrice` including tax.
### proratedLineTax

<MemberInfo kind="property" type={`number`}   />


### addAdjustment

<MemberInfo kind="method" type={`(adjustment: Adjustment) => `}   />


### clearAdjustments

<MemberInfo kind="method" type={`(type?: AdjustmentType) => `}   />




</div>
