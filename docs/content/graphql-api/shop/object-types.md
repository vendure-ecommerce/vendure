---
title: "Types"
weight: 3
date: 2023-07-04T11:02:06.199Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Types

## ActiveOrderResult

{{% gql-fields %}}
union ActiveOrderResult = [Order](/graphql-api/shop/object-types#order) | [NoActiveOrderError](/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## AddPaymentToOrderResult

{{% gql-fields %}}
union AddPaymentToOrderResult = [Order](/graphql-api/shop/object-types#order) | [OrderPaymentStateError](/graphql-api/shop/object-types#orderpaymentstateerror) | [IneligiblePaymentMethodError](/graphql-api/shop/object-types#ineligiblepaymentmethoderror) | [PaymentFailedError](/graphql-api/shop/object-types#paymentfailederror) | [PaymentDeclinedError](/graphql-api/shop/object-types#paymentdeclinederror) | [OrderStateTransitionError](/graphql-api/shop/object-types#orderstatetransitionerror) | [NoActiveOrderError](/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## Address

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * fullName: [String](/graphql-api/shop/object-types#string)
 * company: [String](/graphql-api/shop/object-types#string)
 * streetLine1: [String](/graphql-api/shop/object-types#string)!
 * streetLine2: [String](/graphql-api/shop/object-types#string)
 * city: [String](/graphql-api/shop/object-types#string)
 * province: [String](/graphql-api/shop/object-types#string)
 * postalCode: [String](/graphql-api/shop/object-types#string)
 * country: [Country](/graphql-api/shop/object-types#country)!
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Adjustment

{{% gql-fields %}}
 * adjustmentSource: [String](/graphql-api/shop/object-types#string)!
 * type: [AdjustmentType](/graphql-api/shop/enums#adjustmenttype)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * amount: [Money](/graphql-api/shop/object-types#money)!
 * data: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## AlreadyLoggedInError

Returned when attempting to set the Customer for an Order when already logged in.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ApplyCouponCodeResult

{{% gql-fields %}}
union ApplyCouponCodeResult = [Order](/graphql-api/shop/object-types#order) | [CouponCodeExpiredError](/graphql-api/shop/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/graphql-api/shop/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/graphql-api/shop/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Asset

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [AssetType](/graphql-api/shop/enums#assettype)!
 * fileSize: [Int](/graphql-api/shop/object-types#int)!
 * mimeType: [String](/graphql-api/shop/object-types#string)!
 * width: [Int](/graphql-api/shop/object-types#int)!
 * height: [Int](/graphql-api/shop/object-types#int)!
 * source: [String](/graphql-api/shop/object-types#string)!
 * preview: [String](/graphql-api/shop/object-types#string)!
 * focalPoint: [Coordinate](/graphql-api/shop/object-types#coordinate)
 * tags: [[Tag](/graphql-api/shop/object-types#tag)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## AssetList

{{% gql-fields %}}
 * items: [[Asset](/graphql-api/shop/object-types#asset)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## AuthenticationMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * strategy: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## AuthenticationResult

{{% gql-fields %}}
union AuthenticationResult = [CurrentUser](/graphql-api/shop/object-types#currentuser) | [InvalidCredentialsError](/graphql-api/shop/object-types#invalidcredentialserror) | [NotVerifiedError](/graphql-api/shop/object-types#notverifiederror)
{{% /gql-fields %}}

## Boolean

The `Boolean` scalar type represents `true` or `false`.

## BooleanCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Channel

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * token: [String](/graphql-api/shop/object-types#string)!
 * defaultTaxZone: [Zone](/graphql-api/shop/object-types#zone)
 * defaultShippingZone: [Zone](/graphql-api/shop/object-types#zone)
 * defaultLanguageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/graphql-api/shop/enums#languagecode)!]
 * currencyCode: [CurrencyCode](/graphql-api/shop/enums#currencycode)!
 * defaultCurrencyCode: [CurrencyCode](/graphql-api/shop/enums#currencycode)!
 * availableCurrencyCodes: [[CurrencyCode](/graphql-api/shop/enums#currencycode)!]!
* *// Not yet used - will be implemented in a future release.*
 * trackInventory: [Boolean](/graphql-api/shop/object-types#boolean)
* *// Not yet used - will be implemented in a future release.*
 * outOfStockThreshold: [Int](/graphql-api/shop/object-types#int)
 * pricesIncludeTax: [Boolean](/graphql-api/shop/object-types#boolean)!
 * seller: [Seller](/graphql-api/shop/object-types#seller)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Collection

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)
 * name: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
 * breadcrumbs: [[CollectionBreadcrumb](/graphql-api/shop/object-types#collectionbreadcrumb)!]!
 * position: [Int](/graphql-api/shop/object-types#int)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/graphql-api/shop/object-types#asset)!]!
 * parent: [Collection](/graphql-api/shop/object-types#collection)
 * parentId: [ID](/graphql-api/shop/object-types#id)!
 * children: [[Collection](/graphql-api/shop/object-types#collection)!]
 * filters: [[ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!]!
 * translations: [[CollectionTranslation](/graphql-api/shop/object-types#collectiontranslation)!]!
 * productVariants(options: [ProductVariantListOptions](/graphql-api/shop/input-types#productvariantlistoptions)): [ProductVariantList](/graphql-api/shop/object-types#productvariantlist)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CollectionBreadcrumb

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CollectionList

{{% gql-fields %}}
 * items: [[Collection](/graphql-api/shop/object-types#collection)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CollectionResult

Which Collections are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * collection: [Collection](/graphql-api/shop/object-types#collection)!
 * count: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CollectionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigArg

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * value: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigArgDefinition

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * required: [Boolean](/graphql-api/shop/object-types#boolean)!
 * defaultValue: [JSON](/graphql-api/shop/object-types#json)
 * label: [String](/graphql-api/shop/object-types#string)
 * description: [String](/graphql-api/shop/object-types#string)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ConfigurableOperation

{{% gql-fields %}}
 * code: [String](/graphql-api/shop/object-types#string)!
 * args: [[ConfigArg](/graphql-api/shop/object-types#configarg)!]!
{{% /gql-fields %}}


## ConfigurableOperationDefinition

{{% gql-fields %}}
 * code: [String](/graphql-api/shop/object-types#string)!
 * args: [[ConfigArgDefinition](/graphql-api/shop/object-types#configargdefinition)!]!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Coordinate

{{% gql-fields %}}
 * x: [Float](/graphql-api/shop/object-types#float)!
 * y: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## Country

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/graphql-api/shop/object-types#boolean)!
 * parent: [Region](/graphql-api/shop/object-types#region)
 * parentId: [ID](/graphql-api/shop/object-types#id)
 * translations: [[RegionTranslation](/graphql-api/shop/object-types#regiontranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CountryList

{{% gql-fields %}}
 * items: [[Country](/graphql-api/shop/object-types#country)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CouponCodeExpiredError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * couponCode: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CouponCodeInvalidError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * couponCode: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CouponCodeLimitError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * couponCode: [String](/graphql-api/shop/object-types#string)!
 * limit: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CurrentUser

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * identifier: [String](/graphql-api/shop/object-types#string)!
 * channels: [[CurrentUserChannel](/graphql-api/shop/object-types#currentuserchannel)!]!
{{% /gql-fields %}}


## CurrentUserChannel

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * token: [String](/graphql-api/shop/object-types#string)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * permissions: [[Permission](/graphql-api/shop/enums#permission)!]!
{{% /gql-fields %}}


## CustomFieldConfig

{{% gql-fields %}}
union CustomFieldConfig = [StringCustomFieldConfig](/graphql-api/shop/object-types#stringcustomfieldconfig) | [LocaleStringCustomFieldConfig](/graphql-api/shop/object-types#localestringcustomfieldconfig) | [IntCustomFieldConfig](/graphql-api/shop/object-types#intcustomfieldconfig) | [FloatCustomFieldConfig](/graphql-api/shop/object-types#floatcustomfieldconfig) | [BooleanCustomFieldConfig](/graphql-api/shop/object-types#booleancustomfieldconfig) | [DateTimeCustomFieldConfig](/graphql-api/shop/object-types#datetimecustomfieldconfig) | [RelationCustomFieldConfig](/graphql-api/shop/object-types#relationcustomfieldconfig) | [TextCustomFieldConfig](/graphql-api/shop/object-types#textcustomfieldconfig) | [LocaleTextCustomFieldConfig](/graphql-api/shop/object-types#localetextcustomfieldconfig)
{{% /gql-fields %}}

## Customer

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * title: [String](/graphql-api/shop/object-types#string)
 * firstName: [String](/graphql-api/shop/object-types#string)!
 * lastName: [String](/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * emailAddress: [String](/graphql-api/shop/object-types#string)!
 * addresses: [[Address](/graphql-api/shop/object-types#address)!]
 * orders(options: [OrderListOptions](/graphql-api/shop/input-types#orderlistoptions)): [OrderList](/graphql-api/shop/object-types#orderlist)!
 * user: [User](/graphql-api/shop/object-types#user)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerGroup

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * customers(options: [CustomerListOptions](/graphql-api/shop/input-types#customerlistoptions)): [CustomerList](/graphql-api/shop/object-types#customerlist)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerList

{{% gql-fields %}}
 * items: [[Customer](/graphql-api/shop/object-types#customer)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## DateTime

A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

## DateTimeCustomFieldConfig

Expects the same validation formats as the `<input type="datetime-local">` HTML element.
See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * min: [String](/graphql-api/shop/object-types#string)
 * max: [String](/graphql-api/shop/object-types#string)
 * step: [Int](/graphql-api/shop/object-types#int)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## DeletionResponse

{{% gql-fields %}}
 * result: [DeletionResult](/graphql-api/shop/enums#deletionresult)!
 * message: [String](/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## Discount

{{% gql-fields %}}
 * adjustmentSource: [String](/graphql-api/shop/object-types#string)!
 * type: [AdjustmentType](/graphql-api/shop/enums#adjustmenttype)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * amount: [Money](/graphql-api/shop/object-types#money)!
 * amountWithTax: [Money](/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## EmailAddressConflictError

Returned when attempting to create a Customer with an email address already registered to an existing User.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Facet

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * values: [[FacetValue](/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[FacetTranslation](/graphql-api/shop/object-types#facettranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FacetList

{{% gql-fields %}}
 * items: [[Facet](/graphql-api/shop/object-types#facet)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## FacetTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## FacetValue

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * facet: [Facet](/graphql-api/shop/object-types#facet)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * translations: [[FacetValueTranslation](/graphql-api/shop/object-types#facetvaluetranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FacetValueResult

Which FacetValues are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * facetValue: [FacetValue](/graphql-api/shop/object-types#facetvalue)!
 * count: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## FacetValueTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## FloatCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * min: [Float](/graphql-api/shop/object-types#float)
 * max: [Float](/graphql-api/shop/object-types#float)
 * step: [Float](/graphql-api/shop/object-types#float)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Fulfillment

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * lines: [[FulfillmentLine](/graphql-api/shop/object-types#fulfillmentline)!]!
 * summary: [[FulfillmentLine](/graphql-api/shop/object-types#fulfillmentline)!]!
 * state: [String](/graphql-api/shop/object-types#string)!
 * method: [String](/graphql-api/shop/object-types#string)!
 * trackingCode: [String](/graphql-api/shop/object-types#string)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FulfillmentLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/graphql-api/shop/object-types#orderline)!
 * orderLineId: [ID](/graphql-api/shop/object-types#id)!
 * quantity: [Int](/graphql-api/shop/object-types#int)!
 * fulfillment: [Fulfillment](/graphql-api/shop/object-types#fulfillment)!
 * fulfillmentId: [ID](/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## GuestCheckoutError

Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * errorDetail: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## HistoryEntry

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * type: [HistoryEntryType](/graphql-api/shop/enums#historyentrytype)!
 * data: [JSON](/graphql-api/shop/object-types#json)!
{{% /gql-fields %}}


## HistoryEntryList

{{% gql-fields %}}
 * items: [[HistoryEntry](/graphql-api/shop/object-types#historyentry)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## IdentifierChangeTokenExpiredError

Returned if the token used to change a Customer's email address is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## IdentifierChangeTokenInvalidError

Returned if the token used to change a Customer's email address is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## IneligiblePaymentMethodError

Returned when attempting to add a Payment using a PaymentMethod for which the Order is not eligible.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * eligibilityCheckerMessage: [String](/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## IneligibleShippingMethodError

Returned when attempting to set a ShippingMethod for which the Order is not eligible

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## InsufficientStockError

Returned when attempting to add more items to the Order than are available

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * quantityAvailable: [Int](/graphql-api/shop/object-types#int)!
 * order: [Order](/graphql-api/shop/object-types#order)!
{{% /gql-fields %}}


## Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

## IntCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * min: [Int](/graphql-api/shop/object-types#int)
 * max: [Int](/graphql-api/shop/object-types#int)
 * step: [Int](/graphql-api/shop/object-types#int)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## InvalidCredentialsError

Returned if the user authentication credentials are not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * authenticationError: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## JSON

The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).

## LocaleStringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * length: [Int](/graphql-api/shop/object-types#int)
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * pattern: [String](/graphql-api/shop/object-types#string)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## LocaleTextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## LocalizedString

{{% gql-fields %}}
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * value: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## MissingPasswordError

Returned when attempting to register or verify a customer account without a password, when one is required.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Money

The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## NativeAuthStrategyError

Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NativeAuthenticationResult

{{% gql-fields %}}
union NativeAuthenticationResult = [CurrentUser](/graphql-api/shop/object-types#currentuser) | [InvalidCredentialsError](/graphql-api/shop/object-types#invalidcredentialserror) | [NotVerifiedError](/graphql-api/shop/object-types#notverifiederror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## NegativeQuantityError

Returned when attempting to set a negative OrderLine quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NoActiveOrderError

Returned when invoking a mutation which depends on there being an active Order on the
current session.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NotVerifiedError

Returned if `authOptions.requireVerification` is set to `true` (which is the default)
and an unverified user attempts to authenticate.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Order

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * type: [OrderType](/graphql-api/shop/enums#ordertype)!
* *// The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active"*
 * orderPlacedAt: [DateTime](/graphql-api/shop/object-types#datetime)
* *// A unique code for the Order*
 * code: [String](/graphql-api/shop/object-types#string)!
 * state: [String](/graphql-api/shop/object-types#string)!
* *// An order is active as long as the payment process has not been completed*
 * active: [Boolean](/graphql-api/shop/object-types#boolean)!
 * customer: [Customer](/graphql-api/shop/object-types#customer)
 * shippingAddress: [OrderAddress](/graphql-api/shop/object-types#orderaddress)
 * billingAddress: [OrderAddress](/graphql-api/shop/object-types#orderaddress)
 * lines: [[OrderLine](/graphql-api/shop/object-types#orderline)!]!
* *// Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.*
 * surcharges: [[Surcharge](/graphql-api/shop/object-types#surcharge)!]!
 * discounts: [[Discount](/graphql-api/shop/object-types#discount)!]!
* *// An array of all coupon codes applied to the Order*
 * couponCodes: [[String](/graphql-api/shop/object-types#string)!]!
* *// Promotions applied to the order. Only gets populated after the payment process has completed.*
 * promotions: [[Promotion](/graphql-api/shop/object-types#promotion)!]!
 * payments: [[Payment](/graphql-api/shop/object-types#payment)!]
 * fulfillments: [[Fulfillment](/graphql-api/shop/object-types#fulfillment)!]
 * totalQuantity: [Int](/graphql-api/shop/object-types#int)!
* *// The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of `OrderLine.discountedLinePrice` values.*
 * subTotal: [Money](/graphql-api/shop/object-types#money)!
* *// Same as subTotal, but inclusive of tax*
 * subTotalWithTax: [Money](/graphql-api/shop/object-types#money)!
 * currencyCode: [CurrencyCode](/graphql-api/shop/enums#currencycode)!
 * shippingLines: [[ShippingLine](/graphql-api/shop/object-types#shippingline)!]!
 * shipping: [Money](/graphql-api/shop/object-types#money)!
 * shippingWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// Equal to subTotal plus shipping*
 * total: [Money](/graphql-api/shop/object-types#money)!
* *// The final payable amount. Equal to subTotalWithTax plus shippingWithTax*
 * totalWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// A summary of the taxes being applied to this Order*
 * taxSummary: [[OrderTaxSummary](/graphql-api/shop/object-types#ordertaxsummary)!]!
 * history(options: [HistoryEntryListOptions](/graphql-api/shop/input-types#historyentrylistoptions)): [HistoryEntryList](/graphql-api/shop/object-types#historyentrylist)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderAddress

{{% gql-fields %}}
 * fullName: [String](/graphql-api/shop/object-types#string)
 * company: [String](/graphql-api/shop/object-types#string)
 * streetLine1: [String](/graphql-api/shop/object-types#string)
 * streetLine2: [String](/graphql-api/shop/object-types#string)
 * city: [String](/graphql-api/shop/object-types#string)
 * province: [String](/graphql-api/shop/object-types#string)
 * postalCode: [String](/graphql-api/shop/object-types#string)
 * country: [String](/graphql-api/shop/object-types#string)
 * countryCode: [String](/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/graphql-api/shop/object-types#string)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderLimitError

Returned when the maximum order size limit has been reached.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * maxItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## OrderLine

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/shop/object-types#productvariant)!
 * featuredAsset: [Asset](/graphql-api/shop/object-types#asset)
* *// The price of a single unit, excluding tax and discounts*
 * unitPrice: [Money](/graphql-api/shop/object-types#money)!
* *// The price of a single unit, including tax but excluding discounts*
 * unitPriceWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// Non-zero if the unitPrice has changed since it was initially added to Order*
 * unitPriceChangeSinceAdded: [Money](/graphql-api/shop/object-types#money)!
* *// Non-zero if the unitPriceWithTax has changed since it was initially added to Order*
 * unitPriceWithTaxChangeSinceAdded: [Money](/graphql-api/shop/object-types#money)!
* *// The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.*
 * discountedUnitPrice: [Money](/graphql-api/shop/object-types#money)!
* *// The price of a single unit including discounts and tax*
 * discountedUnitPriceWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
and refund calculations.*
 * proratedUnitPrice: [Money](/graphql-api/shop/object-types#money)!
* *// The proratedUnitPrice including tax*
 * proratedUnitPriceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * quantity: [Int](/graphql-api/shop/object-types#int)!
* *// The quantity at the time the Order was placed*
 * orderPlacedQuantity: [Int](/graphql-api/shop/object-types#int)!
 * taxRate: [Float](/graphql-api/shop/object-types#float)!
* *// The total price of the line excluding tax and discounts.*
 * linePrice: [Money](/graphql-api/shop/object-types#money)!
* *// The total price of the line including tax but excluding discounts.*
 * linePriceWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// The price of the line including discounts, excluding tax*
 * discountedLinePrice: [Money](/graphql-api/shop/object-types#money)!
* *// The price of the line including discounts and tax*
 * discountedLinePriceWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.*
 * proratedLinePrice: [Money](/graphql-api/shop/object-types#money)!
* *// The proratedLinePrice including tax*
 * proratedLinePriceWithTax: [Money](/graphql-api/shop/object-types#money)!
* *// The total tax on this line*
 * lineTax: [Money](/graphql-api/shop/object-types#money)!
 * discounts: [[Discount](/graphql-api/shop/object-types#discount)!]!
 * taxLines: [[TaxLine](/graphql-api/shop/object-types#taxline)!]!
 * order: [Order](/graphql-api/shop/object-types#order)!
 * fulfillmentLines: [[FulfillmentLine](/graphql-api/shop/object-types#fulfillmentline)!]
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderList

{{% gql-fields %}}
 * items: [[Order](/graphql-api/shop/object-types#order)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## OrderModificationError

Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderPaymentStateError

Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderStateTransitionError

Returned if there is an error in transitioning the Order state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * transitionError: [String](/graphql-api/shop/object-types#string)!
 * fromState: [String](/graphql-api/shop/object-types#string)!
 * toState: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderTaxSummary

A summary of the taxes being applied to this order, grouped
by taxRate.

{{% gql-fields %}}
* *// A description of this tax*
 * description: [String](/graphql-api/shop/object-types#string)!
* *// The taxRate as a percentage*
 * taxRate: [Float](/graphql-api/shop/object-types#float)!
* *// The total net price of OrderLines to which this taxRate applies*
 * taxBase: [Money](/graphql-api/shop/object-types#money)!
* *// The total tax being applied to the Order at this taxRate*
 * taxTotal: [Money](/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## PasswordAlreadySetError

Returned when attempting to verify a customer account with a password, when a password has already been set.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordResetTokenExpiredError

Returned if the token used to reset a Customer's password is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordResetTokenInvalidError

Returned if the token used to reset a Customer's password is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordValidationError

Returned when attempting to register or verify a customer account where the given password fails password validation.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * validationErrorMessage: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Payment

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * method: [String](/graphql-api/shop/object-types#string)!
 * amount: [Money](/graphql-api/shop/object-types#money)!
 * state: [String](/graphql-api/shop/object-types#string)!
 * transactionId: [String](/graphql-api/shop/object-types#string)
 * errorMessage: [String](/graphql-api/shop/object-types#string)
 * refunds: [[Refund](/graphql-api/shop/object-types#refund)!]!
 * metadata: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentDeclinedError

Returned when a Payment is declined by the payment provider.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * paymentErrorMessage: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PaymentFailedError

Returned when a Payment fails due to an error.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
 * paymentErrorMessage: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PaymentMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/graphql-api/shop/object-types#boolean)!
 * checker: [ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)
 * handler: [ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!
 * translations: [[PaymentMethodTranslation](/graphql-api/shop/object-types#paymentmethodtranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentMethodQuote

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * isEligible: [Boolean](/graphql-api/shop/object-types#boolean)!
 * eligibilityMessage: [String](/graphql-api/shop/object-types#string)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentMethodTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PriceRange

The price range where the result has more than one price

{{% gql-fields %}}
 * min: [Money](/graphql-api/shop/object-types#money)!
 * max: [Money](/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## Product

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/graphql-api/shop/object-types#asset)!]!
* *// Returns all ProductVariants*
 * variants: [[ProductVariant](/graphql-api/shop/object-types#productvariant)!]!
* *// Returns a paginated, sortable, filterable list of ProductVariants*
 * variantList(options: [ProductVariantListOptions](/graphql-api/shop/input-types#productvariantlistoptions)): [ProductVariantList](/graphql-api/shop/object-types#productvariantlist)!
 * optionGroups: [[ProductOptionGroup](/graphql-api/shop/object-types#productoptiongroup)!]!
 * facetValues: [[FacetValue](/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[ProductTranslation](/graphql-api/shop/object-types#producttranslation)!]!
 * collections: [[Collection](/graphql-api/shop/object-types#collection)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductList

{{% gql-fields %}}
 * items: [[Product](/graphql-api/shop/object-types#product)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ProductOption

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * groupId: [ID](/graphql-api/shop/object-types#id)!
 * group: [ProductOptionGroup](/graphql-api/shop/object-types#productoptiongroup)!
 * translations: [[ProductOptionTranslation](/graphql-api/shop/object-types#productoptiontranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroup

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * options: [[ProductOption](/graphql-api/shop/object-types#productoption)!]!
 * translations: [[ProductOptionGroupTranslation](/graphql-api/shop/object-types#productoptiongrouptranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroupTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductOptionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductVariant

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * product: [Product](/graphql-api/shop/object-types#product)!
 * productId: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * sku: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/graphql-api/shop/object-types#asset)!]!
 * price: [Money](/graphql-api/shop/object-types#money)!
 * currencyCode: [CurrencyCode](/graphql-api/shop/enums#currencycode)!
 * priceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * stockLevel: [String](/graphql-api/shop/object-types#string)!
 * taxRateApplied: [TaxRate](/graphql-api/shop/object-types#taxrate)!
 * taxCategory: [TaxCategory](/graphql-api/shop/object-types#taxcategory)!
 * options: [[ProductOption](/graphql-api/shop/object-types#productoption)!]!
 * facetValues: [[FacetValue](/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[ProductVariantTranslation](/graphql-api/shop/object-types#productvarianttranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductVariantList

{{% gql-fields %}}
 * items: [[ProductVariant](/graphql-api/shop/object-types#productvariant)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ProductVariantTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Promotion

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * startsAt: [DateTime](/graphql-api/shop/object-types#datetime)
 * endsAt: [DateTime](/graphql-api/shop/object-types#datetime)
 * couponCode: [String](/graphql-api/shop/object-types#string)
 * perCustomerUsageLimit: [Int](/graphql-api/shop/object-types#int)
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/graphql-api/shop/object-types#boolean)!
 * conditions: [[ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!]!
 * actions: [[ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!]!
 * translations: [[PromotionTranslation](/graphql-api/shop/object-types#promotiontranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PromotionList

{{% gql-fields %}}
 * items: [[Promotion](/graphql-api/shop/object-types#promotion)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## PromotionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Province

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/graphql-api/shop/object-types#boolean)!
 * parent: [Region](/graphql-api/shop/object-types#region)
 * parentId: [ID](/graphql-api/shop/object-types#id)
 * translations: [[RegionTranslation](/graphql-api/shop/object-types#regiontranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProvinceList

{{% gql-fields %}}
 * items: [[Province](/graphql-api/shop/object-types#province)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## RefreshCustomerVerificationResult

{{% gql-fields %}}
union RefreshCustomerVerificationResult = [Success](/graphql-api/shop/object-types#success) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## Refund

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * items: [Money](/graphql-api/shop/object-types#money)!
 * shipping: [Money](/graphql-api/shop/object-types#money)!
 * adjustment: [Money](/graphql-api/shop/object-types#money)!
 * total: [Money](/graphql-api/shop/object-types#money)!
 * method: [String](/graphql-api/shop/object-types#string)
 * state: [String](/graphql-api/shop/object-types#string)!
 * transactionId: [String](/graphql-api/shop/object-types#string)
 * reason: [String](/graphql-api/shop/object-types#string)
 * lines: [[RefundLine](/graphql-api/shop/object-types#refundline)!]!
 * paymentId: [ID](/graphql-api/shop/object-types#id)!
 * metadata: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## RefundLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/graphql-api/shop/object-types#orderline)!
 * orderLineId: [ID](/graphql-api/shop/object-types#id)!
 * quantity: [Int](/graphql-api/shop/object-types#int)!
 * refund: [Refund](/graphql-api/shop/object-types#refund)!
 * refundId: [ID](/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## RegionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## RegisterCustomerAccountResult

{{% gql-fields %}}
union RegisterCustomerAccountResult = [Success](/graphql-api/shop/object-types#success) | [MissingPasswordError](/graphql-api/shop/object-types#missingpassworderror) | [PasswordValidationError](/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## RelationCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * entity: [String](/graphql-api/shop/object-types#string)!
 * scalarFields: [[String](/graphql-api/shop/object-types#string)!]!
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## RemoveOrderItemsResult

{{% gql-fields %}}
union RemoveOrderItemsResult = [Order](/graphql-api/shop/object-types#order) | [OrderModificationError](/graphql-api/shop/object-types#ordermodificationerror)
{{% /gql-fields %}}

## RequestPasswordResetResult

{{% gql-fields %}}
union RequestPasswordResetResult = [Success](/graphql-api/shop/object-types#success) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## RequestUpdateCustomerEmailAddressResult

{{% gql-fields %}}
union RequestUpdateCustomerEmailAddressResult = [Success](/graphql-api/shop/object-types#success) | [InvalidCredentialsError](/graphql-api/shop/object-types#invalidcredentialserror) | [EmailAddressConflictError](/graphql-api/shop/object-types#emailaddressconflicterror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## ResetPasswordResult

{{% gql-fields %}}
union ResetPasswordResult = [CurrentUser](/graphql-api/shop/object-types#currentuser) | [PasswordResetTokenInvalidError](/graphql-api/shop/object-types#passwordresettokeninvaliderror) | [PasswordResetTokenExpiredError](/graphql-api/shop/object-types#passwordresettokenexpirederror) | [PasswordValidationError](/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror) | [NotVerifiedError](/graphql-api/shop/object-types#notverifiederror)
{{% /gql-fields %}}

## Role

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * permissions: [[Permission](/graphql-api/shop/enums#permission)!]!
 * channels: [[Channel](/graphql-api/shop/object-types#channel)!]!
{{% /gql-fields %}}


## RoleList

{{% gql-fields %}}
 * items: [[Role](/graphql-api/shop/object-types#role)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## SearchReindexResponse

{{% gql-fields %}}
 * success: [Boolean](/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## SearchResponse

{{% gql-fields %}}
 * items: [[SearchResult](/graphql-api/shop/object-types#searchresult)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
 * facetValues: [[FacetValueResult](/graphql-api/shop/object-types#facetvalueresult)!]!
 * collections: [[CollectionResult](/graphql-api/shop/object-types#collectionresult)!]!
{{% /gql-fields %}}


## SearchResult

{{% gql-fields %}}
 * sku: [String](/graphql-api/shop/object-types#string)!
 * slug: [String](/graphql-api/shop/object-types#string)!
 * productId: [ID](/graphql-api/shop/object-types#id)!
 * productName: [String](/graphql-api/shop/object-types#string)!
 * productAsset: [SearchResultAsset](/graphql-api/shop/object-types#searchresultasset)
 * productVariantId: [ID](/graphql-api/shop/object-types#id)!
 * productVariantName: [String](/graphql-api/shop/object-types#string)!
 * productVariantAsset: [SearchResultAsset](/graphql-api/shop/object-types#searchresultasset)
 * price: [SearchResultPrice](/graphql-api/shop/object-types#searchresultprice)!
 * priceWithTax: [SearchResultPrice](/graphql-api/shop/object-types#searchresultprice)!
 * currencyCode: [CurrencyCode](/graphql-api/shop/enums#currencycode)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * facetIds: [[ID](/graphql-api/shop/object-types#id)!]!
 * facetValueIds: [[ID](/graphql-api/shop/object-types#id)!]!
* *// An array of ids of the Collections in which this result appears*
 * collectionIds: [[ID](/graphql-api/shop/object-types#id)!]!
* *// A relevance score for the result. Differs between database implementations*
 * score: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## SearchResultAsset

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * preview: [String](/graphql-api/shop/object-types#string)!
 * focalPoint: [Coordinate](/graphql-api/shop/object-types#coordinate)
{{% /gql-fields %}}


## SearchResultPrice

The price of a search result product, either as a range or as a single price

{{% gql-fields %}}
union SearchResultPrice = [PriceRange](/graphql-api/shop/object-types#pricerange) | [SinglePrice](/graphql-api/shop/object-types#singleprice)
{{% /gql-fields %}}

## Seller

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## SetCustomerForOrderResult

{{% gql-fields %}}
union SetCustomerForOrderResult = [Order](/graphql-api/shop/object-types#order) | [AlreadyLoggedInError](/graphql-api/shop/object-types#alreadyloggedinerror) | [EmailAddressConflictError](/graphql-api/shop/object-types#emailaddressconflicterror) | [NoActiveOrderError](/graphql-api/shop/object-types#noactiveordererror) | [GuestCheckoutError](/graphql-api/shop/object-types#guestcheckouterror)
{{% /gql-fields %}}

## SetOrderShippingMethodResult

{{% gql-fields %}}
union SetOrderShippingMethodResult = [Order](/graphql-api/shop/object-types#order) | [OrderModificationError](/graphql-api/shop/object-types#ordermodificationerror) | [IneligibleShippingMethodError](/graphql-api/shop/object-types#ineligibleshippingmethoderror) | [NoActiveOrderError](/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## ShippingLine

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * shippingMethod: [ShippingMethod](/graphql-api/shop/object-types#shippingmethod)!
 * price: [Money](/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * discountedPrice: [Money](/graphql-api/shop/object-types#money)!
 * discountedPriceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * discounts: [[Discount](/graphql-api/shop/object-types#discount)!]!
{{% /gql-fields %}}


## ShippingMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * fulfillmentHandlerCode: [String](/graphql-api/shop/object-types#string)!
 * checker: [ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!
 * calculator: [ConfigurableOperation](/graphql-api/shop/object-types#configurableoperation)!
 * translations: [[ShippingMethodTranslation](/graphql-api/shop/object-types#shippingmethodtranslation)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ShippingMethodList

{{% gql-fields %}}
 * items: [[ShippingMethod](/graphql-api/shop/object-types#shippingmethod)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ShippingMethodQuote

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * price: [Money](/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * code: [String](/graphql-api/shop/object-types#string)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
* *// Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult*
 * metadata: [JSON](/graphql-api/shop/object-types#json)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ShippingMethodTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/shop/enums#languagecode)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * description: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## SinglePrice

The price value where the result has a single price

{{% gql-fields %}}
 * value: [Money](/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## StringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * length: [Int](/graphql-api/shop/object-types#int)
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * pattern: [String](/graphql-api/shop/object-types#string)
 * options: [[StringFieldOption](/graphql-api/shop/object-types#stringfieldoption)!]
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## StringFieldOption

{{% gql-fields %}}
 * value: [String](/graphql-api/shop/object-types#string)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
{{% /gql-fields %}}


## Success

Indicates that an operation succeeded, where we do not want to return any more specific information.

{{% gql-fields %}}
 * success: [Boolean](/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## Surcharge

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * description: [String](/graphql-api/shop/object-types#string)!
 * sku: [String](/graphql-api/shop/object-types#string)
 * taxLines: [[TaxLine](/graphql-api/shop/object-types#taxline)!]!
 * price: [Money](/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/graphql-api/shop/object-types#money)!
 * taxRate: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## Tag

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * value: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## TagList

{{% gql-fields %}}
 * items: [[Tag](/graphql-api/shop/object-types#tag)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## TaxCategory

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * isDefault: [Boolean](/graphql-api/shop/object-types#boolean)!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TaxLine

{{% gql-fields %}}
 * description: [String](/graphql-api/shop/object-types#string)!
 * taxRate: [Float](/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## TaxRate

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/graphql-api/shop/object-types#boolean)!
 * value: [Float](/graphql-api/shop/object-types#float)!
 * category: [TaxCategory](/graphql-api/shop/object-types#taxcategory)!
 * zone: [Zone](/graphql-api/shop/object-types#zone)!
 * customerGroup: [CustomerGroup](/graphql-api/shop/object-types#customergroup)
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TaxRateList

{{% gql-fields %}}
 * items: [[TaxRate](/graphql-api/shop/object-types#taxrate)!]!
 * totalItems: [Int](/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## TextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/shop/object-types#string)!
 * type: [String](/graphql-api/shop/object-types#string)!
 * list: [Boolean](/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TransitionOrderToStateResult

{{% gql-fields %}}
union TransitionOrderToStateResult = [Order](/graphql-api/shop/object-types#order) | [OrderStateTransitionError](/graphql-api/shop/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## UpdateCustomerEmailAddressResult

{{% gql-fields %}}
union UpdateCustomerEmailAddressResult = [Success](/graphql-api/shop/object-types#success) | [IdentifierChangeTokenInvalidError](/graphql-api/shop/object-types#identifierchangetokeninvaliderror) | [IdentifierChangeTokenExpiredError](/graphql-api/shop/object-types#identifierchangetokenexpirederror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## UpdateCustomerPasswordResult

{{% gql-fields %}}
union UpdateCustomerPasswordResult = [Success](/graphql-api/shop/object-types#success) | [InvalidCredentialsError](/graphql-api/shop/object-types#invalidcredentialserror) | [PasswordValidationError](/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## UpdateOrderItemsResult

{{% gql-fields %}}
union UpdateOrderItemsResult = [Order](/graphql-api/shop/object-types#order) | [OrderModificationError](/graphql-api/shop/object-types#ordermodificationerror) | [OrderLimitError](/graphql-api/shop/object-types#orderlimiterror) | [NegativeQuantityError](/graphql-api/shop/object-types#negativequantityerror) | [InsufficientStockError](/graphql-api/shop/object-types#insufficientstockerror)
{{% /gql-fields %}}

## Upload

The `Upload` scalar type represents a file upload.

## User

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * identifier: [String](/graphql-api/shop/object-types#string)!
 * verified: [Boolean](/graphql-api/shop/object-types#boolean)!
 * roles: [[Role](/graphql-api/shop/object-types#role)!]!
 * lastLogin: [DateTime](/graphql-api/shop/object-types#datetime)
 * authenticationMethods: [[AuthenticationMethod](/graphql-api/shop/object-types#authenticationmethod)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## VerificationTokenExpiredError

Returned if the verification token (used to verify a Customer's email address) is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## VerificationTokenInvalidError

Returned if the verification token (used to verify a Customer's email address) is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/shop/enums#errorcode)!
 * message: [String](/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## VerifyCustomerAccountResult

{{% gql-fields %}}
union VerifyCustomerAccountResult = [CurrentUser](/graphql-api/shop/object-types#currentuser) | [VerificationTokenInvalidError](/graphql-api/shop/object-types#verificationtokeninvaliderror) | [VerificationTokenExpiredError](/graphql-api/shop/object-types#verificationtokenexpirederror) | [MissingPasswordError](/graphql-api/shop/object-types#missingpassworderror) | [PasswordValidationError](/graphql-api/shop/object-types#passwordvalidationerror) | [PasswordAlreadySetError](/graphql-api/shop/object-types#passwordalreadyseterror) | [NativeAuthStrategyError](/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## Zone

{{% gql-fields %}}
 * id: [ID](/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/shop/object-types#datetime)!
 * name: [String](/graphql-api/shop/object-types#string)!
 * members: [[Region](/graphql-api/shop/object-types#region)!]!
 * customFields: [JSON](/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


