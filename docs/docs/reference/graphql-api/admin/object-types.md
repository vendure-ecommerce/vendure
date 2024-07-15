---
title: "Types"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';



## AddFulfillmentToOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">AddFulfillmentToOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#fulfillment">Fulfillment</a> | <a href="/reference/graphql-api/admin/object-types#emptyorderlineselectionerror">EmptyOrderLineSelectionError</a> | <a href="/reference/graphql-api/admin/object-types#itemsalreadyfulfillederror">ItemsAlreadyFulfilledError</a> | <a href="/reference/graphql-api/admin/object-types#insufficientstockonhanderror">InsufficientStockOnHandError</a> | <a href="/reference/graphql-api/admin/object-types#invalidfulfillmenthandlererror">InvalidFulfillmentHandlerError</a> | <a href="/reference/graphql-api/admin/object-types#fulfillmentstatetransitionerror">FulfillmentStateTransitionError</a> | <a href="/reference/graphql-api/admin/object-types#createfulfillmenterror">CreateFulfillmentError</a></div>
</div>

## AddManualPaymentToOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">AddManualPaymentToOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#manualpaymentstateerror">ManualPaymentStateError</a></div>
</div>

## Address

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Address</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">country: <a href="/reference/graphql-api/admin/object-types#country">Country</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">defaultShippingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">defaultBillingAddress: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Adjustment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Adjustment</span> &#123;</div>
<div class="graphql-code-line ">adjustmentSource: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#adjustmenttype">AdjustmentType</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">data: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Administrator

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Administrator</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">user: <a href="/reference/graphql-api/admin/object-types#user">User</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AdministratorList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AdministratorList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Allocation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Allocation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AlreadyRefundedError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an attempting to refund an OrderItem which has already been refunded</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AlreadyRefundedError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">refundId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ApplyCouponCodeResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">ApplyCouponCodeResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#couponcodeexpirederror">CouponCodeExpiredError</a> | <a href="/reference/graphql-api/admin/object-types#couponcodeinvaliderror">CouponCodeInvalidError</a> | <a href="/reference/graphql-api/admin/object-types#couponcodelimiterror">CouponCodeLimitError</a></div>
</div>

## Asset

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Asset</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#assettype">AssetType</a>!</div>

<div class="graphql-code-line ">fileSize: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">mimeType: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">width: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">height: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">source: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">focalPoint: <a href="/reference/graphql-api/admin/object-types#coordinate">Coordinate</a></div>

