---
title: "Mutations"
weight: 2
date: 2023-07-04T11:02:07.589Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Mutations

## addCustomersToGroup
Add Customers to a CustomerGroup

{{% gql-fields %}}
 * addCustomersToGroup(customerGroupId: [ID](/graphql-api/admin/object-types#id)!, customerIds: [[ID](/graphql-api/admin/object-types#id)!]!): [CustomerGroup](/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## addFulfillmentToOrder
{{% gql-fields %}}
 * addFulfillmentToOrder(input: [FulfillOrderInput](/graphql-api/admin/input-types#fulfillorderinput)!): [AddFulfillmentToOrderResult](/graphql-api/admin/object-types#addfulfillmenttoorderresult)!
{{% /gql-fields %}}



## addItemToDraftOrder
Adds an item to the draft Order.

{{% gql-fields %}}
 * addItemToDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!, input: [AddItemToDraftOrderInput](/graphql-api/admin/input-types#additemtodraftorderinput)!): [UpdateOrderItemsResult](/graphql-api/admin/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## addManualPaymentToOrder
Used to manually create a new Payment against an Order.
This can be used by an Administrator when an Order is in the ArrangingPayment state.

It is also used when a completed Order
has been modified (using `modifyOrder`) and the price has increased. The extra payment
can then be manually arranged by the administrator, and the details used to create a new
Payment.

{{% gql-fields %}}
 * addManualPaymentToOrder(input: [ManualPaymentInput](/graphql-api/admin/input-types#manualpaymentinput)!): [AddManualPaymentToOrderResult](/graphql-api/admin/object-types#addmanualpaymenttoorderresult)!
{{% /gql-fields %}}



## addMembersToZone
Add members to a Zone

{{% gql-fields %}}
 * addMembersToZone(zoneId: [ID](/graphql-api/admin/object-types#id)!, memberIds: [[ID](/graphql-api/admin/object-types#id)!]!): [Zone](/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## addNoteToCustomer
{{% gql-fields %}}
 * addNoteToCustomer(input: [AddNoteToCustomerInput](/graphql-api/admin/input-types#addnotetocustomerinput)!): [Customer](/graphql-api/admin/object-types#customer)!
{{% /gql-fields %}}



## addNoteToOrder
{{% gql-fields %}}
 * addNoteToOrder(input: [AddNoteToOrderInput](/graphql-api/admin/input-types#addnotetoorderinput)!): [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## addOptionGroupToProduct
Add an OptionGroup to a Product

{{% gql-fields %}}
 * addOptionGroupToProduct(productId: [ID](/graphql-api/admin/object-types#id)!, optionGroupId: [ID](/graphql-api/admin/object-types#id)!): [Product](/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## adjustDraftOrderLine
Adjusts a draft OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available.

{{% gql-fields %}}
 * adjustDraftOrderLine(orderId: [ID](/graphql-api/admin/object-types#id)!, input: [AdjustDraftOrderLineInput](/graphql-api/admin/input-types#adjustdraftorderlineinput)!): [UpdateOrderItemsResult](/graphql-api/admin/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## applyCouponCodeToDraftOrder
Applies the given coupon code to the draft Order

{{% gql-fields %}}
 * applyCouponCodeToDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!, couponCode: [String](/graphql-api/admin/object-types#string)!): [ApplyCouponCodeResult](/graphql-api/admin/object-types#applycouponcoderesult)!
{{% /gql-fields %}}



## assignAssetsToChannel
Assign assets to channel

{{% gql-fields %}}
 * assignAssetsToChannel(input: [AssignAssetsToChannelInput](/graphql-api/admin/input-types#assignassetstochannelinput)!): [[Asset](/graphql-api/admin/object-types#asset)!]!
{{% /gql-fields %}}



## assignCollectionsToChannel
Assigns Collections to the specified Channel

{{% gql-fields %}}
 * assignCollectionsToChannel(input: [AssignCollectionsToChannelInput](/graphql-api/admin/input-types#assigncollectionstochannelinput)!): [[Collection](/graphql-api/admin/object-types#collection)!]!
{{% /gql-fields %}}



## assignFacetsToChannel
Assigns Facets to the specified Channel

{{% gql-fields %}}
 * assignFacetsToChannel(input: [AssignFacetsToChannelInput](/graphql-api/admin/input-types#assignfacetstochannelinput)!): [[Facet](/graphql-api/admin/object-types#facet)!]!
{{% /gql-fields %}}



## assignPaymentMethodsToChannel
Assigns PaymentMethods to the specified Channel

{{% gql-fields %}}
 * assignPaymentMethodsToChannel(input: [AssignPaymentMethodsToChannelInput](/graphql-api/admin/input-types#assignpaymentmethodstochannelinput)!): [[PaymentMethod](/graphql-api/admin/object-types#paymentmethod)!]!
{{% /gql-fields %}}



## assignProductVariantsToChannel
Assigns ProductVariants to the specified Channel

{{% gql-fields %}}
 * assignProductVariantsToChannel(input: [AssignProductVariantsToChannelInput](/graphql-api/admin/input-types#assignproductvariantstochannelinput)!): [[ProductVariant](/graphql-api/admin/object-types#productvariant)!]!
{{% /gql-fields %}}



## assignProductsToChannel
Assigns all ProductVariants of Product to the specified Channel

{{% gql-fields %}}
 * assignProductsToChannel(input: [AssignProductsToChannelInput](/graphql-api/admin/input-types#assignproductstochannelinput)!): [[Product](/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## assignPromotionsToChannel
Assigns Promotions to the specified Channel

{{% gql-fields %}}
 * assignPromotionsToChannel(input: [AssignPromotionsToChannelInput](/graphql-api/admin/input-types#assignpromotionstochannelinput)!): [[Promotion](/graphql-api/admin/object-types#promotion)!]!
{{% /gql-fields %}}



## assignRoleToAdministrator
Assign a Role to an Administrator

{{% gql-fields %}}
 * assignRoleToAdministrator(administratorId: [ID](/graphql-api/admin/object-types#id)!, roleId: [ID](/graphql-api/admin/object-types#id)!): [Administrator](/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## assignShippingMethodsToChannel
Assigns ShippingMethods to the specified Channel

{{% gql-fields %}}
 * assignShippingMethodsToChannel(input: [AssignShippingMethodsToChannelInput](/graphql-api/admin/input-types#assignshippingmethodstochannelinput)!): [[ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!]!
{{% /gql-fields %}}



## assignStockLocationsToChannel
Assigns StockLocations to the specified Channel

{{% gql-fields %}}
 * assignStockLocationsToChannel(input: [AssignStockLocationsToChannelInput](/graphql-api/admin/input-types#assignstocklocationstochannelinput)!): [[StockLocation](/graphql-api/admin/object-types#stocklocation)!]!
{{% /gql-fields %}}



## authenticate
Authenticates the user using a named authentication strategy

{{% gql-fields %}}
 * authenticate(input: [AuthenticationInput](/graphql-api/admin/input-types#authenticationinput)!, rememberMe: [Boolean](/graphql-api/admin/object-types#boolean)): [AuthenticationResult](/graphql-api/admin/object-types#authenticationresult)!
{{% /gql-fields %}}



## cancelJob
{{% gql-fields %}}
 * cancelJob(jobId: [ID](/graphql-api/admin/object-types#id)!): [Job](/graphql-api/admin/object-types#job)!
{{% /gql-fields %}}



## cancelOrder
{{% gql-fields %}}
 * cancelOrder(input: [CancelOrderInput](/graphql-api/admin/input-types#cancelorderinput)!): [CancelOrderResult](/graphql-api/admin/object-types#cancelorderresult)!
{{% /gql-fields %}}



## cancelPayment
{{% gql-fields %}}
 * cancelPayment(id: [ID](/graphql-api/admin/object-types#id)!): [CancelPaymentResult](/graphql-api/admin/object-types#cancelpaymentresult)!
{{% /gql-fields %}}



## createAdministrator
Create a new Administrator

{{% gql-fields %}}
 * createAdministrator(input: [CreateAdministratorInput](/graphql-api/admin/input-types#createadministratorinput)!): [Administrator](/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## createAssets
Create a new Asset

{{% gql-fields %}}
 * createAssets(input: [[CreateAssetInput](/graphql-api/admin/input-types#createassetinput)!]!): [[CreateAssetResult](/graphql-api/admin/object-types#createassetresult)!]!
{{% /gql-fields %}}



## createChannel
Create a new Channel

{{% gql-fields %}}
 * createChannel(input: [CreateChannelInput](/graphql-api/admin/input-types#createchannelinput)!): [CreateChannelResult](/graphql-api/admin/object-types#createchannelresult)!
{{% /gql-fields %}}



## createCollection
Create a new Collection

{{% gql-fields %}}
 * createCollection(input: [CreateCollectionInput](/graphql-api/admin/input-types#createcollectioninput)!): [Collection](/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## createCountry
Create a new Country

{{% gql-fields %}}
 * createCountry(input: [CreateCountryInput](/graphql-api/admin/input-types#createcountryinput)!): [Country](/graphql-api/admin/object-types#country)!
{{% /gql-fields %}}



## createCustomer
Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer.

{{% gql-fields %}}
 * createCustomer(input: [CreateCustomerInput](/graphql-api/admin/input-types#createcustomerinput)!, password: [String](/graphql-api/admin/object-types#string)): [CreateCustomerResult](/graphql-api/admin/object-types#createcustomerresult)!
{{% /gql-fields %}}



## createCustomerAddress
Create a new Address and associate it with the Customer specified by customerId

{{% gql-fields %}}
 * createCustomerAddress(customerId: [ID](/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/graphql-api/admin/input-types#createaddressinput)!): [Address](/graphql-api/admin/object-types#address)!
{{% /gql-fields %}}



## createCustomerGroup
Create a new CustomerGroup

{{% gql-fields %}}
 * createCustomerGroup(input: [CreateCustomerGroupInput](/graphql-api/admin/input-types#createcustomergroupinput)!): [CustomerGroup](/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## createDraftOrder
Creates a draft Order

{{% gql-fields %}}
 * createDraftOrder: [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## createFacet
Create a new Facet

{{% gql-fields %}}
 * createFacet(input: [CreateFacetInput](/graphql-api/admin/input-types#createfacetinput)!): [Facet](/graphql-api/admin/object-types#facet)!
{{% /gql-fields %}}



## createFacetValues
Create one or more FacetValues

{{% gql-fields %}}
 * createFacetValues(input: [[CreateFacetValueInput](/graphql-api/admin/input-types#createfacetvalueinput)!]!): [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
{{% /gql-fields %}}



## createPaymentMethod
Create existing PaymentMethod

{{% gql-fields %}}
 * createPaymentMethod(input: [CreatePaymentMethodInput](/graphql-api/admin/input-types#createpaymentmethodinput)!): [PaymentMethod](/graphql-api/admin/object-types#paymentmethod)!
{{% /gql-fields %}}



## createProduct
Create a new Product

{{% gql-fields %}}
 * createProduct(input: [CreateProductInput](/graphql-api/admin/input-types#createproductinput)!): [Product](/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## createProductOption
Create a new ProductOption within a ProductOptionGroup

{{% gql-fields %}}
 * createProductOption(input: [CreateProductOptionInput](/graphql-api/admin/input-types#createproductoptioninput)!): [ProductOption](/graphql-api/admin/object-types#productoption)!
{{% /gql-fields %}}



## createProductOptionGroup
Create a new ProductOptionGroup

{{% gql-fields %}}
 * createProductOptionGroup(input: [CreateProductOptionGroupInput](/graphql-api/admin/input-types#createproductoptiongroupinput)!): [ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)!
{{% /gql-fields %}}



## createProductVariants
Create a set of ProductVariants based on the OptionGroups assigned to the given Product

{{% gql-fields %}}
 * createProductVariants(input: [[CreateProductVariantInput](/graphql-api/admin/input-types#createproductvariantinput)!]!): [[ProductVariant](/graphql-api/admin/object-types#productvariant)]!
{{% /gql-fields %}}



## createPromotion
{{% gql-fields %}}
 * createPromotion(input: [CreatePromotionInput](/graphql-api/admin/input-types#createpromotioninput)!): [CreatePromotionResult](/graphql-api/admin/object-types#createpromotionresult)!
{{% /gql-fields %}}



## createProvince
Create a new Province

{{% gql-fields %}}
 * createProvince(input: [CreateProvinceInput](/graphql-api/admin/input-types#createprovinceinput)!): [Province](/graphql-api/admin/object-types#province)!
{{% /gql-fields %}}



## createRole
Create a new Role

{{% gql-fields %}}
 * createRole(input: [CreateRoleInput](/graphql-api/admin/input-types#createroleinput)!): [Role](/graphql-api/admin/object-types#role)!
{{% /gql-fields %}}



## createSeller
Create a new Seller

{{% gql-fields %}}
 * createSeller(input: [CreateSellerInput](/graphql-api/admin/input-types#createsellerinput)!): [Seller](/graphql-api/admin/object-types#seller)!
{{% /gql-fields %}}



## createShippingMethod
Create a new ShippingMethod

{{% gql-fields %}}
 * createShippingMethod(input: [CreateShippingMethodInput](/graphql-api/admin/input-types#createshippingmethodinput)!): [ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!
{{% /gql-fields %}}



## createStockLocation
{{% gql-fields %}}
 * createStockLocation(input: [CreateStockLocationInput](/graphql-api/admin/input-types#createstocklocationinput)!): [StockLocation](/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}



## createTag
Create a new Tag

{{% gql-fields %}}
 * createTag(input: [CreateTagInput](/graphql-api/admin/input-types#createtaginput)!): [Tag](/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## createTaxCategory
Create a new TaxCategory

{{% gql-fields %}}
 * createTaxCategory(input: [CreateTaxCategoryInput](/graphql-api/admin/input-types#createtaxcategoryinput)!): [TaxCategory](/graphql-api/admin/object-types#taxcategory)!
{{% /gql-fields %}}



## createTaxRate
Create a new TaxRate

{{% gql-fields %}}
 * createTaxRate(input: [CreateTaxRateInput](/graphql-api/admin/input-types#createtaxrateinput)!): [TaxRate](/graphql-api/admin/object-types#taxrate)!
{{% /gql-fields %}}



## createZone
Create a new Zone

{{% gql-fields %}}
 * createZone(input: [CreateZoneInput](/graphql-api/admin/input-types#createzoneinput)!): [Zone](/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## deleteAdministrator
Delete an Administrator

{{% gql-fields %}}
 * deleteAdministrator(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteAdministrators
Delete multiple Administrators

{{% gql-fields %}}
 * deleteAdministrators(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteAsset
Delete an Asset

{{% gql-fields %}}
 * deleteAsset(input: [DeleteAssetInput](/graphql-api/admin/input-types#deleteassetinput)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteAssets
Delete multiple Assets

{{% gql-fields %}}
 * deleteAssets(input: [DeleteAssetsInput](/graphql-api/admin/input-types#deleteassetsinput)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteChannel
Delete a Channel

{{% gql-fields %}}
 * deleteChannel(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteChannels
Delete multiple Channels

{{% gql-fields %}}
 * deleteChannels(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCollection
Delete a Collection and all of its descendants

{{% gql-fields %}}
 * deleteCollection(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCollections
Delete multiple Collections and all of their descendants

{{% gql-fields %}}
 * deleteCollections(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCountries
Delete multiple Countries

{{% gql-fields %}}
 * deleteCountries(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCountry
Delete a Country

{{% gql-fields %}}
 * deleteCountry(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomer
Delete a Customer

{{% gql-fields %}}
 * deleteCustomer(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomerAddress
Update an existing Address

{{% gql-fields %}}
 * deleteCustomerAddress(id: [ID](/graphql-api/admin/object-types#id)!): [Success](/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## deleteCustomerGroup
Delete a CustomerGroup

{{% gql-fields %}}
 * deleteCustomerGroup(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomerGroups
Delete multiple CustomerGroups

{{% gql-fields %}}
 * deleteCustomerGroups(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCustomerNote
{{% gql-fields %}}
 * deleteCustomerNote(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomers
Deletes Customers

{{% gql-fields %}}
 * deleteCustomers(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteDraftOrder
Deletes a draft Order

{{% gql-fields %}}
 * deleteDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteFacet
Delete an existing Facet

{{% gql-fields %}}
 * deleteFacet(id: [ID](/graphql-api/admin/object-types#id)!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteFacetValues
Delete one or more FacetValues

{{% gql-fields %}}
 * deleteFacetValues(ids: [[ID](/graphql-api/admin/object-types#id)!]!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteFacets
Delete multiple existing Facets

{{% gql-fields %}}
 * deleteFacets(ids: [[ID](/graphql-api/admin/object-types#id)!]!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteOrderNote
{{% gql-fields %}}
 * deleteOrderNote(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePaymentMethod
Delete a PaymentMethod

{{% gql-fields %}}
 * deletePaymentMethod(id: [ID](/graphql-api/admin/object-types#id)!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePaymentMethods
Delete multiple PaymentMethods

{{% gql-fields %}}
 * deletePaymentMethods(ids: [[ID](/graphql-api/admin/object-types#id)!]!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProduct
Delete a Product

{{% gql-fields %}}
 * deleteProduct(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductOption
Delete a ProductOption

{{% gql-fields %}}
 * deleteProductOption(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductVariant
Delete a ProductVariant

{{% gql-fields %}}
 * deleteProductVariant(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductVariants
Delete multiple ProductVariants

{{% gql-fields %}}
 * deleteProductVariants(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProducts
Delete multiple Products

{{% gql-fields %}}
 * deleteProducts(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deletePromotion
{{% gql-fields %}}
 * deletePromotion(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePromotions
{{% gql-fields %}}
 * deletePromotions(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProvince
Delete a Province

{{% gql-fields %}}
 * deleteProvince(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteRole
Delete an existing Role

{{% gql-fields %}}
 * deleteRole(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteRoles
Delete multiple Roles

{{% gql-fields %}}
 * deleteRoles(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteSeller
Delete a Seller

{{% gql-fields %}}
 * deleteSeller(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteSellers
Delete multiple Sellers

{{% gql-fields %}}
 * deleteSellers(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteShippingMethod
Delete a ShippingMethod

{{% gql-fields %}}
 * deleteShippingMethod(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteShippingMethods
Delete multiple ShippingMethods

{{% gql-fields %}}
 * deleteShippingMethods(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteStockLocation
{{% gql-fields %}}
 * deleteStockLocation(input: [DeleteStockLocationInput](/graphql-api/admin/input-types#deletestocklocationinput)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteStockLocations
{{% gql-fields %}}
 * deleteStockLocations(input: [[DeleteStockLocationInput](/graphql-api/admin/input-types#deletestocklocationinput)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteTag
Delete an existing Tag

{{% gql-fields %}}
 * deleteTag(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxCategories
Deletes multiple TaxCategories

{{% gql-fields %}}
 * deleteTaxCategories(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteTaxCategory
Deletes a TaxCategory

{{% gql-fields %}}
 * deleteTaxCategory(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxRate
Delete a TaxRate

{{% gql-fields %}}
 * deleteTaxRate(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxRates
Delete multiple TaxRates

{{% gql-fields %}}
 * deleteTaxRates(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteZone
Delete a Zone

{{% gql-fields %}}
 * deleteZone(id: [ID](/graphql-api/admin/object-types#id)!): [DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteZones
Delete a Zone

{{% gql-fields %}}
 * deleteZones(ids: [[ID](/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## flushBufferedJobs
{{% gql-fields %}}
 * flushBufferedJobs(bufferIds: [[String](/graphql-api/admin/object-types#string)!]): [Success](/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## importProducts
{{% gql-fields %}}
 * importProducts(csvFile: [Upload](/graphql-api/admin/object-types#upload)!): [ImportInfo](/graphql-api/admin/object-types#importinfo)
{{% /gql-fields %}}



## login
Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})`

{{% gql-fields %}}
 * login(username: [String](/graphql-api/admin/object-types#string)!, password: [String](/graphql-api/admin/object-types#string)!, rememberMe: [Boolean](/graphql-api/admin/object-types#boolean)): [NativeAuthenticationResult](/graphql-api/admin/object-types#nativeauthenticationresult)!
{{% /gql-fields %}}



## logout
{{% gql-fields %}}
 * logout: [Success](/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## modifyOrder
Allows an Order to be modified after it has been completed by the Customer. The Order must first
be in the `Modifying` state.

{{% gql-fields %}}
 * modifyOrder(input: [ModifyOrderInput](/graphql-api/admin/input-types#modifyorderinput)!): [ModifyOrderResult](/graphql-api/admin/object-types#modifyorderresult)!
{{% /gql-fields %}}



## moveCollection
Move a Collection to a different parent or index

{{% gql-fields %}}
 * moveCollection(input: [MoveCollectionInput](/graphql-api/admin/input-types#movecollectioninput)!): [Collection](/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## refundOrder
{{% gql-fields %}}
 * refundOrder(input: [RefundOrderInput](/graphql-api/admin/input-types#refundorderinput)!): [RefundOrderResult](/graphql-api/admin/object-types#refundorderresult)!
{{% /gql-fields %}}



## reindex
{{% gql-fields %}}
 * reindex: [Job](/graphql-api/admin/object-types#job)!
{{% /gql-fields %}}



## removeCollectionsFromChannel
Removes Collections from the specified Channel

{{% gql-fields %}}
 * removeCollectionsFromChannel(input: [RemoveCollectionsFromChannelInput](/graphql-api/admin/input-types#removecollectionsfromchannelinput)!): [[Collection](/graphql-api/admin/object-types#collection)!]!
{{% /gql-fields %}}



## removeCouponCodeFromDraftOrder
Removes the given coupon code from the draft Order

{{% gql-fields %}}
 * removeCouponCodeFromDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!, couponCode: [String](/graphql-api/admin/object-types#string)!): [Order](/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## removeCustomersFromGroup
Remove Customers from a CustomerGroup

{{% gql-fields %}}
 * removeCustomersFromGroup(customerGroupId: [ID](/graphql-api/admin/object-types#id)!, customerIds: [[ID](/graphql-api/admin/object-types#id)!]!): [CustomerGroup](/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## removeDraftOrderLine
Remove an OrderLine from the draft Order

{{% gql-fields %}}
 * removeDraftOrderLine(orderId: [ID](/graphql-api/admin/object-types#id)!, orderLineId: [ID](/graphql-api/admin/object-types#id)!): [RemoveOrderItemsResult](/graphql-api/admin/object-types#removeorderitemsresult)!
{{% /gql-fields %}}



## removeFacetsFromChannel
Removes Facets from the specified Channel

{{% gql-fields %}}
 * removeFacetsFromChannel(input: [RemoveFacetsFromChannelInput](/graphql-api/admin/input-types#removefacetsfromchannelinput)!): [[RemoveFacetFromChannelResult](/graphql-api/admin/object-types#removefacetfromchannelresult)!]!
{{% /gql-fields %}}



## removeMembersFromZone
Remove members from a Zone

{{% gql-fields %}}
 * removeMembersFromZone(zoneId: [ID](/graphql-api/admin/object-types#id)!, memberIds: [[ID](/graphql-api/admin/object-types#id)!]!): [Zone](/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## removeOptionGroupFromProduct
Remove an OptionGroup from a Product. If the OptionGroup is in use by any ProductVariants
the mutation will return a ProductOptionInUseError, and the OptionGroup will not be removed.
Setting the `force` argument to `true` will override this and remove the OptionGroup anyway,
as well as removing any of the group's options from the Product's ProductVariants.

{{% gql-fields %}}
 * removeOptionGroupFromProduct(productId: [ID](/graphql-api/admin/object-types#id)!, optionGroupId: [ID](/graphql-api/admin/object-types#id)!, force: [Boolean](/graphql-api/admin/object-types#boolean)): [RemoveOptionGroupFromProductResult](/graphql-api/admin/object-types#removeoptiongroupfromproductresult)!
{{% /gql-fields %}}



## removePaymentMethodsFromChannel
Removes PaymentMethods from the specified Channel

{{% gql-fields %}}
 * removePaymentMethodsFromChannel(input: [RemovePaymentMethodsFromChannelInput](/graphql-api/admin/input-types#removepaymentmethodsfromchannelinput)!): [[PaymentMethod](/graphql-api/admin/object-types#paymentmethod)!]!
{{% /gql-fields %}}



## removeProductVariantsFromChannel
Removes ProductVariants from the specified Channel

{{% gql-fields %}}
 * removeProductVariantsFromChannel(input: [RemoveProductVariantsFromChannelInput](/graphql-api/admin/input-types#removeproductvariantsfromchannelinput)!): [[ProductVariant](/graphql-api/admin/object-types#productvariant)!]!
{{% /gql-fields %}}



## removeProductsFromChannel
Removes all ProductVariants of Product from the specified Channel

{{% gql-fields %}}
 * removeProductsFromChannel(input: [RemoveProductsFromChannelInput](/graphql-api/admin/input-types#removeproductsfromchannelinput)!): [[Product](/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## removePromotionsFromChannel
Removes Promotions from the specified Channel

{{% gql-fields %}}
 * removePromotionsFromChannel(input: [RemovePromotionsFromChannelInput](/graphql-api/admin/input-types#removepromotionsfromchannelinput)!): [[Promotion](/graphql-api/admin/object-types#promotion)!]!
{{% /gql-fields %}}



## removeSettledJobs
Remove all settled jobs in the given queues older than the given date. Returns the number of jobs deleted.

{{% gql-fields %}}
 * removeSettledJobs(queueNames: [[String](/graphql-api/admin/object-types#string)!], olderThan: [DateTime](/graphql-api/admin/object-types#datetime)): [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}



## removeShippingMethodsFromChannel
Removes ShippingMethods from the specified Channel

{{% gql-fields %}}
 * removeShippingMethodsFromChannel(input: [RemoveShippingMethodsFromChannelInput](/graphql-api/admin/input-types#removeshippingmethodsfromchannelinput)!): [[ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!]!
{{% /gql-fields %}}



## removeStockLocationsFromChannel
Removes StockLocations from the specified Channel

{{% gql-fields %}}
 * removeStockLocationsFromChannel(input: [RemoveStockLocationsFromChannelInput](/graphql-api/admin/input-types#removestocklocationsfromchannelinput)!): [[StockLocation](/graphql-api/admin/object-types#stocklocation)!]!
{{% /gql-fields %}}



## runPendingSearchIndexUpdates
{{% gql-fields %}}
 * runPendingSearchIndexUpdates: [Success](/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## setCustomerForDraftOrder
{{% gql-fields %}}
 * setCustomerForDraftOrder(orderId: [ID](/graphql-api/admin/object-types#id)!, customerId: [ID](/graphql-api/admin/object-types#id), input: [CreateCustomerInput](/graphql-api/admin/input-types#createcustomerinput)): [SetCustomerForDraftOrderResult](/graphql-api/admin/object-types#setcustomerfordraftorderresult)!
{{% /gql-fields %}}



## setDraftOrderBillingAddress
Sets the billing address for a draft Order

{{% gql-fields %}}
 * setDraftOrderBillingAddress(orderId: [ID](/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/graphql-api/admin/input-types#createaddressinput)!): [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderCustomFields
Allows any custom fields to be set for the active order

{{% gql-fields %}}
 * setDraftOrderCustomFields(orderId: [ID](/graphql-api/admin/object-types#id)!, input: [UpdateOrderInput](/graphql-api/admin/input-types#updateorderinput)!): [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderShippingAddress
Sets the shipping address for a draft Order

{{% gql-fields %}}
 * setDraftOrderShippingAddress(orderId: [ID](/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/graphql-api/admin/input-types#createaddressinput)!): [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderShippingMethod
Sets the shipping method by id, which can be obtained with the `eligibleShippingMethodsForDraftOrder` query

{{% gql-fields %}}
 * setDraftOrderShippingMethod(orderId: [ID](/graphql-api/admin/object-types#id)!, shippingMethodId: [ID](/graphql-api/admin/object-types#id)!): [SetOrderShippingMethodResult](/graphql-api/admin/object-types#setordershippingmethodresult)!
{{% /gql-fields %}}



## setOrderCustomFields
{{% gql-fields %}}
 * setOrderCustomFields(input: [UpdateOrderInput](/graphql-api/admin/input-types#updateorderinput)!): [Order](/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## settlePayment
{{% gql-fields %}}
 * settlePayment(id: [ID](/graphql-api/admin/object-types#id)!): [SettlePaymentResult](/graphql-api/admin/object-types#settlepaymentresult)!
{{% /gql-fields %}}



## settleRefund
{{% gql-fields %}}
 * settleRefund(input: [SettleRefundInput](/graphql-api/admin/input-types#settlerefundinput)!): [SettleRefundResult](/graphql-api/admin/object-types#settlerefundresult)!
{{% /gql-fields %}}



## transitionFulfillmentToState
{{% gql-fields %}}
 * transitionFulfillmentToState(id: [ID](/graphql-api/admin/object-types#id)!, state: [String](/graphql-api/admin/object-types#string)!): [TransitionFulfillmentToStateResult](/graphql-api/admin/object-types#transitionfulfillmenttostateresult)!
{{% /gql-fields %}}



## transitionOrderToState
{{% gql-fields %}}
 * transitionOrderToState(id: [ID](/graphql-api/admin/object-types#id)!, state: [String](/graphql-api/admin/object-types#string)!): [TransitionOrderToStateResult](/graphql-api/admin/object-types#transitionordertostateresult)
{{% /gql-fields %}}



## transitionPaymentToState
{{% gql-fields %}}
 * transitionPaymentToState(id: [ID](/graphql-api/admin/object-types#id)!, state: [String](/graphql-api/admin/object-types#string)!): [TransitionPaymentToStateResult](/graphql-api/admin/object-types#transitionpaymenttostateresult)!
{{% /gql-fields %}}



## updateActiveAdministrator
Update the active (currently logged-in) Administrator

{{% gql-fields %}}
 * updateActiveAdministrator(input: [UpdateActiveAdministratorInput](/graphql-api/admin/input-types#updateactiveadministratorinput)!): [Administrator](/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## updateAdministrator
Update an existing Administrator

{{% gql-fields %}}
 * updateAdministrator(input: [UpdateAdministratorInput](/graphql-api/admin/input-types#updateadministratorinput)!): [Administrator](/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## updateAsset
Update an existing Asset

{{% gql-fields %}}
 * updateAsset(input: [UpdateAssetInput](/graphql-api/admin/input-types#updateassetinput)!): [Asset](/graphql-api/admin/object-types#asset)!
{{% /gql-fields %}}



## updateChannel
Update an existing Channel

{{% gql-fields %}}
 * updateChannel(input: [UpdateChannelInput](/graphql-api/admin/input-types#updatechannelinput)!): [UpdateChannelResult](/graphql-api/admin/object-types#updatechannelresult)!
{{% /gql-fields %}}



## updateCollection
Update an existing Collection

{{% gql-fields %}}
 * updateCollection(input: [UpdateCollectionInput](/graphql-api/admin/input-types#updatecollectioninput)!): [Collection](/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## updateCountry
Update an existing Country

{{% gql-fields %}}
 * updateCountry(input: [UpdateCountryInput](/graphql-api/admin/input-types#updatecountryinput)!): [Country](/graphql-api/admin/object-types#country)!
{{% /gql-fields %}}



## updateCustomer
Update an existing Customer

{{% gql-fields %}}
 * updateCustomer(input: [UpdateCustomerInput](/graphql-api/admin/input-types#updatecustomerinput)!): [UpdateCustomerResult](/graphql-api/admin/object-types#updatecustomerresult)!
{{% /gql-fields %}}



## updateCustomerAddress
Update an existing Address

{{% gql-fields %}}
 * updateCustomerAddress(input: [UpdateAddressInput](/graphql-api/admin/input-types#updateaddressinput)!): [Address](/graphql-api/admin/object-types#address)!
{{% /gql-fields %}}



## updateCustomerGroup
Update an existing CustomerGroup

{{% gql-fields %}}
 * updateCustomerGroup(input: [UpdateCustomerGroupInput](/graphql-api/admin/input-types#updatecustomergroupinput)!): [CustomerGroup](/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## updateCustomerNote
{{% gql-fields %}}
 * updateCustomerNote(input: [UpdateCustomerNoteInput](/graphql-api/admin/input-types#updatecustomernoteinput)!): [HistoryEntry](/graphql-api/admin/object-types#historyentry)!
{{% /gql-fields %}}



## updateFacet
Update an existing Facet

{{% gql-fields %}}
 * updateFacet(input: [UpdateFacetInput](/graphql-api/admin/input-types#updatefacetinput)!): [Facet](/graphql-api/admin/object-types#facet)!
{{% /gql-fields %}}



## updateFacetValues
Update one or more FacetValues

{{% gql-fields %}}
 * updateFacetValues(input: [[UpdateFacetValueInput](/graphql-api/admin/input-types#updatefacetvalueinput)!]!): [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
{{% /gql-fields %}}



## updateGlobalSettings
{{% gql-fields %}}
 * updateGlobalSettings(input: [UpdateGlobalSettingsInput](/graphql-api/admin/input-types#updateglobalsettingsinput)!): [UpdateGlobalSettingsResult](/graphql-api/admin/object-types#updateglobalsettingsresult)!
{{% /gql-fields %}}



## updateOrderNote
{{% gql-fields %}}
 * updateOrderNote(input: [UpdateOrderNoteInput](/graphql-api/admin/input-types#updateordernoteinput)!): [HistoryEntry](/graphql-api/admin/object-types#historyentry)!
{{% /gql-fields %}}



## updatePaymentMethod
Update an existing PaymentMethod

{{% gql-fields %}}
 * updatePaymentMethod(input: [UpdatePaymentMethodInput](/graphql-api/admin/input-types#updatepaymentmethodinput)!): [PaymentMethod](/graphql-api/admin/object-types#paymentmethod)!
{{% /gql-fields %}}



## updateProduct
Update an existing Product

{{% gql-fields %}}
 * updateProduct(input: [UpdateProductInput](/graphql-api/admin/input-types#updateproductinput)!): [Product](/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## updateProductOption
Create a new ProductOption within a ProductOptionGroup

{{% gql-fields %}}
 * updateProductOption(input: [UpdateProductOptionInput](/graphql-api/admin/input-types#updateproductoptioninput)!): [ProductOption](/graphql-api/admin/object-types#productoption)!
{{% /gql-fields %}}



## updateProductOptionGroup
Update an existing ProductOptionGroup

{{% gql-fields %}}
 * updateProductOptionGroup(input: [UpdateProductOptionGroupInput](/graphql-api/admin/input-types#updateproductoptiongroupinput)!): [ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)!
{{% /gql-fields %}}



## updateProductVariants
Update existing ProductVariants

{{% gql-fields %}}
 * updateProductVariants(input: [[UpdateProductVariantInput](/graphql-api/admin/input-types#updateproductvariantinput)!]!): [[ProductVariant](/graphql-api/admin/object-types#productvariant)]!
{{% /gql-fields %}}



## updateProducts
Update multiple existing Products

{{% gql-fields %}}
 * updateProducts(input: [[UpdateProductInput](/graphql-api/admin/input-types#updateproductinput)!]!): [[Product](/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## updatePromotion
{{% gql-fields %}}
 * updatePromotion(input: [UpdatePromotionInput](/graphql-api/admin/input-types#updatepromotioninput)!): [UpdatePromotionResult](/graphql-api/admin/object-types#updatepromotionresult)!
{{% /gql-fields %}}



## updateProvince
Update an existing Province

{{% gql-fields %}}
 * updateProvince(input: [UpdateProvinceInput](/graphql-api/admin/input-types#updateprovinceinput)!): [Province](/graphql-api/admin/object-types#province)!
{{% /gql-fields %}}



## updateRole
Update an existing Role

{{% gql-fields %}}
 * updateRole(input: [UpdateRoleInput](/graphql-api/admin/input-types#updateroleinput)!): [Role](/graphql-api/admin/object-types#role)!
{{% /gql-fields %}}



## updateSeller
Update an existing Seller

{{% gql-fields %}}
 * updateSeller(input: [UpdateSellerInput](/graphql-api/admin/input-types#updatesellerinput)!): [Seller](/graphql-api/admin/object-types#seller)!
{{% /gql-fields %}}



## updateShippingMethod
Update an existing ShippingMethod

{{% gql-fields %}}
 * updateShippingMethod(input: [UpdateShippingMethodInput](/graphql-api/admin/input-types#updateshippingmethodinput)!): [ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!
{{% /gql-fields %}}



## updateStockLocation
{{% gql-fields %}}
 * updateStockLocation(input: [UpdateStockLocationInput](/graphql-api/admin/input-types#updatestocklocationinput)!): [StockLocation](/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}



## updateTag
Update an existing Tag

{{% gql-fields %}}
 * updateTag(input: [UpdateTagInput](/graphql-api/admin/input-types#updatetaginput)!): [Tag](/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## updateTaxCategory
Update an existing TaxCategory

{{% gql-fields %}}
 * updateTaxCategory(input: [UpdateTaxCategoryInput](/graphql-api/admin/input-types#updatetaxcategoryinput)!): [TaxCategory](/graphql-api/admin/object-types#taxcategory)!
{{% /gql-fields %}}



## updateTaxRate
Update an existing TaxRate

{{% gql-fields %}}
 * updateTaxRate(input: [UpdateTaxRateInput](/graphql-api/admin/input-types#updatetaxrateinput)!): [TaxRate](/graphql-api/admin/object-types#taxrate)!
{{% /gql-fields %}}



## updateZone
Update an existing Zone

{{% gql-fields %}}
 * updateZone(input: [UpdateZoneInput](/graphql-api/admin/input-types#updatezoneinput)!): [Zone](/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



