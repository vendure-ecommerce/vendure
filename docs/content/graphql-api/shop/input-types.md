---
title: "Input Objects"
weight: 4
date: 2023-07-04T11:02:06.199Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Input Objects

## AuthenticationInput

{{% gql-fields %}}
 * native: [NativeAuthInput](/graphql-api/shop/input-types#nativeauthinput)
{{% /gql-fields %}}


## BooleanListOperators

Operators for filtering on a list of Boolean fields

{{% gql-fields %}}
 * inList: [Boolean](/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## BooleanOperators

Operators for filtering on a Boolean field

{{% gql-fields %}}
 * eq: [Boolean](/graphql-api/shop/object-types#boolean)
 * isNull: [Boolean](/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## CollectionFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * slug: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * position: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * description: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * parentId: [IDOperators](/graphql-api/shop/input-types#idoperators)
{{% /gql-fields %}}


## CollectionListOptions

{{% gql-fields %}}
 * topLevelOnly: [Boolean](/graphql-api/shop/object-types#boolean)
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CollectionSortParameter](/graphql-api/shop/input-types#collectionsortparameter)
* *// Allows the results to be filtered*
 * filter: [CollectionFilterParameter](/graphql-api/shop/input-types#collectionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## CollectionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/graphql-api/shop/enums#sortorder)
 * slug: [SortOrder](/graphql-api/shop/enums#sortorder)
 * position: [SortOrder](/graphql-api/shop/enums#sortorder)
 * description: [SortOrder](/graphql-api/shop/enums#sortorder)
 * parentId: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## ConfigArgInput

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
* *// A JSON stringified representation of the actual value*
 * value: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigurableOperationInput

{{% gql-fields %}}
 * code: [String](/graphql-api/shop/object-types#string)!
 * arguments: [[ConfigArgInput](/graphql-api/shop/input-types#configarginput)!]!
{{% /gql-fields %}}


## CreateAddressInput

{{% gql-fields %}}
 * fullName: [String](/graphql-api/shop/object-types#string)
 * company: [String](/graphql-api/shop/object-types#string)
 * streetLine1: [String](/graphql-api/shop/object-types#string)!
 * streetLine2: [String](/graphql-api/shop/object-types#string)
 * city: [String](/graphql-api/shop/object-types#string)
 * province: [String](/graphql-api/shop/object-types#string)
 * postalCode: [String](/graphql-api/shop/object-types#string)
 * countryCode: [String](/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CreateCustomerInput

{{% gql-fields %}}
 * title: [String](/graphql-api/shop/object-types#string)
 * firstName: [String](/graphql-api/shop/object-types#string)!
 * lastName: [String](/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * emailAddress: [String](/graphql-api/shop/object-types#string)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * title: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * firstName: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * lastName: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * phoneNumber: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * emailAddress: [StringOperators](/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerSortParameter](/graphql-api/shop/input-types#customersortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerFilterParameter](/graphql-api/shop/input-types#customerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * title: [SortOrder](/graphql-api/shop/enums#sortorder)
 * firstName: [SortOrder](/graphql-api/shop/enums#sortorder)
 * lastName: [SortOrder](/graphql-api/shop/enums#sortorder)
 * phoneNumber: [SortOrder](/graphql-api/shop/enums#sortorder)
 * emailAddress: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## DateListOperators

Operators for filtering on a list of Date fields

{{% gql-fields %}}
 * inList: [DateTime](/graphql-api/shop/object-types#datetime)!
{{% /gql-fields %}}


## DateOperators

Operators for filtering on a DateTime field

{{% gql-fields %}}
 * eq: [DateTime](/graphql-api/shop/object-types#datetime)
 * before: [DateTime](/graphql-api/shop/object-types#datetime)
 * after: [DateTime](/graphql-api/shop/object-types#datetime)
 * between: [DateRange](/graphql-api/shop/input-types#daterange)
 * isNull: [Boolean](/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## DateRange

{{% gql-fields %}}
 * start: [DateTime](/graphql-api/shop/object-types#datetime)!
 * end: [DateTime](/graphql-api/shop/object-types#datetime)!
{{% /gql-fields %}}


## FacetFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## FacetListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetSortParameter](/graphql-api/shop/input-types#facetsortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetFilterParameter](/graphql-api/shop/input-types#facetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## FacetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/graphql-api/shop/enums#sortorder)
 * code: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## FacetValueFilterInput

Used to construct boolean expressions for filtering search results
by FacetValue ID. Examples:

* ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
* ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
* ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`

{{% gql-fields %}}
 * and: [ID](/graphql-api/shop/object-types#id)
 * or: [[ID](/graphql-api/shop/object-types#id)!]
{{% /gql-fields %}}


## HistoryEntryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * type: [StringOperators](/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## HistoryEntryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [HistoryEntrySortParameter](/graphql-api/shop/input-types#historyentrysortparameter)
* *// Allows the results to be filtered*
 * filter: [HistoryEntryFilterParameter](/graphql-api/shop/input-types#historyentryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## HistoryEntrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## IDListOperators

Operators for filtering on a list of ID fields

{{% gql-fields %}}
 * inList: [ID](/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## IDOperators

Operators for filtering on an ID field

{{% gql-fields %}}
 * eq: [String](/graphql-api/shop/object-types#string)
 * notEq: [String](/graphql-api/shop/object-types#string)
 * in: [[String](/graphql-api/shop/object-types#string)!]
 * notIn: [[String](/graphql-api/shop/object-types#string)!]
 * isNull: [Boolean](/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## NativeAuthInput

{{% gql-fields %}}
 * username: [String](/graphql-api/shop/object-types#string)!
 * password: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NumberListOperators

Operators for filtering on a list of Number fields

{{% gql-fields %}}
 * inList: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## NumberOperators

Operators for filtering on a Int or Float field

{{% gql-fields %}}
 * eq: [Float](/graphql-api/shop/object-types#float)
 * lt: [Float](/graphql-api/shop/object-types#float)
 * lte: [Float](/graphql-api/shop/object-types#float)
 * gt: [Float](/graphql-api/shop/object-types#float)
 * gte: [Float](/graphql-api/shop/object-types#float)
 * between: [NumberRange](/graphql-api/shop/input-types#numberrange)
 * isNull: [Boolean](/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## NumberRange

{{% gql-fields %}}
 * start: [Float](/graphql-api/shop/object-types#float)!
 * end: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## OrderFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * type: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * orderPlacedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * code: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * state: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * active: [BooleanOperators](/graphql-api/shop/input-types#booleanoperators)
 * totalQuantity: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * subTotal: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * subTotalWithTax: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * currencyCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * shipping: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * shippingWithTax: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * total: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * totalWithTax: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
{{% /gql-fields %}}


## OrderListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [OrderSortParameter](/graphql-api/shop/input-types#ordersortparameter)
* *// Allows the results to be filtered*
 * filter: [OrderFilterParameter](/graphql-api/shop/input-types#orderfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## OrderSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * orderPlacedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * code: [SortOrder](/graphql-api/shop/enums#sortorder)
 * state: [SortOrder](/graphql-api/shop/enums#sortorder)
 * totalQuantity: [SortOrder](/graphql-api/shop/enums#sortorder)
 * subTotal: [SortOrder](/graphql-api/shop/enums#sortorder)
 * subTotalWithTax: [SortOrder](/graphql-api/shop/enums#sortorder)
 * shipping: [SortOrder](/graphql-api/shop/enums#sortorder)
 * shippingWithTax: [SortOrder](/graphql-api/shop/enums#sortorder)
 * total: [SortOrder](/graphql-api/shop/enums#sortorder)
 * totalWithTax: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## PaymentInput

Passed as input to the `addPaymentToOrder` mutation.

{{% gql-fields %}}
* *// This field should correspond to the `code` property of a PaymentMethod.*
 * method: [String](/graphql-api/shop/object-types#string)!
* *// This field should contain arbitrary data passed to the specified PaymentMethodHandler's `createPayment()` method
as the "metadata" argument. For example, it could contain an ID for the payment and other
data generated by the payment provider.*
 * metadata: [JSON](/graphql-api/shop/object-types#json)!
{{% /gql-fields %}}


## ProductFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * slug: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## ProductListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductSortParameter](/graphql-api/shop/input-types#productsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductFilterParameter](/graphql-api/shop/input-types#productfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## ProductSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/graphql-api/shop/enums#sortorder)
 * slug: [SortOrder](/graphql-api/shop/enums#sortorder)
 * description: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## ProductVariantFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * productId: [IDOperators](/graphql-api/shop/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/shop/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * sku: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * price: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * currencyCode: [StringOperators](/graphql-api/shop/input-types#stringoperators)
 * priceWithTax: [NumberOperators](/graphql-api/shop/input-types#numberoperators)
 * stockLevel: [StringOperators](/graphql-api/shop/input-types#stringoperators)
{{% /gql-fields %}}


## ProductVariantListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/shop/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/shop/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductVariantSortParameter](/graphql-api/shop/input-types#productvariantsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductVariantFilterParameter](/graphql-api/shop/input-types#productvariantfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
{{% /gql-fields %}}


## ProductVariantSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/shop/enums#sortorder)
 * productId: [SortOrder](/graphql-api/shop/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/shop/enums#sortorder)
 * sku: [SortOrder](/graphql-api/shop/enums#sortorder)
 * name: [SortOrder](/graphql-api/shop/enums#sortorder)
 * price: [SortOrder](/graphql-api/shop/enums#sortorder)
 * priceWithTax: [SortOrder](/graphql-api/shop/enums#sortorder)
 * stockLevel: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## RegisterCustomerInput

{{% gql-fields %}}
 * emailAddress: [String](/graphql-api/shop/object-types#string)!
 * title: [String](/graphql-api/shop/object-types#string)
 * firstName: [String](/graphql-api/shop/object-types#string)
 * lastName: [String](/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * password: [String](/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## SearchInput

{{% gql-fields %}}
 * term: [String](/graphql-api/shop/object-types#string)
 * facetValueIds: [[ID](/graphql-api/shop/object-types#id)!]
 * facetValueOperator: [LogicalOperator](/graphql-api/shop/enums#logicaloperator)
 * facetValueFilters: [[FacetValueFilterInput](/graphql-api/shop/input-types#facetvaluefilterinput)!]
 * collectionId: [ID](/graphql-api/shop/object-types#id)
 * collectionSlug: [String](/graphql-api/shop/object-types#string)
 * groupByProduct: [Boolean](/graphql-api/shop/object-types#boolean)
 * take: [Int](/graphql-api/shop/object-types#int)
 * skip: [Int](/graphql-api/shop/object-types#int)
 * sort: [SearchResultSortParameter](/graphql-api/shop/input-types#searchresultsortparameter)
{{% /gql-fields %}}


## SearchResultSortParameter

{{% gql-fields %}}
 * name: [SortOrder](/graphql-api/shop/enums#sortorder)
 * price: [SortOrder](/graphql-api/shop/enums#sortorder)
{{% /gql-fields %}}


## StringListOperators

Operators for filtering on a list of String fields

{{% gql-fields %}}
 * inList: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## StringOperators

Operators for filtering on a String field

{{% gql-fields %}}
 * eq: [String](/graphql-api/shop/object-types#string)
 * notEq: [String](/graphql-api/shop/object-types#string)
 * contains: [String](/graphql-api/shop/object-types#string)
 * notContains: [String](/graphql-api/shop/object-types#string)
 * in: [[String](/graphql-api/shop/object-types#string)!]
 * notIn: [[String](/graphql-api/shop/object-types#string)!]
 * regex: [String](/graphql-api/shop/object-types#string)
 * isNull: [Boolean](/graphql-api/shop/object-types#boolean)
{{% /gql-fields %}}


## UpdateAddressInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * fullName: [String](/graphql-api/shop/object-types#string)
 * company: [String](/graphql-api/shop/object-types#string)
 * streetLine1: [String](/graphql-api/shop/object-types#string)
 * streetLine2: [String](/graphql-api/shop/object-types#string)
 * city: [String](/graphql-api/shop/object-types#string)
 * province: [String](/graphql-api/shop/object-types#string)
 * postalCode: [String](/graphql-api/shop/object-types#string)
 * countryCode: [String](/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerInput

{{% gql-fields %}}
 * title: [String](/graphql-api/shop/object-types#string)
 * firstName: [String](/graphql-api/shop/object-types#string)
 * lastName: [String](/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## UpdateOrderInput

{{% gql-fields %}}
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


