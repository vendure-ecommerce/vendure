---
title: "Queries"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## activeAdministrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">activeAdministrator: <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## activeChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">activeChannel: <a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## administrator
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">administrator(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## administrators
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">administrators(options: <a href="/reference/graphql-api/admin/input-types#administratorlistoptions">AdministratorListOptions</a>): <a href="/reference/graphql-api/admin/object-types#administratorlist">AdministratorList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## asset
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a single Asset by id</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">asset(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#asset">Asset</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## assets
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a list of Assets</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">assets(options: <a href="/reference/graphql-api/admin/input-types#assetlistoptions">AssetListOptions</a>): <a href="/reference/graphql-api/admin/object-types#assetlist">AssetList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## channel
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">channel(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#channel">Channel</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## channels
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">channels(options: <a href="/reference/graphql-api/admin/input-types#channellistoptions">ChannelListOptions</a>): <a href="/reference/graphql-api/admin/object-types#channellist">ChannelList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## collection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a Collection either by id or slug. If neither id nor slug is specified, an error will result.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">collection(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>, slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>): <a href="/reference/graphql-api/admin/object-types#collection">Collection</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## collectionFilters
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">collectionFilters: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## collections
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">collections(options: <a href="/reference/graphql-api/admin/input-types#collectionlistoptions">CollectionListOptions</a>): <a href="/reference/graphql-api/admin/object-types#collectionlist">CollectionList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## countries
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">countries(options: <a href="/reference/graphql-api/admin/input-types#countrylistoptions">CountryListOptions</a>): <a href="/reference/graphql-api/admin/object-types#countrylist">CountryList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## country
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">country(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#country">Country</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## customer
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">customer(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#customer">Customer</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## customerGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">customerGroup(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## customerGroups
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">customerGroups(options: <a href="/reference/graphql-api/admin/input-types#customergrouplistoptions">CustomerGroupListOptions</a>): <a href="/reference/graphql-api/admin/object-types#customergrouplist">CustomerGroupList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## customers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">customers(options: <a href="/reference/graphql-api/admin/input-types#customerlistoptions">CustomerListOptions</a>): <a href="/reference/graphql-api/admin/object-types#customerlist">CustomerList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## eligibleShippingMethodsForDraftOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns a list of eligible shipping methods for the draft Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">eligibleShippingMethodsForDraftOrder(orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): [<a href="/reference/graphql-api/admin/object-types#shippingmethodquote">ShippingMethodQuote</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## entityDuplicators
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns all configured EntityDuplicators.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">entityDuplicators: [<a href="/reference/graphql-api/admin/object-types#entityduplicatordefinition">EntityDuplicatorDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## facet
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">facet(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#facet">Facet</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## facetValues
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">facetValues(options: <a href="/reference/graphql-api/admin/input-types#facetvaluelistoptions">FacetValueListOptions</a>): <a href="/reference/graphql-api/admin/object-types#facetvaluelist">FacetValueList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## facets
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">facets(options: <a href="/reference/graphql-api/admin/input-types#facetlistoptions">FacetListOptions</a>): <a href="/reference/graphql-api/admin/object-types#facetlist">FacetList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## fulfillmentHandlers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">fulfillmentHandlers: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## globalSettings
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">globalSettings: <a href="/reference/graphql-api/admin/object-types#globalsettings">GlobalSettings</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## job
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">job(jobId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#job">Job</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## jobBufferSize
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">jobBufferSize(bufferIds: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]): [<a href="/reference/graphql-api/admin/object-types#jobbuffersize">JobBufferSize</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## jobQueues
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">jobQueues: [<a href="/reference/graphql-api/admin/object-types#jobqueue">JobQueue</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## jobs
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">jobs(options: <a href="/reference/graphql-api/admin/input-types#joblistoptions">JobListOptions</a>): <a href="/reference/graphql-api/admin/object-types#joblist">JobList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## jobsById
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">jobsById(jobIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!): [<a href="/reference/graphql-api/admin/object-types#job">Job</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## me
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">me: <a href="/reference/graphql-api/admin/object-types#currentuser">CurrentUser</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## metricSummary
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get metrics for the given interval and metric types.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">metricSummary(input: <a href="/reference/graphql-api/admin/input-types#metricsummaryinput">MetricSummaryInput</a>): [<a href="/reference/graphql-api/admin/object-types#metricsummary">MetricSummary</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## order
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">order(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## orders
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">orders(options: <a href="/reference/graphql-api/admin/input-types#orderlistoptions">OrderListOptions</a>): <a href="/reference/graphql-api/admin/object-types#orderlist">OrderList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## paymentMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">paymentMethod(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## paymentMethodEligibilityCheckers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">paymentMethodEligibilityCheckers: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## paymentMethodHandlers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">paymentMethodHandlers: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## paymentMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">paymentMethods(options: <a href="/reference/graphql-api/admin/input-types#paymentmethodlistoptions">PaymentMethodListOptions</a>): <a href="/reference/graphql-api/admin/object-types#paymentmethodlist">PaymentMethodList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## pendingSearchIndexUpdates
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">pendingSearchIndexUpdates: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## previewCollectionVariants
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Used for real-time previews of the contents of a Collection</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">previewCollectionVariants(input: <a href="/reference/graphql-api/admin/input-types#previewcollectionvariantsinput">PreviewCollectionVariantsInput</a>!, options: <a href="/reference/graphql-api/admin/input-types#productvariantlistoptions">ProductVariantListOptions</a>): <a href="/reference/graphql-api/admin/object-types#productvariantlist">ProductVariantList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## product
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a Product either by id or slug. If neither id nor slug is specified, an error will result.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">product(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>, slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>): <a href="/reference/graphql-api/admin/object-types#product">Product</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## productOptionGroup
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">productOptionGroup(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## productOptionGroups
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">productOptionGroups(filterTerm: <a href="/reference/graphql-api/admin/object-types#string">String</a>): [<a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## productVariant
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a ProductVariant by id</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">productVariant(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## productVariants
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">List ProductVariants either all or for the specific product.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">productVariants(options: <a href="/reference/graphql-api/admin/input-types#productvariantlistoptions">ProductVariantListOptions</a>, productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>): <a href="/reference/graphql-api/admin/object-types#productvariantlist">ProductVariantList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## products
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">List Products</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">products(options: <a href="/reference/graphql-api/admin/input-types#productlistoptions">ProductListOptions</a>): <a href="/reference/graphql-api/admin/object-types#productlist">ProductList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## promotion
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">promotion(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## promotionActions
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">promotionActions: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## promotionConditions
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">promotionConditions: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## promotions
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">promotions(options: <a href="/reference/graphql-api/admin/input-types#promotionlistoptions">PromotionListOptions</a>): <a href="/reference/graphql-api/admin/object-types#promotionlist">PromotionList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## province
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">province(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#province">Province</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## provinces
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">provinces(options: <a href="/reference/graphql-api/admin/input-types#provincelistoptions">ProvinceListOptions</a>): <a href="/reference/graphql-api/admin/object-types#provincelist">ProvinceList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## role
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">role(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#role">Role</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## roles
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">roles(options: <a href="/reference/graphql-api/admin/input-types#rolelistoptions">RoleListOptions</a>): <a href="/reference/graphql-api/admin/object-types#rolelist">RoleList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## search
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">search(input: <a href="/reference/graphql-api/admin/input-types#searchinput">SearchInput</a>!): <a href="/reference/graphql-api/admin/object-types#searchresponse">SearchResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## seller
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">seller(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#seller">Seller</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## sellers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">sellers(options: <a href="/reference/graphql-api/admin/input-types#sellerlistoptions">SellerListOptions</a>): <a href="/reference/graphql-api/admin/object-types#sellerlist">SellerList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## shippingCalculators
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">shippingCalculators: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## shippingEligibilityCheckers
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">shippingEligibilityCheckers: [<a href="/reference/graphql-api/admin/object-types#configurableoperationdefinition">ConfigurableOperationDefinition</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## shippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">shippingMethod(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## shippingMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">shippingMethods(options: <a href="/reference/graphql-api/admin/input-types#shippingmethodlistoptions">ShippingMethodListOptions</a>): <a href="/reference/graphql-api/admin/object-types#shippingmethodlist">ShippingMethodList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## stockLocation
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">stockLocation(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## stockLocations
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">stockLocations(options: <a href="/reference/graphql-api/admin/input-types#stocklocationlistoptions">StockLocationListOptions</a>): <a href="/reference/graphql-api/admin/object-types#stocklocationlist">StockLocationList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## tag
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">tag(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#tag">Tag</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## tags
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">tags(options: <a href="/reference/graphql-api/admin/input-types#taglistoptions">TagListOptions</a>): <a href="/reference/graphql-api/admin/object-types#taglist">TagList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## taxCategories
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">taxCategories(options: <a href="/reference/graphql-api/admin/input-types#taxcategorylistoptions">TaxCategoryListOptions</a>): <a href="/reference/graphql-api/admin/object-types#taxcategorylist">TaxCategoryList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## taxCategory
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">taxCategory(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## taxRate
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">taxRate(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#taxrate">TaxRate</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## taxRates
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">taxRates(options: <a href="/reference/graphql-api/admin/input-types#taxratelistoptions">TaxRateListOptions</a>): <a href="/reference/graphql-api/admin/object-types#taxratelist">TaxRateList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## testEligibleShippingMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">testEligibleShippingMethods(input: <a href="/reference/graphql-api/admin/input-types#testeligibleshippingmethodsinput">TestEligibleShippingMethodsInput</a>!): [<a href="/reference/graphql-api/admin/object-types#shippingmethodquote">ShippingMethodQuote</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## testShippingMethod
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">testShippingMethod(input: <a href="/reference/graphql-api/admin/input-types#testshippingmethodinput">TestShippingMethodInput</a>!): <a href="/reference/graphql-api/admin/object-types#testshippingmethodresult">TestShippingMethodResult</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## zone
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">zone(id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!): <a href="/reference/graphql-api/admin/object-types#zone">Zone</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## zones
<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">zones(options: <a href="/reference/graphql-api/admin/input-types#zonelistoptions">ZoneListOptions</a>): <a href="/reference/graphql-api/admin/object-types#zonelist">ZoneList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
