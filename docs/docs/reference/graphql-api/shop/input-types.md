---
title: "Input Objects"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## AuthenticationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">AuthenticationInput</span> &#123;</div>
<div class="graphql-code-line ">native: <a href="/reference/graphql-api/shop/input-types#nativeauthinput">NativeAuthInput</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## BooleanListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Boolean fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">BooleanListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## BooleanOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a Boolean field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">BooleanOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#collectionfilterparameter">CollectionFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#collectionfilterparameter">CollectionFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionListOptions</span> &#123;</div>
<div class="graphql-code-line ">topLevelOnly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#collectionsortparameter">CollectionSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#collectionfilterparameter">CollectionFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CollectionSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArgInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ConfigArgInput</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A JSON stringified representation of the actual value</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperationInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ConfigurableOperationInput</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">arguments: [<a href="/reference/graphql-api/shop/input-types#configarginput">ConfigArgInput</a>!]!</div>


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
<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CreateCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#customerfilterparameter">CustomerFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#customerfilterparameter">CustomerFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#customersortparameter">CustomerSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#customerfilterparameter">CustomerFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">CustomerSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Date fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a DateTime field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">before: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">after: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">between: <a href="/reference/graphql-api/shop/input-types#daterange">DateRange</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">DateRange</span> &#123;</div>
<div class="graphql-code-line ">start: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">end: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#facetfilterparameter">FacetFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#facetfilterparameter">FacetFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#facetsortparameter">FacetSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#facetfilterparameter">FacetFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


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
<div class="graphql-code-line ">and: <a href="/reference/graphql-api/shop/object-types#id">ID</a></div>

<div class="graphql-code-line ">or: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#facetvaluesortparameter">FacetValueSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#facetvaluefilterparameter">FacetValueFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">FacetValueSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntryFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntryListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#historyentrysortparameter">HistoryEntrySortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#historyentryfilterparameter">HistoryEntryFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntrySortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">HistoryEntrySortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IDListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of ID fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">IDListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IDOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on an ID field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">IDOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">notEq: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">in: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">notIn: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NativeAuthInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NativeAuthInput</span> &#123;</div>
<div class="graphql-code-line ">username: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of Number fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a Int or Float field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">lt: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">lte: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">gt: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">gte: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">between: <a href="/reference/graphql-api/shop/input-types#numberrange">NumberRange</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NumberRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">NumberRange</span> &#123;</div>
<div class="graphql-code-line ">start: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">end: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">active: <a href="/reference/graphql-api/shop/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#orderfilterparameter">OrderFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#orderfilterparameter">OrderFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#ordersortparameter">OrderSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#orderfilterparameter">OrderFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">OrderSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Passed as input to the <code>addPaymentToOrder</code> mutation.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">PaymentInput</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">This field should correspond to the <code>code</code> property of a PaymentMethod.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">method: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">This field should contain arbitrary data passed to the specified PaymentMethodHandler's <code>createPayment()</code> method</div>

<div class="graphql-code-line comment">as the "metadata" argument. For example, it could contain an ID for the payment and other</div>

<div class="graphql-code-line comment">data generated by the payment provider.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/shop/object-types#json">JSON</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/input-types#booleanoperators">BooleanOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#productfilterparameter">ProductFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#productfilterparameter">ProductFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#productsortparameter">ProductSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#productfilterparameter">ProductFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantFilterParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantFilterParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/shop/input-types#idoperators">IDOperators</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/input-types#dateoperators">DateOperators</a></div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/input-types#numberoperators">NumberOperators</a></div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/shop/input-types#stringoperators">StringOperators</a></div>

<div class="graphql-code-line ">_and: [<a href="/reference/graphql-api/shop/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a>!]</div>

<div class="graphql-code-line ">_or: [<a href="/reference/graphql-api/shop/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantListOptions

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantListOptions</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Skips the first n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Takes n results, for use in pagination</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies which properties to sort the results by</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#productvariantsortparameter">ProductVariantSortParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Allows the results to be filtered</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filter: <a href="/reference/graphql-api/shop/input-types#productvariantfilterparameter">ProductVariantFilterParameter</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Specifies whether multiple top-level "filter" fields should be combined with a logical AND or OR operation. Defaults to AND.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">filterOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">ProductVariantSortParameter</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RegisterCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">RegisterCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">password: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SearchInput</span> &#123;</div>
<div class="graphql-code-line ">term: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]</div>

<div class="graphql-code-line ">facetValueOperator: <a href="/reference/graphql-api/shop/enums#logicaloperator">LogicalOperator</a></div>

<div class="graphql-code-line ">facetValueFilters: [<a href="/reference/graphql-api/shop/input-types#facetvaluefilterinput">FacetValueFilterInput</a>!]</div>

<div class="graphql-code-line ">collectionId: <a href="/reference/graphql-api/shop/object-types#id">ID</a></div>

<div class="graphql-code-line ">collectionSlug: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">groupByProduct: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">take: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">skip: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">sort: <a href="/reference/graphql-api/shop/input-types#searchresultsortparameter">SearchResultSortParameter</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultSortParameter

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">SearchResultSortParameter</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/enums#sortorder">SortOrder</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringListOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a list of String fields</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StringListOperators</span> &#123;</div>
<div class="graphql-code-line ">inList: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringOperators

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Operators for filtering on a String field</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">StringOperators</span> &#123;</div>
<div class="graphql-code-line ">eq: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">notEq: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">contains: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">notContains: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">in: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">notIn: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">regex: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">isNull: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>


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
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateCustomerInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateCustomerInput</span> &#123;</div>
<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## UpdateOrderInput

<div class="graphql-code-block">
<div class="graphql-code-line top-level">input <span class="graphql-code-identifier">UpdateOrderInput</span> &#123;</div>
<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
