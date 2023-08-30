---
title: "Queries"
weight: 1
date: 2023-07-04T11:02:07.589Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Queries

## activeAdministrator
{{% gql-fields %}}
 * activeAdministrator: [Administrator](/graphql-api/admin/object-types#administrator)
{{% /gql-fields %}}



## activeChannel
{{% gql-fields %}}
 * activeChannel: [Channel](/graphql-api/admin/object-types#channel)!
{{% /gql-fields %}}



## administrator
{{% gql-fields %}}
 * administrator(id: [ID](/graphql-api/admin/object-types#id)!): [Administrator](/graphql-api/admin/object-types#administrator)
{{% /gql-fields %}}



## administrators
{{% gql-fields %}}
 * administrators(options: [AdministratorListOptions](/graphql-api/admin/input-types#administratorlistoptions)): [AdministratorList](/graphql-api/admin/object-types#administratorlist)!
{{% /gql-fields %}}



## asset
Get a single Asset by id

{{% gql-fields %}}
 * asset(id: [ID](/graphql-api/admin/object-types#id)!): [Asset](/graphql-api/admin/object-types#asset)
{{% /gql-fields %}}



## assets
Get a list of Assets

{{% gql-fields %}}
 * assets(options: [AssetListOptions](/graphql-api/admin/input-types#assetlistoptions)): [AssetList](/graphql-api/admin/object-types#assetlist)!
{{% /gql-fields %}}



## channel
{{% gql-fields %}}
 * channel(id: [ID](/graphql-api/admin/object-types#id)!): [Channel](/graphql-api/admin/object-types#channel)
{{% /gql-fields %}}



## channels
{{% gql-fields %}}
 * channels(options: [ChannelListOptions](/graphql-api/admin/input-types#channellistoptions)): [ChannelList](/graphql-api/admin/object-types#channellist)!
{{% /gql-fields %}}



## collection
Get a Collection either by id or slug. If neither id nor slug is specified, an error will result.

{{% gql-fields %}}
 * collection(id: [ID](/graphql-api/admin/object-types#id), slug: [String](/graphql-api/admin/object-types#string)): [Collection](/graphql-api/admin/object-types#collection)
{{% /gql-fields %}}



## collectionFilters
{{% gql-fields %}}
 * collectionFilters: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## collections
{{% gql-fields %}}
 * collections(options: [CollectionListOptions](/graphql-api/admin/input-types#collectionlistoptions)): [CollectionList](/graphql-api/admin/object-types#collectionlist)!
{{% /gql-fields %}}



## countries
{{% gql-fields %}}
 * countries(options: [CountryListOptions](/graphql-api/admin/input-types#countrylistoptions)): [CountryList](/graphql-api/admin/object-types#countrylist)!
{{% /gql-fields %}}



## country
{{% gql-fields %}}
 * country(id: [ID](/graphql-api/admin/object-types#id)!): [Country](/graphql-api/admin/object-types#country)
{{% /gql-fields %}}



## customer
{{% gql-fields %}}
 * customer(id: [ID](/graphql-api/admin/object-types#id)!): [Customer](/graphql-api/admin/object-types#customer)
{{% /gql-fields %}}



## customerGroup
{{% gql-fields %}}
 * customerGroup(id: [ID](/graphql-api/admin/object-types#id)!): [CustomerGroup](/graphql-api/admin/object-types#customergroup)
{{% /gql-fields %}}



## customerGroups
{{% gql-fields %}}
 * customerGroups(options: [CustomerGroupListOptions](/graphql-api/admin/input-types#customergrouplistoptions)): [CustomerGroupList](/graphql-api/admin/object-types#customergrouplist)!
{{% /gql-fields %}}



## customers
{{% gql-fields %}}
 * customers(options: [CustomerListOptions](/graphql-api/admin/input-types#customerlistoptions)): [CustomerList](/graphql-api/admin/object-types#customerlist)!
{{% /gql-fields %}}



## eligibleShippingMethodsForDraftOrder
Returns a list of eligible shipping methods for the draft Order

{{% gql-fields %}}
 * eligibleShippingMethodsForDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!): [[ShippingMethodQuote](/graphql-api/admin/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## facet
{{% gql-fields %}}
 * facet(id: [ID](/graphql-api/admin/object-types#id)!): [Facet](/graphql-api/admin/object-types#facet)
{{% /gql-fields %}}



## facetValues
{{% gql-fields %}}
 * facetValues(options: [FacetValueListOptions](/graphql-api/admin/input-types#facetvaluelistoptions)): [FacetValueList](/graphql-api/admin/object-types#facetvaluelist)!
{{% /gql-fields %}}



## facets
{{% gql-fields %}}
 * facets(options: [FacetListOptions](/graphql-api/admin/input-types#facetlistoptions)): [FacetList](/graphql-api/admin/object-types#facetlist)!
{{% /gql-fields %}}



## fulfillmentHandlers
{{% gql-fields %}}
 * fulfillmentHandlers: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## globalSettings
{{% gql-fields %}}
 * globalSettings: [GlobalSettings](/graphql-api/admin/object-types#globalsettings)!
{{% /gql-fields %}}



## job
{{% gql-fields %}}
 * job(jobId: [ID](/graphql-api/admin/object-types#id)!): [Job](/graphql-api/admin/object-types#job)
{{% /gql-fields %}}



## jobBufferSize
{{% gql-fields %}}
 * jobBufferSize(bufferIds: [[String](/graphql-api/admin/object-types#string)!]): [[JobBufferSize](/graphql-api/admin/object-types#jobbuffersize)!]!
{{% /gql-fields %}}



## jobQueues
{{% gql-fields %}}
 * jobQueues: [[JobQueue](/graphql-api/admin/object-types#jobqueue)!]!
{{% /gql-fields %}}



## jobs
{{% gql-fields %}}
 * jobs(options: [JobListOptions](/graphql-api/admin/input-types#joblistoptions)): [JobList](/graphql-api/admin/object-types#joblist)!
{{% /gql-fields %}}



## jobsById
{{% gql-fields %}}
 * jobsById(jobIds: [[ID](/graphql-api/admin/object-types#id)!]!): [[Job](/graphql-api/admin/object-types#job)!]!
{{% /gql-fields %}}



## me
{{% gql-fields %}}
 * me: [CurrentUser](/graphql-api/admin/object-types#currentuser)
{{% /gql-fields %}}



## metricSummary
Get metrics for the given interval and metric types.

{{% gql-fields %}}
 * metricSummary(input: [MetricSummaryInput](/graphql-api/admin/input-types#metricsummaryinput)): [[MetricSummary](/graphql-api/admin/object-types#metricsummary)!]!
{{% /gql-fields %}}



## order
{{% gql-fields %}}
 * order(id: [ID](/graphql-api/admin/object-types#id)!): [Order](/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## orders
{{% gql-fields %}}
 * orders(options: [OrderListOptions](/graphql-api/admin/input-types#orderlistoptions)): [OrderList](/graphql-api/admin/object-types#orderlist)!
{{% /gql-fields %}}



## paymentMethod
{{% gql-fields %}}
 * paymentMethod(id: [ID](/graphql-api/admin/object-types#id)!): [PaymentMethod](/graphql-api/admin/object-types#paymentmethod)
{{% /gql-fields %}}



## paymentMethodEligibilityCheckers
{{% gql-fields %}}
 * paymentMethodEligibilityCheckers: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## paymentMethodHandlers
{{% gql-fields %}}
 * paymentMethodHandlers: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## paymentMethods
{{% gql-fields %}}
 * paymentMethods(options: [PaymentMethodListOptions](/graphql-api/admin/input-types#paymentmethodlistoptions)): [PaymentMethodList](/graphql-api/admin/object-types#paymentmethodlist)!
{{% /gql-fields %}}



## pendingSearchIndexUpdates
{{% gql-fields %}}
 * pendingSearchIndexUpdates: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}



## previewCollectionVariants
Used for real-time previews of the contents of a Collection

{{% gql-fields %}}
 * previewCollectionVariants(input: [PreviewCollectionVariantsInput](/graphql-api/admin/input-types#previewcollectionvariantsinput)!, options: [ProductVariantListOptions](/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/graphql-api/admin/object-types#productvariantlist)!
{{% /gql-fields %}}



## product
Get a Product either by id or slug. If neither id nor slug is specified, an error will result.

{{% gql-fields %}}
 * product(id: [ID](/graphql-api/admin/object-types#id), slug: [String](/graphql-api/admin/object-types#string)): [Product](/graphql-api/admin/object-types#product)
{{% /gql-fields %}}



## productOptionGroup
{{% gql-fields %}}
 * productOptionGroup(id: [ID](/graphql-api/admin/object-types#id)!): [ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)
{{% /gql-fields %}}



## productOptionGroups
{{% gql-fields %}}
 * productOptionGroups(filterTerm: [String](/graphql-api/admin/object-types#string)): [[ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)!]!
{{% /gql-fields %}}



## productVariant
Get a ProductVariant by id

{{% gql-fields %}}
 * productVariant(id: [ID](/graphql-api/admin/object-types#id)!): [ProductVariant](/graphql-api/admin/object-types#productvariant)
{{% /gql-fields %}}



## productVariants
List ProductVariants either all or for the specific product.

{{% gql-fields %}}
 * productVariants(options: [ProductVariantListOptions](/graphql-api/admin/input-types#productvariantlistoptions), productId: [ID](/graphql-api/admin/object-types#id)): [ProductVariantList](/graphql-api/admin/object-types#productvariantlist)!
{{% /gql-fields %}}



## products
List Products

{{% gql-fields %}}
 * products(options: [ProductListOptions](/graphql-api/admin/input-types#productlistoptions)): [ProductList](/graphql-api/admin/object-types#productlist)!
{{% /gql-fields %}}



## promotion
{{% gql-fields %}}
 * promotion(id: [ID](/graphql-api/admin/object-types#id)!): [Promotion](/graphql-api/admin/object-types#promotion)
{{% /gql-fields %}}



## promotionActions
{{% gql-fields %}}
 * promotionActions: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## promotionConditions
{{% gql-fields %}}
 * promotionConditions: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## promotions
{{% gql-fields %}}
 * promotions(options: [PromotionListOptions](/graphql-api/admin/input-types#promotionlistoptions)): [PromotionList](/graphql-api/admin/object-types#promotionlist)!
{{% /gql-fields %}}



## province
{{% gql-fields %}}
 * province(id: [ID](/graphql-api/admin/object-types#id)!): [Province](/graphql-api/admin/object-types#province)
{{% /gql-fields %}}



## provinces
{{% gql-fields %}}
 * provinces(options: [ProvinceListOptions](/graphql-api/admin/input-types#provincelistoptions)): [ProvinceList](/graphql-api/admin/object-types#provincelist)!
{{% /gql-fields %}}



## role
{{% gql-fields %}}
 * role(id: [ID](/graphql-api/admin/object-types#id)!): [Role](/graphql-api/admin/object-types#role)
{{% /gql-fields %}}



## roles
{{% gql-fields %}}
 * roles(options: [RoleListOptions](/graphql-api/admin/input-types#rolelistoptions)): [RoleList](/graphql-api/admin/object-types#rolelist)!
{{% /gql-fields %}}



## search
{{% gql-fields %}}
 * search(input: [SearchInput](/graphql-api/admin/input-types#searchinput)!): [SearchResponse](/graphql-api/admin/object-types#searchresponse)!
{{% /gql-fields %}}



## seller
{{% gql-fields %}}
 * seller(id: [ID](/graphql-api/admin/object-types#id)!): [Seller](/graphql-api/admin/object-types#seller)
{{% /gql-fields %}}



## sellers
{{% gql-fields %}}
 * sellers(options: [SellerListOptions](/graphql-api/admin/input-types#sellerlistoptions)): [SellerList](/graphql-api/admin/object-types#sellerlist)!
{{% /gql-fields %}}



## shippingCalculators
{{% gql-fields %}}
 * shippingCalculators: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## shippingEligibilityCheckers
{{% gql-fields %}}
 * shippingEligibilityCheckers: [[ConfigurableOperationDefinition](/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## shippingMethod
{{% gql-fields %}}
 * shippingMethod(id: [ID](/graphql-api/admin/object-types#id)!): [ShippingMethod](/graphql-api/admin/object-types#shippingmethod)
{{% /gql-fields %}}



## shippingMethods
{{% gql-fields %}}
 * shippingMethods(options: [ShippingMethodListOptions](/graphql-api/admin/input-types#shippingmethodlistoptions)): [ShippingMethodList](/graphql-api/admin/object-types#shippingmethodlist)!
{{% /gql-fields %}}



## stockLocation
{{% gql-fields %}}
 * stockLocation(id: [ID](/graphql-api/admin/object-types#id)!): [StockLocation](/graphql-api/admin/object-types#stocklocation)
{{% /gql-fields %}}



## stockLocations
{{% gql-fields %}}
 * stockLocations(options: [StockLocationListOptions](/graphql-api/admin/input-types#stocklocationlistoptions)): [StockLocationList](/graphql-api/admin/object-types#stocklocationlist)!
{{% /gql-fields %}}



## tag
{{% gql-fields %}}
 * tag(id: [ID](/graphql-api/admin/object-types#id)!): [Tag](/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## tags
{{% gql-fields %}}
 * tags(options: [TagListOptions](/graphql-api/admin/input-types#taglistoptions)): [TagList](/graphql-api/admin/object-types#taglist)!
{{% /gql-fields %}}



## taxCategories
{{% gql-fields %}}
 * taxCategories(options: [TaxCategoryListOptions](/graphql-api/admin/input-types#taxcategorylistoptions)): [TaxCategoryList](/graphql-api/admin/object-types#taxcategorylist)!
{{% /gql-fields %}}



## taxCategory
{{% gql-fields %}}
 * taxCategory(id: [ID](/graphql-api/admin/object-types#id)!): [TaxCategory](/graphql-api/admin/object-types#taxcategory)
{{% /gql-fields %}}



## taxRate
{{% gql-fields %}}
 * taxRate(id: [ID](/graphql-api/admin/object-types#id)!): [TaxRate](/graphql-api/admin/object-types#taxrate)
{{% /gql-fields %}}



## taxRates
{{% gql-fields %}}
 * taxRates(options: [TaxRateListOptions](/graphql-api/admin/input-types#taxratelistoptions)): [TaxRateList](/graphql-api/admin/object-types#taxratelist)!
{{% /gql-fields %}}



## testEligibleShippingMethods
{{% gql-fields %}}
 * testEligibleShippingMethods(input: [TestEligibleShippingMethodsInput](/graphql-api/admin/input-types#testeligibleshippingmethodsinput)!): [[ShippingMethodQuote](/graphql-api/admin/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## testShippingMethod
{{% gql-fields %}}
 * testShippingMethod(input: [TestShippingMethodInput](/graphql-api/admin/input-types#testshippingmethodinput)!): [TestShippingMethodResult](/graphql-api/admin/object-types#testshippingmethodresult)!
{{% /gql-fields %}}



## zone
{{% gql-fields %}}
 * zone(id: [ID](/graphql-api/admin/object-types#id)!): [Zone](/graphql-api/admin/object-types#zone)
{{% /gql-fields %}}



## zones
{{% gql-fields %}}
 * zones(options: [ZoneListOptions](/graphql-api/admin/input-types#zonelistoptions)): [ZoneList](/graphql-api/admin/object-types#zonelist)!
{{% /gql-fields %}}



