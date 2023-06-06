---
title: "Queries"
weight: 1
date: 2023-06-06T14:49:27.902Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Queries

## activeAdministrator
{{% gql-fields %}}
 * activeAdministrator: [Administrator](/docs/graphql-api/admin/object-types#administrator)
{{% /gql-fields %}}



## activeChannel
{{% gql-fields %}}
 * activeChannel: [Channel](/docs/graphql-api/admin/object-types#channel)!
{{% /gql-fields %}}



## administrator
{{% gql-fields %}}
 * administrator(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Administrator](/docs/graphql-api/admin/object-types#administrator)
{{% /gql-fields %}}



## administrators
{{% gql-fields %}}
 * administrators(options: [AdministratorListOptions](/docs/graphql-api/admin/input-types#administratorlistoptions)): [AdministratorList](/docs/graphql-api/admin/object-types#administratorlist)!
{{% /gql-fields %}}



## asset
Get a single Asset by id

{{% gql-fields %}}
 * asset(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Asset](/docs/graphql-api/admin/object-types#asset)
{{% /gql-fields %}}



## assets
Get a list of Assets

{{% gql-fields %}}
 * assets(options: [AssetListOptions](/docs/graphql-api/admin/input-types#assetlistoptions)): [AssetList](/docs/graphql-api/admin/object-types#assetlist)!
{{% /gql-fields %}}



## channel
{{% gql-fields %}}
 * channel(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Channel](/docs/graphql-api/admin/object-types#channel)
{{% /gql-fields %}}



## channels
{{% gql-fields %}}
 * channels(options: [ChannelListOptions](/docs/graphql-api/admin/input-types#channellistoptions)): [ChannelList](/docs/graphql-api/admin/object-types#channellist)!
{{% /gql-fields %}}



## collection
Get a Collection either by id or slug. If neither id nor slug is specified, an error will result.

{{% gql-fields %}}
 * collection(id: [ID](/docs/graphql-api/admin/object-types#id), slug: [String](/docs/graphql-api/admin/object-types#string)): [Collection](/docs/graphql-api/admin/object-types#collection)
{{% /gql-fields %}}



## collectionFilters
{{% gql-fields %}}
 * collectionFilters: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## collections
{{% gql-fields %}}
 * collections(options: [CollectionListOptions](/docs/graphql-api/admin/input-types#collectionlistoptions)): [CollectionList](/docs/graphql-api/admin/object-types#collectionlist)!
{{% /gql-fields %}}



## countries
{{% gql-fields %}}
 * countries(options: [CountryListOptions](/docs/graphql-api/admin/input-types#countrylistoptions)): [CountryList](/docs/graphql-api/admin/object-types#countrylist)!
{{% /gql-fields %}}



## country
{{% gql-fields %}}
 * country(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Country](/docs/graphql-api/admin/object-types#country)
{{% /gql-fields %}}



## customer
{{% gql-fields %}}
 * customer(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Customer](/docs/graphql-api/admin/object-types#customer)
{{% /gql-fields %}}



## customerGroup
{{% gql-fields %}}
 * customerGroup(id: [ID](/docs/graphql-api/admin/object-types#id)!): [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)
{{% /gql-fields %}}



## customerGroups
{{% gql-fields %}}
 * customerGroups(options: [CustomerGroupListOptions](/docs/graphql-api/admin/input-types#customergrouplistoptions)): [CustomerGroupList](/docs/graphql-api/admin/object-types#customergrouplist)!
{{% /gql-fields %}}



## customers
{{% gql-fields %}}
 * customers(options: [CustomerListOptions](/docs/graphql-api/admin/input-types#customerlistoptions)): [CustomerList](/docs/graphql-api/admin/object-types#customerlist)!
{{% /gql-fields %}}



## eligibleShippingMethodsForDraftOrder
Returns a list of eligible shipping methods for the draft Order

{{% gql-fields %}}
 * eligibleShippingMethodsForDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!): [[ShippingMethodQuote](/docs/graphql-api/admin/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## facet
{{% gql-fields %}}
 * facet(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Facet](/docs/graphql-api/admin/object-types#facet)
{{% /gql-fields %}}



## facetValues
{{% gql-fields %}}
 * facetValues(options: [FacetValueListOptions](/docs/graphql-api/admin/input-types#facetvaluelistoptions)): [FacetValueList](/docs/graphql-api/admin/object-types#facetvaluelist)!
{{% /gql-fields %}}



## facets
{{% gql-fields %}}
 * facets(options: [FacetListOptions](/docs/graphql-api/admin/input-types#facetlistoptions)): [FacetList](/docs/graphql-api/admin/object-types#facetlist)!
{{% /gql-fields %}}



## fulfillmentHandlers
{{% gql-fields %}}
 * fulfillmentHandlers: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## globalSettings
{{% gql-fields %}}
 * globalSettings: [GlobalSettings](/docs/graphql-api/admin/object-types#globalsettings)!
{{% /gql-fields %}}



## job
{{% gql-fields %}}
 * job(jobId: [ID](/docs/graphql-api/admin/object-types#id)!): [Job](/docs/graphql-api/admin/object-types#job)
{{% /gql-fields %}}



## jobBufferSize
{{% gql-fields %}}
 * jobBufferSize(bufferIds: [[String](/docs/graphql-api/admin/object-types#string)!]): [[JobBufferSize](/docs/graphql-api/admin/object-types#jobbuffersize)!]!
{{% /gql-fields %}}



## jobQueues
{{% gql-fields %}}
 * jobQueues: [[JobQueue](/docs/graphql-api/admin/object-types#jobqueue)!]!
{{% /gql-fields %}}



## jobs
{{% gql-fields %}}
 * jobs(options: [JobListOptions](/docs/graphql-api/admin/input-types#joblistoptions)): [JobList](/docs/graphql-api/admin/object-types#joblist)!
{{% /gql-fields %}}



## jobsById
{{% gql-fields %}}
 * jobsById(jobIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[Job](/docs/graphql-api/admin/object-types#job)!]!
{{% /gql-fields %}}



## me
{{% gql-fields %}}
 * me: [CurrentUser](/docs/graphql-api/admin/object-types#currentuser)
{{% /gql-fields %}}



## metricSummary
Get metrics for the given interval and metric types.

{{% gql-fields %}}
 * metricSummary(input: [MetricSummaryInput](/docs/graphql-api/admin/input-types#metricsummaryinput)): [[MetricSummary](/docs/graphql-api/admin/object-types#metricsummary)!]!
{{% /gql-fields %}}



## order
{{% gql-fields %}}
 * order(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Order](/docs/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## orders
{{% gql-fields %}}
 * orders(options: [OrderListOptions](/docs/graphql-api/admin/input-types#orderlistoptions)): [OrderList](/docs/graphql-api/admin/object-types#orderlist)!
{{% /gql-fields %}}



## paymentMethod
{{% gql-fields %}}
 * paymentMethod(id: [ID](/docs/graphql-api/admin/object-types#id)!): [PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)
{{% /gql-fields %}}



## paymentMethodEligibilityCheckers
{{% gql-fields %}}
 * paymentMethodEligibilityCheckers: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## paymentMethodHandlers
{{% gql-fields %}}
 * paymentMethodHandlers: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## paymentMethods
{{% gql-fields %}}
 * paymentMethods(options: [PaymentMethodListOptions](/docs/graphql-api/admin/input-types#paymentmethodlistoptions)): [PaymentMethodList](/docs/graphql-api/admin/object-types#paymentmethodlist)!
{{% /gql-fields %}}



## pendingSearchIndexUpdates
{{% gql-fields %}}
 * pendingSearchIndexUpdates: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}



## previewCollectionVariants
Used for real-time previews of the contents of a Collection

{{% gql-fields %}}
 * previewCollectionVariants(input: [PreviewCollectionVariantsInput](/docs/graphql-api/admin/input-types#previewcollectionvariantsinput)!, options: [ProductVariantListOptions](/docs/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/docs/graphql-api/admin/object-types#productvariantlist)!
{{% /gql-fields %}}



## product
Get a Product either by id or slug. If neither id nor slug is specified, an error will result.

{{% gql-fields %}}
 * product(id: [ID](/docs/graphql-api/admin/object-types#id), slug: [String](/docs/graphql-api/admin/object-types#string)): [Product](/docs/graphql-api/admin/object-types#product)
{{% /gql-fields %}}



## productOptionGroup
{{% gql-fields %}}
 * productOptionGroup(id: [ID](/docs/graphql-api/admin/object-types#id)!): [ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)
{{% /gql-fields %}}



## productOptionGroups
{{% gql-fields %}}
 * productOptionGroups(filterTerm: [String](/docs/graphql-api/admin/object-types#string)): [[ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)!]!
{{% /gql-fields %}}



## productVariant
Get a ProductVariant by id

{{% gql-fields %}}
 * productVariant(id: [ID](/docs/graphql-api/admin/object-types#id)!): [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)
{{% /gql-fields %}}



## productVariants
List ProductVariants either all or for the specific product.

{{% gql-fields %}}
 * productVariants(options: [ProductVariantListOptions](/docs/graphql-api/admin/input-types#productvariantlistoptions), productId: [ID](/docs/graphql-api/admin/object-types#id)): [ProductVariantList](/docs/graphql-api/admin/object-types#productvariantlist)!
{{% /gql-fields %}}



## products
List Products

{{% gql-fields %}}
 * products(options: [ProductListOptions](/docs/graphql-api/admin/input-types#productlistoptions)): [ProductList](/docs/graphql-api/admin/object-types#productlist)!
{{% /gql-fields %}}



## promotion
{{% gql-fields %}}
 * promotion(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Promotion](/docs/graphql-api/admin/object-types#promotion)
{{% /gql-fields %}}



## promotionActions
{{% gql-fields %}}
 * promotionActions: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## promotionConditions
{{% gql-fields %}}
 * promotionConditions: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## promotions
{{% gql-fields %}}
 * promotions(options: [PromotionListOptions](/docs/graphql-api/admin/input-types#promotionlistoptions)): [PromotionList](/docs/graphql-api/admin/object-types#promotionlist)!
{{% /gql-fields %}}



## province
{{% gql-fields %}}
 * province(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Province](/docs/graphql-api/admin/object-types#province)
{{% /gql-fields %}}



## provinces
{{% gql-fields %}}
 * provinces(options: [ProvinceListOptions](/docs/graphql-api/admin/input-types#provincelistoptions)): [ProvinceList](/docs/graphql-api/admin/object-types#provincelist)!
{{% /gql-fields %}}



## role
{{% gql-fields %}}
 * role(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Role](/docs/graphql-api/admin/object-types#role)
{{% /gql-fields %}}



## roles
{{% gql-fields %}}
 * roles(options: [RoleListOptions](/docs/graphql-api/admin/input-types#rolelistoptions)): [RoleList](/docs/graphql-api/admin/object-types#rolelist)!
{{% /gql-fields %}}



## search
{{% gql-fields %}}
 * search(input: [SearchInput](/docs/graphql-api/admin/input-types#searchinput)!): [SearchResponse](/docs/graphql-api/admin/object-types#searchresponse)!
{{% /gql-fields %}}



## seller
{{% gql-fields %}}
 * seller(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Seller](/docs/graphql-api/admin/object-types#seller)
{{% /gql-fields %}}



## sellers
{{% gql-fields %}}
 * sellers(options: [SellerListOptions](/docs/graphql-api/admin/input-types#sellerlistoptions)): [SellerList](/docs/graphql-api/admin/object-types#sellerlist)!
{{% /gql-fields %}}



## shippingCalculators
{{% gql-fields %}}
 * shippingCalculators: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## shippingEligibilityCheckers
{{% gql-fields %}}
 * shippingEligibilityCheckers: [[ConfigurableOperationDefinition](/docs/graphql-api/admin/object-types#configurableoperationdefinition)!]!
{{% /gql-fields %}}



## shippingMethod
{{% gql-fields %}}
 * shippingMethod(id: [ID](/docs/graphql-api/admin/object-types#id)!): [ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)
{{% /gql-fields %}}



## shippingMethods
{{% gql-fields %}}
 * shippingMethods(options: [ShippingMethodListOptions](/docs/graphql-api/admin/input-types#shippingmethodlistoptions)): [ShippingMethodList](/docs/graphql-api/admin/object-types#shippingmethodlist)!
{{% /gql-fields %}}



## stockLocation
{{% gql-fields %}}
 * stockLocation(id: [ID](/docs/graphql-api/admin/object-types#id)!): [StockLocation](/docs/graphql-api/admin/object-types#stocklocation)
{{% /gql-fields %}}



## stockLocations
{{% gql-fields %}}
 * stockLocations(options: [StockLocationListOptions](/docs/graphql-api/admin/input-types#stocklocationlistoptions)): [StockLocationList](/docs/graphql-api/admin/object-types#stocklocationlist)!
{{% /gql-fields %}}



## tag
{{% gql-fields %}}
 * tag(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Tag](/docs/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## tags
{{% gql-fields %}}
 * tags(options: [TagListOptions](/docs/graphql-api/admin/input-types#taglistoptions)): [TagList](/docs/graphql-api/admin/object-types#taglist)!
{{% /gql-fields %}}



## taxCategories
{{% gql-fields %}}
 * taxCategories(options: [TaxCategoryListOptions](/docs/graphql-api/admin/input-types#taxcategorylistoptions)): [TaxCategoryList](/docs/graphql-api/admin/object-types#taxcategorylist)!
{{% /gql-fields %}}



## taxCategory
{{% gql-fields %}}
 * taxCategory(id: [ID](/docs/graphql-api/admin/object-types#id)!): [TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)
{{% /gql-fields %}}



## taxRate
{{% gql-fields %}}
 * taxRate(id: [ID](/docs/graphql-api/admin/object-types#id)!): [TaxRate](/docs/graphql-api/admin/object-types#taxrate)
{{% /gql-fields %}}



## taxRates
{{% gql-fields %}}
 * taxRates(options: [TaxRateListOptions](/docs/graphql-api/admin/input-types#taxratelistoptions)): [TaxRateList](/docs/graphql-api/admin/object-types#taxratelist)!
{{% /gql-fields %}}



## testEligibleShippingMethods
{{% gql-fields %}}
 * testEligibleShippingMethods(input: [TestEligibleShippingMethodsInput](/docs/graphql-api/admin/input-types#testeligibleshippingmethodsinput)!): [[ShippingMethodQuote](/docs/graphql-api/admin/object-types#shippingmethodquote)!]!
{{% /gql-fields %}}



## testShippingMethod
{{% gql-fields %}}
 * testShippingMethod(input: [TestShippingMethodInput](/docs/graphql-api/admin/input-types#testshippingmethodinput)!): [TestShippingMethodResult](/docs/graphql-api/admin/object-types#testshippingmethodresult)!
{{% /gql-fields %}}



## zone
{{% gql-fields %}}
 * zone(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Zone](/docs/graphql-api/admin/object-types#zone)
{{% /gql-fields %}}



## zones
{{% gql-fields %}}
 * zones(options: [ZoneListOptions](/docs/graphql-api/admin/input-types#zonelistoptions)): [ZoneList](/docs/graphql-api/admin/object-types#zonelist)!
{{% /gql-fields %}}



