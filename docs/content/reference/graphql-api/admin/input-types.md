---
title: "Input Objects"
weight: 4
date: 2023-07-04T11:02:07.589Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Input Objects

## AddItemInput

{{% gql-fields %}}
 * productVariantId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AddItemToDraftOrderInput

{{% gql-fields %}}
 * productVariantId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AddNoteToCustomerInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * note: [String](/graphql-api/admin/object-types#string)!
 * isPublic: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## AddNoteToOrderInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * note: [String](/graphql-api/admin/object-types#string)!
 * isPublic: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## AdjustDraftOrderLineInput

{{% gql-fields %}}
 * orderLineId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AdministratorFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * firstName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * lastName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * emailAddress: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## AdministratorListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [AdministratorSortParameter](/graphql-api/admin/input-types#administratorsortparameter)
* *// Allows the results to be filtered*
 * filter: [AdministratorFilterParameter](/graphql-api/admin/input-types#administratorfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## AdministratorPaymentInput

{{% gql-fields %}}
 * paymentMethod: [String](/graphql-api/admin/object-types#string)
 * metadata: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AdministratorRefundInput

{{% gql-fields %}}
 * paymentId: [ID](/graphql-api/admin/object-types#id)!
 * reason: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## AdministratorSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * firstName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * lastName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * emailAddress: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## AssetFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * fileSize: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * mimeType: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * width: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * height: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * source: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * preview: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## AssetListOptions

{{% gql-fields %}}
 * tags: [[String](/graphql-api/admin/object-types#string)!]
 * tagsOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [AssetSortParameter](/graphql-api/admin/input-types#assetsortparameter)
* *// Allows the results to be filtered*
 * filter: [AssetFilterParameter](/graphql-api/admin/input-types#assetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## AssetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * fileSize: [SortOrder](/graphql-api/admin/enums#sortorder)
 * mimeType: [SortOrder](/graphql-api/admin/enums#sortorder)
 * width: [SortOrder](/graphql-api/admin/enums#sortorder)
 * height: [SortOrder](/graphql-api/admin/enums#sortorder)
 * source: [SortOrder](/graphql-api/admin/enums#sortorder)
 * preview: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## AssignAssetsToChannelInput

{{% gql-fields %}}
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignCollectionsToChannelInput

{{% gql-fields %}}
 * collectionIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignFacetsToChannelInput

{{% gql-fields %}}
 * facetIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignPaymentMethodsToChannelInput

{{% gql-fields %}}
 * paymentMethodIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignProductVariantsToChannelInput

{{% gql-fields %}}
 * productVariantIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
 * priceFactor: [Float](/graphql-api/admin/object-types#float)
{{% /gql-fields %}}


## AssignProductsToChannelInput

{{% gql-fields %}}
 * productIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
 * priceFactor: [Float](/graphql-api/admin/object-types#float)
{{% /gql-fields %}}


## AssignPromotionsToChannelInput

{{% gql-fields %}}
 * promotionIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignShippingMethodsToChannelInput

{{% gql-fields %}}
 * shippingMethodIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AssignStockLocationsToChannelInput

{{% gql-fields %}}
 * stockLocationIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## AuthenticationInput

{{% gql-fields %}}
 * native: [NativeAuthInput](/graphql-api/admin/input-types#nativeauthinput)
{{% /gql-fields %}}


## BooleanListOperators

Operators for filtering on a list of Boolean fields

{{% gql-fields %}}
 * inList: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## BooleanOperators

Operators for filtering on a Boolean field

{{% gql-fields %}}
 * eq: [Boolean](/graphql-api/admin/object-types#boolean)
 * isNull: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## CancelOrderInput

{{% gql-fields %}}
* *// The id of the order to be cancelled*
 * orderId: [ID](/graphql-api/admin/object-types#id)!
* *// Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled*
 * lines: [[OrderLineInput](/graphql-api/admin/input-types#orderlineinput)!]
* *// Specify whether the shipping charges should also be cancelled. Defaults to false*
 * cancelShipping: [Boolean](/graphql-api/admin/object-types#boolean)
 * reason: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## ChannelFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * token: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * defaultLanguageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * currencyCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * defaultCurrencyCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * trackInventory: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * outOfStockThreshold: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * pricesIncludeTax: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## ChannelListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ChannelSortParameter](/graphql-api/admin/input-types#channelsortparameter)
* *// Allows the results to be filtered*
 * filter: [ChannelFilterParameter](/graphql-api/admin/input-types#channelfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ChannelSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * token: [SortOrder](/graphql-api/admin/enums#sortorder)
 * outOfStockThreshold: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CollectionFilterParameter

{{% gql-fields %}}
 * isPrivate: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * inheritFilters: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * slug: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * position: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * parentId: [IDOperators](/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## CollectionListOptions

{{% gql-fields %}}
 * topLevelOnly: [Boolean](/graphql-api/admin/object-types#boolean)
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CollectionSortParameter](/graphql-api/admin/input-types#collectionsortparameter)
* *// Allows the results to be filtered*
 * filter: [CollectionFilterParameter](/graphql-api/admin/input-types#collectionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CollectionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * slug: [SortOrder](/graphql-api/admin/enums#sortorder)
 * position: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ConfigArgInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
* *// A JSON stringified representation of the actual value*
 * value: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigurableOperationInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * arguments: [[ConfigArgInput](/graphql-api/admin/input-types#configarginput)!]!
{{% /gql-fields %}}


## CoordinateInput

{{% gql-fields %}}
 * x: [Float](/graphql-api/admin/object-types#float)!
 * y: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## CountryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * parentId: [IDOperators](/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## CountryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CountrySortParameter](/graphql-api/admin/input-types#countrysortparameter)
* *// Allows the results to be filtered*
 * filter: [CountryFilterParameter](/graphql-api/admin/input-types#countryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CountrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * type: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CountryTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAddressInput

{{% gql-fields %}}
 * fullName: [String](/graphql-api/admin/object-types#string)
 * company: [String](/graphql-api/admin/object-types#string)
 * streetLine1: [String](/graphql-api/admin/object-types#string)!
 * streetLine2: [String](/graphql-api/admin/object-types#string)
 * city: [String](/graphql-api/admin/object-types#string)
 * province: [String](/graphql-api/admin/object-types#string)
 * postalCode: [String](/graphql-api/admin/object-types#string)
 * countryCode: [String](/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAdministratorInput

{{% gql-fields %}}
 * firstName: [String](/graphql-api/admin/object-types#string)!
 * lastName: [String](/graphql-api/admin/object-types#string)!
 * emailAddress: [String](/graphql-api/admin/object-types#string)!
 * password: [String](/graphql-api/admin/object-types#string)!
 * roleIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateAssetInput

{{% gql-fields %}}
 * file: [Upload](/graphql-api/admin/object-types#upload)!
 * tags: [[String](/graphql-api/admin/object-types#string)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateChannelInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * token: [String](/graphql-api/admin/object-types#string)!
 * defaultLanguageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/graphql-api/admin/enums#languagecode)!]
 * pricesIncludeTax: [Boolean](/graphql-api/admin/object-types#boolean)!
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)
 * defaultCurrencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)
 * availableCurrencyCodes: [[CurrencyCode](/graphql-api/admin/enums#currencycode)!]
 * trackInventory: [Boolean](/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * defaultTaxZoneId: [ID](/graphql-api/admin/object-types#id)!
 * defaultShippingZoneId: [ID](/graphql-api/admin/object-types#id)!
 * sellerId: [ID](/graphql-api/admin/object-types#id)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCollectionInput

{{% gql-fields %}}
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * parentId: [ID](/graphql-api/admin/object-types#id)
 * inheritFilters: [Boolean](/graphql-api/admin/object-types#boolean)
 * filters: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]!
 * translations: [[CreateCollectionTranslationInput](/graphql-api/admin/input-types#createcollectiontranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCollectionTranslationInput

{{% gql-fields %}}
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCountryInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[CountryTranslationInput](/graphql-api/admin/input-types#countrytranslationinput)!]!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCustomerGroupInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * customerIds: [[ID](/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateCustomerInput

{{% gql-fields %}}
 * title: [String](/graphql-api/admin/object-types#string)
 * firstName: [String](/graphql-api/admin/object-types#string)!
 * lastName: [String](/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * emailAddress: [String](/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)!
 * translations: [[FacetTranslationInput](/graphql-api/admin/input-types#facettranslationinput)!]!
 * values: [[CreateFacetValueWithFacetInput](/graphql-api/admin/input-types#createfacetvaluewithfacetinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetValueInput

{{% gql-fields %}}
 * facetId: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslationInput](/graphql-api/admin/input-types#facetvaluetranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateFacetValueWithFacetInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslationInput](/graphql-api/admin/input-types#facetvaluetranslationinput)!]!
{{% /gql-fields %}}


## CreateGroupOptionInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
{{% /gql-fields %}}


## CreatePaymentMethodInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * checker: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)
 * handler: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
 * translations: [[PaymentMethodTranslationInput](/graphql-api/admin/input-types#paymentmethodtranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductInput

{{% gql-fields %}}
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]
 * translations: [[ProductTranslationInput](/graphql-api/admin/input-types#producttranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductOptionGroupInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
 * options: [[CreateGroupOptionInput](/graphql-api/admin/input-types#creategroupoptioninput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductOptionInput

{{% gql-fields %}}
 * productOptionGroupId: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionGroupTranslationInput](/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductVariantInput

{{% gql-fields %}}
 * productId: [ID](/graphql-api/admin/object-types#id)!
 * translations: [[ProductVariantTranslationInput](/graphql-api/admin/input-types#productvarianttranslationinput)!]!
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]
 * sku: [String](/graphql-api/admin/object-types#string)!
 * price: [Money](/graphql-api/admin/object-types#money)
 * taxCategoryId: [ID](/graphql-api/admin/object-types#id)
 * optionIds: [[ID](/graphql-api/admin/object-types#id)!]
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)
 * stockLevels: [[StockLevelInput](/graphql-api/admin/input-types#stocklevelinput)!]
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * useGlobalOutOfStockThreshold: [Boolean](/graphql-api/admin/object-types#boolean)
 * trackInventory: [GlobalFlag](/graphql-api/admin/enums#globalflag)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProductVariantOptionInput

{{% gql-fields %}}
 * optionGroupId: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[ProductOptionTranslationInput](/graphql-api/admin/input-types#productoptiontranslationinput)!]!
{{% /gql-fields %}}


## CreatePromotionInput

{{% gql-fields %}}
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * startsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/graphql-api/admin/object-types#int)
 * conditions: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]!
 * actions: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]!
 * translations: [[PromotionTranslationInput](/graphql-api/admin/input-types#promotiontranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateProvinceInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[ProvinceTranslationInput](/graphql-api/admin/input-types#provincetranslationinput)!]!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateRoleInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/graphql-api/admin/enums#permission)!]!
 * channelIds: [[ID](/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## CreateSellerInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateShippingMethodInput

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * fulfillmentHandler: [String](/graphql-api/admin/object-types#string)!
 * checker: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
 * calculator: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
 * translations: [[ShippingMethodTranslationInput](/graphql-api/admin/input-types#shippingmethodtranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateStockLocationInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateTagInput

{{% gql-fields %}}
 * value: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CreateTaxCategoryInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * isDefault: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateTaxRateInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * value: [Float](/graphql-api/admin/object-types#float)!
 * categoryId: [ID](/graphql-api/admin/object-types#id)!
 * zoneId: [ID](/graphql-api/admin/object-types#id)!
 * customerGroupId: [ID](/graphql-api/admin/object-types#id)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CreateZoneInput

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * memberIds: [[ID](/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerFilterParameter

{{% gql-fields %}}
 * postalCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * title: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * firstName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * lastName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * phoneNumber: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * emailAddress: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerGroupFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## CustomerGroupListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerGroupSortParameter](/graphql-api/admin/input-types#customergroupsortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerGroupFilterParameter](/graphql-api/admin/input-types#customergroupfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerGroupSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## CustomerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [CustomerSortParameter](/graphql-api/admin/input-types#customersortparameter)
* *// Allows the results to be filtered*
 * filter: [CustomerFilterParameter](/graphql-api/admin/input-types#customerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## CustomerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * title: [SortOrder](/graphql-api/admin/enums#sortorder)
 * firstName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * lastName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * phoneNumber: [SortOrder](/graphql-api/admin/enums#sortorder)
 * emailAddress: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## DateListOperators

Operators for filtering on a list of Date fields

{{% gql-fields %}}
 * inList: [DateTime](/graphql-api/admin/object-types#datetime)!
{{% /gql-fields %}}


## DateOperators

Operators for filtering on a DateTime field

{{% gql-fields %}}
 * eq: [DateTime](/graphql-api/admin/object-types#datetime)
 * before: [DateTime](/graphql-api/admin/object-types#datetime)
 * after: [DateTime](/graphql-api/admin/object-types#datetime)
 * between: [DateRange](/graphql-api/admin/input-types#daterange)
 * isNull: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DateRange

{{% gql-fields %}}
 * start: [DateTime](/graphql-api/admin/object-types#datetime)!
 * end: [DateTime](/graphql-api/admin/object-types#datetime)!
{{% /gql-fields %}}


## DeleteAssetInput

{{% gql-fields %}}
 * assetId: [ID](/graphql-api/admin/object-types#id)!
 * force: [Boolean](/graphql-api/admin/object-types#boolean)
 * deleteFromAllChannels: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DeleteAssetsInput

{{% gql-fields %}}
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * force: [Boolean](/graphql-api/admin/object-types#boolean)
 * deleteFromAllChannels: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## DeleteStockLocationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * transferToLocationId: [ID](/graphql-api/admin/object-types#id)
{{% /gql-fields %}}


## FacetFilterParameter

{{% gql-fields %}}
 * isPrivate: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## FacetListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetSortParameter](/graphql-api/admin/input-types#facetsortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetFilterParameter](/graphql-api/admin/input-types#facetfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## FacetSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## FacetTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetValueFilterInput

Used to construct boolean expressions for filtering search results
by FacetValue ID. Examples:

* ID=1 OR ID=2: `{ facetValueFilters: [{ or: [1,2] }] }`
* ID=1 AND ID=2: `{ facetValueFilters: [{ and: 1 }, { and: 2 }] }`
* ID=1 AND (ID=2 OR ID=3): `{ facetValueFilters: [{ and: 1 }, { or: [2,3] }] }`

{{% gql-fields %}}
 * and: [ID](/graphql-api/admin/object-types#id)
 * or: [[ID](/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## FacetValueFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## FacetValueListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [FacetValueSortParameter](/graphql-api/admin/input-types#facetvaluesortparameter)
* *// Allows the results to be filtered*
 * filter: [FacetValueFilterParameter](/graphql-api/admin/input-types#facetvaluefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## FacetValueSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## FacetValueTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FulfillOrderInput

{{% gql-fields %}}
 * lines: [[OrderLineInput](/graphql-api/admin/input-types#orderlineinput)!]!
 * handler: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
{{% /gql-fields %}}


## HistoryEntryFilterParameter

{{% gql-fields %}}
 * isPublic: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * type: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## HistoryEntryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [HistoryEntrySortParameter](/graphql-api/admin/input-types#historyentrysortparameter)
* *// Allows the results to be filtered*
 * filter: [HistoryEntryFilterParameter](/graphql-api/admin/input-types#historyentryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## HistoryEntrySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## IDListOperators

Operators for filtering on a list of ID fields

{{% gql-fields %}}
 * inList: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## IDOperators

Operators for filtering on an ID field

{{% gql-fields %}}
 * eq: [String](/graphql-api/admin/object-types#string)
 * notEq: [String](/graphql-api/admin/object-types#string)
 * in: [[String](/graphql-api/admin/object-types#string)!]
 * notIn: [[String](/graphql-api/admin/object-types#string)!]
 * isNull: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## JobFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * startedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * settledAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * queueName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * state: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * progress: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * isSettled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * duration: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * retries: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * attempts: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## JobListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [JobSortParameter](/graphql-api/admin/input-types#jobsortparameter)
* *// Allows the results to be filtered*
 * filter: [JobFilterParameter](/graphql-api/admin/input-types#jobfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## JobSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * startedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * settledAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * queueName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * progress: [SortOrder](/graphql-api/admin/enums#sortorder)
 * duration: [SortOrder](/graphql-api/admin/enums#sortorder)
 * retries: [SortOrder](/graphql-api/admin/enums#sortorder)
 * attempts: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ManualPaymentInput

{{% gql-fields %}}
 * orderId: [ID](/graphql-api/admin/object-types#id)!
 * method: [String](/graphql-api/admin/object-types#string)!
 * transactionId: [String](/graphql-api/admin/object-types#string)
 * metadata: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## MetricSummaryInput

{{% gql-fields %}}
 * interval: [MetricInterval](/graphql-api/admin/enums#metricinterval)!
 * types: [[MetricType](/graphql-api/admin/enums#metrictype)!]!
 * refresh: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## ModifyOrderInput

{{% gql-fields %}}
 * dryRun: [Boolean](/graphql-api/admin/object-types#boolean)!
 * orderId: [ID](/graphql-api/admin/object-types#id)!
 * addItems: [[AddItemInput](/graphql-api/admin/input-types#additeminput)!]
 * adjustOrderLines: [[OrderLineInput](/graphql-api/admin/input-types#orderlineinput)!]
 * surcharges: [[SurchargeInput](/graphql-api/admin/input-types#surchargeinput)!]
 * updateShippingAddress: [UpdateOrderAddressInput](/graphql-api/admin/input-types#updateorderaddressinput)
 * updateBillingAddress: [UpdateOrderAddressInput](/graphql-api/admin/input-types#updateorderaddressinput)
 * note: [String](/graphql-api/admin/object-types#string)
 * refund: [AdministratorRefundInput](/graphql-api/admin/input-types#administratorrefundinput)
 * options: [ModifyOrderOptions](/graphql-api/admin/input-types#modifyorderoptions)
 * couponCodes: [[String](/graphql-api/admin/object-types#string)!]
{{% /gql-fields %}}


## ModifyOrderOptions

{{% gql-fields %}}
 * freezePromotions: [Boolean](/graphql-api/admin/object-types#boolean)
 * recalculateShipping: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## MoveCollectionInput

{{% gql-fields %}}
 * collectionId: [ID](/graphql-api/admin/object-types#id)!
 * parentId: [ID](/graphql-api/admin/object-types#id)!
 * index: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## NativeAuthInput

{{% gql-fields %}}
 * username: [String](/graphql-api/admin/object-types#string)!
 * password: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NumberListOperators

Operators for filtering on a list of Number fields

{{% gql-fields %}}
 * inList: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## NumberOperators

Operators for filtering on a Int or Float field

{{% gql-fields %}}
 * eq: [Float](/graphql-api/admin/object-types#float)
 * lt: [Float](/graphql-api/admin/object-types#float)
 * lte: [Float](/graphql-api/admin/object-types#float)
 * gt: [Float](/graphql-api/admin/object-types#float)
 * gte: [Float](/graphql-api/admin/object-types#float)
 * between: [NumberRange](/graphql-api/admin/input-types#numberrange)
 * isNull: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## NumberRange

{{% gql-fields %}}
 * start: [Float](/graphql-api/admin/object-types#float)!
 * end: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## OrderFilterParameter

{{% gql-fields %}}
 * customerLastName: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * transactionId: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * aggregateOrderId: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * type: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * orderPlacedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * state: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * active: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * totalQuantity: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * subTotal: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * subTotalWithTax: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * currencyCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * shipping: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * shippingWithTax: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * total: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * totalWithTax: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## OrderLineInput

{{% gql-fields %}}
 * orderLineId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [OrderSortParameter](/graphql-api/admin/input-types#ordersortparameter)
* *// Allows the results to be filtered*
 * filter: [OrderFilterParameter](/graphql-api/admin/input-types#orderfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## OrderSortParameter

{{% gql-fields %}}
 * customerLastName: [SortOrder](/graphql-api/admin/enums#sortorder)
 * transactionId: [SortOrder](/graphql-api/admin/enums#sortorder)
 * aggregateOrderId: [SortOrder](/graphql-api/admin/enums#sortorder)
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * orderPlacedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * state: [SortOrder](/graphql-api/admin/enums#sortorder)
 * totalQuantity: [SortOrder](/graphql-api/admin/enums#sortorder)
 * subTotal: [SortOrder](/graphql-api/admin/enums#sortorder)
 * subTotalWithTax: [SortOrder](/graphql-api/admin/enums#sortorder)
 * shipping: [SortOrder](/graphql-api/admin/enums#sortorder)
 * shippingWithTax: [SortOrder](/graphql-api/admin/enums#sortorder)
 * total: [SortOrder](/graphql-api/admin/enums#sortorder)
 * totalWithTax: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PaymentMethodFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## PaymentMethodListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [PaymentMethodSortParameter](/graphql-api/admin/input-types#paymentmethodsortparameter)
* *// Allows the results to be filtered*
 * filter: [PaymentMethodFilterParameter](/graphql-api/admin/input-types#paymentmethodfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## PaymentMethodSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PaymentMethodTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PreviewCollectionVariantsInput

{{% gql-fields %}}
 * parentId: [ID](/graphql-api/admin/object-types#id)
 * inheritFilters: [Boolean](/graphql-api/admin/object-types#boolean)!
 * filters: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]!
{{% /gql-fields %}}


## ProductFilterParameter

{{% gql-fields %}}
 * facetValueId: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * slug: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ProductListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductSortParameter](/graphql-api/admin/input-types#productsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductFilterParameter](/graphql-api/admin/input-types#productfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProductOptionGroupTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * slug: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProductTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * slug: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductVariantFilterParameter

{{% gql-fields %}}
 * facetValueId: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * trackInventory: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * stockOnHand: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * stockAllocated: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * outOfStockThreshold: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * useGlobalOutOfStockThreshold: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * productId: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * sku: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * price: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * currencyCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * priceWithTax: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * stockLevel: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ProductVariantListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProductVariantSortParameter](/graphql-api/admin/input-types#productvariantsortparameter)
* *// Allows the results to be filtered*
 * filter: [ProductVariantFilterParameter](/graphql-api/admin/input-types#productvariantfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProductVariantPriceInput

Used to set up update the price of a ProductVariant in a particular Channel.
If the `delete` flag is `true`, the price will be deleted for the given Channel.

{{% gql-fields %}}
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * price: [Money](/graphql-api/admin/object-types#money)!
 * delete: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## ProductVariantSortParameter

{{% gql-fields %}}
 * stockOnHand: [SortOrder](/graphql-api/admin/enums#sortorder)
 * stockAllocated: [SortOrder](/graphql-api/admin/enums#sortorder)
 * outOfStockThreshold: [SortOrder](/graphql-api/admin/enums#sortorder)
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * productId: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * sku: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * price: [SortOrder](/graphql-api/admin/enums#sortorder)
 * priceWithTax: [SortOrder](/graphql-api/admin/enums#sortorder)
 * stockLevel: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProductVariantTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PromotionFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * startsAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * endsAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * couponCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * perCustomerUsageLimit: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## PromotionListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [PromotionSortParameter](/graphql-api/admin/input-types#promotionsortparameter)
* *// Allows the results to be filtered*
 * filter: [PromotionFilterParameter](/graphql-api/admin/input-types#promotionfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## PromotionSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * startsAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * endsAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * couponCode: [SortOrder](/graphql-api/admin/enums#sortorder)
 * perCustomerUsageLimit: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## PromotionTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProvinceFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * type: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * parentId: [IDOperators](/graphql-api/admin/input-types#idoperators)
{{% /gql-fields %}}


## ProvinceListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ProvinceSortParameter](/graphql-api/admin/input-types#provincesortparameter)
* *// Allows the results to be filtered*
 * filter: [ProvinceFilterParameter](/graphql-api/admin/input-types#provincefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ProvinceSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * type: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * parentId: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ProvinceTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## RefundOrderInput

{{% gql-fields %}}
 * lines: [[OrderLineInput](/graphql-api/admin/input-types#orderlineinput)!]!
 * shipping: [Money](/graphql-api/admin/object-types#money)!
 * adjustment: [Money](/graphql-api/admin/object-types#money)!
 * paymentId: [ID](/graphql-api/admin/object-types#id)!
 * reason: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## RemoveCollectionsFromChannelInput

{{% gql-fields %}}
 * collectionIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveFacetsFromChannelInput

{{% gql-fields %}}
 * facetIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
 * force: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## RemovePaymentMethodsFromChannelInput

{{% gql-fields %}}
 * paymentMethodIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveProductVariantsFromChannelInput

{{% gql-fields %}}
 * productVariantIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveProductsFromChannelInput

{{% gql-fields %}}
 * productIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemovePromotionsFromChannelInput

{{% gql-fields %}}
 * promotionIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveShippingMethodsFromChannelInput

{{% gql-fields %}}
 * shippingMethodIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RemoveStockLocationsFromChannelInput

{{% gql-fields %}}
 * stockLocationIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * channelId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RoleFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## RoleListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [RoleSortParameter](/graphql-api/admin/input-types#rolesortparameter)
* *// Allows the results to be filtered*
 * filter: [RoleFilterParameter](/graphql-api/admin/input-types#rolefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## RoleSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SearchInput

{{% gql-fields %}}
 * term: [String](/graphql-api/admin/object-types#string)
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]
 * facetValueOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
 * facetValueFilters: [[FacetValueFilterInput](/graphql-api/admin/input-types#facetvaluefilterinput)!]
 * collectionId: [ID](/graphql-api/admin/object-types#id)
 * collectionSlug: [String](/graphql-api/admin/object-types#string)
 * groupByProduct: [Boolean](/graphql-api/admin/object-types#boolean)
 * take: [Int](/graphql-api/admin/object-types#int)
 * skip: [Int](/graphql-api/admin/object-types#int)
 * sort: [SearchResultSortParameter](/graphql-api/admin/input-types#searchresultsortparameter)
{{% /gql-fields %}}


## SearchResultSortParameter

{{% gql-fields %}}
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * price: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SellerFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## SellerListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [SellerSortParameter](/graphql-api/admin/input-types#sellersortparameter)
* *// Allows the results to be filtered*
 * filter: [SellerFilterParameter](/graphql-api/admin/input-types#sellerfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## SellerSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## SettleRefundInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * transactionId: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ShippingMethodFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * languageCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * code: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * fulfillmentHandlerCode: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ShippingMethodListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ShippingMethodSortParameter](/graphql-api/admin/input-types#shippingmethodsortparameter)
* *// Allows the results to be filtered*
 * filter: [ShippingMethodFilterParameter](/graphql-api/admin/input-types#shippingmethodfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ShippingMethodSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * code: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
 * fulfillmentHandlerCode: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## ShippingMethodTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StockLevelInput

{{% gql-fields %}}
 * stockLocationId: [ID](/graphql-api/admin/object-types#id)!
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockLocationFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * description: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## StockLocationListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [StockLocationSortParameter](/graphql-api/admin/input-types#stocklocationsortparameter)
* *// Allows the results to be filtered*
 * filter: [StockLocationFilterParameter](/graphql-api/admin/input-types#stocklocationfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## StockLocationSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * description: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## StockMovementListOptions

{{% gql-fields %}}
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)
 * skip: [Int](/graphql-api/admin/object-types#int)
 * take: [Int](/graphql-api/admin/object-types#int)
{{% /gql-fields %}}


## StringListOperators

Operators for filtering on a list of String fields

{{% gql-fields %}}
 * inList: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## StringOperators

Operators for filtering on a String field

{{% gql-fields %}}
 * eq: [String](/graphql-api/admin/object-types#string)
 * notEq: [String](/graphql-api/admin/object-types#string)
 * contains: [String](/graphql-api/admin/object-types#string)
 * notContains: [String](/graphql-api/admin/object-types#string)
 * in: [[String](/graphql-api/admin/object-types#string)!]
 * notIn: [[String](/graphql-api/admin/object-types#string)!]
 * regex: [String](/graphql-api/admin/object-types#string)
 * isNull: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## SurchargeInput

{{% gql-fields %}}
 * description: [String](/graphql-api/admin/object-types#string)!
 * sku: [String](/graphql-api/admin/object-types#string)
 * price: [Money](/graphql-api/admin/object-types#money)!
 * priceIncludesTax: [Boolean](/graphql-api/admin/object-types#boolean)!
 * taxRate: [Float](/graphql-api/admin/object-types#float)
 * taxDescription: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## TagFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * value: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## TagListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TagSortParameter](/graphql-api/admin/input-types#tagsortparameter)
* *// Allows the results to be filtered*
 * filter: [TagFilterParameter](/graphql-api/admin/input-types#tagfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TagSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * value: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TaxCategoryFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * isDefault: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
{{% /gql-fields %}}


## TaxCategoryListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TaxCategorySortParameter](/graphql-api/admin/input-types#taxcategorysortparameter)
* *// Allows the results to be filtered*
 * filter: [TaxCategoryFilterParameter](/graphql-api/admin/input-types#taxcategoryfilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TaxCategorySortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TaxRateFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
 * enabled: [BooleanOperators](/graphql-api/admin/input-types#booleanoperators)
 * value: [NumberOperators](/graphql-api/admin/input-types#numberoperators)
{{% /gql-fields %}}


## TaxRateListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [TaxRateSortParameter](/graphql-api/admin/input-types#taxratesortparameter)
* *// Allows the results to be filtered*
 * filter: [TaxRateFilterParameter](/graphql-api/admin/input-types#taxratefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## TaxRateSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
 * value: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


## TestEligibleShippingMethodsInput

{{% gql-fields %}}
 * shippingAddress: [CreateAddressInput](/graphql-api/admin/input-types#createaddressinput)!
 * lines: [[TestShippingMethodOrderLineInput](/graphql-api/admin/input-types#testshippingmethodorderlineinput)!]!
{{% /gql-fields %}}


## TestShippingMethodInput

{{% gql-fields %}}
 * checker: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
 * calculator: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!
 * shippingAddress: [CreateAddressInput](/graphql-api/admin/input-types#createaddressinput)!
 * lines: [[TestShippingMethodOrderLineInput](/graphql-api/admin/input-types#testshippingmethodorderlineinput)!]!
{{% /gql-fields %}}


## TestShippingMethodOrderLineInput

{{% gql-fields %}}
 * productVariantId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## UpdateActiveAdministratorInput

{{% gql-fields %}}
 * firstName: [String](/graphql-api/admin/object-types#string)
 * lastName: [String](/graphql-api/admin/object-types#string)
 * emailAddress: [String](/graphql-api/admin/object-types#string)
 * password: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAddressInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * fullName: [String](/graphql-api/admin/object-types#string)
 * company: [String](/graphql-api/admin/object-types#string)
 * streetLine1: [String](/graphql-api/admin/object-types#string)
 * streetLine2: [String](/graphql-api/admin/object-types#string)
 * city: [String](/graphql-api/admin/object-types#string)
 * province: [String](/graphql-api/admin/object-types#string)
 * postalCode: [String](/graphql-api/admin/object-types#string)
 * countryCode: [String](/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAdministratorInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * firstName: [String](/graphql-api/admin/object-types#string)
 * lastName: [String](/graphql-api/admin/object-types#string)
 * emailAddress: [String](/graphql-api/admin/object-types#string)
 * password: [String](/graphql-api/admin/object-types#string)
 * roleIds: [[ID](/graphql-api/admin/object-types#id)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateAssetInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * focalPoint: [CoordinateInput](/graphql-api/admin/input-types#coordinateinput)
 * tags: [[String](/graphql-api/admin/object-types#string)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateChannelInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * token: [String](/graphql-api/admin/object-types#string)
 * defaultLanguageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)
 * availableLanguageCodes: [[LanguageCode](/graphql-api/admin/enums#languagecode)!]
 * pricesIncludeTax: [Boolean](/graphql-api/admin/object-types#boolean)
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)
 * defaultCurrencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)
 * availableCurrencyCodes: [[CurrencyCode](/graphql-api/admin/enums#currencycode)!]
 * trackInventory: [Boolean](/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * defaultTaxZoneId: [ID](/graphql-api/admin/object-types#id)
 * defaultShippingZoneId: [ID](/graphql-api/admin/object-types#id)
 * sellerId: [ID](/graphql-api/admin/object-types#id)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCollectionInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * parentId: [ID](/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * inheritFilters: [Boolean](/graphql-api/admin/object-types#boolean)
 * filters: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]
 * translations: [[UpdateCollectionTranslationInput](/graphql-api/admin/input-types#updatecollectiontranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCollectionTranslationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)
 * slug: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCountryInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[CountryTranslationInput](/graphql-api/admin/input-types#countrytranslationinput)!]
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerGroupInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * title: [String](/graphql-api/admin/object-types#string)
 * firstName: [String](/graphql-api/admin/object-types#string)
 * lastName: [String](/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * emailAddress: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateCustomerNoteInput

{{% gql-fields %}}
 * noteId: [ID](/graphql-api/admin/object-types#id)!
 * note: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## UpdateFacetInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[FacetTranslationInput](/graphql-api/admin/input-types#facettranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateFacetValueInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[FacetValueTranslationInput](/graphql-api/admin/input-types#facetvaluetranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateGlobalSettingsInput

{{% gql-fields %}}
 * availableLanguages: [[LanguageCode](/graphql-api/admin/enums#languagecode)!]
 * trackInventory: [Boolean](/graphql-api/admin/object-types#boolean)
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateOrderAddressInput

{{% gql-fields %}}
 * fullName: [String](/graphql-api/admin/object-types#string)
 * company: [String](/graphql-api/admin/object-types#string)
 * streetLine1: [String](/graphql-api/admin/object-types#string)
 * streetLine2: [String](/graphql-api/admin/object-types#string)
 * city: [String](/graphql-api/admin/object-types#string)
 * province: [String](/graphql-api/admin/object-types#string)
 * postalCode: [String](/graphql-api/admin/object-types#string)
 * countryCode: [String](/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## UpdateOrderInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateOrderNoteInput

{{% gql-fields %}}
 * noteId: [ID](/graphql-api/admin/object-types#id)!
 * note: [String](/graphql-api/admin/object-types#string)
 * isPublic: [Boolean](/graphql-api/admin/object-types#boolean)
{{% /gql-fields %}}


## UpdatePaymentMethodInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * checker: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)
 * handler: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)
 * translations: [[PaymentMethodTranslationInput](/graphql-api/admin/input-types#paymentmethodtranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]
 * translations: [[ProductTranslationInput](/graphql-api/admin/input-types#producttranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductOptionGroupInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[ProductOptionGroupTranslationInput](/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductOptionInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[ProductOptionGroupTranslationInput](/graphql-api/admin/input-types#productoptiongrouptranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProductVariantInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * translations: [[ProductVariantTranslationInput](/graphql-api/admin/input-types#productvarianttranslationinput)!]
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]
 * optionIds: [[ID](/graphql-api/admin/object-types#id)!]
 * sku: [String](/graphql-api/admin/object-types#string)
 * taxCategoryId: [ID](/graphql-api/admin/object-types#id)
* *// Sets the price for the ProductVariant in the Channel's default currency*
 * price: [Money](/graphql-api/admin/object-types#money)
* *// Allows multiple prices to be set for the ProductVariant in different currencies.*
 * prices: [[ProductVariantPriceInput](/graphql-api/admin/input-types#productvariantpriceinput)!]
 * featuredAssetId: [ID](/graphql-api/admin/object-types#id)
 * assetIds: [[ID](/graphql-api/admin/object-types#id)!]
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)
 * stockLevels: [[StockLevelInput](/graphql-api/admin/input-types#stocklevelinput)!]
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * useGlobalOutOfStockThreshold: [Boolean](/graphql-api/admin/object-types#boolean)
 * trackInventory: [GlobalFlag](/graphql-api/admin/enums#globalflag)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdatePromotionInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * startsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/graphql-api/admin/object-types#int)
 * conditions: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]
 * actions: [[ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)!]
 * translations: [[PromotionTranslationInput](/graphql-api/admin/input-types#promotiontranslationinput)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateProvinceInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * translations: [[ProvinceTranslationInput](/graphql-api/admin/input-types#provincetranslationinput)!]
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateRoleInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * permissions: [[Permission](/graphql-api/admin/enums#permission)!]
 * channelIds: [[ID](/graphql-api/admin/object-types#id)!]
{{% /gql-fields %}}


## UpdateSellerInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateShippingMethodInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)
 * fulfillmentHandler: [String](/graphql-api/admin/object-types#string)
 * checker: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)
 * calculator: [ConfigurableOperationInput](/graphql-api/admin/input-types#configurableoperationinput)
 * translations: [[ShippingMethodTranslationInput](/graphql-api/admin/input-types#shippingmethodtranslationinput)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateStockLocationInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateTagInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * value: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## UpdateTaxCategoryInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * isDefault: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateTaxRateInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * value: [Float](/graphql-api/admin/object-types#float)
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)
 * categoryId: [ID](/graphql-api/admin/object-types#id)
 * zoneId: [ID](/graphql-api/admin/object-types#id)
 * customerGroupId: [ID](/graphql-api/admin/object-types#id)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## UpdateZoneInput

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ZoneFilterParameter

{{% gql-fields %}}
 * id: [IDOperators](/graphql-api/admin/input-types#idoperators)
 * createdAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * updatedAt: [DateOperators](/graphql-api/admin/input-types#dateoperators)
 * name: [StringOperators](/graphql-api/admin/input-types#stringoperators)
{{% /gql-fields %}}


## ZoneListOptions

{{% gql-fields %}}
* *// Skips the first n results, for use in pagination*
 * skip: [Int](/graphql-api/admin/object-types#int)
* *// Takes n results, for use in pagination*
 * take: [Int](/graphql-api/admin/object-types#int)
* *// Specifies which properties to sort the results by*
 * sort: [ZoneSortParameter](/graphql-api/admin/input-types#zonesortparameter)
* *// Allows the results to be filtered*
 * filter: [ZoneFilterParameter](/graphql-api/admin/input-types#zonefilterparameter)
* *// Specifies whether multiple "filter" arguments should be combines with a logical AND or OR operation. Defaults to AND.*
 * filterOperator: [LogicalOperator](/graphql-api/admin/enums#logicaloperator)
{{% /gql-fields %}}


## ZoneSortParameter

{{% gql-fields %}}
 * id: [SortOrder](/graphql-api/admin/enums#sortorder)
 * createdAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * updatedAt: [SortOrder](/graphql-api/admin/enums#sortorder)
 * name: [SortOrder](/graphql-api/admin/enums#sortorder)
{{% /gql-fields %}}


