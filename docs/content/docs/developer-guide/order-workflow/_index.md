---
title: "Order Workflow"
showtoc: true
---

# Order Workflow

An Order is a collection of one or more ProductVariants which can be purchased by a Customer. Orders are represented internally by the [Order entity]({{< relref "order" >}}) and in the GraphQL API by the [Order type]({{< relref "/docs/graphql-api/shop/object-types#order" >}}).

## Order State

Every Order has a `state` property of type [`OrderState`]({{< relref "order-state" >}}). The following diagram shows the default states and how an Order transitions from one to the next.

{{< figure src="./order_state_diagram.png" >}}

## Structure of an Order

In Vendure an [Order]({{< relref "order" >}}) consists of one or more [OrderLines]({{< relref "order-line" >}}) (representing a given quantity of a particular SKU), which in turn contain one or more [OrderItems]({{< relref "order-item" >}}) (which represent the individual physical units). 

Here is a simplified diagram illustrating this relationship:

{{< figure src="./order_class_diagram.png" >}}

So if the customer adds 2 *Widgets* to the Order, there will be **one OrderLine** containing **two OrderItems**, one for each of the added *Widgets*.

## Shop client order workflow

The following is a description of the flow and related GraphQL operations which are used when dealing with Orders in a customer-facing client application (i.e. a storefront).

1. [`activeOrder` query]({{< relref "/docs/graphql-api/shop/queries#activeorder" >}}) returns the currently-active Order for the session.
* [`addItemToOrder` mutation]({{< relref "/docs/graphql-api/shop/mutations#additemtoorder" >}}) adds an item to the order. The first time it is called will also create a new Order for the session.
* [`adjustOrderLine` mutation]({{< relref "/docs/graphql-api/shop/mutations#adjustorderline" >}}) is used to adjust the quantity of an OrderLine.
* [`removeOrderLine` mutation]({{< relref "/docs/graphql-api/shop/mutations#removeorderline" >}}) removes an OrderLine from the Order.
* [`setCustomerForOrder` mutation]({{< relref "/docs/graphql-api/shop/mutations#setcustomerfororder" >}}) specifies the Customer details (required if the customer is not logged in as an authenticated user).
* [`setOrderShippingAddress` mutation]({{< relref "/docs/graphql-api/shop/mutations#setordershippingaddress" >}}) sets the shipping address for the Order.
* [`eligibleShippingMethods` query]({{< relref "/docs/graphql-api/shop/queries#eligibleshippingmethods" >}}) returns all available shipping methods based on the customer's shipping address and the contents of the Order.
* [`setOrderShippingMethod` mutation]({{< relref "/docs/graphql-api/shop/mutations#setordershippingmethod" >}}) sets the shipping method to use.
* [`addPaymentToOrder` mutation]({{< relref "/docs/graphql-api/shop/mutations#addpaymenttoorder" >}}) adds a payment to the Order. If the payment amount equals the order total, then the Order will be transitioned to either the `PaymentAuthorized` or `PaymentSettled` state (depending on how the payment provider is configured) and the order process is complete from the customer's side.
