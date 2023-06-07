---
title: "Queries"
weight: 1
date: 2023-06-07T09:42:13.591Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Queries

## activeChannel
The active Channel

{{% gql-fields %}}
 * activeChannel: [Channel](/docs/graphql-api/shop/object-types#channel)!
{{% /gql-fields %}}



## activeCustomer
The active Customer

{{% gql-fields %}}
 * activeCustomer: [Customer](/docs/graphql-api/shop/object-types#customer)
{{% /gql-fields %}}



## activeOrder
The active Order. Will be `null` until an Order is created via `addItemToOrder`. Once an Order reaches the
state of `PaymentAuthorized` or `PaymentSettled`, then that Order is no longer considered "active" and this
query will once again return `null`.

{{% gql-fields %}}
 * activeOrder: [Order](/docs/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## availableCountries
An array of supported Countries

{{% gql-fields %}}
 * availableCountries: [[Country](/docs/graphql-api/shop/object-types#country)!]!
{{% /gql-fields %}}



## collection
Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is specified, an error will result.

{{% gql-fields %}}
 * collection(id: [ID](/docs/graphql-api/shop/object-types#id), slug: [String](/docs/graphql-api/shop/object-types#string)): [Collection](/docs/graphql-api/shop/object-types#collection)
{{% /gql-fields %}}



## collections
A list of Collections available to the shop

{{% gql-fields %}}
 * collections(options: [CollectionListOptions](/docs/graphql-api/shop/input-types#collectionlistoptions)): [CollectionList](/docs/graphql-api/shop/object-types#collectionlist)!
{{% /gql-fields %}}



## eligiblePaymentMethods
Returns a list of payment methods and their eligibility based on the current active Order

{{% gql-fields %}}
 * eligiblePaymentMethods: [[PaymentMethodQuote](/docs/graphql-api/shop/object-types#paymentmethodquote)!]!
{{% /gql-fields %}}



## eligibleShippingMethods
Returns a list of eligible shipping methods based on the current active Order

{{% gql-fields %}}
 * eligibleShippingMethods: [[ShippingMethodQuote](/docs/graphql-api/shop/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## facet
Returns a Facet by its id

{{% gql-fields %}}
 * facet(id: [ID](/docs/graphql-api/shop/object-types#id)!): [Facet](/docs/graphql-api/shop/object-types#facet)
{{% /gql-fields %}}



## facets
A list of Facets available to the shop

{{% gql-fields %}}
 * facets(options: [FacetListOptions](/docs/graphql-api/shop/input-types#facetlistoptions)): [FacetList](/docs/graphql-api/shop/object-types#facetlist)!
{{% /gql-fields %}}



## me
Returns information about the current authenticated User

{{% gql-fields %}}
 * me: [CurrentUser](/docs/graphql-api/shop/object-types#currentuser)
{{% /gql-fields %}}



## nextOrderStates
Returns the possible next states that the activeOrder can transition to

{{% gql-fields %}}
 * nextOrderStates: [[String](/docs/graphql-api/shop/object-types#string)!]!
{{% /gql-fields %}}



## order
Returns an Order based on the id. Note that in the Shop API, only orders belonging to the
currently-authenticated User may be queried.

{{% gql-fields %}}
 * order(id: [ID](/docs/graphql-api/shop/object-types#id)!): [Order](/docs/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## orderByCode
Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)
this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation
screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing
general anonymous access to Order data.

{{% gql-fields %}}
 * orderByCode(code: [String](/docs/graphql-api/shop/object-types#string)!): [Order](/docs/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## product
Get a Product either by id or slug. If neither 'id' nor 'slug' is specified, an error will result.

{{% gql-fields %}}
 * product(id: [ID](/docs/graphql-api/shop/object-types#id), slug: [String](/docs/graphql-api/shop/object-types#string)): [Product](/docs/graphql-api/shop/object-types#product)
{{% /gql-fields %}}



## products
Get a list of Products

{{% gql-fields %}}
 * products(options: [ProductListOptions](/docs/graphql-api/shop/input-types#productlistoptions)): [ProductList](/docs/graphql-api/shop/object-types#productlist)!
{{% /gql-fields %}}



## search
Search Products based on the criteria set by the `SearchInput`

{{% gql-fields %}}
 * search(input: [SearchInput](/docs/graphql-api/shop/input-types#searchinput)!): [SearchResponse](/docs/graphql-api/shop/object-types#searchresponse)!
{{% /gql-fields %}}