<div class="graphql-code-line ">tags: [<a href="/reference/graphql-api/admin/object-types#tag">Tag</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AssetList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AssetList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AuthenticationMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">AuthenticationMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">strategy: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## AuthenticationResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">AuthenticationResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/admin/object-types#invalidcredentialserror">InvalidCredentialsError</a></div>
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
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CancelActiveOrderError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an attempting to cancel lines from an Order which is still active</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CancelActiveOrderError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">orderState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CancelOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CancelOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#emptyorderlineselectionerror">EmptyOrderLineSelectionError</a> | <a href="/reference/graphql-api/admin/object-types#quantitytoogreaterror">QuantityTooGreatError</a> | <a href="/reference/graphql-api/admin/object-types#multipleordererror">MultipleOrderError</a> | <a href="/reference/graphql-api/admin/object-types#cancelactiveordererror">CancelActiveOrderError</a> | <a href="/reference/graphql-api/admin/object-types#orderstatetransitionerror">OrderStateTransitionError</a></div>
</div>

## CancelPaymentError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the Payment cancellation fails</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CancelPaymentError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">paymentErrorMessage: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CancelPaymentResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CancelPaymentResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#payment">Payment</a> | <a href="/reference/graphql-api/admin/object-types#cancelpaymenterror">CancelPaymentError</a> | <a href="/reference/graphql-api/admin/object-types#paymentstatetransitionerror">PaymentStateTransitionError</a></div>
</div>

## Cancellation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Cancellation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Channel

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Channel</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">defaultTaxZone: <a href="/reference/graphql-api/admin/object-types#zone">Zone</a></div>

<div class="graphql-code-line ">defaultShippingZone: <a href="/reference/graphql-api/admin/object-types#zone">Zone</a></div>

<div class="graphql-code-line ">defaultLanguageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">availableLanguageCodes: [<a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!]</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">defaultCurrencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">availableCurrencyCodes: [<a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Not yet used - will be implemented in a future release.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Not yet used - will be implemented in a future release.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">pricesIncludeTax: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">seller: <a href="/reference/graphql-api/admin/object-types#seller">Seller</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ChannelDefaultLanguageError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`</div>

<div class="graphql-code-line top-level comment">of the GlobalSettings</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ChannelDefaultLanguageError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">language: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">channelCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ChannelList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ChannelList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Collection

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Collection</span> &#123;</div>
<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">inheritFilters: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">breadcrumbs: [<a href="/reference/graphql-api/admin/object-types#collectionbreadcrumb">CollectionBreadcrumb</a>!]!</div>

<div class="graphql-code-line ">position: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/admin/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/admin/object-types#collection">Collection</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">children: [<a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!]</div>

<div class="graphql-code-line ">filters: [<a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#collectiontranslation">CollectionTranslation</a>!]!</div>

<div class="graphql-code-line ">productVariants(options: <a href="/reference/graphql-api/admin/input-types#productvariantlistoptions">ProductVariantListOptions</a>): <a href="/reference/graphql-api/admin/object-types#productvariantlist">ProductVariantList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionBreadcrumb

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionBreadcrumb</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Which Collections are present in the products returned</div>

<div class="graphql-code-line top-level comment">by the search, and in what quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionResult</span> &#123;</div>
<div class="graphql-code-line ">collection: <a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!</div>

<div class="graphql-code-line ">count: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CollectionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CollectionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArg

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigArg</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigArgDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigArgDefinition</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">required: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">defaultValue: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>

<div class="graphql-code-line ">label: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigurableOperation</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">args: [<a href="/reference/graphql-api/admin/object-types#configarg">ConfigArg</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ConfigurableOperationDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ConfigurableOperationDefinition</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">args: [<a href="/reference/graphql-api/admin/object-types#configargdefinition">ConfigArgDefinition</a>!]!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Coordinate

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Coordinate</span> &#123;</div>
<div class="graphql-code-line ">x: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">y: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


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
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/admin/object-types#region">Region</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#regiontranslation">RegionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CountryList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CountryList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#country">Country</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeExpiredError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeExpiredError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeInvalidError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeInvalidError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CouponCodeLimitError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the provided coupon code is invalid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CouponCodeLimitError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">limit: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreateAssetResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CreateAssetResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#asset">Asset</a> | <a href="/reference/graphql-api/admin/object-types#mimetypeerror">MimeTypeError</a></div>
</div>

## CreateChannelResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CreateChannelResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#channel">Channel</a> | <a href="/reference/graphql-api/admin/object-types#languagenotavailableerror">LanguageNotAvailableError</a></div>
</div>

## CreateCustomerResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CreateCustomerResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#customer">Customer</a> | <a href="/reference/graphql-api/admin/object-types#emailaddressconflicterror">EmailAddressConflictError</a></div>
</div>

## CreateFulfillmentError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an error is thrown in a FulfillmentHandler's createFulfillment method</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CreateFulfillmentError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fulfillmentHandlerError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CreatePromotionResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CreatePromotionResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a> | <a href="/reference/graphql-api/admin/object-types#missingconditionserror">MissingConditionsError</a></div>
</div>

## CurrentUser

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CurrentUser</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">identifier: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/admin/object-types#currentuserchannel">CurrentUserChannel</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CurrentUserChannel

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CurrentUserChannel</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">token: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">CustomFieldConfig</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#stringcustomfieldconfig">StringCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#localestringcustomfieldconfig">LocaleStringCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#intcustomfieldconfig">IntCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#floatcustomfieldconfig">FloatCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#booleancustomfieldconfig">BooleanCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#datetimecustomfieldconfig">DateTimeCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#relationcustomfieldconfig">RelationCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#textcustomfieldconfig">TextCustomFieldConfig</a> | <a href="/reference/graphql-api/admin/object-types#localetextcustomfieldconfig">LocaleTextCustomFieldConfig</a></div>
</div>

## CustomFields

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">This type is deprecated in v2.2 in favor of the EntityCustomFields type,</div>

<div class="graphql-code-line top-level comment">which allows custom fields to be defined on user-supplies entities.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomFields</span> &#123;</div>
<div class="graphql-code-line ">Address: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Administrator: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Asset: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Channel: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Collection: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Customer: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">CustomerGroup: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Facet: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">FacetValue: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Fulfillment: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">GlobalSettings: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Order: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">OrderLine: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">PaymentMethod: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Product: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">ProductOption: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">ProductOptionGroup: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">ProductVariant: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">ProductVariantPrice: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Promotion: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Region: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Seller: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">ShippingMethod: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">StockLocation: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">TaxCategory: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">TaxRate: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">User: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>

<div class="graphql-code-line ">Zone: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Customer

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Customer</span> &#123;</div>
<div class="graphql-code-line ">groups: [<a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!]!</div>

<div class="graphql-code-line ">history(options: <a href="/reference/graphql-api/admin/input-types#historyentrylistoptions">HistoryEntryListOptions</a>): <a href="/reference/graphql-api/admin/object-types#historyentrylist">HistoryEntryList</a>!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">firstName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lastName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">emailAddress: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">addresses: [<a href="/reference/graphql-api/admin/object-types#address">Address</a>!]</div>

<div class="graphql-code-line ">orders(options: <a href="/reference/graphql-api/admin/input-types#orderlistoptions">OrderListOptions</a>): <a href="/reference/graphql-api/admin/object-types#orderlist">OrderList</a>!</div>

<div class="graphql-code-line ">user: <a href="/reference/graphql-api/admin/object-types#user">User</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroup

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomerGroup</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customers(options: <a href="/reference/graphql-api/admin/input-types#customerlistoptions">CustomerListOptions</a>): <a href="/reference/graphql-api/admin/object-types#customerlist">CustomerList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerGroupList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomerGroupList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## CustomerList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">CustomerList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#customer">Customer</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


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
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DeletionResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">DeletionResponse</span> &#123;</div>
<div class="graphql-code-line ">result: <a href="/reference/graphql-api/admin/enums#deletionresult">DeletionResult</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Discount

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Discount</span> &#123;</div>
<div class="graphql-code-line ">adjustmentSource: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#adjustmenttype">AdjustmentType</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">amountWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DuplicateEntityError

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">DuplicateEntityError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">duplicationError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## DuplicateEntityResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">DuplicateEntityResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#duplicateentitysuccess">DuplicateEntitySuccess</a> | <a href="/reference/graphql-api/admin/object-types#duplicateentityerror">DuplicateEntityError</a></div>
</div>

## DuplicateEntitySuccess

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">DuplicateEntitySuccess</span> &#123;</div>
<div class="graphql-code-line ">newEntityId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## EmailAddressConflictError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to create a Customer with an email address already registered to an existing User.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">EmailAddressConflictError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## EmptyOrderLineSelectionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if no OrderLines have been specified for the operation</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">EmptyOrderLineSelectionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## EntityCustomFields

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">EntityCustomFields</span> &#123;</div>
<div class="graphql-code-line ">entityName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: [<a href="/reference/graphql-api/admin/object-types#customfieldconfig">CustomFieldConfig</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## EntityDuplicatorDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">EntityDuplicatorDefinition</span> &#123;</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">args: [<a href="/reference/graphql-api/admin/object-types#configargdefinition">ConfigArgDefinition</a>!]!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">forEntities: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Facet

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Facet</span> &#123;</div>
<div class="graphql-code-line ">isPrivate: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">values: [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns a paginated, sortable, filterable list of the Facet's values. Added in v2.1.0.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">valueList(options: <a href="/reference/graphql-api/admin/input-types#facetvaluelistoptions">FacetValueListOptions</a>): <a href="/reference/graphql-api/admin/object-types#facetvaluelist">FacetValueList</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#facettranslation">FacetTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetInUseError

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetInUseError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">facetCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productCount: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">variantCount: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#facet">Facet</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValue

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValue</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">facet: <a href="/reference/graphql-api/admin/object-types#facet">Facet</a>!</div>

<div class="graphql-code-line ">facetId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#facetvaluetranslation">FacetValueTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Which FacetValues are present in the products returned</div>

<div class="graphql-code-line top-level comment">by the search, and in what quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueResult</span> &#123;</div>
<div class="graphql-code-line ">facetValue: <a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!</div>

<div class="graphql-code-line ">count: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FacetValueTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FacetValueTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


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
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/admin/object-types#float">Float</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Fulfillment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Fulfillment</span> &#123;</div>
<div class="graphql-code-line ">nextStates: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/object-types#fulfillmentline">FulfillmentLine</a>!]!</div>

<div class="graphql-code-line ">summary: [<a href="/reference/graphql-api/admin/object-types#fulfillmentline">FulfillmentLine</a>!]!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">trackingCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FulfillmentLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FulfillmentLine</span> &#123;</div>
<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!</div>

<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">fulfillment: <a href="/reference/graphql-api/admin/object-types#fulfillment">Fulfillment</a>!</div>

<div class="graphql-code-line ">fulfillmentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## FulfillmentStateTransitionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when there is an error in transitioning the Fulfillment state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">FulfillmentStateTransitionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transitionError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fromState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">toState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## GlobalSettings

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">GlobalSettings</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">availableLanguages: [<a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!]!</div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">serverConfig: <a href="/reference/graphql-api/admin/object-types#serverconfig">ServerConfig</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## GuestCheckoutError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">GuestCheckoutError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">errorDetail: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntry

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">HistoryEntry</span> &#123;</div>
<div class="graphql-code-line ">isPublic: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">administrator: <a href="/reference/graphql-api/admin/object-types#administrator">Administrator</a></div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#historyentrytype">HistoryEntryType</a>!</div>

<div class="graphql-code-line ">data: <a href="/reference/graphql-api/admin/object-types#json">JSON</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## HistoryEntryList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">HistoryEntryList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#historyentry">HistoryEntry</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ID

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>ID</code> scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">ID</span></div>
</div>

## ImportInfo

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ImportInfo</span> &#123;</div>
<div class="graphql-code-line ">errors: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]</div>

<div class="graphql-code-line ">processed: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">imported: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## IneligibleShippingMethodError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set a ShippingMethod for which the Order is not eligible</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">IneligibleShippingMethodError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InsufficientStockError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to add more items to the Order than are available</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InsufficientStockError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">quantityAvailable: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">order: <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InsufficientStockOnHandError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if attempting to create a Fulfillment when there is insufficient</div>

<div class="graphql-code-line top-level comment">stockOnHand of a ProductVariant to satisfy the requested quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InsufficientStockOnHandError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">productVariantName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


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
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">min: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">step: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InvalidCredentialsError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the user authentication credentials are not valid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InvalidCredentialsError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">authenticationError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## InvalidFulfillmentHandlerError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the specified FulfillmentHandler code is not valid</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">InvalidFulfillmentHandlerError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ItemsAlreadyFulfilledError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the specified items are already part of a Fulfillment</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ItemsAlreadyFulfilledError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JSON

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>JSON</code> scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">JSON</span></div>
</div>

## Job

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Job</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">startedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">settledAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">queueName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/enums#jobstate">JobState</a>!</div>

<div class="graphql-code-line ">progress: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">data: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>

<div class="graphql-code-line ">result: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>

<div class="graphql-code-line ">error: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>

<div class="graphql-code-line ">isSettled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">duration: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">retries: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">attempts: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobBufferSize

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">JobBufferSize</span> &#123;</div>
<div class="graphql-code-line ">bufferId: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">size: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">JobList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#job">Job</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## JobQueue

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">JobQueue</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">running: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LanguageNotAvailableError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LanguageNotAvailableError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LocaleStringCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocaleStringCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">length: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">pattern: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LocaleTextCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocaleTextCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## LocalizedString

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">LocalizedString</span> &#123;</div>
<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ManualPaymentStateError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a call to addManualPaymentToOrder is made but the Order</div>

<div class="graphql-code-line top-level comment">is not in the required state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ManualPaymentStateError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MetricSummary

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MetricSummary</span> &#123;</div>
<div class="graphql-code-line ">interval: <a href="/reference/graphql-api/admin/enums#metricinterval">MetricInterval</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#metrictype">MetricType</a>!</div>

<div class="graphql-code-line ">title: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">entries: [<a href="/reference/graphql-api/admin/object-types#metricsummaryentry">MetricSummaryEntry</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MetricSummaryEntry

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MetricSummaryEntry</span> &#123;</div>
<div class="graphql-code-line ">label: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MimeTypeError

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MimeTypeError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fileName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">mimeType: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## MissingConditionsError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if a PromotionCondition has neither a couponCode nor any conditions set</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MissingConditionsError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ModifyOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">ModifyOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#nochangesspecifiederror">NoChangesSpecifiedError</a> | <a href="/reference/graphql-api/admin/object-types#ordermodificationstateerror">OrderModificationStateError</a> | <a href="/reference/graphql-api/admin/object-types#paymentmethodmissingerror">PaymentMethodMissingError</a> | <a href="/reference/graphql-api/admin/object-types#refundpaymentidmissingerror">RefundPaymentIdMissingError</a> | <a href="/reference/graphql-api/admin/object-types#orderlimiterror">OrderLimitError</a> | <a href="/reference/graphql-api/admin/object-types#negativequantityerror">NegativeQuantityError</a> | <a href="/reference/graphql-api/admin/object-types#insufficientstockerror">InsufficientStockError</a> | <a href="/reference/graphql-api/admin/object-types#couponcodeexpirederror">CouponCodeExpiredError</a> | <a href="/reference/graphql-api/admin/object-types#couponcodeinvaliderror">CouponCodeInvalidError</a> | <a href="/reference/graphql-api/admin/object-types#couponcodelimiterror">CouponCodeLimitError</a> | <a href="/reference/graphql-api/admin/object-types#ineligibleshippingmethoderror">IneligibleShippingMethodError</a></div>
</div>

## Money

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The <code>Money</code> scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">scalar <span class="graphql-code-identifier">Money</span></div>
</div>

## MultipleOrderError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an operation has specified OrderLines from multiple Orders</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">MultipleOrderError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NativeAuthStrategyError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NativeAuthStrategyError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NativeAuthenticationResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">NativeAuthenticationResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#currentuser">CurrentUser</a> | <a href="/reference/graphql-api/admin/object-types#invalidcredentialserror">InvalidCredentialsError</a> | <a href="/reference/graphql-api/admin/object-types#nativeauthstrategyerror">NativeAuthStrategyError</a></div>
</div>

## NegativeQuantityError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to set a negative OrderLine quantity.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NegativeQuantityError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NoActiveOrderError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when invoking a mutation which depends on there being an active Order on the</div>

<div class="graphql-code-line top-level comment">current session.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NoActiveOrderError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NoChangesSpecifiedError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a call to modifyOrder fails to specify any changes</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NoChangesSpecifiedError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## NothingToRefundError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an attempting to refund an Order but neither items nor shipping refund was specified</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">NothingToRefundError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Order

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Order</span> &#123;</div>
<div class="graphql-code-line ">nextStates: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">modifications: [<a href="/reference/graphql-api/admin/object-types#ordermodification">OrderModification</a>!]!</div>

<div class="graphql-code-line ">sellerOrders: [<a href="/reference/graphql-api/admin/object-types#order">Order</a>!]</div>

<div class="graphql-code-line ">aggregateOrder: <a href="/reference/graphql-api/admin/object-types#order">Order</a></div>

<div class="graphql-code-line ">aggregateOrderId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!]!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#ordertype">OrderType</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The date & time that the Order was placed, i.e. the Customer</div>

<div class="graphql-code-line comment">completed the checkout and the Order is no longer "active"</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">orderPlacedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A unique code for the Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An order is active as long as the payment process has not been completed</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">active: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customer: <a href="/reference/graphql-api/admin/object-types#customer">Customer</a></div>

<div class="graphql-code-line ">shippingAddress: <a href="/reference/graphql-api/admin/object-types#orderaddress">OrderAddress</a></div>

<div class="graphql-code-line ">billingAddress: <a href="/reference/graphql-api/admin/object-types#orderaddress">OrderAddress</a></div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Surcharges are arbitrary modifications to the Order total which are neither</div>

<div class="graphql-code-line comment">ProductVariants nor discounts resulting from applied Promotions. For example,</div>

<div class="graphql-code-line comment">one-off discounts based on customer interaction, or surcharges based on payment</div>

<div class="graphql-code-line comment">methods.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">surcharges: [<a href="/reference/graphql-api/admin/object-types#surcharge">Surcharge</a>!]!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/admin/object-types#discount">Discount</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An array of all coupon codes applied to the Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">couponCodes: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Promotions applied to the order. Only gets populated after the payment process has completed.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">promotions: [<a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a>!]!</div>

<div class="graphql-code-line ">payments: [<a href="/reference/graphql-api/admin/object-types#payment">Payment</a>!]</div>

<div class="graphql-code-line ">fulfillments: [<a href="/reference/graphql-api/admin/object-types#fulfillment">Fulfillment</a>!]</div>

<div class="graphql-code-line ">totalQuantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level</div>

<div class="graphql-code-line comment">discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.</div>

<div class="graphql-code-line comment">To get a total of all OrderLines which does not account for prorated discounts, use the</div>

<div class="graphql-code-line comment">sum of <code>OrderLine.discountedLinePrice</code> values.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">subTotal: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Same as subTotal, but inclusive of tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">subTotalWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">shippingLines: [<a href="/reference/graphql-api/admin/object-types#shippingline">ShippingLine</a>!]!</div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">shippingWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Equal to subTotal plus shipping</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">total: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The final payable amount. Equal to subTotalWithTax plus shippingWithTax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">totalWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A summary of the taxes being applied to this Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxSummary: [<a href="/reference/graphql-api/admin/object-types#ordertaxsummary">OrderTaxSummary</a>!]!</div>

<div class="graphql-code-line ">history(options: <a href="/reference/graphql-api/admin/input-types#historyentrylistoptions">HistoryEntryListOptions</a>): <a href="/reference/graphql-api/admin/object-types#historyentrylist">HistoryEntryList</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderAddress

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderAddress</span> &#123;</div>
<div class="graphql-code-line ">fullName: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">company: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine1: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">streetLine2: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">city: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">province: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">postalCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">country: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">countryCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">phoneNumber: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderLimitError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when the maximum order size limit has been reached.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderLimitError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">maxItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderLine</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/admin/object-types#asset">Asset</a></div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit, excluding tax and discounts</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit, including tax but excluding discounts</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Non-zero if the unitPrice has changed since it was initially added to Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceChangeSinceAdded: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Non-zero if the unitPriceWithTax has changed since it was initially added to Order</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">unitPriceWithTaxChangeSinceAdded: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit including discounts, excluding tax.</div>

<div class="graphql-code-line comment"></div>

<div class="graphql-code-line comment">If Order-level discounts have been applied, this will not be the</div>

<div class="graphql-code-line comment">actual taxable unit price (see `proratedUnitPrice`), but is generally the</div>

<div class="graphql-code-line comment">correct price to display to customers to avoid confusion</div>

<div class="graphql-code-line comment">about the internal handling of distributed Order-level discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedUnitPrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a single unit including discounts and tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedUnitPriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)</div>

