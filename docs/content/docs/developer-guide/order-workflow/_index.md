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

The [GraphQL Shop API Guide]({{< relref "/docs/storefront/shop-api-guide" >}}#order-flow) lists the GraphQL operations you will need to implement this workflow in your storefront client application.

