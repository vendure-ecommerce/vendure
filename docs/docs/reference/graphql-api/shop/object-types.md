---
title: "Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## ActiveOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">ActiveOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#noactiveordererror">NoActiveOrderError</a></div>
</div>

## AddPaymentToOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">AddPaymentToOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#orderpaymentstateerror">OrderPaymentStateError</a> | <a href="/reference/graphql-api/shop/object-types#ineligiblepaymentmethoderror">IneligiblePaymentMethodError</a> | <a href="/reference/graphql-api/shop/object-types#paymentfailederror">PaymentFailedError</a> | <a href="/reference/graphql-api/shop/object-types#paymentdeclinederror">PaymentDeclinedError</a> | <a href="/reference/graphql-api/shop/object-types#orderstatetransitionerror">OrderStateTransitionError</a> | <a href="/reference/graphql-api/shop/object-types#noactiveordererror">NoActiveOrderError</a></div>
</div>

## Address

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Address</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">country: <a href="/reference/graphql-api/shop/object-types#country">Country</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Adjustment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Adjustment</span> &#123;</div>
<div class="graphql-code-line ">adjustmentSource: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/enums#adjustmenttype">AdjustmentType</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">data: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AlreadyLoggedInError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set the Customer for an Order when already logged in.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AlreadyLoggedInError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ApplyCouponCodeResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">ApplyCouponCodeResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#couponcodeexpirederror">CouponCodeExpiredError</a> | <a href="/reference/graphql-api/shop/object-types#couponcodeinvaliderror">CouponCodeInvalidError</a> | <a href="/reference/graphql-api/shop/object-types#couponcodelimiterror">CouponCodeLimitError</a></div>
</div>

## Asset

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Asset</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/enums#assettype">AssetType</a>!</div>

<div class="graphql-code-line ">fileSize: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">mimeType: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">width: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">height: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">source: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">focalPoint: <a href="/reference/graphql-api/shop/object-types#coordinate">Coordinate</a></div>