<div class="graphql-code-line comment">Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax</div>

<div class="graphql-code-line comment">and refund calculations.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedUnitPrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The proratedUnitPrice including tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedUnitPriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The quantity of items purchased</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The quantity at the time the Order was placed</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">orderPlacedQuantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total price of the line excluding tax and discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">linePrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total price of the line including tax but excluding discounts.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">linePriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of the line including discounts, excluding tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedLinePrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of the line including discounts and tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">discountedLinePriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)</div>

<div class="graphql-code-line comment">Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax</div>

<div class="graphql-code-line comment">and refund calculations.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedLinePrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The proratedLinePrice including tax</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">proratedLinePriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total tax on this line</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">lineTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/admin/object-types#discount">Discount</a>!]!</div>

<div class="graphql-code-line ">taxLines: [<a href="/reference/graphql-api/admin/object-types#taxline">TaxLine</a>!]!</div>

<div class="graphql-code-line ">order: <a href="/reference/graphql-api/admin/object-types#order">Order</a>!</div>

<div class="graphql-code-line ">fulfillmentLines: [<a href="/reference/graphql-api/admin/object-types#fulfillmentline">FulfillmentLine</a>!]</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#order">Order</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderModification

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderModification</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">priceChange: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">note: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/object-types#ordermodificationline">OrderModificationLine</a>!]!</div>

