---
title: "Input Objects"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## AddItemInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AddItemInput</span> &#123;</div>
<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AddItemToDraftOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AddItemToDraftOrderInput</span> &#123;</div>
<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AddNoteToCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AddNoteToCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isPublic: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AddNoteToOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AddNoteToOrderInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isPublic: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdjustDraftOrderLineInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdjustDraftOrderLineInput</span> &#123;</div>
<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdministratorFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#administratorfilterparameter">AdministratorFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#administratorfilterparameter">AdministratorFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdministratorListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#administratorsortparameter">AdministratorSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#administratorfilterparameter">AdministratorFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorPaymentInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdministratorPaymentInput</span> &#123;</div>
<div class="graphql-code-line ">paymentMethod: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorRefundInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdministratorRefundInput</span> &#123;</div>
<div class="graphql-code-line ">paymentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">reason: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The amount to be refunded to this particular Payment. This was introduced in</div>

<div class="graphql-code-line comment">v2.2.0 as the preferred way to specify the refund amount. The `lines`, <code>shipping</code> and `adjustment`</div>

<div class="graphql-code-line comment">fields will be removed in a future version.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/admin/object-types#money">Money</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AdministratorSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssetFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssetFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">fileSize: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">mimeType: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">width: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">height: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">source: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#assetfilterparameter">AssetFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#assetfilterparameter">AssetFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssetListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssetListOptions</span> &#123;</div>
<div class="graphql-code-line ">tags: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">tagsOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#assetsortparameter">AssetSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#assetfilterparameter">AssetFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssetSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssetSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">fileSize: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">mimeType: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">width: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">height: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">source: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignAssetsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignAssetsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignCollectionsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignCollectionsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">collectionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignFacetsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignFacetsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">facetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignPaymentMethodsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignPaymentMethodsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">paymentMethodIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignProductVariantsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignProductVariantsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">productVariantIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">priceFactor: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignProductsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignProductsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">productIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">priceFactor: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignPromotionsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignPromotionsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">promotionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignShippingMethodsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignShippingMethodsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">shippingMethodIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssignStockLocationsToChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AssignStockLocationsToChannelInput</span> &#123;</div>
<div class="graphql-code-line ">stockLocationIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AuthenticationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AuthenticationInput</span> &#123;</div>
<div class="graphql-code-line ">native: <a href="/reference/graphql-api/admin/input-types#nativeauthinput">NativeAuthInput</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## BooleanListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Boolean fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">BooleanListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## BooleanOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a Boolean field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">BooleanOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CancelOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CancelOrderInput</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The id of the order to be cancelled</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Optionally specify which OrderLines to cancel. If not provided, all OrderLines will be cancelled</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/input-types#orderlineinput">OrderLineInput</a>!]</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specify whether the shipping charges should also be cancelled. Defaults to false</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">cancelShipping: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">reason: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ChannelFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ChannelFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">defaultLanguageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">defaultCurrencyCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">pricesIncludeTax: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#channelfilterparameter">ChannelFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#channelfilterparameter">ChannelFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ChannelListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ChannelListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#channelsortparameter">ChannelSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#channelfilterparameter">ChannelFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ChannelSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ChannelSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">inheritFilters: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#collectionfilterparameter">CollectionFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#collectionfilterparameter">CollectionFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionListOptions</span> &#123;</div>
<div class="graphql-code-line ">topLevelOnly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#collectionsortparameter">CollectionSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#collectionfilterparameter">CollectionFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArgInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ConfigArgInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A JSON stringified representation of the actual value</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ConfigurableOperationInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">arguments: [<a href="/reference/graphql-api/admin/input-types#configarginput">ConfigArgInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CoordinateInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CoordinateInput</span> &#123;</div>
<div class="graphql-code-line ">x: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">y: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountryFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CountryFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#countryfilterparameter">CountryFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#countryfilterparameter">CountryFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountryListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CountryListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#countrysortparameter">CountrySortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#countryfilterparameter">CountryFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountrySortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CountrySortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountryTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CountryTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateAddressInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Input used to create an Address.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">The countryCode must correspond to a <code>code</code> property of a Country that has been defined in the</div>

<div class="graphql-code-line top-level comment">Vendure server. The <code>code</code> property is typically a 2-character ISO code such as "GB", "US", "DE" etc.</div>

