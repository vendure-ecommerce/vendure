---
title: "Input Objects"
weight: 4
date: 2023-06-06T14:49:27.902Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Input Objects

## AddItemInput

{{% gql-fields %}}
 * productVariantId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AddItemToDraftOrderInput

{{% gql-fields %}}
 * productVariantId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AddNoteToCustomerInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * note: [String](/docs/graphql-api/admin/object-types#string)!
 * isPublic: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## AddNoteToOrderInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * note: [String](/docs/graphql-api/admin/object-types#string)!
 * isPublic: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## AdjustDraftOrderLineInput

{{% gql-fields %}}
 * orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AdministratorFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * firstName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * lastName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * emailAddress: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## AdministratorListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [AdministratorSortParameter](/docs/graphql-api/admin/input-types#administratorsortparameter)
* *// Allows the results to be filtered*
 * filter: [AdministratorFilterParameter](/docs/graphql-api/admin/input-types#administratorfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## AdministratorPaymentInput

{{% gql-fields %}}
 * paymentMethod: [String](/docs/graphql-api/admin/object-types#string)
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AdministratorRefundInput

{{% gql-fields %}}
 * paymentId: [ID](/docs/graphql-api/admin/object-types#id)!
 * reason: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## AdministratorSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * firstName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * lastName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * emailAddress: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## AssetFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * fileSize: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * mimeType: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * width: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * height: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * source: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * preview: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## AssetListOptions

{{% gql-fields %}}
 * tags: [[String](/docs/graphql-api/admin/object-types#string)!]
 * tagsOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [AssetSortParameter](/docs/graphql-api/admin/input-types#assetsortparameter)
* *// Allows the results to be filtered*
 * filter: [AssetFilterParameter](/docs/graphql-api/admin/input-types#assetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## AssetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * fileSize: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * mimeType: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * width: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * height: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * source: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * preview: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## AssignAssetsToChannelInput

{{% gql-fields %}}
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignCollectionsToChannelInput

{{% gql-fields %}}
 * collectionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignFacetsToChannelInput

{{% gql-fields %}}
 * facetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignPaymentMethodsToChannelInput

{{% gql-fields %}}
 * paymentMethodIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignProductVariantsToChannelInput

{{% gql-fields %}}
 * productVariantIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
 * priceFactor: [Float](/docs/graphql-api/admin/object-types#float)
{{% /gql-fields %}}


## AssignProductsToChannelInput

{{% gql-fields %}}
 * productIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
 * priceFactor: [Float](/docs/graphql-api/admin/object-types#float)
{{% /gql-fields %}}


## AssignPromotionsToChannelInput

{{% gql-fields %}}
 * promotionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignShippingMethodsToChannelInput

{{% gql-fields %}}
 * shippingMethodIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignStockLocationsToChannelInput

{{% gql-fields %}}
 * stockLocationIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AuthenticationInput

{{% gql-fields %}}
 * native: [NativeAuthInput](/docs/graphql-api/admin/input-types#nativeauthinput)
{{% /gql-fields %}}


## BooleanListOperators

Operators for filtering on a list of Boolean fields

{{% gql-fields %}}
 * inList: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## BooleanOperators

Operators for filtering on a Boolean field

{{% gql-fields %}}
 * eq: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * isNull: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## CancelOrderInput

{{% gql-fields %}}
* *// The id of the order to be cancelled*
 * orderId: [ID](/docs/graphql-api/admin/object-types#id)!
* *// Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled*
 * lines: [[OrderLineInput](/docs/graphql-api/admin/input-types#orderlineinput)!]
* *// Specify whether the shipping charges should also be cancelled. Defaults to false*
 * cancelShipping: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * reason: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## ChannelFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * token: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * defaultLanguageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * currencyCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * defaultCurrencyCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * trackInventory: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * outOfStockThreshold: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * pricesIncludeTax: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## ChannelListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ChannelSortParameter](/docs/graphql-api/admin/input-types#channelsortparameter)
* *// Allows the results to be filtered*
 * filter: [ChannelFilterParameter](/docs/graphql-api/admin/input-types#channelfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ChannelSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * token: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * outOfStockThreshold: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CollectionFilterParameter

{{% gql-fields %}}
 * isPrivate: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * inheritFilters: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * slug: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * position: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * parentId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## CollectionListOptions

{{% gql-fields %}}
 * topLevelOnly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CollectionSortParameter](/docs/graphql-api/admin/input-types#collectionsortparameter)
* *// Allows the results to be filtered*
 * filter: [CollectionFilterParameter](/docs/graphql-api/admin/input-types#collectionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CollectionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * slug: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * position: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ConfigArgInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
* *// A JSON stringified representation of the actual value*
 * value: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigurableOperationInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * arguments: [[ConfigArgInput](/docs/graphql-api/admin/input-types#configarginput)!]!
{{% /gql-fields %}}


## CoordinateInput

{{% gql-fields %}}
 * x: [Float](/docs/graphql-api/admin/object-types#float)!
 * y: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## CountryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * parentId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## CountryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CountrySortParameter](/docs/graphql-api/admin/input-types#countrysortparameter)
* *// Allows the results to be filtered*
 * filter: [CountryFilterParameter](/docs/graphql-api/admin/input-types#countryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CountrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * type: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CountryTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAddressInput

{{% gql-fields %}}
 * fullName: [String](/docs/graphql-api/admin/object-types#string)
 * company: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine1: [String](/docs/graphql-api/admin/object-types#string)!
 * streetLine2: [String](/docs/graphql-api/admin/object-types#string)
 * city: [String](/docs/graphql-api/admin/object-types#string)
 * province: [String](/docs/graphql-api/admin/object-types#string)
 * postalCode: [String](/docs/graphql-api/admin/object-types#string)
 * countryCode: [String](/docs/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAdministratorInput

{{% gql-fields %}}
 * firstName: [String](/docs/graphql-api/admin/object-types#string)!
 * lastName: [String](/docs/graphql-api/admin/object-types#string)!
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)!
 * password: [String](/docs/graphql-api/admin/object-types#string)!
 * roleIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAssetInput

{{% gql-fields %}}
 * file: [Upload](/docs/graphql-api/admin/object-types#upload)!
 * tags: [[String](/docs/graphql-api/admin/object-types#string)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateChannelInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * token: [String](/docs/graphql-api/admin/object-types#string)!
 * defaultLanguageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/docs/graphql-api/admin/enums#languagecode)!]
 * pricesIncludeTax: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)
 * defaultCurrencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)
 * availableCurrencyCodes: [[CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!]
 * trackInventory: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * defaultTaxZoneId: [ID](/docs/graphql-api/admin/object-types#id)!
 * defaultShippingZoneId: [ID](/docs/graphql-api/admin/object-types#id)!
 * sellerId: [ID](/docs/graphql-api/admin/object-types#id)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCollectionInput

{{% gql-fields %}}
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)
 * inheritFilters: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * filters: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]!
 * translations: [[CreateCollectionTranslationInput](/docs/graphql-api/admin/input-types#createcollectiontranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCollectionTranslationInput

{{% gql-fields %}}
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCountryInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[CountryTranslationInput](/docs/graphql-api/admin/input-types#countrytranslationinput)!]!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCustomerGroupInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * customerIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCustomerInput

{{% gql-fields %}}
 * title: [String](/docs/graphql-api/admin/object-types#string)
 * firstName: [String](/docs/graphql-api/admin/object-types#string)!
 * lastName: [String](/docs/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * translations: [[FacetTranslationInput](/docs/graphql-api/admin/input-types#facettranslationinput)!]!
 * values: [[CreateFacetValueWithFacetInput](/docs/graphql-api/admin/input-types#createfacetvaluewithfacetinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetValueInput

{{% gql-fields %}}
 * facetId: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslationInput](/docs/graphql-api/admin/input-types#facetvaluetranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetValueWithFacetInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslationInput](/docs/graphql-api/admin/input-types#facetvaluetranslationinput)!]!
{{% /gql-fields %}}


## CreateGroupOptionInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/docs/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
{{% /gql-fields %}}


## CreatePaymentMethodInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * checker: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)
 * handler: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
 * translations: [[PaymentMethodTranslationInput](/docs/graphql-api/admin/input-types#paymentmethodtranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductInput

{{% gql-fields %}}
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * translations: [[ProductTranslationInput](/docs/graphql-api/admin/input-types#producttranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductOptionGroupInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/docs/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
 * options: [[CreateGroupOptionInput](/docs/graphql-api/admin/input-types#creategroupoptioninput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductOptionInput

{{% gql-fields %}}
 * productOptionGroupId: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/docs/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductVariantInput

{{% gql-fields %}}
 * productId: [ID](/docs/graphql-api/admin/object-types#id)!
 * translations: [[ProductVariantTranslationInput](/docs/graphql-api/admin/input-types#productvarianttranslationinput)!]!
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * sku: [String](/docs/graphql-api/admin/object-types#string)!
 * price: [Money](/docs/graphql-api/admin/object-types#money)
 * taxCategoryId: [ID](/docs/graphql-api/admin/object-types#id)
 * optionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)
 * stockLevels: [[StockLevelInput](/docs/graphql-api/admin/input-types#stocklevelinput)!]
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * useGlobalOutOfStockThreshold: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * trackInventory: [GlobalFlag](/docs/graphql-api/admin/enums#globalflag)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductVariantOptionInput

{{% gql-fields %}}
 * optionGroupId: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionTranslationInput](/docs/graphql-api/admin/input-types#productoptiontranslationinput)!]!
{{% /gql-fields %}}


## CreatePromotionInput

{{% gql-fields %}}
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * startsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/docs/graphql-api/admin/object-types#int)
 * conditions: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]!
 * actions: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]!
 * translations: [[PromotionTranslationInput](/docs/graphql-api/admin/input-types#promotiontranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProvinceInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[ProvinceTranslationInput](/docs/graphql-api/admin/input-types#provincetranslationinput)!]!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateRoleInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/docs/graphql-api/admin/enums#permission)!]!
 * channelIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## CreateSellerInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateShippingMethodInput

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * fulfillmentHandler: [String](/docs/graphql-api/admin/object-types#string)!
 * checker: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
 * calculator: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
 * translations: [[ShippingMethodTranslationInput](/docs/graphql-api/admin/input-types#shippingmethodtranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateStockLocationInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateTagInput

{{% gql-fields %}}
 * value: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CreateTaxCategoryInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * isDefault: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateTaxRateInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * value: [Float](/docs/graphql-api/admin/object-types#float)!
 * categoryId: [ID](/docs/graphql-api/admin/object-types#id)!
 * zoneId: [ID](/docs/graphql-api/admin/object-types#id)!
 * customerGroupId: [ID](/docs/graphql-api/admin/object-types#id)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateZoneInput

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * memberIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerFilterParameter

{{% gql-fields %}}
 * postalCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * title: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * firstName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * lastName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * phoneNumber: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * emailAddress: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerGroupFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerGroupListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerGroupSortParameter](/docs/graphql-api/admin/input-types#customergroupsortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerGroupFilterParameter](/docs/graphql-api/admin/input-types#customergroupfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerGroupSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CustomerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerSortParameter](/docs/graphql-api/admin/input-types#customersortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerFilterParameter](/docs/graphql-api/admin/input-types#customerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * title: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * firstName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * lastName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * phoneNumber: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * emailAddress: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## DateListOperators

Operators for filtering on a list of Date fields

{{% gql-fields %}}
 * inList: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
{{% /gql-fields %}}


## DateOperators

Operators for filtering on a DateTime field

{{% gql-fields %}}
 * eq: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * before: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * after: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * between: [DateRange](/docs/graphql-api/admin/input-types#daterange)
 * isNull: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DateRange

{{% gql-fields %}}
 * start: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * end: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
{{% /gql-fields %}}


## DeleteAssetInput

{{% gql-fields %}}
 * assetId: [ID](/docs/graphql-api/admin/object-types#id)!
 * force: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * deleteFromAllChannels: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DeleteAssetsInput

{{% gql-fields %}}
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * force: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * deleteFromAllChannels: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DeleteStockLocationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * transferToLocationId: [ID](/docs/graphql-api/admin/object-types#id)
{{% /gql-fields %}}


## FacetFilterParameter

{{% gql-fields %}}
 * isPrivate: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## FacetListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetSortParameter](/docs/graphql-api/admin/input-types#facetsortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetFilterParameter](/docs/graphql-api/admin/input-types#facetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## FacetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## FacetTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetValueFilterInput

Used to construct boolean expressions for filtering search results
by FacetValue ID. Examples:

* ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
* ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
* ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`

{{% gql-fields %}}
 * and: [ID](/docs/graphql-api/admin/object-types#id)
 * or: [[ID](/docs/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## FacetValueFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## FacetValueListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetValueSortParameter](/docs/graphql-api/admin/input-types#facetvaluesortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetValueFilterParameter](/docs/graphql-api/admin/input-types#facetvaluefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## FacetValueSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## FacetValueTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FulfillOrderInput

{{% gql-fields %}}
 * lines: [[OrderLineInput](/docs/graphql-api/admin/input-types#orderlineinput)!]!
 * handler: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
{{% /gql-fields %}}


## HistoryEntryFilterParameter

{{% gql-fields %}}
 * isPublic: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * type: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## HistoryEntryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [HistoryEntrySortParameter](/docs/graphql-api/admin/input-types#historyentrysortparameter)
* *// Allows the results to be filtered*
 * filter: [HistoryEntryFilterParameter](/docs/graphql-api/admin/input-types#historyentryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## HistoryEntrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## IDListOperators

Operators for filtering on a list of ID fields

{{% gql-fields %}}
 * inList: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## IDOperators

Operators for filtering on an ID field

{{% gql-fields %}}
 * eq: [String](/docs/graphql-api/admin/object-types#string)
 * notEq: [String](/docs/graphql-api/admin/object-types#string)
 * in: [[String](/docs/graphql-api/admin/object-types#string)!]
 * notIn: [[String](/docs/graphql-api/admin/object-types#string)!]
 * isNull: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## JobFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * startedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * settledAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * queueName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * state: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * progress: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * isSettled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * duration: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * retries: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * attempts: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## JobListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [JobSortParameter](/docs/graphql-api/admin/input-types#jobsortparameter)
* *// Allows the results to be filtered*
 * filter: [JobFilterParameter](/docs/graphql-api/admin/input-types#jobfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## JobSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * startedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * settledAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * queueName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * progress: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * duration: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * retries: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * attempts: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ManualPaymentInput

{{% gql-fields %}}
 * orderId: [ID](/docs/graphql-api/admin/object-types#id)!
 * method: [String](/docs/graphql-api/admin/object-types#string)!
 * transactionId: [String](/docs/graphql-api/admin/object-types#string)
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## MetricSummaryInput

{{% gql-fields %}}
 * interval: [MetricInterval](/docs/graphql-api/admin/enums#metricinterval)!
 * types: [[MetricType](/docs/graphql-api/admin/enums#metrictype)!]!
 * refresh: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## ModifyOrderInput

{{% gql-fields %}}
 * dryRun: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * orderId: [ID](/docs/graphql-api/admin/object-types#id)!
 * addItems: [[AddItemInput](/docs/graphql-api/admin/input-types#additeminput)!]
 * adjustOrderLines: [[OrderLineInput](/docs/graphql-api/admin/input-types#orderlineinput)!]
 * surcharges: [[SurchargeInput](/docs/graphql-api/admin/input-types#surchargeinput)!]
 * updateShippingAddress: [UpdateOrderAddressInput](/docs/graphql-api/admin/input-types#updateorderaddressinput)
 * updateBillingAddress: [UpdateOrderAddressInput](/docs/graphql-api/admin/input-types#updateorderaddressinput)
 * note: [String](/docs/graphql-api/admin/object-types#string)
 * refund: [AdministratorRefundInput](/docs/graphql-api/admin/input-types#administratorrefundinput)
 * options: [ModifyOrderOptions](/docs/graphql-api/admin/input-types#modifyorderoptions)
 * couponCodes: [[String](/docs/graphql-api/admin/object-types#string)!]
{{% /gql-fields %}}


## ModifyOrderOptions

{{% gql-fields %}}
 * freezePromotions: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * recalculateShipping: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## MoveCollectionInput

{{% gql-fields %}}
 * collectionId: [ID](/docs/graphql-api/admin/object-types#id)!
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)!
 * index: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## NativeAuthInput

{{% gql-fields %}}
 * username: [String](/docs/graphql-api/admin/object-types#string)!
 * password: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NumberListOperators

Operators for filtering on a list of Number fields

{{% gql-fields %}}
 * inList: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## NumberOperators

Operators for filtering on a Int or Float field

{{% gql-fields %}}
 * eq: [Float](/docs/graphql-api/admin/object-types#float)
 * lt: [Float](/docs/graphql-api/admin/object-types#float)
 * lte: [Float](/docs/graphql-api/admin/object-types#float)
 * gt: [Float](/docs/graphql-api/admin/object-types#float)
 * gte: [Float](/docs/graphql-api/admin/object-types#float)
 * between: [NumberRange](/docs/graphql-api/admin/input-types#numberrange)
 * isNull: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## NumberRange

{{% gql-fields %}}
 * start: [Float](/docs/graphql-api/admin/object-types#float)!
 * end: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## OrderFilterParameter

{{% gql-fields %}}
 * customerLastName: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * transactionId: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * aggregateOrderId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * type: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * orderPlacedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * state: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * active: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * totalQuantity: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * subTotal: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * subTotalWithTax: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * currencyCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * shipping: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * shippingWithTax: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * total: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * totalWithTax: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## OrderLineInput

{{% gql-fields %}}
 * orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [OrderSortParameter](/docs/graphql-api/admin/input-types#ordersortparameter)
* *// Allows the results to be filtered*
 * filter: [OrderFilterParameter](/docs/graphql-api/admin/input-types#orderfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## OrderSortParameter

{{% gql-fields %}}
 * customerLastName: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * transactionId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * aggregateOrderId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * orderPlacedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * state: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * totalQuantity: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * subTotal: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * subTotalWithTax: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * shipping: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * shippingWithTax: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * total: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * totalWithTax: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PaymentMethodFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## PaymentMethodListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [PaymentMethodSortParameter](/docs/graphql-api/admin/input-types#paymentmethodsortparameter)
* *// Allows the results to be filtered*
 * filter: [PaymentMethodFilterParameter](/docs/graphql-api/admin/input-types#paymentmethodfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## PaymentMethodSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PaymentMethodTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PreviewCollectionVariantsInput

{{% gql-fields %}}
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)
 * inheritFilters: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * filters: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]!
{{% /gql-fields %}}


## ProductFilterParameter

{{% gql-fields %}}
 * facetValueId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * slug: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ProductListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductSortParameter](/docs/graphql-api/admin/input-types#productsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductFilterParameter](/docs/graphql-api/admin/input-types#productfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProductOptionGroupTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * slug: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProductTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * slug: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductVariantFilterParameter

{{% gql-fields %}}
 * facetValueId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * trackInventory: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * stockOnHand: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * stockAllocated: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * outOfStockThreshold: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * useGlobalOutOfStockThreshold: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * productId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * sku: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * price: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * currencyCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * priceWithTax: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * stockLevel: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ProductVariantListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductVariantSortParameter](/docs/graphql-api/admin/input-types#productvariantsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductVariantFilterParameter](/docs/graphql-api/admin/input-types#productvariantfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProductVariantPriceInput

Used to set up update the price of a ProductVariant in a particular Channel.
If the `delete` flag is `true`, the price will be deleted for the given Channel.

{{% gql-fields %}}
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * delete: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## ProductVariantSortParameter

{{% gql-fields %}}
 * stockOnHand: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * stockAllocated: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * outOfStockThreshold: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * productId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * sku: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * price: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * priceWithTax: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * stockLevel: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProductVariantTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PromotionFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * startsAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * endsAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * couponCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * perCustomerUsageLimit: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## PromotionListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [PromotionSortParameter](/docs/graphql-api/admin/input-types#promotionsortparameter)
* *// Allows the results to be filtered*
 * filter: [PromotionFilterParameter](/docs/graphql-api/admin/input-types#promotionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## PromotionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * startsAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * endsAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * couponCode: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * perCustomerUsageLimit: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PromotionTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProvinceFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * parentId: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## ProvinceListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProvinceSortParameter](/docs/graphql-api/admin/input-types#provincesortparameter)
* *// Allows the results to be filtered*
 * filter: [ProvinceFilterParameter](/docs/graphql-api/admin/input-types#provincefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProvinceSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * type: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProvinceTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## RefundOrderInput

{{% gql-fields %}}
 * lines: [[OrderLineInput](/docs/graphql-api/admin/input-types#orderlineinput)!]!
 * shipping: [Money](/docs/graphql-api/admin/object-types#money)!
 * adjustment: [Money](/docs/graphql-api/admin/object-types#money)!
 * paymentId: [ID](/docs/graphql-api/admin/object-types#id)!
 * reason: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## RemoveCollectionsFromChannelInput

{{% gql-fields %}}
 * collectionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveFacetsFromChannelInput

{{% gql-fields %}}
 * facetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
 * force: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## RemovePaymentMethodsFromChannelInput

{{% gql-fields %}}
 * paymentMethodIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveProductVariantsFromChannelInput

{{% gql-fields %}}
 * productVariantIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveProductsFromChannelInput

{{% gql-fields %}}
 * productIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemovePromotionsFromChannelInput

{{% gql-fields %}}
 * promotionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveShippingMethodsFromChannelInput

{{% gql-fields %}}
 * shippingMethodIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveStockLocationsFromChannelInput

{{% gql-fields %}}
 * stockLocationIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RoleFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## RoleListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [RoleSortParameter](/docs/graphql-api/admin/input-types#rolesortparameter)
* *// Allows the results to be filtered*
 * filter: [RoleFilterParameter](/docs/graphql-api/admin/input-types#rolefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## RoleSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SearchInput

{{% gql-fields %}}
 * term: [String](/docs/graphql-api/admin/object-types#string)
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * facetValueOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
 * facetValueFilters: [[FacetValueFilterInput](/docs/graphql-api/admin/input-types#facetvaluefilterinput)!]
 * collectionId: [ID](/docs/graphql-api/admin/object-types#id)
 * collectionSlug: [String](/docs/graphql-api/admin/object-types#string)
 * groupByProduct: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * take: [Int](/docs/graphql-api/admin/object-types#int)
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
 * sort: [SearchResultSortParameter](/docs/graphql-api/admin/input-types#searchresultsortparameter)
{{% /gql-fields %}}


## SearchResultSortParameter

{{% gql-fields %}}
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * price: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SellerFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## SellerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [SellerSortParameter](/docs/graphql-api/admin/input-types#sellersortparameter)
* *// Allows the results to be filtered*
 * filter: [SellerFilterParameter](/docs/graphql-api/admin/input-types#sellerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## SellerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SettleRefundInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * transactionId: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ShippingMethodFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * fulfillmentHandlerCode: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ShippingMethodListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ShippingMethodSortParameter](/docs/graphql-api/admin/input-types#shippingmethodsortparameter)
* *// Allows the results to be filtered*
 * filter: [ShippingMethodFilterParameter](/docs/graphql-api/admin/input-types#shippingmethodfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ShippingMethodSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * fulfillmentHandlerCode: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ShippingMethodTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StockLevelInput

{{% gql-fields %}}
 * stockLocationId: [ID](/docs/graphql-api/admin/object-types#id)!
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockLocationFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## StockLocationListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [StockLocationSortParameter](/docs/graphql-api/admin/input-types#stocklocationsortparameter)
* *// Allows the results to be filtered*
 * filter: [StockLocationFilterParameter](/docs/graphql-api/admin/input-types#stocklocationfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## StockLocationSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## StockMovementListOptions

{{% gql-fields %}}
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
 * take: [Int](/docs/graphql-api/admin/object-types#int)
{{% /gql-fields %}}


## StringListOperators

Operators for filtering on a list of String fields

{{% gql-fields %}}
 * inList: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## StringOperators

Operators for filtering on a String field

{{% gql-fields %}}
 * eq: [String](/docs/graphql-api/admin/object-types#string)
 * notEq: [String](/docs/graphql-api/admin/object-types#string)
 * contains: [String](/docs/graphql-api/admin/object-types#string)
 * notContains: [String](/docs/graphql-api/admin/object-types#string)
 * in: [[String](/docs/graphql-api/admin/object-types#string)!]
 * notIn: [[String](/docs/graphql-api/admin/object-types#string)!]
 * regex: [String](/docs/graphql-api/admin/object-types#string)
 * isNull: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## SurchargeInput

{{% gql-fields %}}
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * sku: [String](/docs/graphql-api/admin/object-types#string)
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * priceIncludesTax: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * taxRate: [Float](/docs/graphql-api/admin/object-types#float)
 * taxDescription: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## TagFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * value: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## TagListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TagSortParameter](/docs/graphql-api/admin/input-types#tagsortparameter)
* *// Allows the results to be filtered*
 * filter: [TagFilterParameter](/docs/graphql-api/admin/input-types#tagfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TagSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * value: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TaxCategoryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * isDefault: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## TaxCategoryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TaxCategorySortParameter](/docs/graphql-api/admin/input-types#taxcategorysortparameter)
* *// Allows the results to be filtered*
 * filter: [TaxCategoryFilterParameter](/docs/graphql-api/admin/input-types#taxcategoryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TaxCategorySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TaxRateFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/docs/graphql-api/admin/input-types#booleanoperators)
 * value: [NumberOperators](/docs/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## TaxRateListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TaxRateSortParameter](/docs/graphql-api/admin/input-types#taxratesortparameter)
* *// Allows the results to be filtered*
 * filter: [TaxRateFilterParameter](/docs/graphql-api/admin/input-types#taxratefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TaxRateSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * value: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TestEligibleShippingMethodsInput

{{% gql-fields %}}
 * shippingAddress: [CreateAddressInput](/docs/graphql-api/admin/input-types#createaddressinput)!
 * lines: [[TestShippingMethodOrderLineInput](/docs/graphql-api/admin/input-types#testshippingmethodorderlineinput)!]!
{{% /gql-fields %}}


## TestShippingMethodInput

{{% gql-fields %}}
 * checker: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
 * calculator: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!
 * shippingAddress: [CreateAddressInput](/docs/graphql-api/admin/input-types#createaddressinput)!
 * lines: [[TestShippingMethodOrderLineInput](/docs/graphql-api/admin/input-types#testshippingmethodorderlineinput)!]!
{{% /gql-fields %}}


## TestShippingMethodOrderLineInput

{{% gql-fields %}}
 * productVariantId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## UpdateActiveAdministratorInput

{{% gql-fields %}}
 * firstName: [String](/docs/graphql-api/admin/object-types#string)
 * lastName: [String](/docs/graphql-api/admin/object-types#string)
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)
 * password: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAddressInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * fullName: [String](/docs/graphql-api/admin/object-types#string)
 * company: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine1: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine2: [String](/docs/graphql-api/admin/object-types#string)
 * city: [String](/docs/graphql-api/admin/object-types#string)
 * province: [String](/docs/graphql-api/admin/object-types#string)
 * postalCode: [String](/docs/graphql-api/admin/object-types#string)
 * countryCode: [String](/docs/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAdministratorInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * firstName: [String](/docs/graphql-api/admin/object-types#string)
 * lastName: [String](/docs/graphql-api/admin/object-types#string)
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)
 * password: [String](/docs/graphql-api/admin/object-types#string)
 * roleIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAssetInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * focalPoint: [CoordinateInput](/docs/graphql-api/admin/input-types#coordinateinput)
 * tags: [[String](/docs/graphql-api/admin/object-types#string)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateChannelInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * token: [String](/docs/graphql-api/admin/object-types#string)
 * defaultLanguageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)
 * availableLanguageCodes: [[LanguageCode](/docs/graphql-api/admin/enums#languagecode)!]
 * pricesIncludeTax: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)
 * defaultCurrencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)
 * availableCurrencyCodes: [[CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!]
 * trackInventory: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * defaultTaxZoneId: [ID](/docs/graphql-api/admin/object-types#id)
 * defaultShippingZoneId: [ID](/docs/graphql-api/admin/object-types#id)
 * sellerId: [ID](/docs/graphql-api/admin/object-types#id)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCollectionInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * inheritFilters: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * filters: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]
 * translations: [[UpdateCollectionTranslationInput](/docs/graphql-api/admin/input-types#updatecollectiontranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCollectionTranslationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * slug: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCountryInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[CountryTranslationInput](/docs/graphql-api/admin/input-types#countrytranslationinput)!]
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerGroupInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * title: [String](/docs/graphql-api/admin/object-types#string)
 * firstName: [String](/docs/graphql-api/admin/object-types#string)
 * lastName: [String](/docs/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerNoteInput

{{% gql-fields %}}
 * noteId: [ID](/docs/graphql-api/admin/object-types#id)!
 * note: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## UpdateFacetInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[FacetTranslationInput](/docs/graphql-api/admin/input-types#facettranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateFacetValueInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[FacetValueTranslationInput](/docs/graphql-api/admin/input-types#facetvaluetranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateGlobalSettingsInput

{{% gql-fields %}}
 * availableLanguages: [[LanguageCode](/docs/graphql-api/admin/enums#languagecode)!]
 * trackInventory: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateOrderAddressInput

{{% gql-fields %}}
 * fullName: [String](/docs/graphql-api/admin/object-types#string)
 * company: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine1: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine2: [String](/docs/graphql-api/admin/object-types#string)
 * city: [String](/docs/graphql-api/admin/object-types#string)
 * province: [String](/docs/graphql-api/admin/object-types#string)
 * postalCode: [String](/docs/graphql-api/admin/object-types#string)
 * countryCode: [String](/docs/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## UpdateOrderInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateOrderNoteInput

{{% gql-fields %}}
 * noteId: [ID](/docs/graphql-api/admin/object-types#id)!
 * note: [String](/docs/graphql-api/admin/object-types#string)
 * isPublic: [Boolean](/docs/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## UpdatePaymentMethodInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * checker: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)
 * handler: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)
 * translations: [[PaymentMethodTranslationInput](/docs/graphql-api/admin/input-types#paymentmethodtranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * translations: [[ProductTranslationInput](/docs/graphql-api/admin/input-types#producttranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductOptionGroupInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[ProductOptionGroupTranslationInput](/docs/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductOptionInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[ProductOptionGroupTranslationInput](/docs/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductVariantInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * translations: [[ProductVariantTranslationInput](/docs/graphql-api/admin/input-types#productvarianttranslationinput)!]
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * optionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * sku: [String](/docs/graphql-api/admin/object-types#string)
 * taxCategoryId: [ID](/docs/graphql-api/admin/object-types#id)
* *// Sets the price for the ProductVariant in the Channel's default currency*
 * price: [Money](/docs/graphql-api/admin/object-types#money)
* *// Allows multiple prices to be set for the ProductVariant in different currencies.*
 * prices: [[ProductVariantPriceInput](/docs/graphql-api/admin/input-types#productvariantpriceinput)!]
 * featuredAssetId: [ID](/docs/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)
 * stockLevels: [[StockLevelInput](/docs/graphql-api/admin/input-types#stocklevelinput)!]
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * useGlobalOutOfStockThreshold: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * trackInventory: [GlobalFlag](/docs/graphql-api/admin/enums#globalflag)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdatePromotionInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * startsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/docs/graphql-api/admin/object-types#int)
 * conditions: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]
 * actions: [[ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)!]
 * translations: [[PromotionTranslationInput](/docs/graphql-api/admin/input-types#promotiontranslationinput)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProvinceInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * translations: [[ProvinceTranslationInput](/docs/graphql-api/admin/input-types#provincetranslationinput)!]
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateRoleInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * permissions: [[Permission](/docs/graphql-api/admin/enums#permission)!]
 * channelIds: [[ID](/docs/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## UpdateSellerInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateShippingMethodInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)
 * fulfillmentHandler: [String](/docs/graphql-api/admin/object-types#string)
 * checker: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)
 * calculator: [ConfigurableOperationInput](/docs/graphql-api/admin/input-types#configurableoperationinput)
 * translations: [[ShippingMethodTranslationInput](/docs/graphql-api/admin/input-types#shippingmethodtranslationinput)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateStockLocationInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateTagInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * value: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## UpdateTaxCategoryInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * isDefault: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateTaxRateInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * value: [Float](/docs/graphql-api/admin/object-types#float)
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * categoryId: [ID](/docs/graphql-api/admin/object-types#id)
 * zoneId: [ID](/docs/graphql-api/admin/object-types#id)
 * customerGroupId: [ID](/docs/graphql-api/admin/object-types#id)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateZoneInput

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ZoneFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/docs/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/docs/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/docs/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ZoneListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/docs/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/docs/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ZoneSortParameter](/docs/graphql-api/admin/input-types#zonesortparameter)
* *// Allows the results to be filtered*
 * filter: [ZoneFilterParameter](/docs/graphql-api/admin/input-types#zonefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/docs/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ZoneSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/docs/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


