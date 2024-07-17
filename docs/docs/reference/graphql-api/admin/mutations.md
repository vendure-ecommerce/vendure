---
title: "Mutations"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## addCustomersToGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Add Customers to a CustomerGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addCustomersToGroup(customerGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, customerIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addFulfillmentToOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addFulfillmentToOrder(input: <a href="/reference/graphql-api/admin/input-types#fulfillorderinput">FulfillOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#addfulfillmenttoorderresult">AddFulfillmentToOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addItemToDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Adds an item to the draft Order.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addItemToDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#additemtodraftorderinput">AddItemToDraftOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#updateorderitemsresult">UpdateOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addManualPaymentToOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Used to manually create a new Payment against an Order.</div>

<div class="graphql-code-line top-level comment">This can be used by an Administrator when an Order is in the ArrangingPayment state.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">It is also used when a completed Order</div>

<div class="graphql-code-line top-level comment">has been modified (using `modifyOrder`) and the price has increased. The extra payment</div>

<div class="graphql-code-line top-level comment">can then be manually arranged by the administrator, and the details used to create a new</div>

<div class="graphql-code-line top-level comment">Payment.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addManualPaymentToOrder(input: <a href="/reference/graphql-api/admin/input-types#manualpaymentinput">ManualPaymentInput</a>!): <a href="/reference/graphql-api/admin/object-types#addmanualpaymenttoorderresult">AddManualPaymentToOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addMembersToZone
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Add members to a Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addMembersToZone(zoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, memberIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): <a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addNoteToCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addNoteToCustomer(input: <a href="/reference/graphql-api/admin/input-types#addnotetocustomerinput">AddNoteToCustomerInput</a>!): <a href="/reference/graphql-api/admin/object-types#customer">Customer</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addNoteToOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addNoteToOrder(input: <a href="/reference/graphql-api/admin/input-types#addnotetoorderinput">AddNoteToOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## addOptionGroupToProduct
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Add an OptionGroup to a Product</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">addOptionGroupToProduct(productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, optionGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#product">Product</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## adjustDraftOrderLine
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Adjusts a draft OrderLine. If custom fields are defined on the OrderLine entity, a third argument 'customFields' of type <code>OrderLineCustomFieldsInput</code> will be available.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">adjustDraftOrderLine(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#adjustdraftorderlineinput">AdjustDraftOrderLineInput</a>!): <a href="/reference/graphql-api/admin/object-types#updateorderitemsresult">UpdateOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## applyCouponCodeToDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Applies the given coupon code to the draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">applyCouponCodeToDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!): <a href="/reference/graphql-api/admin/object-types#applycouponcoderesult">ApplyCouponCodeResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignAssetsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assign assets to channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignAssetsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignassetstochannelinput">AssignAssetsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignCollectionsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns Collections to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignCollectionsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assigncollectionstochannelinput">AssignCollectionsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignFacetsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns Facets to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignFacetsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignfacetstochannelinput">AssignFacetsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#facet">Facet</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignPaymentMethodsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns PaymentMethods to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignPaymentMethodsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignpaymentmethodstochannelinput">AssignPaymentMethodsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignProductVariantsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns ProductVariants to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignProductVariantsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignproductvariantstochannelinput">AssignProductVariantsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignProductsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns all ProductVariants of Product to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignProductsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignproductstochannelinput">AssignProductsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#product">Product</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignPromotionsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns Promotions to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignPromotionsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignpromotionstochannelinput">AssignPromotionsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignRoleToAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assign a Role to an Administrator</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignRoleToAdministrator(administratorId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, roleId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignShippingMethodsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns ShippingMethods to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignShippingMethodsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignshippingmethodstochannelinput">AssignShippingMethodsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assignStockLocationsToChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Assigns StockLocations to the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">assignStockLocationsToChannel(input: <a href="/reference/graphql-api/admin/input-types#assignstocklocationstochannelinput">AssignStockLocationsToChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## authenticate
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Authenticates the user using a named authentication strategy</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">authenticate(input: <a href="/reference/graphql-api/admin/input-types#authenticationinput">AuthenticationInput</a>!, rememberMe: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/admin/object-types#authenticationresult">AuthenticationResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## cancelJob
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">cancelJob(jobId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#job">Job</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## cancelOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">cancelOrder(input: <a href="/reference/graphql-api/admin/input-types#cancelorderinput">CancelOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#cancelorderresult">CancelOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## cancelPayment
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">cancelPayment(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#cancelpaymentresult">CancelPaymentResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Administrator</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createAdministrator(input: <a href="/reference/graphql-api/admin/input-types#createadministratorinput">CreateAdministratorInput</a>!): <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createAssets
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Asset</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createAssets(input: [<a href="/reference/graphql-api/admin/input-types#createassetinput">CreateAssetInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#createassetresult">CreateAssetResult</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createChannel(input: <a href="/reference/graphql-api/admin/input-types#createchannelinput">CreateChannelInput</a>!): <a href="/reference/graphql-api/admin/object-types#createchannelresult">CreateChannelResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCollection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Collection</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCollection(input: <a href="/reference/graphql-api/admin/input-types#createcollectioninput">CreateCollectionInput</a>!): <a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCountry
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Country</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCountry(input: <a href="/reference/graphql-api/admin/input-types#createcountryinput">CreateCountryInput</a>!): <a href="/reference/graphql-api/admin/object-types#country">Country</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Customer. If a password is provided, a new User will also be created an linked to the Customer.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCustomer(input: <a href="/reference/graphql-api/admin/input-types#createcustomerinput">CreateCustomerInput</a>!, password: <a href="/reference/graphql-api/admin/object-types#string">String</a>): <a href="/reference/graphql-api/admin/object-types#createcustomerresult">CreateCustomerResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Address and associate it with the Customer specified by customerId</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCustomerAddress(customerId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/admin/object-types#address">Address</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createCustomerGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new CustomerGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createCustomerGroup(input: <a href="/reference/graphql-api/admin/input-types#createcustomergroupinput">CreateCustomerGroupInput</a>!): <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Creates a draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createDraftOrder: <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createFacet
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Facet</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createFacet(input: <a href="/reference/graphql-api/admin/input-types#createfacetinput">CreateFacetInput</a>!): <a href="/reference/graphql-api/admin/object-types#facet">Facet</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createFacetValues
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create one or more FacetValues</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createFacetValues(input: [<a href="/reference/graphql-api/admin/input-types#createfacetvalueinput">CreateFacetValueInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createPaymentMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create existing PaymentMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createPaymentMethod(input: <a href="/reference/graphql-api/admin/input-types#createpaymentmethodinput">CreatePaymentMethodInput</a>!): <a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createProduct
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Product</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createProduct(input: <a href="/reference/graphql-api/admin/input-types#createproductinput">CreateProductInput</a>!): <a href="/reference/graphql-api/admin/object-types#product">Product</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createProductOption
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new ProductOption within a ProductOptionGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createProductOption(input: <a href="/reference/graphql-api/admin/input-types#createproductoptioninput">CreateProductOptionInput</a>!): <a href="/reference/graphql-api/admin/object-types#productoption">ProductOption</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createProductOptionGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new ProductOptionGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createProductOptionGroup(input: <a href="/reference/graphql-api/admin/input-types#createproductoptiongroupinput">CreateProductOptionGroupInput</a>!): <a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createProductVariants
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a set of ProductVariants based on the OptionGroups assigned to the given Product</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createProductVariants(input: [<a href="/reference/graphql-api/admin/input-types#createproductvariantinput">CreateProductVariantInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createPromotion
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createPromotion(input: <a href="/reference/graphql-api/admin/input-types#createpromotioninput">CreatePromotionInput</a>!): <a href="/reference/graphql-api/admin/object-types#createpromotionresult">CreatePromotionResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createProvince
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Province</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createProvince(input: <a href="/reference/graphql-api/admin/input-types#createprovinceinput">CreateProvinceInput</a>!): <a href="/reference/graphql-api/admin/object-types#province">Province</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createRole
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Role</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createRole(input: <a href="/reference/graphql-api/admin/input-types#createroleinput">CreateRoleInput</a>!): <a href="/reference/graphql-api/admin/object-types#role">Role</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createSeller
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Seller</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createSeller(input: <a href="/reference/graphql-api/admin/input-types#createsellerinput">CreateSellerInput</a>!): <a href="/reference/graphql-api/admin/object-types#seller">Seller</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new ShippingMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createShippingMethod(input: <a href="/reference/graphql-api/admin/input-types#createshippingmethodinput">CreateShippingMethodInput</a>!): <a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createStockLocation
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createStockLocation(input: <a href="/reference/graphql-api/admin/input-types#createstocklocationinput">CreateStockLocationInput</a>!): <a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createTag
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Tag</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createTag(input: <a href="/reference/graphql-api/admin/input-types#createtaginput">CreateTagInput</a>!): <a href="/reference/graphql-api/admin/object-types#tag">Tag</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createTaxCategory
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new TaxCategory</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createTaxCategory(input: <a href="/reference/graphql-api/admin/input-types#createtaxcategoryinput">CreateTaxCategoryInput</a>!): <a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createTaxRate
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new TaxRate</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createTaxRate(input: <a href="/reference/graphql-api/admin/input-types#createtaxrateinput">CreateTaxRateInput</a>!): <a href="/reference/graphql-api/admin/object-types#taxrate">TaxRate</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## createZone
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">createZone(input: <a href="/reference/graphql-api/admin/input-types#createzoneinput">CreateZoneInput</a>!): <a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an Administrator</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteAdministrator(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteAdministrators
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Administrators</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteAdministrators(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteAsset
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an Asset</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteAsset(input: <a href="/reference/graphql-api/admin/input-types#deleteassetinput">DeleteAssetInput</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteAssets
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Assets</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteAssets(input: <a href="/reference/graphql-api/admin/input-types#deleteassetsinput">DeleteAssetsInput</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteChannel(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteChannels
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Channels</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteChannels(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCollection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Collection and all of its descendants</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCollection(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCollections
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Collections and all of their descendants</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCollections(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCountries
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Countries</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCountries(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCountry
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Country</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCountry(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Customer</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomer(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Address</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomerAddress(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomerGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a CustomerGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomerGroup(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomerGroups
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple CustomerGroups</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomerGroups(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomerNote
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomerNote(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteCustomers
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Deletes Customers</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteCustomers(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Deletes a draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteFacet
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an existing Facet</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteFacet(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteFacetValues
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete one or more FacetValues</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteFacetValues(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteFacets
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple existing Facets</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteFacets(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteOrderNote
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteOrderNote(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deletePaymentMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a PaymentMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deletePaymentMethod(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deletePaymentMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple PaymentMethods</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deletePaymentMethods(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProduct
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Product</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProduct(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProductOption
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a ProductOption</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProductOption(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProductVariant
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a ProductVariant</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProductVariant(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProductVariants
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple ProductVariants</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProductVariants(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProducts
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Products</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProducts(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deletePromotion
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deletePromotion(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deletePromotions
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deletePromotions(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteProvince
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Province</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteProvince(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteRole
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an existing Role</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteRole(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteRoles
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Roles</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteRoles(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteSeller
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Seller</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteSeller(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteSellers
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple Sellers</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteSellers(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a ShippingMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteShippingMethod(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteShippingMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple ShippingMethods</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteShippingMethods(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteStockLocation
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteStockLocation(input: <a href="/reference/graphql-api/admin/input-types#deletestocklocationinput">DeleteStockLocationInput</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteStockLocations
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteStockLocations(input: [<a href="/reference/graphql-api/admin/input-types#deletestocklocationinput">DeleteStockLocationInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteTag
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete an existing Tag</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteTag(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteTaxCategories
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Deletes multiple TaxCategories</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteTaxCategories(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteTaxCategory
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Deletes a TaxCategory</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteTaxCategory(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteTaxRate
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a TaxRate</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteTaxRate(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteTaxRates
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete multiple TaxRates</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteTaxRates(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteZone
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteZone(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## deleteZones
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Delete a Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">deleteZones(ids: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#deletionresponse">DeletionResponse</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## duplicateEntity
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Duplicate an existing entity using a specific EntityDuplicator.</div>

<div class="graphql-code-line top-level comment">Since v2.2.0.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">duplicateEntity(input: <a href="/reference/graphql-api/admin/input-types#duplicateentityinput">DuplicateEntityInput</a>!): <a href="/reference/graphql-api/admin/object-types#duplicateentityresult">DuplicateEntityResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## flushBufferedJobs
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">flushBufferedJobs(bufferIds: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]): <a href="/reference/graphql-api/admin/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## importProducts
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">importProducts(csvFile: <a href="/reference/graphql-api/admin/object-types#upload">Upload</a>!): <a href="/reference/graphql-api/admin/object-types#importinfo">ImportInfo</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## login
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Authenticates the user using the native authentication strategy. This mutation is an alias for authenticate(&#123; native: &#123; ... &#125;&#125;)</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">The <code>rememberMe</code> option applies when using cookie-based sessions, and if <code>true</code> it will set the maxAge of the session cookie</div>

<div class="graphql-code-line top-level comment">to 1 year.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">login(username: <a href="/reference/graphql-api/admin/object-types#string">String</a>!, password: <a href="/reference/graphql-api/admin/object-types#string">String</a>!, rememberMe: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/admin/object-types#nativeauthenticationresult">NativeAuthenticationResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## logout
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">logout: <a href="/reference/graphql-api/admin/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## modifyOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Allows an Order to be modified after it has been completed by the Customer. The Order must first</div>

<div class="graphql-code-line top-level comment">be in the <code>Modifying</code> state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">modifyOrder(input: <a href="/reference/graphql-api/admin/input-types#modifyorderinput">ModifyOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#modifyorderresult">ModifyOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## moveCollection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Move a Collection to a different parent or index</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">moveCollection(input: <a href="/reference/graphql-api/admin/input-types#movecollectioninput">MoveCollectionInput</a>!): <a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## refundOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">refundOrder(input: <a href="/reference/graphql-api/admin/input-types#refundorderinput">RefundOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#refundorderresult">RefundOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## reindex
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">reindex: <a href="/reference/graphql-api/admin/object-types#job">Job</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeCollectionsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes Collections from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeCollectionsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removecollectionsfromchannelinput">RemoveCollectionsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeCouponCodeFromDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes the given coupon code from the draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeCouponCodeFromDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeCustomersFromGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove Customers from a CustomerGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeCustomersFromGroup(customerGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, customerIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeDraftOrderLine
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove an OrderLine from the draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeDraftOrderLine(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#removeorderitemsresult">RemoveOrderItemsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeFacetsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes Facets from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeFacetsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removefacetsfromchannelinput">RemoveFacetsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#removefacetfromchannelresult">RemoveFacetFromChannelResult</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeMembersFromZone
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove members from a Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeMembersFromZone(zoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, memberIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): <a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeOptionGroupFromProduct
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove an OptionGroup from a Product. If the OptionGroup is in use by any ProductVariants</div>

<div class="graphql-code-line top-level comment">the mutation will return a ProductOptionInUseError, and the OptionGroup will not be removed.</div>

<div class="graphql-code-line top-level comment">Setting the <code>force</code> argument to <code>true</code> will override this and remove the OptionGroup anyway,</div>

<div class="graphql-code-line top-level comment">as well as removing any of the group's options from the Product's ProductVariants.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeOptionGroupFromProduct(productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, optionGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>): <a href="/reference/graphql-api/admin/object-types#removeoptiongroupfromproductresult">RemoveOptionGroupFromProductResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removePaymentMethodsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes PaymentMethods from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removePaymentMethodsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removepaymentmethodsfromchannelinput">RemovePaymentMethodsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeProductVariantsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes ProductVariants from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeProductVariantsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removeproductvariantsfromchannelinput">RemoveProductVariantsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeProductsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes all ProductVariants of Product from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeProductsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removeproductsfromchannelinput">RemoveProductsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#product">Product</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removePromotionsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes Promotions from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removePromotionsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removepromotionsfromchannelinput">RemovePromotionsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeSettledJobs
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Remove all settled jobs in the given queues older than the given date. Returns the number of jobs deleted.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeSettledJobs(queueNames: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!], olderThan: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>): <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeShippingMethodsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes ShippingMethods from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeShippingMethodsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removeshippingmethodsfromchannelinput">RemoveShippingMethodsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## removeStockLocationsFromChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Removes StockLocations from the specified Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">removeStockLocationsFromChannel(input: <a href="/reference/graphql-api/admin/input-types#removestocklocationsfromchannelinput">RemoveStockLocationsFromChannelInput</a>!): [<a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## runPendingSearchIndexUpdates
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">runPendingSearchIndexUpdates: <a href="/reference/graphql-api/admin/object-types#success">Success</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setCustomerForDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setCustomerForDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, customerId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>, input: <a href="/reference/graphql-api/admin/input-types#createcustomerinput">CreateCustomerInput</a>): <a href="/reference/graphql-api/admin/object-types#setcustomerfordraftorderresult">SetCustomerForDraftOrderResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setDraftOrderBillingAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the billing address for a draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setDraftOrderBillingAddress(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setDraftOrderCustomFields
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Allows any custom fields to be set for the active order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setDraftOrderCustomFields(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#updateorderinput">UpdateOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setDraftOrderShippingAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the shipping address for a draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setDraftOrderShippingAddress(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, input: <a href="/reference/graphql-api/admin/input-types#createaddressinput">CreateAddressInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setDraftOrderShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Sets the shipping method by id, which can be obtained with the <code>eligibleShippingMethodsForDraftOrder</code> query</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setDraftOrderShippingMethod(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, shippingMethodId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#setordershippingmethodresult">SetOrderShippingMethodResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderCustomFields
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderCustomFields(input: <a href="/reference/graphql-api/admin/input-types#updateorderinput">UpdateOrderInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## setOrderCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Allows a different Customer to be assigned to an Order. Added in v2.2.0.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">setOrderCustomer(input: <a href="/reference/graphql-api/admin/input-types#setordercustomerinput">SetOrderCustomerInput</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## settlePayment
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">settlePayment(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#settlepaymentresult">SettlePaymentResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## settleRefund
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">settleRefund(input: <a href="/reference/graphql-api/admin/input-types#settlerefundinput">SettleRefundInput</a>!): <a href="/reference/graphql-api/admin/object-types#settlerefundresult">SettleRefundResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## transitionFulfillmentToState
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">transitionFulfillmentToState(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!): <a href="/reference/graphql-api/admin/object-types#transitionfulfillmenttostateresult">TransitionFulfillmentToStateResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## transitionOrderToState
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">transitionOrderToState(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!): <a href="/reference/graphql-api/admin/object-types#transitionordertostateresult">TransitionOrderToStateResult</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## transitionPaymentToState
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">transitionPaymentToState(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!, state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!): <a href="/reference/graphql-api/admin/object-types#transitionpaymenttostateresult">TransitionPaymentToStateResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateActiveAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update the active (currently logged-in) Administrator</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateActiveAdministrator(input: <a href="/reference/graphql-api/admin/input-types#updateactiveadministratorinput">UpdateActiveAdministratorInput</a>!): <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Administrator</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateAdministrator(input: <a href="/reference/graphql-api/admin/input-types#updateadministratorinput">UpdateAdministratorInput</a>!): <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateAsset
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Asset</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateAsset(input: <a href="/reference/graphql-api/admin/input-types#updateassetinput">UpdateAssetInput</a>!): <a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateChannel(input: <a href="/reference/graphql-api/admin/input-types#updatechannelinput">UpdateChannelInput</a>!): <a href="/reference/graphql-api/admin/object-types#updatechannelresult">UpdateChannelResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCollection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Collection</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCollection(input: <a href="/reference/graphql-api/admin/input-types#updatecollectioninput">UpdateCollectionInput</a>!): <a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCountry
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Country</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCountry(input: <a href="/reference/graphql-api/admin/input-types#updatecountryinput">UpdateCountryInput</a>!): <a href="/reference/graphql-api/admin/object-types#country">Country</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Customer</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomer(input: <a href="/reference/graphql-api/admin/input-types#updatecustomerinput">UpdateCustomerInput</a>!): <a href="/reference/graphql-api/admin/object-types#updatecustomerresult">UpdateCustomerResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerAddress
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Address</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerAddress(input: <a href="/reference/graphql-api/admin/input-types#updateaddressinput">UpdateAddressInput</a>!): <a href="/reference/graphql-api/admin/object-types#address">Address</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing CustomerGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerGroup(input: <a href="/reference/graphql-api/admin/input-types#updatecustomergroupinput">UpdateCustomerGroupInput</a>!): <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateCustomerNote
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateCustomerNote(input: <a href="/reference/graphql-api/admin/input-types#updatecustomernoteinput">UpdateCustomerNoteInput</a>!): <a href="/reference/graphql-api/admin/object-types#historyentry">HistoryEntry</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateFacet
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Facet</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateFacet(input: <a href="/reference/graphql-api/admin/input-types#updatefacetinput">UpdateFacetInput</a>!): <a href="/reference/graphql-api/admin/object-types#facet">Facet</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateFacetValues
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update one or more FacetValues</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateFacetValues(input: [<a href="/reference/graphql-api/admin/input-types#updatefacetvalueinput">UpdateFacetValueInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateGlobalSettings
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateGlobalSettings(input: <a href="/reference/graphql-api/admin/input-types#updateglobalsettingsinput">UpdateGlobalSettingsInput</a>!): <a href="/reference/graphql-api/admin/object-types#updateglobalsettingsresult">UpdateGlobalSettingsResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateOrderNote
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateOrderNote(input: <a href="/reference/graphql-api/admin/input-types#updateordernoteinput">UpdateOrderNoteInput</a>!): <a href="/reference/graphql-api/admin/object-types#historyentry">HistoryEntry</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updatePaymentMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing PaymentMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updatePaymentMethod(input: <a href="/reference/graphql-api/admin/input-types#updatepaymentmethodinput">UpdatePaymentMethodInput</a>!): <a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProduct
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Product</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProduct(input: <a href="/reference/graphql-api/admin/input-types#updateproductinput">UpdateProductInput</a>!): <a href="/reference/graphql-api/admin/object-types#product">Product</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProductOption
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Create a new ProductOption within a ProductOptionGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProductOption(input: <a href="/reference/graphql-api/admin/input-types#updateproductoptioninput">UpdateProductOptionInput</a>!): <a href="/reference/graphql-api/admin/object-types#productoption">ProductOption</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProductOptionGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing ProductOptionGroup</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProductOptionGroup(input: <a href="/reference/graphql-api/admin/input-types#updateproductoptiongroupinput">UpdateProductOptionGroupInput</a>!): <a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProductVariants
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update existing ProductVariants</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProductVariants(input: [<a href="/reference/graphql-api/admin/input-types#updateproductvariantinput">UpdateProductVariantInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProducts
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update multiple existing Products</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProducts(input: [<a href="/reference/graphql-api/admin/input-types#updateproductinput">UpdateProductInput</a>!]!): [<a href="/reference/graphql-api/admin/object-types#product">Product</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updatePromotion
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updatePromotion(input: <a href="/reference/graphql-api/admin/input-types#updatepromotioninput">UpdatePromotionInput</a>!): <a href="/reference/graphql-api/admin/object-types#updatepromotionresult">UpdatePromotionResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateProvince
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Province</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateProvince(input: <a href="/reference/graphql-api/admin/input-types#updateprovinceinput">UpdateProvinceInput</a>!): <a href="/reference/graphql-api/admin/object-types#province">Province</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateRole
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Role</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateRole(input: <a href="/reference/graphql-api/admin/input-types#updateroleinput">UpdateRoleInput</a>!): <a href="/reference/graphql-api/admin/object-types#role">Role</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateSeller
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Seller</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateSeller(input: <a href="/reference/graphql-api/admin/input-types#updatesellerinput">UpdateSellerInput</a>!): <a href="/reference/graphql-api/admin/object-types#seller">Seller</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing ShippingMethod</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateShippingMethod(input: <a href="/reference/graphql-api/admin/input-types#updateshippingmethodinput">UpdateShippingMethodInput</a>!): <a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateStockLocation
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateStockLocation(input: <a href="/reference/graphql-api/admin/input-types#updatestocklocationinput">UpdateStockLocationInput</a>!): <a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateTag
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Tag</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateTag(input: <a href="/reference/graphql-api/admin/input-types#updatetaginput">UpdateTagInput</a>!): <a href="/reference/graphql-api/admin/object-types#tag">Tag</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateTaxCategory
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing TaxCategory</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateTaxCategory(input: <a href="/reference/graphql-api/admin/input-types#updatetaxcategoryinput">UpdateTaxCategoryInput</a>!): <a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateTaxRate
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing TaxRate</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateTaxRate(input: <a href="/reference/graphql-api/admin/input-types#updatetaxrateinput">UpdateTaxRateInput</a>!): <a href="/reference/graphql-api/admin/object-types#taxrate">TaxRate</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## updateZone
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Update an existing Zone</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Mutation</span> &#123;</div>
<div class="graphql-code-line ">updateZone(input: <a href="/reference/graphql-api/admin/input-types#updatezoneinput">UpdateZoneInput</a>!): <a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