<div class="graphql-code-line top-level comment">If an invalid code is passed, the mutation will fail.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateAddressInput</span> &#123;</div>
<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateAdministratorInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateAdministratorInput</span> &#123;</div>
<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">roleIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateAssetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateAssetInput</span> &#123;</div>
<div class="graphql-code-line ">file: <a href="/reference/graphql-api/admin/object-types#upload">Upload</a>!</div>

<div class="graphql-code-line ">tags: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateChannelInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">defaultLanguageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">availableLanguageCodes: [<a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!]</div>

<div class="graphql-code-line ">pricesIncludeTax: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a></div>

<div class="graphql-code-line ">defaultCurrencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a></div>

<div class="graphql-code-line ">availableCurrencyCodes: [<a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!]</div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">defaultTaxZoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">defaultShippingZoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">sellerId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCollectionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCollectionInput</span> &#123;</div>
<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">inheritFilters: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">filters: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#createcollectiontranslationinput">CreateCollectionTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCollectionTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCollectionTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCountryInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCountryInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#countrytranslationinput">CountryTranslationInput</a>!]!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCustomerGroupInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCustomerGroupInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customerIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateFacetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateFacetInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#facettranslationinput">FacetTranslationInput</a>!]!</div>

