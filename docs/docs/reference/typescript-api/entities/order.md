---
title: "Order"
weight: 10
date: 2023-07-14T16:57:49.888Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Order
<div class="symbol">


# Order

{{< generation-info sourceFile="packages/core/src/entity/order/order.entity.ts" sourceLine="43" packageName="@vendure/core">}}

An Order is created whenever a <a href='/typescript-api/entities/customer#customer'>Customer</a> adds an item to the cart. It contains all the
information required to fulfill an order: which <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s in what quantities;
the shipping address and price; any applicable promotions; payments etc.

An Order exists in a well-defined state according to the <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a> type. A state machine
is used to govern the transition from one state to another.

## Signature

```TypeScript
class Order extends VendureEntity implements ChannelAware, HasCustomFields {
  constructor(input?: DeepPartial<Order>)
  @Column('varchar', { default: OrderType.Regular }) @Column('varchar', { default: OrderType.Regular })
    type: OrderType;
  @OneToMany(type => Order, sellerOrder => sellerOrder.aggregateOrder) @OneToMany(type => Order, sellerOrder => sellerOrder.aggregateOrder)
    sellerOrders: Order[];
  @Index() @ManyToOne(type => Order, aggregateOrder => aggregateOrder.sellerOrders) @Index()
    @ManyToOne(type => Order, aggregateOrder => aggregateOrder.sellerOrders)
    aggregateOrder?: Order;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    aggregateOrderId?: ID;
  @Column() @Index({ unique: true }) @Column()
    @Index({ unique: true })
    code: string;
  @Column('varchar') @Column('varchar') state: OrderState;
  @Column({ default: true }) @Column({ default: true })
    active: boolean;
  @Column({ nullable: true }) @Column({ nullable: true })
    orderPlacedAt?: Date;
  @Index() @ManyToOne(type => Customer) @Index()
    @ManyToOne(type => Customer)
    customer?: Customer;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    customerId?: ID;
  @OneToMany(type => OrderLine, line => line.order) @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];
  @OneToMany(type => Surcharge, surcharge => surcharge.order) @OneToMany(type => Surcharge, surcharge => surcharge.order)
    surcharges: Surcharge[];
  @Column('simple-array') @Column('simple-array')
    couponCodes: string[];
  @ManyToMany(type => Promotion) @JoinTable() @ManyToMany(type => Promotion)
    @JoinTable()
    promotions: Promotion[];
  @Column('simple-json') @Column('simple-json') shippingAddress: OrderAddress;
  @Column('simple-json') @Column('simple-json') billingAddress: OrderAddress;
  @OneToMany(type => Payment, payment => payment.order) @OneToMany(type => Payment, payment => payment.order)
    payments: Payment[];
  @ManyToMany(type => Fulfillment) @JoinTable() @ManyToMany(type => Fulfillment)
    @JoinTable()
    fulfillments: Fulfillment[];
  @Column('varchar') @Column('varchar')
    currencyCode: CurrencyCode;
  @Column(type => CustomOrderFields) @Column(type => CustomOrderFields)
    customFields: CustomOrderFields;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    taxZoneId?: ID;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @OneToMany(type => OrderModification, modification => modification.order) @OneToMany(type => OrderModification, modification => modification.order)
    modifications: OrderModification[];
  @Money() @Money()
    subTotal: number;
  @Money() @Money()
    subTotalWithTax: number;
  @OneToMany(type => ShippingLine, shippingLine => shippingLine.order) @OneToMany(type => ShippingLine, shippingLine => shippingLine.order)
    shippingLines: ShippingLine[];
  @Money({ default: 0 }) @Money({ default: 0 })
    shipping: number;
  @Money({ default: 0 }) @Money({ default: 0 })
    shippingWithTax: number;
  @Calculated({ relations: ['lines', 'shippingLines'] }) discounts: Discount[]
  @Calculated({
        query: qb =>
            qb
                .leftJoin(
                    qb1 => {
                        return qb1
                            .from(Order, 'order')
                            .select('order.shipping + order.subTotal', 'total')
                            .addSelect('order.id', 'oid');
                    },
                    't1',
                    't1.oid = order.id',
                )
                .addSelect('t1.total', 'total'),
        expression: 'total',
    }) total: number
  @Calculated({
        query: qb =>
            qb
                .leftJoin(
                    qb1 => {
                        return qb1
                            .from(Order, 'order')
                            .select('order.shippingWithTax + order.subTotalWithTax', 'twt')
                            .addSelect('order.id', 'oid');
                    },
                    't1',
                    't1.oid = order.id',
                )
                .addSelect('t1.twt', 'twt'),
        expression: 'twt',
    }) totalWithTax: number
  @Calculated({
        relations: ['lines'],
        query: qb => {
            qb.leftJoin(
                qb1 => {
                    return qb1
                        .from(Order, 'order')
                        .select('SUM(lines.quantity)', 'qty')
                        .addSelect('order.id', 'oid')
                        .leftJoin('order.lines', 'lines')
                        .groupBy('order.id');
                },
                't1',
                't1.oid = order.id',
            ).addSelect('t1.qty', 'qty');
        },
        expression: 'qty',
    }) totalQuantity: number
  @Calculated({ relations: ['lines'] }) taxSummary: OrderTaxSummary[]
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * HasCustomFields


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Order"  >}}

{{< member-description >}}{{< /member-description >}}

### type

{{< member-info kind="property" type="OrderType"  >}}

{{< member-description >}}{{< /member-description >}}

### sellerOrders

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### aggregateOrder

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### aggregateOrderId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A unique code for the Order, generated according to the
<a href='/typescript-api/orders/order-code-strategy#ordercodestrategy'>OrderCodeStrategy</a>. This should be used as an order reference
for Customers, rather than the Order's id.{{< /member-description >}}

### state

{{< member-info kind="property" type="<a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### active

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}Whether the Order is considered "active", meaning that the
Customer can still make changes to it and has not yet completed
the checkout process.
This is governed by the <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.{{< /member-description >}}

### orderPlacedAt

{{< member-info kind="property" type="Date"  >}}

{{< member-description >}}The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active".
This is governed by the <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.{{< /member-description >}}

### customer

{{< member-info kind="property" type="<a href='/typescript-api/entities/customer#customer'>Customer</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customerId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### lines

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### surcharges

{{< member-info kind="property" type="<a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]"  >}}

{{< member-description >}}Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.{{< /member-description >}}

### couponCodes

{{< member-info kind="property" type="string[]"  >}}

{{< member-description >}}An array of all coupon codes applied to the Order.{{< /member-description >}}

### promotions

{{< member-info kind="property" type="<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[]"  >}}

{{< member-description >}}Promotions applied to the order. Only gets populated after the payment process has completed,
i.e. the Order is no longer active.{{< /member-description >}}

### shippingAddress

{{< member-info kind="property" type="OrderAddress"  >}}

{{< member-description >}}{{< /member-description >}}

### billingAddress

{{< member-info kind="property" type="OrderAddress"  >}}

{{< member-description >}}{{< /member-description >}}

### payments

{{< member-info kind="property" type="<a href='/typescript-api/entities/payment#payment'>Payment</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### fulfillments

{{< member-info kind="property" type="<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### currencyCode

{{< member-info kind="property" type="<a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomOrderFields"  >}}

{{< member-description >}}{{< /member-description >}}

### taxZoneId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### modifications

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### subTotal

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the OrderItems.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>'s `discountedLinePrice` values.{{< /member-description >}}

### subTotalWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}Same as subTotal, but inclusive of tax.{{< /member-description >}}

### shippingLines

{{< member-info kind="property" type="<a href='/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>[]"  >}}

{{< member-description >}}The shipping charges applied to this order.{{< /member-description >}}

### shipping

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The total of all the `shippingLines`.{{< /member-description >}}

### shippingWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### discounts

{{< member-info kind="property" type="Discount[]"  >}}

{{< member-description >}}{{< /member-description >}}

### total

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}Equal to `subTotal` plus `shipping`{{< /member-description >}}

### totalWithTax

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The final payable amount. Equal to `subTotalWithTax` plus `shippingWithTax`.{{< /member-description >}}

### totalQuantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxSummary

{{< member-info kind="property" type="OrderTaxSummary[]"  >}}

{{< member-description >}}A summary of the taxes being applied to this Order.{{< /member-description >}}


</div>
