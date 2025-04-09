---
title: "Queries"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## activeChannel
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The active Channel</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">activeChannel: <a href="/reference/graphql-api/shop/object-types#channel">Channel</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## activeCustomer
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The active Customer</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">activeCustomer: <a href="/reference/graphql-api/shop/object-types#customer">Customer</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## activeOrder
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The active Order. Will be <code>null</code> until an Order is created via `addItemToOrder`. Once an Order reaches the</div>

<div class="graphql-code-line top-level comment">state of <code>PaymentAuthorized</code> or `PaymentSettled`, then that Order is no longer considered "active" and this</div>

<div class="graphql-code-line top-level comment">query will once again return `null`.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">activeOrder: <a href="/reference/graphql-api/shop/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## availableCountries
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">An array of supported Countries</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">availableCountries: [<a href="/reference/graphql-api/shop/object-types#country">Country</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## collection
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns a Collection either by its id or slug. If neither 'id' nor 'slug' is specified, an error will result.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">collection(id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>, slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>): <a href="/reference/graphql-api/shop/object-types#collection">Collection</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## collections
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">A list of Collections available to the shop</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">collections(options: <a href="/reference/graphql-api/shop/input-types#collectionlistoptions">CollectionListOptions</a>): <a href="/reference/graphql-api/shop/object-types#collectionlist">CollectionList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## eligiblePaymentMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns a list of payment methods and their eligibility based on the current active Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">eligiblePaymentMethods: [<a href="/reference/graphql-api/shop/object-types#paymentmethodquote">PaymentMethodQuote</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## eligibleShippingMethods
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns a list of eligible shipping methods based on the current active Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">eligibleShippingMethods: [<a href="/reference/graphql-api/shop/object-types#shippingmethodquote">ShippingMethodQuote</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## facet
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns a Facet by its id</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">facet(id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!): <a href="/reference/graphql-api/shop/object-types#facet">Facet</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## facets
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">A list of Facets available to the shop</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">facets(options: <a href="/reference/graphql-api/shop/input-types#facetlistoptions">FacetListOptions</a>): <a href="/reference/graphql-api/shop/object-types#facetlist">FacetList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## me
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns information about the current authenticated User</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">me: <a href="/reference/graphql-api/shop/object-types#currentuser">CurrentUser</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## nextOrderStates
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns the possible next states that the activeOrder can transition to</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">nextOrderStates: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## order
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns an Order based on the id. Note that in the Shop API, only orders belonging to the</div>

<div class="graphql-code-line top-level comment">currently-authenticated User may be queried.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">order(id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!): <a href="/reference/graphql-api/shop/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## orderByCode
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returns an Order based on the order `code`. For guest Orders (i.e. Orders placed by non-authenticated Customers)</div>

<div class="graphql-code-line top-level comment">this query will only return the Order within 2 hours of the Order being placed. This allows an Order confirmation</div>

<div class="graphql-code-line top-level comment">screen to be shown immediately after completion of a guest checkout, yet prevents security risks of allowing</div>

<div class="graphql-code-line top-level comment">general anonymous access to Order data.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">orderByCode(code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!): <a href="/reference/graphql-api/shop/object-types#order">Order</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## product
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a Product either by id or slug. If neither 'id' nor 'slug' is specified, an error will result.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">product(id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>, slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>): <a href="/reference/graphql-api/shop/object-types#product">Product</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## products
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Get a list of Products</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">products(options: <a href="/reference/graphql-api/shop/input-types#productlistoptions">ProductListOptions</a>): <a href="/reference/graphql-api/shop/object-types#productlist">ProductList</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## search
<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Search Products based on the criteria set by the `SearchInput`</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Query</span> &#123;</div>
<div class="graphql-code-line ">search(input: <a href="/reference/graphql-api/shop/input-types#searchinput">SearchInput</a>!): <a href="/reference/graphql-api/shop/object-types#searchresponse">SearchResponse</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