<div class="graphql-code-line ">surcharges: [<a href="/reference/graphql-api/admin/object-types#surcharge">Surcharge</a>!]</div>

<div class="graphql-code-line ">payment: <a href="/reference/graphql-api/admin/object-types#payment">Payment</a></div>

<div class="graphql-code-line ">refund: <a href="/reference/graphql-api/admin/object-types#refund">Refund</a></div>

<div class="graphql-code-line ">isSettled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderModificationError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to modify the contents of an Order that is not in the <code>AddingItems</code> state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderModificationError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderModificationLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderModificationLine</span> &#123;</div>
<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!</div>

<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">modification: <a href="/reference/graphql-api/admin/object-types#ordermodification">OrderModification</a>!</div>

<div class="graphql-code-line ">modificationId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderModificationStateError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when attempting to modify the contents of an Order that is not in the <code>Modifying</code> state.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderModificationStateError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderProcessState

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderProcessState</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">to: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## OrderStateTransitionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if there is an error in transitioning the Order state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">OrderStateTransitionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transitionError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fromState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">toState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


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
<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The taxRate as a percentage</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total net price of OrderLines to which this taxRate applies</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxBase: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The total tax being applied to the Order at this taxRate</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">taxTotal: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Payment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Payment</span> &#123;</div>
<div class="graphql-code-line ">nextStates: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">amount: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">errorMessage: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">refunds: [<a href="/reference/graphql-api/admin/object-types#refund">Refund</a>!]!</div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a></div>