<div class="graphql-code-line ">tags: [<a href="/reference/graphql-api/shop/object-types#tag">Tag</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssetList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AssetList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AuthenticationMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AuthenticationMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">strategy: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AuthenticationResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">AuthenticationResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/shop/object-types#invalidcredentialserror">InvalidCredentialsError</a> | <a href="/reference/graphql-api/shop/object-types#notverifiederror">NotVerifiedError</a></div>
</div>

## Boolean

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Boolean</code> scalar type represents <code>true</code> or `false`.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Boolean</span></div>
</div>

## BooleanCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">BooleanCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Channel

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Channel</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">defaultTaxZone: <a href="/reference/graphql-api/shop/object-types#zone">Zone</a></div>

<div class="graphql-code-line ">defaultShippingZone: <a href="/reference/graphql-api/shop/object-types#zone">Zone</a></div>

<div class="graphql-code-line ">defaultLanguageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">availableLanguageCodes: [<a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!]</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">defaultCurrencyCode: <a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">availableCurrencyCodes: [<a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Not yet used - will be implemented in a future release.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Not yet used - will be implemented in a future release.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">pricesIncludeTax: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">seller: <a href="/reference/graphql-api/shop/object-types#seller">Seller</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Collection

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Collection</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">breadcrumbs: [<a href="/reference/graphql-api/shop/object-types#collectionbreadcrumb">CollectionBreadcrumb</a>!]!</div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/shop/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/shop/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/shop/object-types#collection">Collection</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">children: [<a href="/reference/graphql-api/shop/object-types#collection">Collection</a>!]</div>

<div class="graphql-code-line ">filters: [<a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#collectiontranslation">CollectionTranslation</a>!]!</div>

<div class="graphql-code-line ">productVariants(options: <a href="/reference/graphql-api/shop/input-types#productvariantlistoptions">ProductVariantListOptions</a>): <a href="/reference/graphql-api/shop/object-types#productvariantlist">ProductVariantList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionBreadcrumb

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionBreadcrumb</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#collection">Collection</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Which Collections are present in the products returned</div>

<div class="graphql-code-line top-level comment">by the search, and in what quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionResult</span> &#123;</div>
<div class="graphql-code-line ">collection: <a href="/reference/graphql-api/shop/object-types#collection">Collection</a>!</div>

<div class="graphql-code-line ">count: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArg

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigArg</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArgDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigArgDefinition</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">required: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">defaultValue: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>

<div class="graphql-code-line ">label: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigurableOperation</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">args: [<a href="/reference/graphql-api/shop/object-types#configarg">ConfigArg</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperationDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigurableOperationDefinition</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">args: [<a href="/reference/graphql-api/shop/object-types#configargdefinition">ConfigArgDefinition</a>!]!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Coordinate

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Coordinate</span> &#123;</div>
<div class="graphql-code-line ">x: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">y: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Country

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">A Country of the world which your shop operates in.</div>

<div class="graphql-code-line top-level comment"></div>

<div class="graphql-code-line top-level comment">The <code>code</code> field is typically a 2-character ISO code such as "GB", "US", "DE" etc. This code is used in certain inputs such as</div>

<div class="graphql-code-line top-level comment">`UpdateAddressInput` and <code>CreateAddressInput</code> to specify the country.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Country</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/shop/object-types#region">Region</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/shop/object-types#id">ID</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#regiontranslation">RegionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountryList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CountryList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#country">Country</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeExpiredError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeExpiredError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeInvalidError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeInvalidError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeLimitError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeLimitError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">limit: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CurrentUser

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CurrentUser</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">identifier: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/shop/object-types#currentuserchannel">CurrentUserChannel</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CurrentUserChannel

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CurrentUserChannel</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CustomFieldConfig</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#stringcustomfieldconfig">StringCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#localestringcustomfieldconfig">LocaleStringCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#intcustomfieldconfig">IntCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#floatcustomfieldconfig">FloatCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#booleancustomfieldconfig">BooleanCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#datetimecustomfieldconfig">DateTimeCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#relationcustomfieldconfig">RelationCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#textcustomfieldconfig">TextCustomFieldConfig</a> | <a href="/reference/graphql-api/shop/object-types#localetextcustomfieldconfig">LocaleTextCustomFieldConfig</a></div>
</div>

## Customer

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Customer</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">addresses: [<a href="/reference/graphql-api/shop/object-types#address">Address</a>!]</div>

<div class="graphql-code-line ">orders(options: <a href="/reference/graphql-api/shop/input-types#orderlistoptions">OrderListOptions</a>): <a href="/reference/graphql-api/shop/object-types#orderlist">OrderList</a>!</div>

<div class="graphql-code-line ">user: <a href="/reference/graphql-api/shop/object-types#user">User</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroup

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomerGroup</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customers(options: <a href="/reference/graphql-api/shop/input-types#customerlistoptions">CustomerListOptions</a>): <a href="/reference/graphql-api/shop/object-types#customerlist">CustomerList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomerList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#customer">Customer</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DateTime

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the <code>date-time</code> format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">DateTime</span></div>
</div>

## DateTimeCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Expects the same validation formats as the <code>&lt;input type="datetime-local"&gt;</code> HTML element.</div>

<div class="graphql-code-line top-level comment">See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">DateTimeCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DeletionResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">DeletionResponse</span> &#123;</div>
<div class="graphql-code-line ">result: <a href="/reference/graphql-api/shop/enums#deletionresult">DeletionResult</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Discount

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Discount</span> &#123;</div>
<div class="graphql-code-line ">adjustmentSource: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/enums#adjustmenttype">AdjustmentType</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">amountWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## EmailAddressConflictError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to create a Customer with an email address already registered to an existing User.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">EmailAddressConflictError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Facet

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Facet</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">values: [<a href="/reference/graphql-api/shop/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns a paginated, sortable, filterable list of the Facet's values. Added in v2.1.0.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">valueList(options: <a href="/reference/graphql-api/shop/input-types#facetvaluelistoptions">FacetValueListOptions</a>): <a href="/reference/graphql-api/shop/object-types#facetvaluelist">FacetValueList</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#facettranslation">FacetTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#facet">Facet</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValue

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValue</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">facet: <a href="/reference/graphql-api/shop/object-types#facet">Facet</a>!</div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#facetvaluetranslation">FacetValueTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Which FacetValues are present in the products returned</div>

<div class="graphql-code-line top-level comment">by the search, and in what quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueResult</span> &#123;</div>
<div class="graphql-code-line ">facetValue: <a href="/reference/graphql-api/shop/object-types#facetvalue">FacetValue</a>!</div>

<div class="graphql-code-line ">count: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Float

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Float</code> scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Float</span></div>
</div>

## FloatCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FloatCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/shop/object-types#float">Float</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Fulfillment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Fulfillment</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/shop/object-types#fulfillmentline">FulfillmentLine</a>!]!</div>

<div class="graphql-code-line ">summary: [<a href="/reference/graphql-api/shop/object-types#fulfillmentline">FulfillmentLine</a>!]!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">trackingCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FulfillmentLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FulfillmentLine</span> &#123;</div>
<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/shop/object-types#orderline">OrderLine</a>!</div>

<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">fulfillment: <a href="/reference/graphql-api/shop/object-types#fulfillment">Fulfillment</a>!</div>

<div class="graphql-code-line ">fulfillmentId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## GuestCheckoutError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">GuestCheckoutError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">errorDetail: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntry

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">HistoryEntry</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/enums#historyentrytype">HistoryEntryType</a>!</div>

<div class="graphql-code-line ">data: <a href="/reference/graphql-api/shop/object-types#json">JSON</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">HistoryEntryList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#historyentry">HistoryEntry</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ID

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>ID</code> scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">ID</span></div>
</div>

## IdentifierChangeTokenExpiredError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the token used to change a Customer's email address is valid, but has</div>

<div class="graphql-code-line top-level comment">expired according to the <code>verificationTokenDuration</code> setting in the AuthOptions.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IdentifierChangeTokenExpiredError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IdentifierChangeTokenInvalidError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the token used to change a Customer's email address is either</div>

<div class="graphql-code-line top-level comment">invalid or does not match any expected tokens.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IdentifierChangeTokenInvalidError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IneligiblePaymentMethodError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to add a Payment using a PaymentMethod for which the Order is not eligible.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IneligiblePaymentMethodError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">eligibilityCheckerMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IneligibleShippingMethodError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set a ShippingMethod for which the Order is not eligible</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IneligibleShippingMethodError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InsufficientStockError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to add more items to the Order than are available</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InsufficientStockError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">quantityAvailable: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">order: <a href="/reference/graphql-api/shop/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Int

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Int</code> scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Int</span></div>
</div>

## IntCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IntCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InvalidCredentialsError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the user authentication credentials are not valid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InvalidCredentialsError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">authenticationError: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JSON

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>JSON</code> scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">JSON</span></div>
</div>

## LocaleStringCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocaleStringCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">length: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">pattern: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LocaleTextCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocaleTextCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LocalizedString

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocalizedString</span> &#123;</div>
<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MissingPasswordError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to register or verify a customer account without a password, when one is required.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MissingPasswordError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Money

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Money</code> scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Money</span></div>
</div>

## NativeAuthStrategyError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NativeAuthStrategyError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NativeAuthenticationResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">NativeAuthenticationResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/shop/object-types#invalidcredentialserror">InvalidCredentialsError</a> | <a href="/reference/graphql-api/shop/object-types#notverifiederror">NotVerifiedError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## NegativeQuantityError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set a negative OrderLine quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NegativeQuantityError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NoActiveOrderError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when invoking a mutation which depends on there being an active Order on the</div>

<div class="graphql-code-line top-level comment">current session.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NoActiveOrderError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NotVerifiedError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if <code>authOptions.requireVerification</code> is set to <code>true</code> (which is the default)</div>

<div class="graphql-code-line top-level comment">and an unverified user attempts to authenticate.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NotVerifiedError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Order

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Order</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/enums#ordertype">OrderType</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The date & time that the Order was placed, i.e. the Customer</div>

<div class="graphql-code-line comment">completed the checkout and the Order is no longer "active"</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A unique code for the Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An order is active as long as the payment process has not been completed</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">active: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customer: <a href="/reference/graphql-api/shop/object-types#customer">Customer</a></div>

<div class="graphql-code-line ">shippingAddress: <a href="/reference/graphql-api/shop/object-types#orderaddress">OrderAddress</a></div>

<div class="graphql-code-line ">billingAddress: <a href="/reference/graphql-api/shop/object-types#orderaddress">OrderAddress</a></div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/shop/object-types#orderline">OrderLine</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Surcharges are arbitrary modifications to the Order total which are neither</div>

<div class="graphql-code-line comment">ProductVariants nor discounts resulting from applied Promotions. For example,</div>

<div class="graphql-code-line comment">one-off discounts based on customer interaction, or surcharges based on payment</div>

<div class="graphql-code-line comment">methods.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">surcharges: [<a href="/reference/graphql-api/shop/object-types#surcharge">Surcharge</a>!]!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/shop/object-types#discount">Discount</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An array of all coupon codes applied to the Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">couponCodes: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Promotions applied to the order. Only gets populated after the payment process has completed.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">promotions: [<a href="/reference/graphql-api/shop/object-types#promotion">Promotion</a>!]!</div>

<div class="graphql-code-line ">payments: [<a href="/reference/graphql-api/shop/object-types#payment">Payment</a>!]</div>

<div class="graphql-code-line ">fulfillments: [<a href="/reference/graphql-api/shop/object-types#fulfillment">Fulfillment</a>!]</div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level</div>

<div class="graphql-code-line comment">discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.</div>

<div class="graphql-code-line comment">To get a total of all OrderLines which does not account for prorated discounts, use the</div>

<div class="graphql-code-line comment">sum of <code>OrderLine.discountedLinePrice</code> values.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Same as subTotal, but inclusive of tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">shippingLines: [<a href="/reference/graphql-api/shop/object-types#shippingline">ShippingLine</a>!]!</div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Equal to subTotal plus shipping</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">total: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The final payable amount. Equal to subTotalWithTax plus shippingWithTax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A summary of the taxes being applied to this Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxSummary: [<a href="/reference/graphql-api/shop/object-types#ordertaxsummary">OrderTaxSummary</a>!]!</div>

<div class="graphql-code-line ">history(options: <a href="/reference/graphql-api/shop/input-types#historyentrylistoptions">HistoryEntryListOptions</a>): <a href="/reference/graphql-api/shop/object-types#historyentrylist">HistoryEntryList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderAddress

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderAddress</span> &#123;</div>
<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">country: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderLimitError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when the maximum order size limit has been reached.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderLimitError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">maxItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderLine</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/shop/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/shop/object-types#asset">Asset</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit, excluding tax and discounts</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit, including tax but excluding discounts</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Non-zero if the unitPrice has changed since it was initially added to Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceChangeSinceAdded: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Non-zero if the unitPriceWithTax has changed since it was initially added to Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceWithTaxChangeSinceAdded: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit including discounts, excluding tax.</div>

<div class="graphql-code-line comment"></div>

<div class="graphql-code-line comment">If Order-level discounts have been applied, this will not be the</div>

<div class="graphql-code-line comment">actual taxable unit price (see `proratedUnitPrice`), but is generally the</div>

<div class="graphql-code-line comment">correct price to display to customers to avoid confusion</div>

<div class="graphql-code-line comment">about the internal handling of distributed Order-level discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedUnitPrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit including discounts and tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedUnitPriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)</div>

<div class="graphql-code-line comment">Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax</div>

<div class="graphql-code-line comment">and refund calculations.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedUnitPrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The proratedUnitPrice including tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedUnitPriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The quantity of items purchased</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The quantity at the time the Order was placed</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">orderPlacedQuantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total price of the line excluding tax and discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">linePrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total price of the line including tax but excluding discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">linePriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of the line including discounts, excluding tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedLinePrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of the line including discounts and tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedLinePriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)</div>

<div class="graphql-code-line comment">Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax</div>

<div class="graphql-code-line comment">and refund calculations.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedLinePrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The proratedLinePrice including tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedLinePriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total tax on this line</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">lineTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/shop/object-types#discount">Discount</a>!]!</div>

