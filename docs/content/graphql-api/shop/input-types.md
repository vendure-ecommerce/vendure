---
title: "Input Objects"
weight: 4
date: 2023-06-06T14:49:26.419Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Input Objects

## AuthenticationInput

{{% gql-fields %}}
 * native: [NativeAuthInput](/docs/graphql-api/shop/input-types#nativeauthinput)
{{% /gql-fields %}}


## BooleanListOperators

Operators for filtering on a list of Boolean fields

{{% gql-fields %}}
 * inList: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## BooleanOperators

Operators for filtering on a Boolean field

{{% gql-fields %}}
 * eq: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * isNull: [Boolean](/docs/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## CollectionFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * slug: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * position: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * description: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * parentId: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
{{% /gql-fields %}}


## CollectionListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CollectionSortParameter](/docs/graphql-api/shop/input-types#collectionsortparameter)
* *// Allows the results to be filtered*
 * filter: [CollectionFilterParameter](/docs/graphql-api/shop/input-types#collectionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## CollectionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * slug: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * position: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * parentId: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## ConfigArgInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
* *// A JSON stringified representation of the actual value*
 * value: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigurableOperationInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * arguments: [[ConfigArgInput](/docs/graphql-api/shop/input-types#configarginput)!]!
{{% /gql-fields %}}


## CreateAddressInput

{{% gql-fields %}}
 * fullName: [String](/docs/graphql-api/shop/object-types#string)
 * company: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine1: [String](/docs/graphql-api/shop/object-types#string)!
 * streetLine2: [String](/docs/graphql-api/shop/object-types#string)
 * city: [String](/docs/graphql-api/shop/object-types#string)
 * province: [String](/docs/graphql-api/shop/object-types#string)
 * postalCode: [String](/docs/graphql-api/shop/object-types#string)
 * countryCode: [String](/docs/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CreateCustomerInput

{{% gql-fields %}}
 * title: [String](/docs/graphql-api/shop/object-types#string)
 * firstName: [String](/docs/graphql-api/shop/object-types#string)!
 * lastName: [String](/docs/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * emailAddress: [String](/docs/graphql-api/shop/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * title: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * firstName: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * lastName: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * phoneNumber: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * emailAddress: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerSortParameter](/docs/graphql-api/shop/input-types#customersortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerFilterParameter](/docs/graphql-api/shop/input-types#customerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * title: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * firstName: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * lastName: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * phoneNumber: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * emailAddress: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## DateListOperators

Operators for filtering on a list of Date fields

{{% gql-fields %}}
 * inList: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
{{% /gql-fields %}}


## DateOperators

Operators for filtering on a DateTime field

{{% gql-fields %}}
 * eq: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * before: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * after: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * between: [DateRange](/docs/graphql-api/shop/input-types#daterange)
 * isNull: [Boolean](/docs/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## DateRange

{{% gql-fields %}}
 * start: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * end: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
{{% /gql-fields %}}


## FacetFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## FacetListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetSortParameter](/docs/graphql-api/shop/input-types#facetsortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetFilterParameter](/docs/graphql-api/shop/input-types#facetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## FacetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## FacetValueFilterInput

Used to construct boolean expressions for filtering search results
by FacetValue ID. Examples:

* ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
* ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
* ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`

{{% gql-fields %}}
 * and: [ID](/docs/graphql-api/shop/object-types#id)
 * or: [[ID](/docs/graphql-api/shop/object-types#id)!]
{{% /gql-fields %}}


## HistoryEntryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * type: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## HistoryEntryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [HistoryEntrySortParameter](/docs/graphql-api/shop/input-types#historyentrysortparameter)
* *// Allows the results to be filtered*
 * filter: [HistoryEntryFilterParameter](/docs/graphql-api/shop/input-types#historyentryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## HistoryEntrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## IDListOperators

Operators for filtering on a list of ID fields

{{% gql-fields %}}
 * inList: [ID](/docs/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## IDOperators

Operators for filtering on an ID field

{{% gql-fields %}}
 * eq: [String](/docs/graphql-api/shop/object-types#string)
 * notEq: [String](/docs/graphql-api/shop/object-types#string)
 * in: [[String](/docs/graphql-api/shop/object-types#string)!]
 * notIn: [[String](/docs/graphql-api/shop/object-types#string)!]
 * isNull: [Boolean](/docs/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## NativeAuthInput

{{% gql-fields %}}
 * username: [String](/docs/graphql-api/shop/object-types#string)!
 * password: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NumberListOperators

Operators for filtering on a list of Number fields

{{% gql-fields %}}
 * inList: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## NumberOperators

Operators for filtering on a Int or Float field

{{% gql-fields %}}
 * eq: [Float](/docs/graphql-api/shop/object-types#float)
 * lt: [Float](/docs/graphql-api/shop/object-types#float)
 * lte: [Float](/docs/graphql-api/shop/object-types#float)
 * gt: [Float](/docs/graphql-api/shop/object-types#float)
 * gte: [Float](/docs/graphql-api/shop/object-types#float)
 * between: [NumberRange](/docs/graphql-api/shop/input-types#numberrange)
 * isNull: [Boolean](/docs/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## NumberRange

{{% gql-fields %}}
 * start: [Float](/docs/graphql-api/shop/object-types#float)!
 * end: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## OrderFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * type: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * orderPlacedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * code: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * state: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * active: [BooleanOperators](/docs/graphql-api/shop/input-types#booleanoperators)
 * totalQuantity: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * subTotal: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * subTotalWithTax: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * currencyCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * shipping: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * shippingWithTax: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * total: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * totalWithTax: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
{{% /gql-fields %}}


## OrderListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [OrderSortParameter](/docs/graphql-api/shop/input-types#ordersortparameter)
* *// Allows the results to be filtered*
 * filter: [OrderFilterParameter](/docs/graphql-api/shop/input-types#orderfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## OrderSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * orderPlacedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * state: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * totalQuantity: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * subTotal: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * subTotalWithTax: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * shipping: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * shippingWithTax: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * total: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * totalWithTax: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## PaymentInput

Passed as input to the `addPaymentToOrder` mutation.

{{% gql-fields %}}
* *// This field should correspond to the `code` property of a PaymentMethod.*
 * method: [String](/docs/graphql-api/shop/object-types#string)!
* *// This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
as the "metadata" argument. For example, it could contain an ID for the payment and other
data generated by the payment provider.*
 * metadata: [JSON](/docs/graphql-api/shop/object-types#json)!
{{% /gql-fields %}}


## ProductFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * slug: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## ProductListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductSortParameter](/docs/graphql-api/shop/input-types#productsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductFilterParameter](/docs/graphql-api/shop/input-types#productfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## ProductSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * slug: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## ProductVariantFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * productId: [IDOperators](/docs/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * sku: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * price: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * currencyCode: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
 * priceWithTax: [NumberOperators](/docs/graphql-api/shop/input-types#numberoperators)
 * stockLevel: [StringOperators](/docs/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## ProductVariantListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductVariantSortParameter](/docs/graphql-api/shop/input-types#productvariantsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductVariantFilterParameter](/docs/graphql-api/shop/input-types#productvariantfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## ProductVariantSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * productId: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * sku: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * price: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * priceWithTax: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * stockLevel: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## RegisterCustomerInput

{{% gql-fields %}}
 * emailAddress: [String](/docs/graphql-api/shop/object-types#string)!
 * title: [String](/docs/graphql-api/shop/object-types#string)
 * firstName: [String](/docs/graphql-api/shop/object-types#string)
 * lastName: [String](/docs/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * password: [String](/docs/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## SearchInput

{{% gql-fields %}}
 * term: [String](/docs/graphql-api/shop/object-types#string)
 * facetValueIds: [[ID](/docs/graphql-api/shop/object-types#id)!]
 * facetValueOperator: [LogicalOperator](/docs/graphql-api/shop/enums#logicaloperator)
 * facetValueFilters: [[FacetValueFilterInput](/docs/graphql-api/shop/input-types#facetvaluefilterinput)!]
 * collectionId: [ID](/docs/graphql-api/shop/object-types#id)
 * collectionSlug: [String](/docs/graphql-api/shop/object-types#string)
 * groupByProduct: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * take: [Int](/docs/graphql-api/shop/object-types#int)
 * skip: [Int](/docs/graphql-api/shop/object-types#int)
 * sort: [SearchResultSortParameter](/docs/graphql-api/shop/input-types#searchresultsortparameter)
{{% /gql-fields %}}


## SearchResultSortParameter

{{% gql-fields %}}
 * name: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
 * price: [SortOrder](/docs/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## StringListOperators

Operators for filtering on a list of String fields

{{% gql-fields %}}
 * inList: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## StringOperators

Operators for filtering on a String field

{{% gql-fields %}}
 * eq: [String](/docs/graphql-api/shop/object-types#string)
 * notEq: [String](/docs/graphql-api/shop/object-types#string)
 * contains: [String](/docs/graphql-api/shop/object-types#string)
 * notContains: [String](/docs/graphql-api/shop/object-types#string)
 * in: [[String](/docs/graphql-api/shop/object-types#string)!]
 * notIn: [[String](/docs/graphql-api/shop/object-types#string)!]
 * regex: [String](/docs/graphql-api/shop/object-types#string)
 * isNull: [Boolean](/docs/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## UpdateAddressInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * fullName: [String](/docs/graphql-api/shop/object-types#string)
 * company: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine1: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine2: [String](/docs/graphql-api/shop/object-types#string)
 * city: [String](/docs/graphql-api/shop/object-types#string)
 * province: [String](/docs/graphql-api/shop/object-types#string)
 * postalCode: [String](/docs/graphql-api/shop/object-types#string)
 * countryCode: [String](/docs/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerInput

{{% gql-fields %}}
 * title: [String](/docs/graphql-api/shop/object-types#string)
 * firstName: [String](/docs/graphql-api/shop/object-types#string)
 * lastName: [String](/docs/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## UpdateOrderInput

{{% gql-fields %}}
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


