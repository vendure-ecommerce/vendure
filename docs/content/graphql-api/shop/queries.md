---
title: "Queries"
weight: 1
date: 2023-07-04T11:02:06.199Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Queries

## activeChannel
The active Channel

{{% gql-fields %}}
 * activeChannel: [Channel](/graphql-api/shop/object-types#channel)!
{{% /gql-fields %}}



## activeCustomer
The active Customer

{{% gql-fields %}}
 * activeCustomer: [Customer](/graphql-api/shop/object-types#customer)
{{% /gql-fields %}}



## activeOrder
The active Order. Will be `null` until an Order is created via `addItemToOrder`. Once an Order reaches the
state of `PaymentAuthorized` or `PaymentSettled`, then that Order is no longer considered "active" and this
query will once again return `null`.

{{% gql-fields %}}
 * activeOrder: [Order](/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## availableCountries
An array of supported Countries

{{% gql-fields %}}
 * availableCountries: [[Country](/graphql-api/shop/object-types#country)!]!
{{% /gql-fields %}}



## collection
Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is specified, an error will result.

{{% gql-fields %}}
 * collection(id: [ID](/graphql-api/shop/object-types#id), slug: [String](/graphql-api/shop/object-types#string)): [Collection](/graphql-api/shop/object-types#collection)
{{% /gql-fields %}}



## collections
A list of Collections available to the shop

{{% gql-fields %}}
 * collections(options: [CollectionListOptions](/graphql-api/shop/input-types#collectionlistoptions)): [CollectionList](/graphql-api/shop/object-types#collectionlist)!
{{% /gql-fields %}}



## eligiblePaymentMethods
Returns a list of payment methods and their eligibility based on the current active Order

{{% gql-fields %}}
 * eligiblePaymentMethods: [[PaymentMethodQuote](/graphql-api/shop/object-types#paymentmethodquote)!]!
{{% /gql-fields %}}



## eligibleShippingMethods
Returns a list of eligible shipping methods based on the current active Order

{{% gql-fields %}}
 * eligibleShippingMethods: [[ShippingMethodQuote](/graphql-api/shop/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## facet
Returns a Facet by its id

{{% gql-fields %}}
 * facet(id: [ID](/graphql-api/shop/object-types#id)!): [Facet](/graphql-api/shop/object-types#facet)
{{% /gql-fields %}}



## facets
A list of Facets available to the shop

{{% gql-fields %}}
 * facets(options: [FacetListOptions](/graphql-api/shop/input-types#facetlistoptions)): [FacetList](/graphql-api/shop/object-types#facetlist)!
{{% /gql-fields %}}



## me
Returns information about the current authenticated User

{{% gql-fields %}}
 * me: [CurrentUser](/graphql-api/shop/object-types#currentuser)
{{% /gql-fields %}}



## nextOrderStates
Returns the possible next states that the activeOrder can transition to

{{% gql-fields %}}
 * nextOrderStates: [[String](/graphql-api/shop/object-types#string)!]!
{{% /gql-fields %}}



## order
Returns an Order based on the id. Note that in the Shop API, only orders belonging to the
currently-authenticated User may be queried.

{{% gql-fields %}}
 * order(id: [ID](/graphql-api/shop/object-types#id)!): [Order](/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## orderByCode
Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)
this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation
screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing
general anonymous access to Order data.

{{% gql-fields %}}
 * orderByCode(code: [String](/graphql-api/shop/object-types#string)!): [Order](/graphql-api/shop/object-types#order)
{{% /gql-fields %}}



## product
Get a Product either by id or slug. If neither 'id' nor 'slug' is specified, an error will result.

{{% gql-fields %}}
 * product(id: [ID](/graphql-api/shop/object-types#id), slug: [String](/graphql-api/shop/object-types#string)): [Product](/graphql-api/shop/object-types#product)
{{% /gql-fields %}}



## products
Get a list of Products

{{% gql-fields %}}
 * products(options: [ProductListOptions](/graphql-api/shop/input-types#productlistoptions)): [ProductList](/graphql-api/shop/object-types#productlist)!
{{% /gql-fields %}}



## search
Search Products based on the criteria set by the `SearchInput`

{{% gql-fields %}}
 * search(input: [SearchInput](/graphql-api/shop/input-types#searchinput)!): [SearchResponse](/graphql-api/shop/object-types#searchresponse)!
{{% /gql-fields %}}



