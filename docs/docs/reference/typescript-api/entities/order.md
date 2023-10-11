---
title: "Order"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Order

<GenerationInfo sourceFile="packages/core/src/entity/order/order.entity.ts" sourceLine="43" packageName="@vendure/core" />

An Order is created whenever a <a href='/reference/typescript-api/entities/customer#customer'>Customer</a> adds an item to the cart. It contains all the
information required to fulfill an order: which <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s in what quantities;
the shipping address and price; any applicable promotions; payments etc.

An Order exists in a well-defined state according to the <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a> type. A state machine
is used to govern the transition from one state to another.

```ts title="Signature"
class Order extends VendureEntity implements ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Order>)
    @Column('varchar', { default: OrderType.Regular })
    type: OrderType;
    @OneToMany(type => Order, sellerOrder => sellerOrder.aggregateOrder)
    sellerOrders: Order[];
    @Index()
    @ManyToOne(type => Order, aggregateOrder => aggregateOrder.sellerOrders)
    aggregateOrder?: Order;
    @EntityId({ nullable: true })
    aggregateOrderId?: ID;
    @Column()
    @Index({ unique: true })
    code: string;
    @Column('varchar') state: OrderState;
    @Column({ default: true })
    active: boolean;
    @Column({ nullable: true })
    orderPlacedAt?: Date;
    @Index()
    @ManyToOne(type => Customer)
    customer?: Customer;
    @EntityId({ nullable: true })
    customerId?: ID;
    @OneToMany(type => OrderLine, line => line.order)
    lines: OrderLine[];
    @OneToMany(type => Surcharge, surcharge => surcharge.order)
    surcharges: Surcharge[];
    @Column('simple-array')
    couponCodes: string[];
    @ManyToMany(type => Promotion)
    @JoinTable()
    promotions: Promotion[];
    @Column('simple-json') shippingAddress: OrderAddress;
    @Column('simple-json') billingAddress: OrderAddress;
    @OneToMany(type => Payment, payment => payment.order)
    payments: Payment[];
    @ManyToMany(type => Fulfillment)
    @JoinTable()
    fulfillments: Fulfillment[];
    @Column('varchar')
    currencyCode: CurrencyCode;
    @Column(type => CustomOrderFields)
    customFields: CustomOrderFields;
    @EntityId({ nullable: true })
    taxZoneId?: ID;
    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => OrderModification, modification => modification.order)
    modifications: OrderModification[];
    @Money()
    subTotal: number;
    @Money()
    subTotalWithTax: number;
    @OneToMany(type => ShippingLine, shippingLine => shippingLine.order)
    shippingLines: ShippingLine[];
    @Money({ default: 0 })
    shipping: number;
    @Money({ default: 0 })
    shippingWithTax: number;
    discounts: Discount[]
    total: number
    totalWithTax: number
    totalQuantity: number
    taxSummary: OrderTaxSummary[]
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Order`}   />


### type

<MemberInfo kind="property" type={`OrderType`}   />


### sellerOrders

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>[]`}   />


### aggregateOrder

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### aggregateOrderId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### code

<MemberInfo kind="property" type={`string`}   />

A unique code for the Order, generated according to the
<a href='/reference/typescript-api/orders/order-code-strategy#ordercodestrategy'>OrderCodeStrategy</a>. This should be used as an order reference
for Customers, rather than the Order's id.
### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>`}   />


### active

<MemberInfo kind="property" type={`boolean`}   />

Whether the Order is considered "active", meaning that the
Customer can still make changes to it and has not yet completed
the checkout process.
This is governed by the <a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.
### orderPlacedAt

<MemberInfo kind="property" type={`Date`}   />

The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active".
This is governed by the <a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>.
### customer

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/customer#customer'>Customer</a>`}   />


### customerId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]`}   />


### surcharges

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]`}   />

Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.
### couponCodes

<MemberInfo kind="property" type={`string[]`}   />

An array of all coupon codes applied to the Order.
### promotions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]`}   />

Promotions applied to the order. Only gets populated after the payment process has completed,
i.e. the Order is no longer active.
### shippingAddress

<MemberInfo kind="property" type={`OrderAddress`}   />


### billingAddress

<MemberInfo kind="property" type={`OrderAddress`}   />


### payments

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>[]`}   />


### fulfillments

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>[]`}   />


### currencyCode

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomOrderFields`}   />


### taxZoneId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### modifications

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>[]`}   />


### subTotal

<MemberInfo kind="property" type={`number`}   />

The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the OrderItems.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>'s `discountedLinePrice` values.
### subTotalWithTax

<MemberInfo kind="property" type={`number`}   />

Same as subTotal, but inclusive of tax.
### shippingLines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>[]`}   />

The shipping charges applied to this order.
### shipping

<MemberInfo kind="property" type={`number`}   />

The total of all the `shippingLines`.
### shippingWithTax

<MemberInfo kind="property" type={`number`}   />


### discounts

<MemberInfo kind="property" type={`Discount[]`}   />


### total

<MemberInfo kind="property" type={`number`}   />

Equal to `subTotal` plus `shipping`
### totalWithTax

<MemberInfo kind="property" type={`number`}   />

The final payable amount. Equal to `subTotalWithTax` plus `shippingWithTax`.
### totalQuantity

<MemberInfo kind="property" type={`number`}   />


### taxSummary

<MemberInfo kind="property" type={`OrderTaxSummary[]`}   />

A summary of the taxes being applied to this Order.


</div>