<div class="graphql-code-line ">handler: <a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#paymentmethodtranslation">PaymentMethodTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#paymentmethod">PaymentMethod</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodMissingError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a call to modifyOrder fails to include a paymentMethod even</div>

<div class="graphql-code-line top-level comment">though the price has increased as a result of the changes.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodMissingError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodQuote

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodQuote</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isEligible: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">eligibilityMessage: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentMethodTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentMethodTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentOrderMismatchError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an attempting to refund a Payment against OrderLines from a different Order</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentOrderMismatchError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PaymentStateTransitionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when there is an error in transitioning the Payment state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PaymentStateTransitionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transitionError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fromState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">toState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PermissionDefinition

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PermissionDefinition</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">assignable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PriceRange

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The price range where the result has more than one price</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PriceRange</span> &#123;</div>
<div class="graphql-code-line ">min: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">max: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Product

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Product</span> &#123;</div>
<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!]!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/admin/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns all ProductVariants</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">variants: [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Returns a paginated, sortable, filterable list of ProductVariants</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">variantList(options: <a href="/reference/graphql-api/admin/input-types#productvariantlistoptions">ProductVariantListOptions</a>): <a href="/reference/graphql-api/admin/object-types#productvariantlist">ProductVariantList</a>!</div>

<div class="graphql-code-line ">optionGroups: [<a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a>!]!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#producttranslation">ProductTranslation</a>!]!</div>

<div class="graphql-code-line ">collections: [<a href="/reference/graphql-api/admin/object-types#collection">Collection</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#product">Product</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOption

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOption</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">groupId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">group: <a href="/reference/graphql-api/admin/object-types#productoptiongroup">ProductOptionGroup</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#productoptiontranslation">ProductOptionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionGroup

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionGroup</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/admin/object-types#productoption">ProductOption</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#productoptiongrouptranslation">ProductOptionGroupTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionGroupTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionGroupTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionInUseError

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionInUseError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">optionGroupCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productVariantCount: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductOptionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductOptionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariant

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariant</span> &#123;</div>
<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">trackInventory: <a href="/reference/graphql-api/admin/enums#globalflag">GlobalFlag</a>!</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">stockAllocated: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">outOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">useGlobalOutOfStockThreshold: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">prices: [<a href="/reference/graphql-api/admin/object-types#productvariantprice">ProductVariantPrice</a>!]!</div>

<div class="graphql-code-line ">stockLevels: [<a href="/reference/graphql-api/admin/object-types#stocklevel">StockLevel</a>!]!</div>

<div class="graphql-code-line ">stockMovements(options: <a href="/reference/graphql-api/admin/input-types#stockmovementlistoptions">StockMovementListOptions</a>): <a href="/reference/graphql-api/admin/object-types#stockmovementlist">StockMovementList</a>!</div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!]!</div>

