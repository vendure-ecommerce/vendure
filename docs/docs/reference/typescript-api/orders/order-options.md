---
title: "OrderOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="483" packageName="@vendure/core" />



```ts title="Signature"
interface OrderOptions {
    orderItemsLimit?: number;
    orderLineItemsLimit?: number;
    orderItemPriceCalculationStrategy?: OrderItemPriceCalculationStrategy;
    process?: Array<OrderProcess<any>>;
    stockAllocationStrategy?: StockAllocationStrategy;
    mergeStrategy?: OrderMergeStrategy;
    checkoutMergeStrategy?: OrderMergeStrategy;
    orderCodeStrategy?: OrderCodeStrategy;
    orderByCodeAccessStrategy?: OrderByCodeAccessStrategy;
    changedPriceHandlingStrategy?: ChangedPriceHandlingStrategy;
    orderPlacedStrategy?: OrderPlacedStrategy;
    activeOrderStrategy?: ActiveOrderStrategy<any> | Array<ActiveOrderStrategy<any>>;
    orderSellerStrategy?: OrderSellerStrategy;
    guestCheckoutStrategy?: GuestCheckoutStrategy;
}
```

<div className="members-wrapper">

### orderItemsLimit

<MemberInfo kind="property" type={`number`} default={`999`}   />

The maximum number of individual items allowed in a single order. This option exists
to prevent excessive resource usage when dealing with very large orders. For example,
if an order contains a million items, then any operations on that order (modifying a quantity,
adding or removing an item) will require Vendure to loop through all million items
to perform price calculations against active promotions and taxes. This can have a significant
performance impact for very large values.

Attempting to exceed this limit will cause Vendure to throw a `OrderLimitError`.
### orderLineItemsLimit

<MemberInfo kind="property" type={`number`} default={`999`}   />

The maximum number of items allowed per order line. This option is an addition
on the `orderItemsLimit` for more granular control. Note `orderItemsLimit` is still
important in order to prevent excessive resource usage.

Attempting to exceed this limit will cause Vendure to throw a OrderLimitError`.
### orderItemPriceCalculationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>`} default={`DefaultPriceCalculationStrategy`}   />

Defines the logic used to calculate the unit price of an OrderLine when adding an
item to an Order.
### process

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a>&#60;any&#62;&#62;`} default={`[]`}   />

Allows the definition of custom states and transition logic for the order process state machine.
Takes an array of objects implementing the <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> interface.
### stockAllocationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/stock-allocation-strategy#stockallocationstrategy'>StockAllocationStrategy</a>`} default={`<a href='/reference/typescript-api/orders/default-stock-allocation-strategy#defaultstockallocationstrategy'>DefaultStockAllocationStrategy</a>`}   />

Determines the point of the order process at which stock gets allocated.
### mergeStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>`} default={`<a href='/reference/typescript-api/orders/merge-strategies#mergeordersstrategy'>MergeOrdersStrategy</a>`}   />

Defines the strategy used to merge a guest Order and an existing Order when
signing in.
### checkoutMergeStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-merge-strategy#ordermergestrategy'>OrderMergeStrategy</a>`} default={`<a href='/reference/typescript-api/orders/merge-strategies#usegueststrategy'>UseGuestStrategy</a>`}   />

Defines the strategy used to merge a guest Order and an existing Order when
signing in as part of the checkout flow.
### orderCodeStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-code-strategy#ordercodestrategy'>OrderCodeStrategy</a>`} default={`<a href='/reference/typescript-api/orders/order-code-strategy#defaultordercodestrategy'>DefaultOrderCodeStrategy</a>`}   />

Allows a user-defined function to create Order codes. This can be useful when
integrating with existing systems. By default, Vendure will generate a 16-character
alphanumeric string.

Note: when using a custom function for Order codes, bear in mind the database limit
for string types (e.g. 255 chars for a varchar field in MySQL), and also the need
for codes to be unique.
### orderByCodeAccessStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-by-code-access-strategy#orderbycodeaccessstrategy'>OrderByCodeAccessStrategy</a>`} default={`<a href='/reference/typescript-api/orders/order-by-code-access-strategy#defaultorderbycodeaccessstrategy'>DefaultOrderByCodeAccessStrategy</a>`}  since="1.1.0"  />

Defines the strategy used to check if and how an Order may be retrieved via the orderByCode query.

The default strategy permits permanent access to the Customer owning the Order and anyone
within 2 hours after placing the Order.
### changedPriceHandlingStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/changed-price-handling-strategy#changedpricehandlingstrategy'>ChangedPriceHandlingStrategy</a>`} default={`DefaultChangedPriceHandlingStrategy`}   />

Defines how we handle the situation where an item exists in an Order, and
then later on another is added but in the meantime the price of the ProductVariant has changed.

By default, the latest price will be used. Any price changes resulting from using a newer price
will be reflected in the GraphQL `OrderLine.unitPrice[WithTax]ChangeSinceAdded` field.
### orderPlacedStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>`} default={`<a href='/reference/typescript-api/orders/default-order-placed-strategy#defaultorderplacedstrategy'>DefaultOrderPlacedStrategy</a>`}   />

Defines the point of the order process at which the Order is set as "placed".
### activeOrderStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>&#60;any&#62; | Array&#60;<a href='/reference/typescript-api/orders/active-order-strategy#activeorderstrategy'>ActiveOrderStrategy</a>&#60;any&#62;&#62;`} default={`<a href='/reference/typescript-api/orders/default-active-order-strategy#defaultactiveorderstrategy'>DefaultActiveOrderStrategy</a>`}  since="1.9.0"  />

Defines the strategy used to determine the active Order when interacting with Shop API operations
such as `activeOrder` and `addItemToOrder`. By default, the strategy uses the active Session.

Note that if multiple strategies are defined, they will be checked in order and the first one that
returns an Order will be used.
### orderSellerStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/order-seller-strategy#ordersellerstrategy'>OrderSellerStrategy</a>`} default={`<a href='/reference/typescript-api/orders/order-seller-strategy#defaultordersellerstrategy'>DefaultOrderSellerStrategy</a>`}  since="2.0.0"  />

Defines how Orders will be split amongst multiple Channels in a multivendor scenario.
### guestCheckoutStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/orders/guest-checkout-strategy#guestcheckoutstrategy'>GuestCheckoutStrategy</a>`} default={`<a href='/reference/typescript-api/orders/default-guest-checkout-strategy#defaultguestcheckoutstrategy'>DefaultGuestCheckoutStrategy</a>`}  since="2.0.0"  />

Defines how we deal with guest checkouts.


</div>