<div class="graphql-code-line ">values: [<a href="/reference/graphql-api/admin/input-types#createfacetvaluewithfacetinput">CreateFacetValueWithFacetInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateFacetValueInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateFacetValueInput</span> &#123;</div>
<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#facetvaluetranslationinput">FacetValueTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateFacetValueWithFacetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateFacetValueWithFacetInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#facetvaluetranslationinput">FacetValueTranslationInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateGroupOptionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateGroupOptionInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiongrouptranslationinput">ProductOptionGroupTranslationInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreatePaymentMethodInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreatePaymentMethodInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a></div>

<div class="graphql-code-line ">handler: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#paymentmethodtranslationinput">PaymentMethodTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProductInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProductInput</span> &#123;</div>
<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#producttranslationinput">ProductTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProductOptionGroupInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProductOptionGroupInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiongrouptranslationinput">ProductOptionGroupTranslationInput</a>!]!</div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/admin/input-types#creategroupoptioninput">CreateGroupOptionInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProductOptionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProductOptionInput</span> &#123;</div>
<div class="graphql-code-line ">productOptionGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiongrouptranslationinput">ProductOptionGroupTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProductVariantInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProductVariantInput</span> &#123;</div>
<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productvarianttranslationinput">ProductVariantTranslationInput</a>!]!</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a></div>

<div class="graphql-code-line ">taxCategoryId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">optionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">stockLevels: [<a href="/reference/graphql-api/admin/input-types#stocklevelinput">StockLevelInput</a>!]</div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">useGlobalOutOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/enums#globalflag">GlobalFlag</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProductVariantOptionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProductVariantOptionInput</span> &#123;</div>
<div class="graphql-code-line ">optionGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiontranslationinput">ProductOptionTranslationInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreatePromotionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreatePromotionInput</span> &#123;</div>
<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">conditions: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]!</div>

<div class="graphql-code-line ">actions: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#promotiontranslationinput">PromotionTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateProvinceInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateProvinceInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#provincetranslationinput">ProvinceTranslationInput</a>!]!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateRoleInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateRoleInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]!</div>

<div class="graphql-code-line ">channelIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateSellerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateSellerInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateShippingMethodInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateShippingMethodInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fulfillmentHandler: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>

<div class="graphql-code-line ">calculator: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#shippingmethodtranslationinput">ShippingMethodTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateStockLocationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateStockLocationInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateTagInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateTagInput</span> &#123;</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateTaxCategoryInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateTaxCategoryInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isDefault: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateTaxRateInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateTaxRateInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">categoryId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">zoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">customerGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateZoneInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateZoneInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">memberIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#customerfilterparameter">CustomerFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#customerfilterparameter">CustomerFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroupFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerGroupFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#customergroupfilterparameter">CustomerGroupFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#customergroupfilterparameter">CustomerGroupFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroupListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerGroupListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#customergroupsortparameter">CustomerGroupSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#customergroupfilterparameter">CustomerGroupFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroupSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerGroupSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#customersortparameter">CustomerSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#customerfilterparameter">CustomerFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Date fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a DateTime field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">before: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">after: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">between: <a href="/reference/graphql-api/admin/input-types#daterange">DateRange</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateRange</span> &#123;</div>
<div class="graphql-code-line ">start: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">end: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DeleteAssetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DeleteAssetInput</span> &#123;</div>
<div class="graphql-code-line ">assetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">deleteFromAllChannels: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DeleteAssetsInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DeleteAssetsInput</span> &#123;</div>
<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">deleteFromAllChannels: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DeleteStockLocationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DeleteStockLocationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">transferToLocationId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DuplicateEntityInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DuplicateEntityInput</span> &#123;</div>
<div class="graphql-code-line ">entityName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">entityId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">duplicatorInput: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#facetfilterparameter">FacetFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#facetfilterparameter">FacetFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#facetsortparameter">FacetSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#facetfilterparameter">FacetFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueFilterInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Used to construct boolean expressions for filtering search results</div>

<div class="graphql-code-line top-level comment">by FacetValue ID. Examples:</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">* ID=1 OR ID=2: `&#123; facetValueFilters: [&#123; or: [1,2] &#125;] &#125;`</div>

<div class="graphql-code-line top-level comment">* ID=1 AND ID=2: `&#123; facetValueFilters: [&#123; and: 1 &#125;, &#123; and: 2 &#125;] &#125;`</div>

<div class="graphql-code-line top-level comment">* ID=1 AND (ID=2 OR ID=3): `&#123; facetValueFilters: [&#123; and: 1 &#125;, &#123; or: [2,3] &#125;] &#125;`</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueFilterInput</span> &#123;</div>
<div class="graphql-code-line ">and: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">or: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#facetvaluesortparameter">FacetValueSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FulfillOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FulfillOrderInput</span> &#123;</div>
<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/input-types#orderlineinput">OrderLineInput</a>!]!</div>

<div class="graphql-code-line ">handler: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntryFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">isPublic: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntryListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#historyentrysortparameter">HistoryEntrySortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntrySortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntrySortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IDListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of ID fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">IDListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IDOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on an ID field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">IDOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">notEq: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">in: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">notIn: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">JobFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">startedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">settledAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">queueName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">progress: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">isSettled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">duration: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">retries: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">attempts: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#jobfilterparameter">JobFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#jobfilterparameter">JobFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">JobListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#jobsortparameter">JobSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#jobfilterparameter">JobFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">JobSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">startedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">settledAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">queueName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">progress: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">duration: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">retries: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">attempts: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ManualPaymentInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ManualPaymentInput</span> &#123;</div>
<div class="graphql-code-line ">orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MetricSummaryInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">MetricSummaryInput</span> &#123;</div>
<div class="graphql-code-line ">interval: <a href="/reference/graphql-api/admin/enums#metricinterval">MetricInterval</a>!</div>

<div class="graphql-code-line ">types: [<a href="/reference/graphql-api/admin/enums#metrictype">MetricType</a>!]!</div>

<div class="graphql-code-line ">refresh: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ModifyOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ModifyOrderInput</span> &#123;</div>
<div class="graphql-code-line ">dryRun: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">addItems: [<a href="/reference/graphql-api/admin/input-types#additeminput">AddItemInput</a>!]</div>

<div class="graphql-code-line ">adjustOrderLines: [<a href="/reference/graphql-api/admin/input-types#orderlineinput">OrderLineInput</a>!]</div>

<div class="graphql-code-line ">surcharges: [<a href="/reference/graphql-api/admin/input-types#surchargeinput">SurchargeInput</a>!]</div>

<div class="graphql-code-line ">updateShippingAddress: <a href="/reference/graphql-api/admin/input-types#updateorderaddressinput">UpdateOrderAddressInput</a></div>

<div class="graphql-code-line ">updateBillingAddress: <a href="/reference/graphql-api/admin/input-types#updateorderaddressinput">UpdateOrderAddressInput</a></div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Deprecated in v2.2.0. Use <code>refunds</code> instead to allow multiple refunds to be</div>

<div class="graphql-code-line comment">applied in the case that multiple payment methods have been used on the order.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">refund: <a href="/reference/graphql-api/admin/input-types#administratorrefundinput">AdministratorRefundInput</a></div>

<div class="graphql-code-line ">refunds: [<a href="/reference/graphql-api/admin/input-types#administratorrefundinput">AdministratorRefundInput</a>!]</div>

<div class="graphql-code-line ">options: <a href="/reference/graphql-api/admin/input-types#modifyorderoptions">ModifyOrderOptions</a></div>

<div class="graphql-code-line ">couponCodes: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Added in v2.2</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">shippingMethodIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ModifyOrderOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ModifyOrderOptions</span> &#123;</div>
<div class="graphql-code-line ">freezePromotions: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">recalculateShipping: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MoveCollectionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">MoveCollectionInput</span> &#123;</div>
<div class="graphql-code-line ">collectionId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">index: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NativeAuthInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NativeAuthInput</span> &#123;</div>
<div class="graphql-code-line ">username: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Number fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a Int or Float field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">lt: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">lte: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">gt: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">gte: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">between: <a href="/reference/graphql-api/admin/input-types#numberrange">NumberRange</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberRange</span> &#123;</div>
<div class="graphql-code-line ">start: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">end: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">customerLastName: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">aggregateOrderId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">active: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#orderfilterparameter">OrderFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#orderfilterparameter">OrderFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderLineInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderLineInput</span> &#123;</div>
<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#ordersortparameter">OrderSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#orderfilterparameter">OrderFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderSortParameter</span> &#123;</div>
<div class="graphql-code-line ">customerLastName: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">aggregateOrderId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PaymentMethodFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#paymentmethodfilterparameter">PaymentMethodFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#paymentmethodfilterparameter">PaymentMethodFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PaymentMethodListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#paymentmethodsortparameter">PaymentMethodSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#paymentmethodfilterparameter">PaymentMethodFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PaymentMethodSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PaymentMethodTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PreviewCollectionVariantsInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PreviewCollectionVariantsInput</span> &#123;</div>
<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">inheritFilters: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">filters: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">facetValueId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#productfilterparameter">ProductFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#productfilterparameter">ProductFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#productsortparameter">ProductSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#productfilterparameter">ProductFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionGroupTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductOptionGroupTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductOptionTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">facetValueId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">stockAllocated: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">useGlobalOutOfStockThreshold: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#productvariantsortparameter">ProductVariantSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantPriceInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Used to set up update the price of a ProductVariant in a particular Channel.</div>

<div class="graphql-code-line top-level comment">If the <code>delete</code> flag is `true`, the price will be deleted for the given Channel.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantPriceInput</span> &#123;</div>
<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">delete: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantSortParameter</span> &#123;</div>
<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">stockAllocated: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PromotionFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#promotionfilterparameter">PromotionFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#promotionfilterparameter">PromotionFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PromotionListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#promotionsortparameter">PromotionSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#promotionfilterparameter">PromotionFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PromotionSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PromotionTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProvinceFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#provincefilterparameter">ProvinceFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#provincefilterparameter">ProvinceFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProvinceListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#provincesortparameter">ProvinceSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#provincefilterparameter">ProvinceFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProvinceSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProvinceTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RefundOrderInput</span> &#123;</div>
<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/input-types#orderlineinput">OrderLineInput</a>!]!</div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">adjustment: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">If an amount is specified, this value will be used to create a Refund rather than calculating the</div>

<div class="graphql-code-line comment">amount automatically. This was added in v2.2 and will be the preferred way to specify the refund</div>

<div class="graphql-code-line comment">amount in the future. The `lines`, <code>shipping</code> and <code>adjustment</code> fields will likely be removed in a future</div>

<div class="graphql-code-line comment">version.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/admin/object-types#money">Money</a></div>

<div class="graphql-code-line ">paymentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">reason: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveCollectionsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveCollectionsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">collectionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveFacetsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveFacetsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">facetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">force: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemovePaymentMethodsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemovePaymentMethodsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">paymentMethodIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveProductVariantsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveProductVariantsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">productVariantIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveProductsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveProductsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">productIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemovePromotionsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemovePromotionsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">promotionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveShippingMethodsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveShippingMethodsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">shippingMethodIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveStockLocationsFromChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RemoveStockLocationsFromChannelInput</span> &#123;</div>
<div class="graphql-code-line ">stockLocationIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">channelId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RoleFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RoleFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#rolefilterparameter">RoleFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#rolefilterparameter">RoleFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RoleListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RoleListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#rolesortparameter">RoleSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#rolefilterparameter">RoleFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RoleSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RoleSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SearchInput</span> &#123;</div>
<div class="graphql-code-line ">term: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">facetValueOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>

<div class="graphql-code-line ">facetValueFilters: [<a href="/reference/graphql-api/admin/input-types#facetvaluefilterinput">FacetValueFilterInput</a>!]</div>

<div class="graphql-code-line ">collectionId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">collectionSlug: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">groupByProduct: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#searchresultsortparameter">SearchResultSortParameter</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SearchResultSortParameter</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SellerFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SellerFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#sellerfilterparameter">SellerFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#sellerfilterparameter">SellerFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SellerListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SellerListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#sellersortparameter">SellerSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#sellerfilterparameter">SellerFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SellerSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SellerSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SetOrderCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SetOrderCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">orderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">customerId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SettleRefundInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SettleRefundInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ShippingMethodFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">fulfillmentHandlerCode: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#shippingmethodfilterparameter">ShippingMethodFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#shippingmethodfilterparameter">ShippingMethodFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ShippingMethodListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#shippingmethodsortparameter">ShippingMethodSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#shippingmethodfilterparameter">ShippingMethodFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ShippingMethodSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">fulfillmentHandlerCode: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ShippingMethodTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLevelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StockLevelInput</span> &#123;</div>
<div class="graphql-code-line ">stockLocationId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLocationFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StockLocationFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#stocklocationfilterparameter">StockLocationFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#stocklocationfilterparameter">StockLocationFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLocationListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StockLocationListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#stocklocationsortparameter">StockLocationSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#stocklocationfilterparameter">StockLocationFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLocationSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StockLocationSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockMovementListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StockMovementListOptions</span> &#123;</div>
<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a></div>

<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of String fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StringListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a String field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StringOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">notEq: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">contains: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">notContains: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">in: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">notIn: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">regex: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SurchargeInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SurchargeInput</span> &#123;</div>
<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceIncludesTax: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">taxDescription: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TagFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TagFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#tagfilterparameter">TagFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#tagfilterparameter">TagFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TagListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TagListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#tagsortparameter">TagSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#tagfilterparameter">TagFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TagSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TagSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategoryFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxCategoryFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">isDefault: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#taxcategoryfilterparameter">TaxCategoryFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#taxcategoryfilterparameter">TaxCategoryFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategoryListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxCategoryListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#taxcategorysortparameter">TaxCategorySortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#taxcategoryfilterparameter">TaxCategoryFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategorySortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxCategorySortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRateFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxRateFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#taxratefilterparameter">TaxRateFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#taxratefilterparameter">TaxRateFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRateListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxRateListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#taxratesortparameter">TaxRateSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#taxratefilterparameter">TaxRateFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRateSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TaxRateSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TestEligibleShippingMethodsInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TestEligibleShippingMethodsInput</span> &#123;</div>
<div class="graphql-code-line ">shippingAddress: <a href="/reference/graphql-api/admin/input-types#createaddressinput">CreateAddressInput</a>!</div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/input-types#testshippingmethodorderlineinput">TestShippingMethodOrderLineInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TestShippingMethodInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TestShippingMethodInput</span> &#123;</div>
<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>

<div class="graphql-code-line ">calculator: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!</div>

<div class="graphql-code-line ">shippingAddress: <a href="/reference/graphql-api/admin/input-types#createaddressinput">CreateAddressInput</a>!</div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/input-types#testshippingmethodorderlineinput">TestShippingMethodOrderLineInput</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TestShippingMethodOrderLineInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">TestShippingMethodOrderLineInput</span> &#123;</div>
<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateActiveAdministratorInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateActiveAdministratorInput</span> &#123;</div>
<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateAddressInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Input used to update an Address.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">The countryCode must correspond to a <code>code</code> property of a Country that has been defined in the</div>

<div class="graphql-code-line top-level comment">Vendure server. The <code>code</code> property is typically a 2-character ISO code such as "GB", "US", "DE" etc.</div>

<div class="graphql-code-line top-level comment">If an invalid code is passed, the mutation will fail.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateAddressInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateAdministratorInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateAdministratorInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">roleIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateAssetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateAssetInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">focalPoint: <a href="/reference/graphql-api/admin/input-types#coordinateinput">CoordinateInput</a></div>

<div class="graphql-code-line ">tags: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateChannelInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateChannelInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultLanguageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a></div>

<div class="graphql-code-line ">availableLanguageCodes: [<a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!]</div>

<div class="graphql-code-line ">pricesIncludeTax: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a></div>

<div class="graphql-code-line ">defaultCurrencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a></div>

<div class="graphql-code-line ">availableCurrencyCodes: [<a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!]</div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">defaultTaxZoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">defaultShippingZoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">sellerId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCollectionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCollectionInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">inheritFilters: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">filters: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#updatecollectiontranslationinput">UpdateCollectionTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCollectionTranslationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCollectionTranslationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCountryInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCountryInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#countrytranslationinput">CountryTranslationInput</a>!]</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCustomerGroupInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCustomerGroupInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCustomerNoteInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCustomerNoteInput</span> &#123;</div>
<div class="graphql-code-line ">noteId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateFacetInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateFacetInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#facettranslationinput">FacetTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateFacetValueInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateFacetValueInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#facetvaluetranslationinput">FacetValueTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateGlobalSettingsInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateGlobalSettingsInput</span> &#123;</div>
<div class="graphql-code-line ">availableLanguages: [<a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!]</div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateOrderAddressInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateOrderAddressInput</span> &#123;</div>
<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateOrderInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateOrderNoteInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateOrderNoteInput</span> &#123;</div>
<div class="graphql-code-line ">noteId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">isPublic: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdatePaymentMethodInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdatePaymentMethodInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a></div>

<div class="graphql-code-line ">handler: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#paymentmethodtranslationinput">PaymentMethodTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateProductInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateProductInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#producttranslationinput">ProductTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateProductOptionGroupInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateProductOptionGroupInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiongrouptranslationinput">ProductOptionGroupTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateProductOptionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateProductOptionInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productoptiongrouptranslationinput">ProductOptionGroupTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateProductVariantInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateProductVariantInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#productvarianttranslationinput">ProductVariantTranslationInput</a>!]</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">optionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">taxCategoryId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Sets the price for the ProductVariant in the Channel's default currency</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows multiple prices to be set for the ProductVariant in different currencies.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">prices: [<a href="/reference/graphql-api/admin/input-types#productvariantpriceinput">ProductVariantPriceInput</a>!]</div>

<div class="graphql-code-line ">featuredAssetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">assetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">stockLevels: [<a href="/reference/graphql-api/admin/input-types#stocklevelinput">StockLevelInput</a>!]</div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">useGlobalOutOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/enums#globalflag">GlobalFlag</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdatePromotionInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdatePromotionInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">conditions: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]</div>

<div class="graphql-code-line ">actions: [<a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a>!]</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#promotiontranslationinput">PromotionTranslationInput</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateProvinceInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateProvinceInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#provincetranslationinput">ProvinceTranslationInput</a>!]</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateRoleInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateRoleInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">channelIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateSellerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateSellerInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateShippingMethodInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateShippingMethodInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">fulfillmentHandler: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a></div>

<div class="graphql-code-line ">calculator: <a href="/reference/graphql-api/admin/input-types#configurableoperationinput">ConfigurableOperationInput</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/input-types#shippingmethodtranslationinput">ShippingMethodTranslationInput</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateStockLocationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateStockLocationInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateTagInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateTagInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateTaxCategoryInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateTaxCategoryInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">isDefault: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateTaxRateInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateTaxRateInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">categoryId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">zoneId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">customerGroupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateZoneInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateZoneInput</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ZoneFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ZoneFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/admin/input-types#zonefilterparameter">ZoneFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/admin/input-types#zonefilterparameter">ZoneFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ZoneListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ZoneListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/admin/input-types#zonesortparameter">ZoneSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/admin/input-types#zonefilterparameter">ZoneFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/admin/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ZoneSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ZoneSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