<div class="graphql-code-line ">taxLines: [<a href="/reference/graphql-api/shop/object-types#taxline">TaxLine</a>!]!</div>

<div class="graphql-code-line ">order: <a href="/reference/graphql-api/shop/object-types#order">Order</a>!</div>

<div class="graphql-code-line ">fulfillmentLines: [<a href="/reference/graphql-api/shop/object-types#fulfillmentline">FulfillmentLine</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#order">Order</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderModificationError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to modify the contents of an Order that is not in the <code>AddingItems</code> state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderModificationError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderPaymentStateError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to add a Payment to an Order that is not in the <code>ArrangingPayment</code> state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderPaymentStateError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderStateTransitionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if there is an error in transitioning the Order state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderStateTransitionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transitionError: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fromState: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">toState: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderTaxSummary

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">A summary of the taxes being applied to this order, grouped</div>

<div class="graphql-code-line top-level comment">by taxRate.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderTaxSummary</span> &#123;</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A description of this tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The taxRate as a percentage</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total net price of OrderLines to which this taxRate applies</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxBase: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total tax being applied to the Order at this taxRate</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxTotal: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PasswordAlreadySetError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to verify a customer account with a password, when a password has already been set.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PasswordAlreadySetError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PasswordResetTokenExpiredError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the token used to reset a Customer's password is valid, but has</div>

<div class="graphql-code-line top-level comment">expired according to the <code>verificationTokenDuration</code> setting in the AuthOptions.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PasswordResetTokenExpiredError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PasswordResetTokenInvalidError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the token used to reset a Customer's password is either</div>

<div class="graphql-code-line top-level comment">invalid or does not match any expected tokens.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PasswordResetTokenInvalidError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PasswordValidationError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to register or verify a customer account where the given password fails password validation.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PasswordValidationError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">validationErrorMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Payment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Payment</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">errorMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">refunds: [<a href="/reference/graphql-api/shop/object-types#refund">Refund</a>!]!</div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentDeclinedError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a Payment is declined by the payment provider.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentDeclinedError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">paymentErrorMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentFailedError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a Payment fails due to an error.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentFailedError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">paymentErrorMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a></div>

<div class="graphql-code-line ">handler: <a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#paymentmethodtranslation">PaymentMethodTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodQuote

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodQuote</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isEligible: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">eligibilityMessage: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PriceRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The price range where the result has more than one price</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PriceRange</span> &#123;</div>
<div class="graphql-code-line ">min: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Product

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Product</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/shop/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/shop/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns all ProductVariants</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">variants: [<a href="/reference/graphql-api/shop/object-types#productvariant">ProductVariant</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns a paginated, sortable, filterable list of ProductVariants</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">variantList(options: <a href="/reference/graphql-api/shop/input-types#productvariantlistoptions">ProductVariantListOptions</a>): <a href="/reference/graphql-api/shop/object-types#productvariantlist">ProductVariantList</a>!</div>

<div class="graphql-code-line ">optionGroups: [<a href="/reference/graphql-api/shop/object-types#productoptiongroup">ProductOptionGroup</a>!]!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/shop/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#producttranslation">ProductTranslation</a>!]!</div>

<div class="graphql-code-line ">collections: [<a href="/reference/graphql-api/shop/object-types#collection">Collection</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#product">Product</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOption

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOption</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">groupId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">group: <a href="/reference/graphql-api/shop/object-types#productoptiongroup">ProductOptionGroup</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#productoptiontranslation">ProductOptionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionGroup

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionGroup</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/shop/object-types#productoption">ProductOption</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#productoptiongrouptranslation">ProductOptionGroupTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionGroupTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionGroupTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariant

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariant</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">product: <a href="/reference/graphql-api/shop/object-types#product">Product</a>!</div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/shop/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/shop/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">taxRateApplied: <a href="/reference/graphql-api/shop/object-types#taxrate">TaxRate</a>!</div>

<div class="graphql-code-line ">taxCategory: <a href="/reference/graphql-api/shop/object-types#taxcategory">TaxCategory</a>!</div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/shop/object-types#productoption">ProductOption</a>!]!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/shop/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#productvarianttranslation">ProductVariantTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariantList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#productvariant">ProductVariant</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariantTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Promotion

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Promotion</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">conditions: [<a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">actions: [<a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#promotiontranslation">PromotionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PromotionList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#promotion">Promotion</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PromotionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Province

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Province</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/shop/object-types#region">Region</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/shop/object-types#id">ID</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#regiontranslation">RegionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProvinceList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#province">Province</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefreshCustomerVerificationResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RefreshCustomerVerificationResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## Refund

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Refund</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">items: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">adjustment: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">reason: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/shop/object-types#refundline">RefundLine</a>!]!</div>

<div class="graphql-code-line ">paymentId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundLine</span> &#123;</div>
<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/shop/object-types#orderline">OrderLine</a>!</div>

<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">refund: <a href="/reference/graphql-api/shop/object-types#refund">Refund</a>!</div>

<div class="graphql-code-line ">refundId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RegionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RegionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RegisterCustomerAccountResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RegisterCustomerAccountResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#missingpassworderror">MissingPasswordError</a> | <a href="/reference/graphql-api/shop/object-types#passwordvalidationerror">PasswordValidationError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## RelationCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RelationCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">entity: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">scalarFields: [<a href="/reference/graphql-api/shop/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveOrderItemsResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RemoveOrderItemsResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#ordermodificationerror">OrderModificationError</a></div>
</div>

## RequestPasswordResetResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RequestPasswordResetResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## RequestUpdateCustomerEmailAddressResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RequestUpdateCustomerEmailAddressResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#invalidcredentialserror">InvalidCredentialsError</a> | <a href="/reference/graphql-api/shop/object-types#emailaddressconflicterror">EmailAddressConflictError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## ResetPasswordResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">ResetPasswordResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/shop/object-types#passwordresettokeninvaliderror">PasswordResetTokenInvalidError</a> | <a href="/reference/graphql-api/shop/object-types#passwordresettokenexpirederror">PasswordResetTokenExpiredError</a> | <a href="/reference/graphql-api/shop/object-types#passwordvalidationerror">PasswordValidationError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a> | <a href="/reference/graphql-api/shop/object-types#notverifiederror">NotVerifiedError</a></div>
</div>

## Role

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Role</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]!</div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/shop/object-types#channel">Channel</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RoleList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RoleList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#role">Role</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchReindexResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchReindexResponse</span> &#123;</div>
<div class="graphql-code-line ">success: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResponse</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#searchresult">SearchResult</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/shop/object-types#facetvalueresult">FacetValueResult</a>!]!</div>

<div class="graphql-code-line ">collections: [<a href="/reference/graphql-api/shop/object-types#collectionresult">CollectionResult</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResult</span> &#123;</div>
<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">productName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productAsset: <a href="/reference/graphql-api/shop/object-types#searchresultasset">SearchResultAsset</a></div>

<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">productVariantName: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productVariantAsset: <a href="/reference/graphql-api/shop/object-types#searchresultasset">SearchResultAsset</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/object-types#searchresultprice">SearchResultPrice</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/object-types#searchresultprice">SearchResultPrice</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/shop/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">facetIds: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An array of ids of the Collections in which this result appears</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">collectionIds: [<a href="/reference/graphql-api/shop/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A relevance score for the result. Differs between database implementations</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">score: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultAsset

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResultAsset</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">focalPoint: <a href="/reference/graphql-api/shop/object-types#coordinate">Coordinate</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultPrice

<div class="graphql-code-block">
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a search result product, either as a range or as a single price</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SearchResultPrice</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#pricerange">PriceRange</a> | <a href="/reference/graphql-api/shop/object-types#singleprice">SinglePrice</a></div>
</div>

## Seller

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Seller</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SetCustomerForOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SetCustomerForOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#alreadyloggedinerror">AlreadyLoggedInError</a> | <a href="/reference/graphql-api/shop/object-types#emailaddressconflicterror">EmailAddressConflictError</a> | <a href="/reference/graphql-api/shop/object-types#noactiveordererror">NoActiveOrderError</a> | <a href="/reference/graphql-api/shop/object-types#guestcheckouterror">GuestCheckoutError</a></div>
</div>

## SetOrderShippingMethodResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SetOrderShippingMethodResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#ordermodificationerror">OrderModificationError</a> | <a href="/reference/graphql-api/shop/object-types#ineligibleshippingmethoderror">IneligibleShippingMethodError</a> | <a href="/reference/graphql-api/shop/object-types#noactiveordererror">NoActiveOrderError</a></div>
</div>

## ShippingLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingLine</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">shippingMethod: <a href="/reference/graphql-api/shop/object-types#shippingmethod">ShippingMethod</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discountedPrice: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discountedPriceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/shop/object-types#discount">Discount</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fulfillmentHandlerCode: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">calculator: <a href="/reference/graphql-api/shop/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/shop/object-types#shippingmethodtranslation">ShippingMethodTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#shippingmethod">ShippingMethod</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodQuote

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodQuote</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/shop/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SinglePrice

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The price value where the result has a single price</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SinglePrice</span> &#123;</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## String

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>String</code> scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">String</span></div>
</div>

## StringCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StringCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">length: <a href="/reference/graphql-api/shop/object-types#int">Int</a></div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">pattern: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/shop/object-types#stringfieldoption">StringFieldOption</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringFieldOption

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StringFieldOption</span> &#123;</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Success

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Indicates that an operation succeeded, where we do not want to return any more specific information.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Success</span> &#123;</div>
<div class="graphql-code-line ">success: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Surcharge

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Surcharge</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/shop/object-types#string">String</a></div>

<div class="graphql-code-line ">taxLines: [<a href="/reference/graphql-api/shop/object-types#taxline">TaxLine</a>!]!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/shop/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Tag

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Tag</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TagList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TagList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#tag">Tag</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategory

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxCategory</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isDefault: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxLine</span> &#123;</div>
<div class="graphql-code-line ">description: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRate

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxRate</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/shop/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">category: <a href="/reference/graphql-api/shop/object-types#taxcategory">TaxCategory</a>!</div>

<div class="graphql-code-line ">zone: <a href="/reference/graphql-api/shop/object-types#zone">Zone</a>!</div>

<div class="graphql-code-line ">customerGroup: <a href="/reference/graphql-api/shop/object-types#customergroup">CustomerGroup</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRateList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxRateList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/shop/object-types#taxrate">TaxRate</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/shop/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TextCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TextCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/shop/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/shop/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TransitionOrderToStateResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">TransitionOrderToStateResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#orderstatetransitionerror">OrderStateTransitionError</a></div>
</div>

## UpdateCustomerEmailAddressResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateCustomerEmailAddressResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#identifierchangetokeninvaliderror">IdentifierChangeTokenInvalidError</a> | <a href="/reference/graphql-api/shop/object-types#identifierchangetokenexpirederror">IdentifierChangeTokenExpiredError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## UpdateCustomerPasswordResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateCustomerPasswordResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#success">Success</a> | <a href="/reference/graphql-api/shop/object-types#invalidcredentialserror">InvalidCredentialsError</a> | <a href="/reference/graphql-api/shop/object-types#passwordvalidationerror">PasswordValidationError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## UpdateOrderItemsResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateOrderItemsResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#order">Order</a> | <a href="/reference/graphql-api/shop/object-types#ordermodificationerror">OrderModificationError</a> | <a href="/reference/graphql-api/shop/object-types#orderlimiterror">OrderLimitError</a> | <a href="/reference/graphql-api/shop/object-types#negativequantityerror">NegativeQuantityError</a> | <a href="/reference/graphql-api/shop/object-types#insufficientstockerror">InsufficientStockError</a></div>
</div>

## Upload

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Upload</code> scalar type represents a file upload.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Upload</span></div>
</div>

## User

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">User</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">identifier: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">verified: <a href="/reference/graphql-api/shop/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">roles: [<a href="/reference/graphql-api/shop/object-types#role">Role</a>!]!</div>

<div class="graphql-code-line ">lastLogin: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">authenticationMethods: [<a href="/reference/graphql-api/shop/object-types#authenticationmethod">AuthenticationMethod</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## VerificationTokenExpiredError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the verification token (used to verify a Customer's email address) is valid, but has</div>

<div class="graphql-code-line top-level comment">expired according to the <code>verificationTokenDuration</code> setting in the AuthOptions.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">VerificationTokenExpiredError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## VerificationTokenInvalidError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the verification token (used to verify a Customer's email address) is either</div>

<div class="graphql-code-line top-level comment">invalid or does not match any expected tokens.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">VerificationTokenInvalidError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/shop/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## VerifyCustomerAccountResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">VerifyCustomerAccountResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/shop/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/shop/object-types#verificationtokeninvaliderror">VerificationTokenInvalidError</a> | <a href="/reference/graphql-api/shop/object-types#verificationtokenexpirederror">VerificationTokenExpiredError</a> | <a href="/reference/graphql-api/shop/object-types#missingpassworderror">MissingPasswordError</a> | <a href="/reference/graphql-api/shop/object-types#passwordvalidationerror">PasswordValidationError</a> | <a href="/reference/graphql-api/shop/object-types#passwordalreadyseterror">PasswordAlreadySetError</a> | <a href="/reference/graphql-api/shop/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## Zone

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Zone</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/shop/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/shop/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/shop/object-types#string">String</a>!</div>

<div class="graphql-code-line ">members: [<a href="/reference/graphql-api/shop/object-types#region">Region</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/shop/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
