---
title: "Mutations"
weight: 2
date: 2023-06-07T09:42:15.213Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Mutations

## addCustomersToGroup
Add Customers to a CustomerGroup

{{% gql-fields %}}
 * addCustomersToGroup(customerGroupId: [ID](/docs/graphql-api/admin/object-types#id)!, customerIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## addFulfillmentToOrder
{{% gql-fields %}}
 * addFulfillmentToOrder(input: [FulfillOrderInput](/docs/graphql-api/admin/input-types#fulfillorderinput)!): [AddFulfillmentToOrderResult](/docs/graphql-api/admin/object-types#addfulfillmenttoorderresult)!
{{% /gql-fields %}}



## addItemToDraftOrder
Adds an item to the draft Order.

{{% gql-fields %}}
 * addItemToDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [AddItemToDraftOrderInput](/docs/graphql-api/admin/input-types#additemtodraftorderinput)!): [UpdateOrderItemsResult](/docs/graphql-api/admin/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## addManualPaymentToOrder
Used to manually create a new Payment against an Order.
This can be used by an Administrator when an Order is in the ArrangingPayment state.

It is also used when a completed Order
has been modified (using `modifyOrder`) and the price has increased. The extra payment
can then be manually arranged by the administrator, and the details used to create a new
Payment.

{{% gql-fields %}}
 * addManualPaymentToOrder(input: [ManualPaymentInput](/docs/graphql-api/admin/input-types#manualpaymentinput)!): [AddManualPaymentToOrderResult](/docs/graphql-api/admin/object-types#addmanualpaymenttoorderresult)!
{{% /gql-fields %}}



## addMembersToZone
Add members to a Zone

{{% gql-fields %}}
 * addMembersToZone(zoneId: [ID](/docs/graphql-api/admin/object-types#id)!, memberIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [Zone](/docs/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## addNoteToCustomer
{{% gql-fields %}}
 * addNoteToCustomer(input: [AddNoteToCustomerInput](/docs/graphql-api/admin/input-types#addnotetocustomerinput)!): [Customer](/docs/graphql-api/admin/object-types#customer)!
{{% /gql-fields %}}



## addNoteToOrder
{{% gql-fields %}}
 * addNoteToOrder(input: [AddNoteToOrderInput](/docs/graphql-api/admin/input-types#addnotetoorderinput)!): [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## addOptionGroupToProduct
Add an OptionGroup to a Product

{{% gql-fields %}}
 * addOptionGroupToProduct(productId: [ID](/docs/graphql-api/admin/object-types#id)!, optionGroupId: [ID](/docs/graphql-api/admin/object-types#id)!): [Product](/docs/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## adjustDraftOrderLine
Adjusts a draft OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type `OrderLineCustomFieldsInput` will be available.

{{% gql-fields %}}
 * adjustDraftOrderLine(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [AdjustDraftOrderLineInput](/docs/graphql-api/admin/input-types#adjustdraftorderlineinput)!): [UpdateOrderItemsResult](/docs/graphql-api/admin/object-types#updateorderitemsresult)!
{{% /gql-fields %}}



## applyCouponCodeToDraftOrder
Applies the given coupon code to the draft Order

{{% gql-fields %}}
 * applyCouponCodeToDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, couponCode: [String](/docs/graphql-api/admin/object-types#string)!): [ApplyCouponCodeResult](/docs/graphql-api/admin/object-types#applycouponcoderesult)!
{{% /gql-fields %}}



## assignAssetsToChannel
Assign assets to channel

{{% gql-fields %}}
 * assignAssetsToChannel(input: [AssignAssetsToChannelInput](/docs/graphql-api/admin/input-types#assignassetstochannelinput)!): [[Asset](/docs/graphql-api/admin/object-types#asset)!]!
{{% /gql-fields %}}



## assignCollectionsToChannel
Assigns Collections to the specified Channel

{{% gql-fields %}}
 * assignCollectionsToChannel(input: [AssignCollectionsToChannelInput](/docs/graphql-api/admin/input-types#assigncollectionstochannelinput)!): [[Collection](/docs/graphql-api/admin/object-types#collection)!]!
{{% /gql-fields %}}



## assignFacetsToChannel
Assigns Facets to the specified Channel

{{% gql-fields %}}
 * assignFacetsToChannel(input: [AssignFacetsToChannelInput](/docs/graphql-api/admin/input-types#assignfacetstochannelinput)!): [[Facet](/docs/graphql-api/admin/object-types#facet)!]!
{{% /gql-fields %}}



## assignPaymentMethodsToChannel
Assigns PaymentMethods to the specified Channel

{{% gql-fields %}}
 * assignPaymentMethodsToChannel(input: [AssignPaymentMethodsToChannelInput](/docs/graphql-api/admin/input-types#assignpaymentmethodstochannelinput)!): [[PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)!]!
{{% /gql-fields %}}



## assignProductVariantsToChannel
Assigns ProductVariants to the specified Channel

{{% gql-fields %}}
 * assignProductVariantsToChannel(input: [AssignProductVariantsToChannelInput](/docs/graphql-api/admin/input-types#assignproductvariantstochannelinput)!): [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!]!
{{% /gql-fields %}}



## assignProductsToChannel
Assigns all ProductVariants of Product to the specified Channel

{{% gql-fields %}}
 * assignProductsToChannel(input: [AssignProductsToChannelInput](/docs/graphql-api/admin/input-types#assignproductstochannelinput)!): [[Product](/docs/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## assignPromotionsToChannel
Assigns Promotions to the specified Channel

{{% gql-fields %}}
 * assignPromotionsToChannel(input: [AssignPromotionsToChannelInput](/docs/graphql-api/admin/input-types#assignpromotionstochannelinput)!): [[Promotion](/docs/graphql-api/admin/object-types#promotion)!]!
{{% /gql-fields %}}



## assignRoleToAdministrator
Assign a Role to an Administrator

{{% gql-fields %}}
 * assignRoleToAdministrator(administratorId: [ID](/docs/graphql-api/admin/object-types#id)!, roleId: [ID](/docs/graphql-api/admin/object-types#id)!): [Administrator](/docs/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## assignShippingMethodsToChannel
Assigns ShippingMethods to the specified Channel

{{% gql-fields %}}
 * assignShippingMethodsToChannel(input: [AssignShippingMethodsToChannelInput](/docs/graphql-api/admin/input-types#assignshippingmethodstochannelinput)!): [[ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!]!
{{% /gql-fields %}}



## assignStockLocationsToChannel
Assigns StockLocations to the specified Channel

{{% gql-fields %}}
 * assignStockLocationsToChannel(input: [AssignStockLocationsToChannelInput](/docs/graphql-api/admin/input-types#assignstocklocationstochannelinput)!): [[StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!]!
{{% /gql-fields %}}



## authenticate
Authenticates the user using a named authentication strategy

{{% gql-fields %}}
 * authenticate(input: [AuthenticationInput](/docs/graphql-api/admin/input-types#authenticationinput)!, rememberMe: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [AuthenticationResult](/docs/graphql-api/admin/object-types#authenticationresult)!
{{% /gql-fields %}}



## cancelJob
{{% gql-fields %}}
 * cancelJob(jobId: [ID](/docs/graphql-api/admin/object-types#id)!): [Job](/docs/graphql-api/admin/object-types#job)!
{{% /gql-fields %}}



## cancelOrder
{{% gql-fields %}}
 * cancelOrder(input: [CancelOrderInput](/docs/graphql-api/admin/input-types#cancelorderinput)!): [CancelOrderResult](/docs/graphql-api/admin/object-types#cancelorderresult)!
{{% /gql-fields %}}



## cancelPayment
{{% gql-fields %}}
 * cancelPayment(id: [ID](/docs/graphql-api/admin/object-types#id)!): [CancelPaymentResult](/docs/graphql-api/admin/object-types#cancelpaymentresult)!
{{% /gql-fields %}}



## createAdministrator
Create a new Administrator

{{% gql-fields %}}
 * createAdministrator(input: [CreateAdministratorInput](/docs/graphql-api/admin/input-types#createadministratorinput)!): [Administrator](/docs/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## createAssets
Create a new Asset

{{% gql-fields %}}
 * createAssets(input: [[CreateAssetInput](/docs/graphql-api/admin/input-types#createassetinput)!]!): [[CreateAssetResult](/docs/graphql-api/admin/object-types#createassetresult)!]!
{{% /gql-fields %}}



## createChannel
Create a new Channel

{{% gql-fields %}}
 * createChannel(input: [CreateChannelInput](/docs/graphql-api/admin/input-types#createchannelinput)!): [CreateChannelResult](/docs/graphql-api/admin/object-types#createchannelresult)!
{{% /gql-fields %}}



## createCollection
Create a new Collection

{{% gql-fields %}}
 * createCollection(input: [CreateCollectionInput](/docs/graphql-api/admin/input-types#createcollectioninput)!): [Collection](/docs/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## createCountry
Create a new Country

{{% gql-fields %}}
 * createCountry(input: [CreateCountryInput](/docs/graphql-api/admin/input-types#createcountryinput)!): [Country](/docs/graphql-api/admin/object-types#country)!
{{% /gql-fields %}}



## createCustomer
Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer.

{{% gql-fields %}}
 * createCustomer(input: [CreateCustomerInput](/docs/graphql-api/admin/input-types#createcustomerinput)!, password: [String](/docs/graphql-api/admin/object-types#string)): [CreateCustomerResult](/docs/graphql-api/admin/object-types#createcustomerresult)!
{{% /gql-fields %}}



## createCustomerAddress
Create a new Address and associate it with the Customer specified by customerId

{{% gql-fields %}}
 * createCustomerAddress(customerId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/docs/graphql-api/admin/input-types#createaddressinput)!): [Address](/docs/graphql-api/admin/object-types#address)!
{{% /gql-fields %}}



## createCustomerGroup
Create a new CustomerGroup

{{% gql-fields %}}
 * createCustomerGroup(input: [CreateCustomerGroupInput](/docs/graphql-api/admin/input-types#createcustomergroupinput)!): [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## createDraftOrder
Creates a draft Order

{{% gql-fields %}}
 * createDraftOrder: [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## createFacet
Create a new Facet

{{% gql-fields %}}
 * createFacet(input: [CreateFacetInput](/docs/graphql-api/admin/input-types#createfacetinput)!): [Facet](/docs/graphql-api/admin/object-types#facet)!
{{% /gql-fields %}}



## createFacetValues
Create one or more FacetValues

{{% gql-fields %}}
 * createFacetValues(input: [[CreateFacetValueInput](/docs/graphql-api/admin/input-types#createfacetvalueinput)!]!): [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
{{% /gql-fields %}}



## createPaymentMethod
Create existing PaymentMethod

{{% gql-fields %}}
 * createPaymentMethod(input: [CreatePaymentMethodInput](/docs/graphql-api/admin/input-types#createpaymentmethodinput)!): [PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)!
{{% /gql-fields %}}



## createProduct
Create a new Product

{{% gql-fields %}}
 * createProduct(input: [CreateProductInput](/docs/graphql-api/admin/input-types#createproductinput)!): [Product](/docs/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## createProductOption
Create a new ProductOption within a ProductOptionGroup

{{% gql-fields %}}
 * createProductOption(input: [CreateProductOptionInput](/docs/graphql-api/admin/input-types#createproductoptioninput)!): [ProductOption](/docs/graphql-api/admin/object-types#productoption)!
{{% /gql-fields %}}



## createProductOptionGroup
Create a new ProductOptionGroup

{{% gql-fields %}}
 * createProductOptionGroup(input: [CreateProductOptionGroupInput](/docs/graphql-api/admin/input-types#createproductoptiongroupinput)!): [ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)!
{{% /gql-fields %}}



## createProductVariants
Create a set of ProductVariants based on the OptionGroups assigned to the given Product

{{% gql-fields %}}
 * createProductVariants(input: [[CreateProductVariantInput](/docs/graphql-api/admin/input-types#createproductvariantinput)!]!): [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)]!
{{% /gql-fields %}}



## createPromotion
{{% gql-fields %}}
 * createPromotion(input: [CreatePromotionInput](/docs/graphql-api/admin/input-types#createpromotioninput)!): [CreatePromotionResult](/docs/graphql-api/admin/object-types#createpromotionresult)!
{{% /gql-fields %}}



## createProvince
Create a new Province

{{% gql-fields %}}
 * createProvince(input: [CreateProvinceInput](/docs/graphql-api/admin/input-types#createprovinceinput)!): [Province](/docs/graphql-api/admin/object-types#province)!
{{% /gql-fields %}}



## createRole
Create a new Role

{{% gql-fields %}}
 * createRole(input: [CreateRoleInput](/docs/graphql-api/admin/input-types#createroleinput)!): [Role](/docs/graphql-api/admin/object-types#role)!
{{% /gql-fields %}}



## createSeller
Create a new Seller

{{% gql-fields %}}
 * createSeller(input: [CreateSellerInput](/docs/graphql-api/admin/input-types#createsellerinput)!): [Seller](/docs/graphql-api/admin/object-types#seller)!
{{% /gql-fields %}}



## createShippingMethod
Create a new ShippingMethod

{{% gql-fields %}}
 * createShippingMethod(input: [CreateShippingMethodInput](/docs/graphql-api/admin/input-types#createshippingmethodinput)!): [ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!
{{% /gql-fields %}}



## createStockLocation
{{% gql-fields %}}
 * createStockLocation(input: [CreateStockLocationInput](/docs/graphql-api/admin/input-types#createstocklocationinput)!): [StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}



## createTag
Create a new Tag

{{% gql-fields %}}
 * createTag(input: [CreateTagInput](/docs/graphql-api/admin/input-types#createtaginput)!): [Tag](/docs/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## createTaxCategory
Create a new TaxCategory

{{% gql-fields %}}
 * createTaxCategory(input: [CreateTaxCategoryInput](/docs/graphql-api/admin/input-types#createtaxcategoryinput)!): [TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)!
{{% /gql-fields %}}



## createTaxRate
Create a new TaxRate

{{% gql-fields %}}
 * createTaxRate(input: [CreateTaxRateInput](/docs/graphql-api/admin/input-types#createtaxrateinput)!): [TaxRate](/docs/graphql-api/admin/object-types#taxrate)!
{{% /gql-fields %}}



## createZone
Create a new Zone

{{% gql-fields %}}
 * createZone(input: [CreateZoneInput](/docs/graphql-api/admin/input-types#createzoneinput)!): [Zone](/docs/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## deleteAdministrator
Delete an Administrator

{{% gql-fields %}}
 * deleteAdministrator(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteAdministrators
Delete multiple Administrators

{{% gql-fields %}}
 * deleteAdministrators(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteAsset
Delete an Asset

{{% gql-fields %}}
 * deleteAsset(input: [DeleteAssetInput](/docs/graphql-api/admin/input-types#deleteassetinput)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteAssets
Delete multiple Assets

{{% gql-fields %}}
 * deleteAssets(input: [DeleteAssetsInput](/docs/graphql-api/admin/input-types#deleteassetsinput)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteChannel
Delete a Channel

{{% gql-fields %}}
 * deleteChannel(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteChannels
Delete multiple Channels

{{% gql-fields %}}
 * deleteChannels(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCollection
Delete a Collection and all of its descendants

{{% gql-fields %}}
 * deleteCollection(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCollections
Delete multiple Collections and all of their descendants

{{% gql-fields %}}
 * deleteCollections(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCountries
Delete multiple Countries

{{% gql-fields %}}
 * deleteCountries(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCountry
Delete a Country

{{% gql-fields %}}
 * deleteCountry(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomer
Delete a Customer

{{% gql-fields %}}
 * deleteCustomer(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomerAddress
Update an existing Address

{{% gql-fields %}}
 * deleteCustomerAddress(id: [ID](/docs/graphql-api/admin/object-types#id)!): [Success](/docs/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## deleteCustomerGroup
Delete a CustomerGroup

{{% gql-fields %}}
 * deleteCustomerGroup(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomerGroups
Delete multiple CustomerGroups

{{% gql-fields %}}
 * deleteCustomerGroups(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteCustomerNote
{{% gql-fields %}}
 * deleteCustomerNote(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteCustomers
Deletes Customers

{{% gql-fields %}}
 * deleteCustomers(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteDraftOrder
Deletes a draft Order

{{% gql-fields %}}
 * deleteDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteFacet
Delete an existing Facet

{{% gql-fields %}}
 * deleteFacet(id: [ID](/docs/graphql-api/admin/object-types#id)!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteFacetValues
Delete one or more FacetValues

{{% gql-fields %}}
 * deleteFacetValues(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteFacets
Delete multiple existing Facets

{{% gql-fields %}}
 * deleteFacets(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteOrderNote
{{% gql-fields %}}
 * deleteOrderNote(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePaymentMethod
Delete a PaymentMethod

{{% gql-fields %}}
 * deletePaymentMethod(id: [ID](/docs/graphql-api/admin/object-types#id)!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePaymentMethods
Delete multiple PaymentMethods

{{% gql-fields %}}
 * deletePaymentMethods(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProduct
Delete a Product

{{% gql-fields %}}
 * deleteProduct(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductOption
Delete a ProductOption

{{% gql-fields %}}
 * deleteProductOption(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductVariant
Delete a ProductVariant

{{% gql-fields %}}
 * deleteProductVariant(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteProductVariants
Delete multiple ProductVariants

{{% gql-fields %}}
 * deleteProductVariants(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProducts
Delete multiple Products

{{% gql-fields %}}
 * deleteProducts(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deletePromotion
{{% gql-fields %}}
 * deletePromotion(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deletePromotions
{{% gql-fields %}}
 * deletePromotions(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteProvince
Delete a Province

{{% gql-fields %}}
 * deleteProvince(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteRole
Delete an existing Role

{{% gql-fields %}}
 * deleteRole(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteRoles
Delete multiple Roles

{{% gql-fields %}}
 * deleteRoles(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteSeller
Delete a Seller

{{% gql-fields %}}
 * deleteSeller(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteSellers
Delete multiple Sellers

{{% gql-fields %}}
 * deleteSellers(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteShippingMethod
Delete a ShippingMethod

{{% gql-fields %}}
 * deleteShippingMethod(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteShippingMethods
Delete multiple ShippingMethods

{{% gql-fields %}}
 * deleteShippingMethods(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteStockLocation
{{% gql-fields %}}
 * deleteStockLocation(input: [DeleteStockLocationInput](/docs/graphql-api/admin/input-types#deletestocklocationinput)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteStockLocations
{{% gql-fields %}}
 * deleteStockLocations(input: [[DeleteStockLocationInput](/docs/graphql-api/admin/input-types#deletestocklocationinput)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteTag
Delete an existing Tag

{{% gql-fields %}}
 * deleteTag(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxCategories
Deletes multiple TaxCategories

{{% gql-fields %}}
 * deleteTaxCategories(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteTaxCategory
Deletes a TaxCategory

{{% gql-fields %}}
 * deleteTaxCategory(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxRate
Delete a TaxRate

{{% gql-fields %}}
 * deleteTaxRate(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteTaxRates
Delete multiple TaxRates

{{% gql-fields %}}
 * deleteTaxRates(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## deleteZone
Delete a Zone

{{% gql-fields %}}
 * deleteZone(id: [ID](/docs/graphql-api/admin/object-types#id)!): [DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!
{{% /gql-fields %}}



## deleteZones
Delete a Zone

{{% gql-fields %}}
 * deleteZones(ids: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [[DeletionResponse](/docs/graphql-api/admin/object-types#deletionresponse)!]!
{{% /gql-fields %}}



## flushBufferedJobs
{{% gql-fields %}}
 * flushBufferedJobs(bufferIds: [[String](/docs/graphql-api/admin/object-types#string)!]): [Success](/docs/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## importProducts
{{% gql-fields %}}
 * importProducts(csvFile: [Upload](/docs/graphql-api/admin/object-types#upload)!): [ImportInfo](/docs/graphql-api/admin/object-types#importinfo)
{{% /gql-fields %}}



## login
Authenticates the user using the native authentication strategy. This mutation is an alias for `authenticate({ native: { ... }})`

{{% gql-fields %}}
 * login(username: [String](/docs/graphql-api/admin/object-types#string)!, password: [String](/docs/graphql-api/admin/object-types#string)!, rememberMe: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [NativeAuthenticationResult](/docs/graphql-api/admin/object-types#nativeauthenticationresult)!
{{% /gql-fields %}}



## logout
{{% gql-fields %}}
 * logout: [Success](/docs/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## modifyOrder
Allows an Order to be modified after it has been completed by the Customer. The Order must first
be in the `Modifying` state.

{{% gql-fields %}}
 * modifyOrder(input: [ModifyOrderInput](/docs/graphql-api/admin/input-types#modifyorderinput)!): [ModifyOrderResult](/docs/graphql-api/admin/object-types#modifyorderresult)!
{{% /gql-fields %}}



## moveCollection
Move a Collection to a different parent or index

{{% gql-fields %}}
 * moveCollection(input: [MoveCollectionInput](/docs/graphql-api/admin/input-types#movecollectioninput)!): [Collection](/docs/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## refundOrder
{{% gql-fields %}}
 * refundOrder(input: [RefundOrderInput](/docs/graphql-api/admin/input-types#refundorderinput)!): [RefundOrderResult](/docs/graphql-api/admin/object-types#refundorderresult)!
{{% /gql-fields %}}



## reindex
{{% gql-fields %}}
 * reindex: [Job](/docs/graphql-api/admin/object-types#job)!
{{% /gql-fields %}}



## removeCollectionsFromChannel
Removes Collections from the specified Channel

{{% gql-fields %}}
 * removeCollectionsFromChannel(input: [RemoveCollectionsFromChannelInput](/docs/graphql-api/admin/input-types#removecollectionsfromchannelinput)!): [[Collection](/docs/graphql-api/admin/object-types#collection)!]!
{{% /gql-fields %}}



## removeCouponCodeFromDraftOrder
Removes the given coupon code from the draft Order

{{% gql-fields %}}
 * removeCouponCodeFromDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, couponCode: [String](/docs/graphql-api/admin/object-types#string)!): [Order](/docs/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## removeCustomersFromGroup
Remove Customers from a CustomerGroup

{{% gql-fields %}}
 * removeCustomersFromGroup(customerGroupId: [ID](/docs/graphql-api/admin/object-types#id)!, customerIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## removeDraftOrderLine
Remove an OrderLine from the draft Order

{{% gql-fields %}}
 * removeDraftOrderLine(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!): [RemoveOrderItemsResult](/docs/graphql-api/admin/object-types#removeorderitemsresult)!
{{% /gql-fields %}}



## removeFacetsFromChannel
Removes Facets from the specified Channel

{{% gql-fields %}}
 * removeFacetsFromChannel(input: [RemoveFacetsFromChannelInput](/docs/graphql-api/admin/input-types#removefacetsfromchannelinput)!): [[RemoveFacetFromChannelResult](/docs/graphql-api/admin/object-types#removefacetfromchannelresult)!]!
{{% /gql-fields %}}



## removeMembersFromZone
Remove members from a Zone

{{% gql-fields %}}
 * removeMembersFromZone(zoneId: [ID](/docs/graphql-api/admin/object-types#id)!, memberIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!): [Zone](/docs/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



## removeOptionGroupFromProduct
Remove an OptionGroup from a Product. If the OptionGroup is in use by any ProductVariants
the mutation will return a ProductOptionInUseError, and the OptionGroup will not be removed.
Setting the `force` argument to `true` will override this and remove the OptionGroup anyway,
as well as removing any of the group's options from the Product's ProductVariants.

{{% gql-fields %}}
 * removeOptionGroupFromProduct(productId: [ID](/docs/graphql-api/admin/object-types#id)!, optionGroupId: [ID](/docs/graphql-api/admin/object-types#id)!, force: [Boolean](/docs/graphql-api/admin/object-types#boolean)): [RemoveOptionGroupFromProductResult](/docs/graphql-api/admin/object-types#removeoptiongroupfromproductresult)!
{{% /gql-fields %}}



## removePaymentMethodsFromChannel
Removes PaymentMethods from the specified Channel

{{% gql-fields %}}
 * removePaymentMethodsFromChannel(input: [RemovePaymentMethodsFromChannelInput](/docs/graphql-api/admin/input-types#removepaymentmethodsfromchannelinput)!): [[PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)!]!
{{% /gql-fields %}}



## removeProductVariantsFromChannel
Removes ProductVariants from the specified Channel

{{% gql-fields %}}
 * removeProductVariantsFromChannel(input: [RemoveProductVariantsFromChannelInput](/docs/graphql-api/admin/input-types#removeproductvariantsfromchannelinput)!): [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!]!
{{% /gql-fields %}}



## removeProductsFromChannel
Removes all ProductVariants of Product from the specified Channel

{{% gql-fields %}}
 * removeProductsFromChannel(input: [RemoveProductsFromChannelInput](/docs/graphql-api/admin/input-types#removeproductsfromchannelinput)!): [[Product](/docs/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## removePromotionsFromChannel
Removes Promotions from the specified Channel

{{% gql-fields %}}
 * removePromotionsFromChannel(input: [RemovePromotionsFromChannelInput](/docs/graphql-api/admin/input-types#removepromotionsfromchannelinput)!): [[Promotion](/docs/graphql-api/admin/object-types#promotion)!]!
{{% /gql-fields %}}



## removeSettledJobs
Remove all settled jobs in the given queues older than the given date. Returns the number of jobs deleted.

{{% gql-fields %}}
 * removeSettledJobs(queueNames: [[String](/docs/graphql-api/admin/object-types#string)!], olderThan: [DateTime](/docs/graphql-api/admin/object-types#datetime)): [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}



## removeShippingMethodsFromChannel
Removes ShippingMethods from the specified Channel

{{% gql-fields %}}
 * removeShippingMethodsFromChannel(input: [RemoveShippingMethodsFromChannelInput](/docs/graphql-api/admin/input-types#removeshippingmethodsfromchannelinput)!): [[ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!]!
{{% /gql-fields %}}



## removeStockLocationsFromChannel
Removes StockLocations from the specified Channel

{{% gql-fields %}}
 * removeStockLocationsFromChannel(input: [RemoveStockLocationsFromChannelInput](/docs/graphql-api/admin/input-types#removestocklocationsfromchannelinput)!): [[StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!]!
{{% /gql-fields %}}



## runPendingSearchIndexUpdates
{{% gql-fields %}}
 * runPendingSearchIndexUpdates: [Success](/docs/graphql-api/admin/object-types#success)!
{{% /gql-fields %}}



## setCustomerForDraftOrder
{{% gql-fields %}}
 * setCustomerForDraftOrder(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, customerId: [ID](/docs/graphql-api/admin/object-types#id), input: [CreateCustomerInput](/docs/graphql-api/admin/input-types#createcustomerinput)): [SetCustomerForDraftOrderResult](/docs/graphql-api/admin/object-types#setcustomerfordraftorderresult)!
{{% /gql-fields %}}



## setDraftOrderBillingAddress
Sets the billing address for a draft Order

{{% gql-fields %}}
 * setDraftOrderBillingAddress(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/docs/graphql-api/admin/input-types#createaddressinput)!): [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderCustomFields
Allows any custom fields to be set for the active order

{{% gql-fields %}}
 * setDraftOrderCustomFields(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [UpdateOrderInput](/docs/graphql-api/admin/input-types#updateorderinput)!): [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderShippingAddress
Sets the shipping address for a draft Order

{{% gql-fields %}}
 * setDraftOrderShippingAddress(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, input: [CreateAddressInput](/docs/graphql-api/admin/input-types#createaddressinput)!): [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}



## setDraftOrderShippingMethod
Sets the shipping method by id, which can be obtained with the `eligibleShippingMethodsForDraftOrder` query

{{% gql-fields %}}
 * setDraftOrderShippingMethod(orderId: [ID](/docs/graphql-api/admin/object-types#id)!, shippingMethodId: [ID](/docs/graphql-api/admin/object-types#id)!): [SetOrderShippingMethodResult](/docs/graphql-api/admin/object-types#setordershippingmethodresult)!
{{% /gql-fields %}}



## setOrderCustomFields
{{% gql-fields %}}
 * setOrderCustomFields(input: [UpdateOrderInput](/docs/graphql-api/admin/input-types#updateorderinput)!): [Order](/docs/graphql-api/admin/object-types#order)
{{% /gql-fields %}}



## settlePayment
{{% gql-fields %}}
 * settlePayment(id: [ID](/docs/graphql-api/admin/object-types#id)!): [SettlePaymentResult](/docs/graphql-api/admin/object-types#settlepaymentresult)!
{{% /gql-fields %}}



## settleRefund
{{% gql-fields %}}
 * settleRefund(input: [SettleRefundInput](/docs/graphql-api/admin/input-types#settlerefundinput)!): [SettleRefundResult](/docs/graphql-api/admin/object-types#settlerefundresult)!
{{% /gql-fields %}}



## transitionFulfillmentToState
{{% gql-fields %}}
 * transitionFulfillmentToState(id: [ID](/docs/graphql-api/admin/object-types#id)!, state: [String](/docs/graphql-api/admin/object-types#string)!): [TransitionFulfillmentToStateResult](/docs/graphql-api/admin/object-types#transitionfulfillmenttostateresult)!
{{% /gql-fields %}}



## transitionOrderToState
{{% gql-fields %}}
 * transitionOrderToState(id: [ID](/docs/graphql-api/admin/object-types#id)!, state: [String](/docs/graphql-api/admin/object-types#string)!): [TransitionOrderToStateResult](/docs/graphql-api/admin/object-types#transitionordertostateresult)
{{% /gql-fields %}}



## transitionPaymentToState
{{% gql-fields %}}
 * transitionPaymentToState(id: [ID](/docs/graphql-api/admin/object-types#id)!, state: [String](/docs/graphql-api/admin/object-types#string)!): [TransitionPaymentToStateResult](/docs/graphql-api/admin/object-types#transitionpaymenttostateresult)!
{{% /gql-fields %}}



## updateActiveAdministrator
Update the active (currently logged-in) Administrator

{{% gql-fields %}}
 * updateActiveAdministrator(input: [UpdateActiveAdministratorInput](/docs/graphql-api/admin/input-types#updateactiveadministratorinput)!): [Administrator](/docs/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## updateAdministrator
Update an existing Administrator

{{% gql-fields %}}
 * updateAdministrator(input: [UpdateAdministratorInput](/docs/graphql-api/admin/input-types#updateadministratorinput)!): [Administrator](/docs/graphql-api/admin/object-types#administrator)!
{{% /gql-fields %}}



## updateAsset
Update an existing Asset

{{% gql-fields %}}
 * updateAsset(input: [UpdateAssetInput](/docs/graphql-api/admin/input-types#updateassetinput)!): [Asset](/docs/graphql-api/admin/object-types#asset)!
{{% /gql-fields %}}



## updateChannel
Update an existing Channel

{{% gql-fields %}}
 * updateChannel(input: [UpdateChannelInput](/docs/graphql-api/admin/input-types#updatechannelinput)!): [UpdateChannelResult](/docs/graphql-api/admin/object-types#updatechannelresult)!
{{% /gql-fields %}}



## updateCollection
Update an existing Collection

{{% gql-fields %}}
 * updateCollection(input: [UpdateCollectionInput](/docs/graphql-api/admin/input-types#updatecollectioninput)!): [Collection](/docs/graphql-api/admin/object-types#collection)!
{{% /gql-fields %}}



## updateCountry
Update an existing Country

{{% gql-fields %}}
 * updateCountry(input: [UpdateCountryInput](/docs/graphql-api/admin/input-types#updatecountryinput)!): [Country](/docs/graphql-api/admin/object-types#country)!
{{% /gql-fields %}}



## updateCustomer
Update an existing Customer

{{% gql-fields %}}
 * updateCustomer(input: [UpdateCustomerInput](/docs/graphql-api/admin/input-types#updatecustomerinput)!): [UpdateCustomerResult](/docs/graphql-api/admin/object-types#updatecustomerresult)!
{{% /gql-fields %}}



## updateCustomerAddress
Update an existing Address

{{% gql-fields %}}
 * updateCustomerAddress(input: [UpdateAddressInput](/docs/graphql-api/admin/input-types#updateaddressinput)!): [Address](/docs/graphql-api/admin/object-types#address)!
{{% /gql-fields %}}



## updateCustomerGroup
Update an existing CustomerGroup

{{% gql-fields %}}
 * updateCustomerGroup(input: [UpdateCustomerGroupInput](/docs/graphql-api/admin/input-types#updatecustomergroupinput)!): [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!
{{% /gql-fields %}}



## updateCustomerNote
{{% gql-fields %}}
 * updateCustomerNote(input: [UpdateCustomerNoteInput](/docs/graphql-api/admin/input-types#updatecustomernoteinput)!): [HistoryEntry](/docs/graphql-api/admin/object-types#historyentry)!
{{% /gql-fields %}}



## updateFacet
Update an existing Facet

{{% gql-fields %}}
 * updateFacet(input: [UpdateFacetInput](/docs/graphql-api/admin/input-types#updatefacetinput)!): [Facet](/docs/graphql-api/admin/object-types#facet)!
{{% /gql-fields %}}



## updateFacetValues
Update one or more FacetValues

{{% gql-fields %}}
 * updateFacetValues(input: [[UpdateFacetValueInput](/docs/graphql-api/admin/input-types#updatefacetvalueinput)!]!): [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
{{% /gql-fields %}}



## updateGlobalSettings
{{% gql-fields %}}
 * updateGlobalSettings(input: [UpdateGlobalSettingsInput](/docs/graphql-api/admin/input-types#updateglobalsettingsinput)!): [UpdateGlobalSettingsResult](/docs/graphql-api/admin/object-types#updateglobalsettingsresult)!
{{% /gql-fields %}}



## updateOrderNote
{{% gql-fields %}}
 * updateOrderNote(input: [UpdateOrderNoteInput](/docs/graphql-api/admin/input-types#updateordernoteinput)!): [HistoryEntry](/docs/graphql-api/admin/object-types#historyentry)!
{{% /gql-fields %}}



## updatePaymentMethod
Update an existing PaymentMethod

{{% gql-fields %}}
 * updatePaymentMethod(input: [UpdatePaymentMethodInput](/docs/graphql-api/admin/input-types#updatepaymentmethodinput)!): [PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)!
{{% /gql-fields %}}



## updateProduct
Update an existing Product

{{% gql-fields %}}
 * updateProduct(input: [UpdateProductInput](/docs/graphql-api/admin/input-types#updateproductinput)!): [Product](/docs/graphql-api/admin/object-types#product)!
{{% /gql-fields %}}



## updateProductOption
Create a new ProductOption within a ProductOptionGroup

{{% gql-fields %}}
 * updateProductOption(input: [UpdateProductOptionInput](/docs/graphql-api/admin/input-types#updateproductoptioninput)!): [ProductOption](/docs/graphql-api/admin/object-types#productoption)!
{{% /gql-fields %}}



## updateProductOptionGroup
Update an existing ProductOptionGroup

{{% gql-fields %}}
 * updateProductOptionGroup(input: [UpdateProductOptionGroupInput](/docs/graphql-api/admin/input-types#updateproductoptiongroupinput)!): [ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)!
{{% /gql-fields %}}



## updateProductVariants
Update existing ProductVariants

{{% gql-fields %}}
 * updateProductVariants(input: [[UpdateProductVariantInput](/docs/graphql-api/admin/input-types#updateproductvariantinput)!]!): [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)]!
{{% /gql-fields %}}



## updateProducts
Update multiple existing Products

{{% gql-fields %}}
 * updateProducts(input: [[UpdateProductInput](/docs/graphql-api/admin/input-types#updateproductinput)!]!): [[Product](/docs/graphql-api/admin/object-types#product)!]!
{{% /gql-fields %}}



## updatePromotion
{{% gql-fields %}}
 * updatePromotion(input: [UpdatePromotionInput](/docs/graphql-api/admin/input-types#updatepromotioninput)!): [UpdatePromotionResult](/docs/graphql-api/admin/object-types#updatepromotionresult)!
{{% /gql-fields %}}



## updateProvince
Update an existing Province

{{% gql-fields %}}
 * updateProvince(input: [UpdateProvinceInput](/docs/graphql-api/admin/input-types#updateprovinceinput)!): [Province](/docs/graphql-api/admin/object-types#province)!
{{% /gql-fields %}}



## updateRole
Update an existing Role

{{% gql-fields %}}
 * updateRole(input: [UpdateRoleInput](/docs/graphql-api/admin/input-types#updateroleinput)!): [Role](/docs/graphql-api/admin/object-types#role)!
{{% /gql-fields %}}



## updateSeller
Update an existing Seller

{{% gql-fields %}}
 * updateSeller(input: [UpdateSellerInput](/docs/graphql-api/admin/input-types#updatesellerinput)!): [Seller](/docs/graphql-api/admin/object-types#seller)!
{{% /gql-fields %}}



## updateShippingMethod
Update an existing ShippingMethod

{{% gql-fields %}}
 * updateShippingMethod(input: [UpdateShippingMethodInput](/docs/graphql-api/admin/input-types#updateshippingmethodinput)!): [ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!
{{% /gql-fields %}}



## updateStockLocation
{{% gql-fields %}}
 * updateStockLocation(input: [UpdateStockLocationInput](/docs/graphql-api/admin/input-types#updatestocklocationinput)!): [StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}



## updateTag
Update an existing Tag

{{% gql-fields %}}
 * updateTag(input: [UpdateTagInput](/docs/graphql-api/admin/input-types#updatetaginput)!): [Tag](/docs/graphql-api/admin/object-types#tag)!
{{% /gql-fields %}}



## updateTaxCategory
Update an existing TaxCategory

{{% gql-fields %}}
 * updateTaxCategory(input: [UpdateTaxCategoryInput](/docs/graphql-api/admin/input-types#updatetaxcategoryinput)!): [TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)!
{{% /gql-fields %}}



## updateTaxRate
Update an existing TaxRate

{{% gql-fields %}}
 * updateTaxRate(input: [UpdateTaxRateInput](/docs/graphql-api/admin/input-types#updatetaxrateinput)!): [TaxRate](/docs/graphql-api/admin/object-types#taxrate)!
{{% /gql-fields %}}



## updateZone
Update an existing Zone

{{% gql-fields %}}
 * updateZone(input: [UpdateZoneInput](/docs/graphql-api/admin/input-types#updatezoneinput)!): [Zone](/docs/graphql-api/admin/object-types#zone)!
{{% /gql-fields %}}