<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">product: <a href="/reference/graphql-api/admin/object-types#product">Product</a>!</div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">featuredAsset: <a href="/reference/graphql-api/admin/object-types#asset">Asset</a></div>

<div class="graphql-code-line ">assets: [<a href="/reference/graphql-api/admin/object-types#asset">Asset</a>!]!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">stockLevel: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">taxRateApplied: <a href="/reference/graphql-api/admin/object-types#taxrate">TaxRate</a>!</div>

<div class="graphql-code-line ">taxCategory: <a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a>!</div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/admin/object-types#productoption">ProductOption</a>!]!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/admin/object-types#facetvalue">FacetValue</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#productvarianttranslation">ProductVariantTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariantList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantPrice

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariantPrice</span> &#123;</div>
<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProductVariantTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProductVariantTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Promotion

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Promotion</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">startsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">endsAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">couponCode: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">perCustomerUsageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">usageLimit: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">conditions: [<a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">actions: [<a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!]!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#promotiontranslation">PromotionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PromotionList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## PromotionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">PromotionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Province

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Province</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">parent: <a href="/reference/graphql-api/admin/object-types#region">Region</a></div>

<div class="graphql-code-line ">parentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a></div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#regiontranslation">RegionTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ProvinceList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ProvinceList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#province">Province</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## QuantityTooGreatError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the specified quantity of an OrderLine is greater than the number of items in that line</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">QuantityTooGreatError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Refund

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Refund</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">items: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">shipping: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">adjustment: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">total: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">method: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">state: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transactionId: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">reason: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">lines: [<a href="/reference/graphql-api/admin/object-types#refundline">RefundLine</a>!]!</div>

<div class="graphql-code-line ">paymentId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundAmountError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if <code>amount</code> is greater than the maximum un-refunded amount of the Payment</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundAmountError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">maximumRefundable: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundLine</span> &#123;</div>
<div class="graphql-code-line ">orderLine: <a href="/reference/graphql-api/admin/object-types#orderline">OrderLine</a>!</div>

<div class="graphql-code-line ">orderLineId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">refund: <a href="/reference/graphql-api/admin/object-types#refund">Refund</a>!</div>

<div class="graphql-code-line ">refundId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RefundOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#refund">Refund</a> | <a href="/reference/graphql-api/admin/object-types#quantitytoogreaterror">QuantityTooGreatError</a> | <a href="/reference/graphql-api/admin/object-types#nothingtorefunderror">NothingToRefundError</a> | <a href="/reference/graphql-api/admin/object-types#orderstatetransitionerror">OrderStateTransitionError</a> | <a href="/reference/graphql-api/admin/object-types#multipleordererror">MultipleOrderError</a> | <a href="/reference/graphql-api/admin/object-types#paymentordermismatcherror">PaymentOrderMismatchError</a> | <a href="/reference/graphql-api/admin/object-types#refundorderstateerror">RefundOrderStateError</a> | <a href="/reference/graphql-api/admin/object-types#alreadyrefundederror">AlreadyRefundedError</a> | <a href="/reference/graphql-api/admin/object-types#refundstatetransitionerror">RefundStateTransitionError</a> | <a href="/reference/graphql-api/admin/object-types#refundamounterror">RefundAmountError</a></div>
</div>

## RefundOrderStateError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if an attempting to refund an Order which is not in the expected state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundOrderStateError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">orderState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundPaymentIdMissingError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when a call to modifyOrder fails to include a refundPaymentId even</div>

<div class="graphql-code-line top-level comment">though the price has decreased as a result of the changes.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundPaymentIdMissingError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RefundStateTransitionError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned when there is an error in transitioning the Refund state</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RefundStateTransitionError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">transitionError: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fromState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">toState: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RegionTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RegionTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RelationCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RelationCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">entity: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">scalarFields: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Release

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Release</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RemoveFacetFromChannelResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RemoveFacetFromChannelResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#facet">Facet</a> | <a href="/reference/graphql-api/admin/object-types#facetinuseerror">FacetInUseError</a></div>
</div>

## RemoveOptionGroupFromProductResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RemoveOptionGroupFromProductResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#product">Product</a> | <a href="/reference/graphql-api/admin/object-types#productoptioninuseerror">ProductOptionInUseError</a></div>
</div>

## RemoveOrderItemsResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">RemoveOrderItemsResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#ordermodificationerror">OrderModificationError</a></div>
</div>

## Return

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Return</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Role

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Role</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]!</div>

