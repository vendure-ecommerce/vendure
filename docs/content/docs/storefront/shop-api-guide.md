---
title: "Shop API Guide"
weight: 2
showtoc: true
---

# GraphQL Shop API Guide

This is an overview of the GraphQL Shop API, which is used when implementing a storefront application with Vendure. 

{{% alert "warning" %}}
This guide only lists some of the more common operations you'll need for your storefront. Please consult [the Shop API reference]({{< relref "/docs/graphql-api/shop" >}}) for a complete guide.
{{% /alert %}}

## Universal Parameters

There are a couple of query parameters which are valid for all GraphQL operations:

* `languageCode`: This sets the current langauge for the request. Any translatable types (e.g. Products, Facets, Collections) will be returned in that language, if a translation is defined for that language. If not, they will fall back to the default language. The value should be one of the ISO 639-1 codes defined by the [`LanguageCode` enum]({{< relref "language-code" >}}).

  ```text
  POST http://localhost:3000/shop-api?languageCode=de
  ```
* `vendure-token`: If your Vendure instance features more than a single [Channel]({{< relref "channels" >}}), the token of the active Channel can be specified by token as either a query parameter _or_ as a header. The name of the key can be configured by the [`channelTokenKey` config option]({{< relref "vendure-config" >}}#channeltokenkey).

## Browsing the catalogue

* {{< shop-api-operation operation="collections" type="query" >}}: List available Collections. Useful for creating navigation menus.
* {{< shop-api-operation operation="search" type="query" >}}: Useful both for keyword searching, and for listing product results by collectionId and/or facetValueId. In practice this query can power all kinds of storefront product lists as it is backed by a search index optimized for performance.
* {{< shop-api-operation operation="product" type="query" >}}: Use this for the Product detail view.

## Order flow

*See the [Order Workflow guide]({{< relref "/docs/developer-guide/order-workflow" >}}) for a detailed explanation of how Orders are handled in Vendure.*

* {{< shop-api-operation operation="activeOrder" type="query" >}} returns the currently-active Order for the session.
* {{< shop-api-operation operation="addItemToOrder" type="mutation" >}} adds an item to the order. The first time it is called will also create a new Order for the session.
* {{< shop-api-operation operation="adjustOrderLine" type="mutation" >}} is used to adjust the quantity of an OrderLine.
* {{< shop-api-operation operation="removeOrderLine" type="mutation" >}} removes an OrderLine from the Order.
* {{< shop-api-operation operation="setCustomerForOrder" type="mutation" >}} specifies the Customer details (required if the customer is not logged in as an authenticated user).
* {{< shop-api-operation operation="setOrderShippingAddress" type="mutation" >}} sets the shipping address for the Order.
* {{< shop-api-operation operation="eligibleShippingMethods" type="mutation" >}} returns all available shipping methods based on the customer's shipping address and the contents of the Order.
* {{< shop-api-operation operation="setOrderShippingMethod" type="mutation" >}} sets the shipping method to use.
* {{< shop-api-operation operation="addPaymentToOrder" type="mutation" >}} adds a payment to the Order. If the payment amount equals the order total, then the Order will be transitioned to either the `PaymentAuthorized` or `PaymentSettled` state (depending on how the payment provider is configured) and the order process is complete from the customer's side.
* {{< shop-api-operation operation="orderByCode" type="query" >}} allows even guest Customers to fetch the order they just placed for up to 2 hours after placing it. This is intended to be used to display an order confirmation page immediately after the order is completed.


## Customer account management

* {{< shop-api-operation operation="registerCustomerAccount" type="mutation" >}}: Creates a new Customer account.
* {{< shop-api-operation operation="login" type="mutation" >}}: Log in with registered Customer credentials.
* {{< shop-api-operation operation="logout" type="mutation" >}}: Log out from Customer account.
* {{< shop-api-operation operation="activeCustomer" type="query" >}}: Returns the current logged-in Customer, or `null` if not logged in. This is useful for displaying the logged-in status in the storefront. The returned [`Customer`]({{< relref "/docs/graphql-api/shop/object-types" >}}#customer) type can also be used to query the Customer's Order history, list of Addresses and other personal details.
* {{< shop-api-operation operation="requestPasswordReset" type="mutation" >}}: Use this to implement a "forgotten password" flow. This will trigger a password reset email to be sent.
* {{< shop-api-operation operation="resetPassword" type="mutation" >}}: Use the token provided in the password reset email to set a new password.