<div class="graphql-code-line ">channels: [<a href="/reference/graphql-api/admin/object-types#channel">Channel</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## RoleList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">RoleList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#role">Role</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Sale

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Sale</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchReindexResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchReindexResponse</span> &#123;</div>
<div class="graphql-code-line ">success: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResponse

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResponse</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#searchresult">SearchResult</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">facetValues: [<a href="/reference/graphql-api/admin/object-types#facetvalueresult">FacetValueResult</a>!]!</div>

<div class="graphql-code-line ">collections: [<a href="/reference/graphql-api/admin/object-types#collectionresult">CollectionResult</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResult</span> &#123;</div>
<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An array of ids of the Channels in which this result appears</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">channelIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">slug: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">productName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productAsset: <a href="/reference/graphql-api/admin/object-types#searchresultasset">SearchResultAsset</a></div>

<div class="graphql-code-line ">productVariantId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">productVariantName: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">productVariantAsset: <a href="/reference/graphql-api/admin/object-types#searchresultasset">SearchResultAsset</a></div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#searchresultprice">SearchResultPrice</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#searchresultprice">SearchResultPrice</a>!</div>

<div class="graphql-code-line ">currencyCode: <a href="/reference/graphql-api/admin/enums#currencycode">CurrencyCode</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">facetIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line ">facetValueIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">An array of ids of the Collections in which this result appears</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">collectionIds: [<a href="/reference/graphql-api/admin/object-types#id">ID</a>!]!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">A relevance score for the result. Differs between database implementations</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">score: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultAsset

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SearchResultAsset</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">preview: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">focalPoint: <a href="/reference/graphql-api/admin/object-types#coordinate">Coordinate</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SearchResultPrice

<div class="graphql-code-block">
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">The price of a search result product, either as a range or as a single price</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SearchResultPrice</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#pricerange">PriceRange</a> | <a href="/reference/graphql-api/admin/object-types#singleprice">SinglePrice</a></div>
</div>

## Seller

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Seller</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SellerList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SellerList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#seller">Seller</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ServerConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ServerConfig</span> &#123;</div>
<div class="graphql-code-line ">orderProcess: [<a href="/reference/graphql-api/admin/object-types#orderprocessstate">OrderProcessState</a>!]!</div>

<div class="graphql-code-line ">permittedAssetTypes: [<a href="/reference/graphql-api/admin/object-types#string">String</a>!]!</div>

<div class="graphql-code-line ">permissions: [<a href="/reference/graphql-api/admin/object-types#permissiondefinition">PermissionDefinition</a>!]!</div>

<div class="graphql-code-line ">moneyStrategyPrecision: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">This field is deprecated in v2.2 in favor of the entityCustomFields field,</div>

<div class="graphql-code-line comment">which allows custom fields to be defined on user-supplies entities.</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">customFieldConfig: <a href="/reference/graphql-api/admin/object-types#customfields">CustomFields</a>!</div>

<div class="graphql-code-line ">entityCustomFields: [<a href="/reference/graphql-api/admin/object-types#entitycustomfields">EntityCustomFields</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SetCustomerForDraftOrderResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SetCustomerForDraftOrderResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#emailaddressconflicterror">EmailAddressConflictError</a></div>
</div>

## SetOrderShippingMethodResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SetOrderShippingMethodResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#ordermodificationerror">OrderModificationError</a> | <a href="/reference/graphql-api/admin/object-types#ineligibleshippingmethoderror">IneligibleShippingMethodError</a> | <a href="/reference/graphql-api/admin/object-types#noactiveordererror">NoActiveOrderError</a></div>
</div>

## SettlePaymentError

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Returned if the Payment settlement fails</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SettlePaymentError</span> &#123;</div>
<div class="graphql-code-line ">errorCode: <a href="/reference/graphql-api/admin/enums#errorcode">ErrorCode</a>!</div>

<div class="graphql-code-line ">message: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">paymentErrorMessage: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SettlePaymentResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SettlePaymentResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#payment">Payment</a> | <a href="/reference/graphql-api/admin/object-types#settlepaymenterror">SettlePaymentError</a> | <a href="/reference/graphql-api/admin/object-types#paymentstatetransitionerror">PaymentStateTransitionError</a> | <a href="/reference/graphql-api/admin/object-types#orderstatetransitionerror">OrderStateTransitionError</a></div>
</div>

## SettleRefundResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">SettleRefundResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#refund">Refund</a> | <a href="/reference/graphql-api/admin/object-types#refundstatetransitionerror">RefundStateTransitionError</a></div>
</div>

## ShippingLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingLine</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">shippingMethod: <a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discountedPrice: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discountedPriceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">discounts: [<a href="/reference/graphql-api/admin/object-types#discount">Discount</a>!]!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethod

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethod</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">fulfillmentHandlerCode: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">checker: <a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">calculator: <a href="/reference/graphql-api/admin/object-types#configurableoperation">ConfigurableOperation</a>!</div>

<div class="graphql-code-line ">translations: [<a href="/reference/graphql-api/admin/object-types#shippingmethodtranslation">ShippingMethodTranslation</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#shippingmethod">ShippingMethod</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodQuote

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodQuote</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">code: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line comment">Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult</div>
<div class="graphql-code-line comment">"""</div>
<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ShippingMethodTranslation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ShippingMethodTranslation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">languageCode: <a href="/reference/graphql-api/admin/enums#languagecode">LanguageCode</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## SinglePrice

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">The price value where the result has a single price</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">SinglePrice</span> &#123;</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockAdjustment

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StockAdjustment</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">productVariant: <a href="/reference/graphql-api/admin/object-types#productvariant">ProductVariant</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/enums#stockmovementtype">StockMovementType</a>!</div>

<div class="graphql-code-line ">quantity: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLevel

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StockLevel</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">stockLocationId: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">stockOnHand: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">stockAllocated: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>

<div class="graphql-code-line ">stockLocation: <a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLocation

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StockLocation</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockLocationList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StockLocationList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#stocklocation">StockLocation</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StockMovementItem

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">StockMovementItem</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#stockadjustment">StockAdjustment</a> | <a href="/reference/graphql-api/admin/object-types#allocation">Allocation</a> | <a href="/reference/graphql-api/admin/object-types#sale">Sale</a> | <a href="/reference/graphql-api/admin/object-types#cancellation">Cancellation</a> | <a href="/reference/graphql-api/admin/object-types#return">Return</a> | <a href="/reference/graphql-api/admin/object-types#release">Release</a></div>
</div>

## StockMovementList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StockMovementList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#stockmovementitem">StockMovementItem</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


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
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">length: <a href="/reference/graphql-api/admin/object-types#int">Int</a></div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">pattern: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">options: [<a href="/reference/graphql-api/admin/object-types#stringfieldoption">StringFieldOption</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## StringFieldOption

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">StringFieldOption</span> &#123;</div>
<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Success

<div class="graphql-code-block">
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level comment">Indicates that an operation succeeded, where we do not want to return any more specific information.</div>
<div class="graphql-code-line top-level comment">"""</div>
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Success</span> &#123;</div>
<div class="graphql-code-line ">success: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Surcharge

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Surcharge</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">sku: <a href="/reference/graphql-api/admin/object-types#string">String</a></div>

<div class="graphql-code-line ">taxLines: [<a href="/reference/graphql-api/admin/object-types#taxline">TaxLine</a>!]!</div>

<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Tag

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Tag</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TagList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TagList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#tag">Tag</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategory

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxCategory</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">isDefault: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxCategoryList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxCategoryList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxLine

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxLine</span> &#123;</div>
<div class="graphql-code-line ">description: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">taxRate: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRate

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxRate</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">enabled: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">value: <a href="/reference/graphql-api/admin/object-types#float">Float</a>!</div>

<div class="graphql-code-line ">category: <a href="/reference/graphql-api/admin/object-types#taxcategory">TaxCategory</a>!</div>

<div class="graphql-code-line ">zone: <a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!</div>

<div class="graphql-code-line ">customerGroup: <a href="/reference/graphql-api/admin/object-types#customergroup">CustomerGroup</a></div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TaxRateList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TaxRateList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#taxrate">TaxRate</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TestShippingMethodQuote

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TestShippingMethodQuote</span> &#123;</div>
<div class="graphql-code-line ">price: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">priceWithTax: <a href="/reference/graphql-api/admin/object-types#money">Money</a>!</div>

<div class="graphql-code-line ">metadata: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TestShippingMethodResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TestShippingMethodResult</span> &#123;</div>
<div class="graphql-code-line ">eligible: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">quote: <a href="/reference/graphql-api/admin/object-types#testshippingmethodquote">TestShippingMethodQuote</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TextCustomFieldConfig

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">TextCustomFieldConfig</span> &#123;</div>
<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">type: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">list: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">label: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">description: [<a href="/reference/graphql-api/admin/object-types#localizedstring">LocalizedString</a>!]</div>

<div class="graphql-code-line ">readonly: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">internal: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">nullable: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a></div>

<div class="graphql-code-line ">requiresPermission: [<a href="/reference/graphql-api/admin/enums#permission">Permission</a>!]</div>

<div class="graphql-code-line ">ui: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## TransitionFulfillmentToStateResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">TransitionFulfillmentToStateResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#fulfillment">Fulfillment</a> | <a href="/reference/graphql-api/admin/object-types#fulfillmentstatetransitionerror">FulfillmentStateTransitionError</a></div>
</div>

## TransitionOrderToStateResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">TransitionOrderToStateResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#orderstatetransitionerror">OrderStateTransitionError</a></div>
</div>

## TransitionPaymentToStateResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">TransitionPaymentToStateResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#payment">Payment</a> | <a href="/reference/graphql-api/admin/object-types#paymentstatetransitionerror">PaymentStateTransitionError</a></div>
</div>

## UpdateChannelResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateChannelResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#channel">Channel</a> | <a href="/reference/graphql-api/admin/object-types#languagenotavailableerror">LanguageNotAvailableError</a></div>
</div>

## UpdateCustomerResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateCustomerResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#customer">Customer</a> | <a href="/reference/graphql-api/admin/object-types#emailaddressconflicterror">EmailAddressConflictError</a></div>
</div>

## UpdateGlobalSettingsResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateGlobalSettingsResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#globalsettings">GlobalSettings</a> | <a href="/reference/graphql-api/admin/object-types#channeldefaultlanguageerror">ChannelDefaultLanguageError</a></div>
</div>

## UpdateOrderItemsResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdateOrderItemsResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#order">Order</a> | <a href="/reference/graphql-api/admin/object-types#ordermodificationerror">OrderModificationError</a> | <a href="/reference/graphql-api/admin/object-types#orderlimiterror">OrderLimitError</a> | <a href="/reference/graphql-api/admin/object-types#negativequantityerror">NegativeQuantityError</a> | <a href="/reference/graphql-api/admin/object-types#insufficientstockerror">InsufficientStockError</a></div>
</div>

## UpdatePromotionResult

<div class="graphql-code-block">
<div class="graphql-code-line top-level">union <span class="graphql-code-identifier">UpdatePromotionResult</span> =</div>
<div class="graphql-code-line "><a href="/reference/graphql-api/admin/object-types#promotion">Promotion</a> | <a href="/reference/graphql-api/admin/object-types#missingconditionserror">MissingConditionsError</a></div>
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
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">identifier: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">verified: <a href="/reference/graphql-api/admin/object-types#boolean">Boolean</a>!</div>

<div class="graphql-code-line ">roles: [<a href="/reference/graphql-api/admin/object-types#role">Role</a>!]!</div>

<div class="graphql-code-line ">lastLogin: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a></div>

<div class="graphql-code-line ">authenticationMethods: [<a href="/reference/graphql-api/admin/object-types#authenticationmethod">AuthenticationMethod</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## Zone

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">Zone</span> &#123;</div>
<div class="graphql-code-line ">id: <a href="/reference/graphql-api/admin/object-types#id">ID</a>!</div>

<div class="graphql-code-line ">createdAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">updatedAt: <a href="/reference/graphql-api/admin/object-types#datetime">DateTime</a>!</div>

<div class="graphql-code-line ">name: <a href="/reference/graphql-api/admin/object-types#string">String</a>!</div>

<div class="graphql-code-line ">members: [<a href="/reference/graphql-api/admin/object-types#region">Region</a>!]!</div>

<div class="graphql-code-line ">customFields: <a href="/reference/graphql-api/admin/object-types#json">JSON</a></div>


<div class="graphql-code-line top-level">&#125;</div>
</div>

## ZoneList

<div class="graphql-code-block">
<div class="graphql-code-line top-level">type <span class="graphql-code-identifier">ZoneList</span> &#123;</div>
<div class="graphql-code-line ">items: [<a href="/reference/graphql-api/admin/object-types#zone">Zone</a>!]!</div>

<div class="graphql-code-line ">totalItems: <a href="/reference/graphql-api/admin/object-types#int">Int</a>!</div>


<div class="graphql-code-line top-level">&#125;</div>
</div>
