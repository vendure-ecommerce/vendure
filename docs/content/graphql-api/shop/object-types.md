---
title: "Types"
weight: 3
date: 2023-06-06T14:49:26.419Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Types

## ActiveOrderResult

{{% gql-fields %}}
union ActiveOrderResult = [Order](/docs/graphql-api/shop/object-types#order) | [NoActiveOrderError](/docs/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## AddPaymentToOrderResult

{{% gql-fields %}}
union AddPaymentToOrderResult = [Order](/docs/graphql-api/shop/object-types#order) | [OrderPaymentStateError](/docs/graphql-api/shop/object-types#orderpaymentstateerror) | [IneligiblePaymentMethodError](/docs/graphql-api/shop/object-types#ineligiblepaymentmethoderror) | [PaymentFailedError](/docs/graphql-api/shop/object-types#paymentfailederror) | [PaymentDeclinedError](/docs/graphql-api/shop/object-types#paymentdeclinederror) | [OrderStateTransitionError](/docs/graphql-api/shop/object-types#orderstatetransitionerror) | [NoActiveOrderError](/docs/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## Address

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * fullName: [String](/docs/graphql-api/shop/object-types#string)
 * company: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine1: [String](/docs/graphql-api/shop/object-types#string)!
 * streetLine2: [String](/docs/graphql-api/shop/object-types#string)
 * city: [String](/docs/graphql-api/shop/object-types#string)
 * province: [String](/docs/graphql-api/shop/object-types#string)
 * postalCode: [String](/docs/graphql-api/shop/object-types#string)
 * country: [Country](/docs/graphql-api/shop/object-types#country)!
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Adjustment

{{% gql-fields %}}
 * adjustmentSource: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [AdjustmentType](/docs/graphql-api/shop/enums#adjustmenttype)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * amount: [Money](/docs/graphql-api/shop/object-types#money)!
 * data: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## AlreadyLoggedInError

Returned when attempting to set the Customer for an Order when already logged in.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ApplyCouponCodeResult

{{% gql-fields %}}
union ApplyCouponCodeResult = [Order](/docs/graphql-api/shop/object-types#order) | [CouponCodeExpiredError](/docs/graphql-api/shop/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/docs/graphql-api/shop/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/docs/graphql-api/shop/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Asset

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [AssetType](/docs/graphql-api/shop/enums#assettype)!
 * fileSize: [Int](/docs/graphql-api/shop/object-types#int)!
 * mimeType: [String](/docs/graphql-api/shop/object-types#string)!
 * width: [Int](/docs/graphql-api/shop/object-types#int)!
 * height: [Int](/docs/graphql-api/shop/object-types#int)!
 * source: [String](/docs/graphql-api/shop/object-types#string)!
 * preview: [String](/docs/graphql-api/shop/object-types#string)!
 * focalPoint: [Coordinate](/docs/graphql-api/shop/object-types#coordinate)
 * tags: [[Tag](/docs/graphql-api/shop/object-types#tag)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## AssetList

{{% gql-fields %}}
 * items: [[Asset](/docs/graphql-api/shop/object-types#asset)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## AuthenticationMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * strategy: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## AuthenticationResult

{{% gql-fields %}}
union AuthenticationResult = [CurrentUser](/docs/graphql-api/shop/object-types#currentuser) | [InvalidCredentialsError](/docs/graphql-api/shop/object-types#invalidcredentialserror) | [NotVerifiedError](/docs/graphql-api/shop/object-types#notverifiederror)
{{% /gql-fields %}}

## Boolean

The `Boolean` scalar type represents `true` or `false`.

## BooleanCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Channel

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * token: [String](/docs/graphql-api/shop/object-types#string)!
 * defaultTaxZone: [Zone](/docs/graphql-api/shop/object-types#zone)
 * defaultShippingZone: [Zone](/docs/graphql-api/shop/object-types#zone)
 * defaultLanguageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/docs/graphql-api/shop/enums#languagecode)!]
 * currencyCode: [CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!
 * defaultCurrencyCode: [CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!
 * availableCurrencyCodes: [[CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!]!
* *// Not yet used - will be implemented in a future release.*
 * trackInventory: [Boolean](/docs/graphql-api/shop/object-types#boolean)
* *// Not yet used - will be implemented in a future release.*
 * outOfStockThreshold: [Int](/docs/graphql-api/shop/object-types#int)
 * pricesIncludeTax: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * seller: [Seller](/docs/graphql-api/shop/object-types#seller)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Collection

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
 * breadcrumbs: [[CollectionBreadcrumb](/docs/graphql-api/shop/object-types#collectionbreadcrumb)!]!
 * position: [Int](/docs/graphql-api/shop/object-types#int)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/shop/object-types#asset)!]!
 * parent: [Collection](/docs/graphql-api/shop/object-types#collection)
 * parentId: [ID](/docs/graphql-api/shop/object-types#id)!
 * children: [[Collection](/docs/graphql-api/shop/object-types#collection)!]
 * filters: [[ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!]!
 * translations: [[CollectionTranslation](/docs/graphql-api/shop/object-types#collectiontranslation)!]!
 * productVariants(options: [ProductVariantListOptions](/docs/graphql-api/shop/input-types#productvariantlistoptions)): [ProductVariantList](/docs/graphql-api/shop/object-types#productvariantlist)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CollectionBreadcrumb

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CollectionList

{{% gql-fields %}}
 * items: [[Collection](/docs/graphql-api/shop/object-types#collection)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CollectionResult

Which Collections are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * collection: [Collection](/docs/graphql-api/shop/object-types#collection)!
 * count: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CollectionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigArg

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * value: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ConfigArgDefinition

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * required: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * defaultValue: [JSON](/docs/graphql-api/shop/object-types#json)
 * label: [String](/docs/graphql-api/shop/object-types#string)
 * description: [String](/docs/graphql-api/shop/object-types#string)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ConfigurableOperation

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * args: [[ConfigArg](/docs/graphql-api/shop/object-types#configarg)!]!
{{% /gql-fields %}}


## ConfigurableOperationDefinition

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * args: [[ConfigArgDefinition](/docs/graphql-api/shop/object-types#configargdefinition)!]!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Coordinate

{{% gql-fields %}}
 * x: [Float](/docs/graphql-api/shop/object-types#float)!
 * y: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## Country

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * parent: [Region](/docs/graphql-api/shop/object-types#region)
 * parentId: [ID](/docs/graphql-api/shop/object-types#id)
 * translations: [[RegionTranslation](/docs/graphql-api/shop/object-types#regiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CountryList

{{% gql-fields %}}
 * items: [[Country](/docs/graphql-api/shop/object-types#country)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CouponCodeExpiredError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * couponCode: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CouponCodeInvalidError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * couponCode: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## CouponCodeLimitError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * couponCode: [String](/docs/graphql-api/shop/object-types#string)!
 * limit: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## CurrentUser

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * identifier: [String](/docs/graphql-api/shop/object-types#string)!
 * channels: [[CurrentUserChannel](/docs/graphql-api/shop/object-types#currentuserchannel)!]!
{{% /gql-fields %}}


## CurrentUserChannel

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * token: [String](/docs/graphql-api/shop/object-types#string)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * permissions: [[Permission](/docs/graphql-api/shop/enums#permission)!]!
{{% /gql-fields %}}


## CustomFieldConfig

{{% gql-fields %}}
union CustomFieldConfig = [StringCustomFieldConfig](/docs/graphql-api/shop/object-types#stringcustomfieldconfig) | [LocaleStringCustomFieldConfig](/docs/graphql-api/shop/object-types#localestringcustomfieldconfig) | [IntCustomFieldConfig](/docs/graphql-api/shop/object-types#intcustomfieldconfig) | [FloatCustomFieldConfig](/docs/graphql-api/shop/object-types#floatcustomfieldconfig) | [BooleanCustomFieldConfig](/docs/graphql-api/shop/object-types#booleancustomfieldconfig) | [DateTimeCustomFieldConfig](/docs/graphql-api/shop/object-types#datetimecustomfieldconfig) | [RelationCustomFieldConfig](/docs/graphql-api/shop/object-types#relationcustomfieldconfig) | [TextCustomFieldConfig](/docs/graphql-api/shop/object-types#textcustomfieldconfig) | [LocaleTextCustomFieldConfig](/docs/graphql-api/shop/object-types#localetextcustomfieldconfig)
{{% /gql-fields %}}

## Customer

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * title: [String](/docs/graphql-api/shop/object-types#string)
 * firstName: [String](/docs/graphql-api/shop/object-types#string)!
 * lastName: [String](/docs/graphql-api/shop/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * emailAddress: [String](/docs/graphql-api/shop/object-types#string)!
 * addresses: [[Address](/docs/graphql-api/shop/object-types#address)!]
 * orders(options: [OrderListOptions](/docs/graphql-api/shop/input-types#orderlistoptions)): [OrderList](/docs/graphql-api/shop/object-types#orderlist)!
 * user: [User](/docs/graphql-api/shop/object-types#user)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerGroup

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * customers(options: [CustomerListOptions](/docs/graphql-api/shop/input-types#customerlistoptions)): [CustomerList](/docs/graphql-api/shop/object-types#customerlist)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## CustomerList

{{% gql-fields %}}
 * items: [[Customer](/docs/graphql-api/shop/object-types#customer)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## DateTime

A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

## DateTimeCustomFieldConfig

Expects the same validation formats as the `<input type="datetime-local">` HTML element.
See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * min: [String](/docs/graphql-api/shop/object-types#string)
 * max: [String](/docs/graphql-api/shop/object-types#string)
 * step: [Int](/docs/graphql-api/shop/object-types#int)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## DeletionResponse

{{% gql-fields %}}
 * result: [DeletionResult](/docs/graphql-api/shop/enums#deletionresult)!
 * message: [String](/docs/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## Discount

{{% gql-fields %}}
 * adjustmentSource: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [AdjustmentType](/docs/graphql-api/shop/enums#adjustmenttype)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * amount: [Money](/docs/graphql-api/shop/object-types#money)!
 * amountWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## EmailAddressConflictError

Returned when attempting to create a Customer with an email address already registered to an existing User.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Facet

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * values: [[FacetValue](/docs/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[FacetTranslation](/docs/graphql-api/shop/object-types#facettranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FacetList

{{% gql-fields %}}
 * items: [[Facet](/docs/graphql-api/shop/object-types#facet)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## FacetTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## FacetValue

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * facet: [Facet](/docs/graphql-api/shop/object-types#facet)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * translations: [[FacetValueTranslation](/docs/graphql-api/shop/object-types#facetvaluetranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FacetValueResult

Which FacetValues are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * facetValue: [FacetValue](/docs/graphql-api/shop/object-types#facetvalue)!
 * count: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## FacetValueTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## FloatCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * min: [Float](/docs/graphql-api/shop/object-types#float)
 * max: [Float](/docs/graphql-api/shop/object-types#float)
 * step: [Float](/docs/graphql-api/shop/object-types#float)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## Fulfillment

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * lines: [[FulfillmentLine](/docs/graphql-api/shop/object-types#fulfillmentline)!]!
 * summary: [[FulfillmentLine](/docs/graphql-api/shop/object-types#fulfillmentline)!]!
 * state: [String](/docs/graphql-api/shop/object-types#string)!
 * method: [String](/docs/graphql-api/shop/object-types#string)!
 * trackingCode: [String](/docs/graphql-api/shop/object-types#string)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## FulfillmentLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/docs/graphql-api/shop/object-types#orderline)!
 * orderLineId: [ID](/docs/graphql-api/shop/object-types#id)!
 * quantity: [Int](/docs/graphql-api/shop/object-types#int)!
 * fulfillment: [Fulfillment](/docs/graphql-api/shop/object-types#fulfillment)!
 * fulfillmentId: [ID](/docs/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## GuestCheckoutError

Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * errorDetail: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## HistoryEntry

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * type: [HistoryEntryType](/docs/graphql-api/shop/enums#historyentrytype)!
 * data: [JSON](/docs/graphql-api/shop/object-types#json)!
{{% /gql-fields %}}


## HistoryEntryList

{{% gql-fields %}}
 * items: [[HistoryEntry](/docs/graphql-api/shop/object-types#historyentry)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## IdentifierChangeTokenExpiredError

Returned if the token used to change a Customer's email address is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## IdentifierChangeTokenInvalidError

Returned if the token used to change a Customer's email address is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## IneligiblePaymentMethodError

Returned when attempting to add a Payment using a PaymentMethod for which the Order is not eligible.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * eligibilityCheckerMessage: [String](/docs/graphql-api/shop/object-types#string)
{{% /gql-fields %}}


## IneligibleShippingMethodError

Returned when attempting to set a ShippingMethod for which the Order is not eligible

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## InsufficientStockError

Returned when attempting to add more items to the Order than are available

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * quantityAvailable: [Int](/docs/graphql-api/shop/object-types#int)!
 * order: [Order](/docs/graphql-api/shop/object-types#order)!
{{% /gql-fields %}}


## Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

## IntCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * min: [Int](/docs/graphql-api/shop/object-types#int)
 * max: [Int](/docs/graphql-api/shop/object-types#int)
 * step: [Int](/docs/graphql-api/shop/object-types#int)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## InvalidCredentialsError

Returned if the user authentication credentials are not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * authenticationError: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## JSON

The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).

## LocaleStringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * length: [Int](/docs/graphql-api/shop/object-types#int)
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * pattern: [String](/docs/graphql-api/shop/object-types#string)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## LocaleTextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## LocalizedString

{{% gql-fields %}}
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * value: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## MissingPasswordError

Returned when attempting to register or verify a customer account without a password, when one is required.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Money

The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## NativeAuthStrategyError

Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NativeAuthenticationResult

{{% gql-fields %}}
union NativeAuthenticationResult = [CurrentUser](/docs/graphql-api/shop/object-types#currentuser) | [InvalidCredentialsError](/docs/graphql-api/shop/object-types#invalidcredentialserror) | [NotVerifiedError](/docs/graphql-api/shop/object-types#notverifiederror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## NegativeQuantityError

Returned when attempting to set a negative OrderLine quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NoActiveOrderError

Returned when invoking a mutation which depends on there being an active Order on the
current session.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## NotVerifiedError

Returned if `authOptions.requireVerification` is set to `true` (which is the default)
and an unverified user attempts to authenticate.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Order

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * type: [OrderType](/docs/graphql-api/shop/enums#ordertype)!
* *// The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active"*
 * orderPlacedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)
* *// A unique code for the Order*
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * state: [String](/docs/graphql-api/shop/object-types#string)!
* *// An order is active as long as the payment process has not been completed*
 * active: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * customer: [Customer](/docs/graphql-api/shop/object-types#customer)
 * shippingAddress: [OrderAddress](/docs/graphql-api/shop/object-types#orderaddress)
 * billingAddress: [OrderAddress](/docs/graphql-api/shop/object-types#orderaddress)
 * lines: [[OrderLine](/docs/graphql-api/shop/object-types#orderline)!]!
* *// Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.*
 * surcharges: [[Surcharge](/docs/graphql-api/shop/object-types#surcharge)!]!
 * discounts: [[Discount](/docs/graphql-api/shop/object-types#discount)!]!
* *// An array of all coupon codes applied to the Order*
 * couponCodes: [[String](/docs/graphql-api/shop/object-types#string)!]!
* *// Promotions applied to the order. Only gets populated after the payment process has completed.*
 * promotions: [[Promotion](/docs/graphql-api/shop/object-types#promotion)!]!
 * payments: [[Payment](/docs/graphql-api/shop/object-types#payment)!]
 * fulfillments: [[Fulfillment](/docs/graphql-api/shop/object-types#fulfillment)!]
 * totalQuantity: [Int](/docs/graphql-api/shop/object-types#int)!
* *// The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of `OrderLine.discountedLinePrice` values.*
 * subTotal: [Money](/docs/graphql-api/shop/object-types#money)!
* *// Same as subTotal, but inclusive of tax*
 * subTotalWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!
 * shippingLines: [[ShippingLine](/docs/graphql-api/shop/object-types#shippingline)!]!
 * shipping: [Money](/docs/graphql-api/shop/object-types#money)!
 * shippingWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// Equal to subTotal plus shipping*
 * total: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The final payable amount. Equal to subTotalWithTax plus shippingWithTax*
 * totalWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// A summary of the taxes being applied to this Order*
 * taxSummary: [[OrderTaxSummary](/docs/graphql-api/shop/object-types#ordertaxsummary)!]!
 * history(options: [HistoryEntryListOptions](/docs/graphql-api/shop/input-types#historyentrylistoptions)): [HistoryEntryList](/docs/graphql-api/shop/object-types#historyentrylist)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderAddress

{{% gql-fields %}}
 * fullName: [String](/docs/graphql-api/shop/object-types#string)
 * company: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine1: [String](/docs/graphql-api/shop/object-types#string)
 * streetLine2: [String](/docs/graphql-api/shop/object-types#string)
 * city: [String](/docs/graphql-api/shop/object-types#string)
 * province: [String](/docs/graphql-api/shop/object-types#string)
 * postalCode: [String](/docs/graphql-api/shop/object-types#string)
 * country: [String](/docs/graphql-api/shop/object-types#string)
 * countryCode: [String](/docs/graphql-api/shop/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/shop/object-types#string)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderLimitError

Returned when the maximum order size limit has been reached.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * maxItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## OrderLine

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/shop/object-types#productvariant)!
 * featuredAsset: [Asset](/docs/graphql-api/shop/object-types#asset)
* *// The price of a single unit, excluding tax and discounts*
 * unitPrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The price of a single unit, including tax but excluding discounts*
 * unitPriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// Non-zero if the unitPrice has changed since it was initially added to Order*
 * unitPriceChangeSinceAdded: [Money](/docs/graphql-api/shop/object-types#money)!
* *// Non-zero if the unitPriceWithTax has changed since it was initially added to Order*
 * unitPriceWithTaxChangeSinceAdded: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.*
 * discountedUnitPrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The price of a single unit including discounts and tax*
 * discountedUnitPriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
and refund calculations.*
 * proratedUnitPrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The proratedUnitPrice including tax*
 * proratedUnitPriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * quantity: [Int](/docs/graphql-api/shop/object-types#int)!
* *// The quantity at the time the Order was placed*
 * orderPlacedQuantity: [Int](/docs/graphql-api/shop/object-types#int)!
 * taxRate: [Float](/docs/graphql-api/shop/object-types#float)!
* *// The total price of the line excluding tax and discounts.*
 * linePrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The total price of the line including tax but excluding discounts.*
 * linePriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The price of the line including discounts, excluding tax*
 * discountedLinePrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The price of the line including discounts and tax*
 * discountedLinePriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.*
 * proratedLinePrice: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The proratedLinePrice including tax*
 * proratedLinePriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The total tax on this line*
 * lineTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * discounts: [[Discount](/docs/graphql-api/shop/object-types#discount)!]!
 * taxLines: [[TaxLine](/docs/graphql-api/shop/object-types#taxline)!]!
 * order: [Order](/docs/graphql-api/shop/object-types#order)!
 * fulfillmentLines: [[FulfillmentLine](/docs/graphql-api/shop/object-types#fulfillmentline)!]
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## OrderList

{{% gql-fields %}}
 * items: [[Order](/docs/graphql-api/shop/object-types#order)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## OrderModificationError

Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderPaymentStateError

Returned when attempting to add a Payment to an Order that is not in the `ArrangingPayment` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderStateTransitionError

Returned if there is an error in transitioning the Order state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * transitionError: [String](/docs/graphql-api/shop/object-types#string)!
 * fromState: [String](/docs/graphql-api/shop/object-types#string)!
 * toState: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## OrderTaxSummary

A summary of the taxes being applied to this order, grouped
by taxRate.

{{% gql-fields %}}
* *// A description of this tax*
 * description: [String](/docs/graphql-api/shop/object-types#string)!
* *// The taxRate as a percentage*
 * taxRate: [Float](/docs/graphql-api/shop/object-types#float)!
* *// The total net price of OrderLines to which this taxRate applies*
 * taxBase: [Money](/docs/graphql-api/shop/object-types#money)!
* *// The total tax being applied to the Order at this taxRate*
 * taxTotal: [Money](/docs/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## PasswordAlreadySetError

Returned when attempting to verify a customer account with a password, when a password has already been set.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordResetTokenExpiredError

Returned if the token used to reset a Customer's password is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordResetTokenInvalidError

Returned if the token used to reset a Customer's password is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PasswordValidationError

Returned when attempting to register or verify a customer account where the given password fails password validation.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * validationErrorMessage: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Payment

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * method: [String](/docs/graphql-api/shop/object-types#string)!
 * amount: [Money](/docs/graphql-api/shop/object-types#money)!
 * state: [String](/docs/graphql-api/shop/object-types#string)!
 * transactionId: [String](/docs/graphql-api/shop/object-types#string)
 * errorMessage: [String](/docs/graphql-api/shop/object-types#string)
 * refunds: [[Refund](/docs/graphql-api/shop/object-types#refund)!]!
 * metadata: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentDeclinedError

Returned when a Payment is declined by the payment provider.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * paymentErrorMessage: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PaymentFailedError

Returned when a Payment fails due to an error.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
 * paymentErrorMessage: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PaymentMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * checker: [ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)
 * handler: [ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!
 * translations: [[PaymentMethodTranslation](/docs/graphql-api/shop/object-types#paymentmethodtranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentMethodQuote

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * isEligible: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * eligibilityMessage: [String](/docs/graphql-api/shop/object-types#string)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PaymentMethodTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## PriceRange

The price range where the result has more than one price

{{% gql-fields %}}
 * min: [Money](/docs/graphql-api/shop/object-types#money)!
 * max: [Money](/docs/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## Product

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/shop/object-types#asset)!]!
* *// Returns all ProductVariants*
 * variants: [[ProductVariant](/docs/graphql-api/shop/object-types#productvariant)!]!
* *// Returns a paginated, sortable, filterable list of ProductVariants*
 * variantList(options: [ProductVariantListOptions](/docs/graphql-api/shop/input-types#productvariantlistoptions)): [ProductVariantList](/docs/graphql-api/shop/object-types#productvariantlist)!
 * optionGroups: [[ProductOptionGroup](/docs/graphql-api/shop/object-types#productoptiongroup)!]!
 * facetValues: [[FacetValue](/docs/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[ProductTranslation](/docs/graphql-api/shop/object-types#producttranslation)!]!
 * collections: [[Collection](/docs/graphql-api/shop/object-types#collection)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductList

{{% gql-fields %}}
 * items: [[Product](/docs/graphql-api/shop/object-types#product)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ProductOption

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * groupId: [ID](/docs/graphql-api/shop/object-types#id)!
 * group: [ProductOptionGroup](/docs/graphql-api/shop/object-types#productoptiongroup)!
 * translations: [[ProductOptionTranslation](/docs/graphql-api/shop/object-types#productoptiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroup

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * options: [[ProductOption](/docs/graphql-api/shop/object-types#productoption)!]!
 * translations: [[ProductOptionGroupTranslation](/docs/graphql-api/shop/object-types#productoptiongrouptranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroupTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductOptionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## ProductVariant

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * product: [Product](/docs/graphql-api/shop/object-types#product)!
 * productId: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * sku: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/shop/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/shop/object-types#asset)!]!
 * price: [Money](/docs/graphql-api/shop/object-types#money)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!
 * priceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * stockLevel: [String](/docs/graphql-api/shop/object-types#string)!
 * taxRateApplied: [TaxRate](/docs/graphql-api/shop/object-types#taxrate)!
 * taxCategory: [TaxCategory](/docs/graphql-api/shop/object-types#taxcategory)!
 * options: [[ProductOption](/docs/graphql-api/shop/object-types#productoption)!]!
 * facetValues: [[FacetValue](/docs/graphql-api/shop/object-types#facetvalue)!]!
 * translations: [[ProductVariantTranslation](/docs/graphql-api/shop/object-types#productvarianttranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProductVariantList

{{% gql-fields %}}
 * items: [[ProductVariant](/docs/graphql-api/shop/object-types#productvariant)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ProductVariantTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Promotion

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * startsAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * endsAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * couponCode: [String](/docs/graphql-api/shop/object-types#string)
 * perCustomerUsageLimit: [Int](/docs/graphql-api/shop/object-types#int)
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * conditions: [[ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!]!
 * actions: [[ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!]!
 * translations: [[PromotionTranslation](/docs/graphql-api/shop/object-types#promotiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## PromotionList

{{% gql-fields %}}
 * items: [[Promotion](/docs/graphql-api/shop/object-types#promotion)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## PromotionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## Province

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * parent: [Region](/docs/graphql-api/shop/object-types#region)
 * parentId: [ID](/docs/graphql-api/shop/object-types#id)
 * translations: [[RegionTranslation](/docs/graphql-api/shop/object-types#regiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ProvinceList

{{% gql-fields %}}
 * items: [[Province](/docs/graphql-api/shop/object-types#province)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## RefreshCustomerVerificationResult

{{% gql-fields %}}
union RefreshCustomerVerificationResult = [Success](/docs/graphql-api/shop/object-types#success) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## Refund

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * items: [Money](/docs/graphql-api/shop/object-types#money)!
 * shipping: [Money](/docs/graphql-api/shop/object-types#money)!
 * adjustment: [Money](/docs/graphql-api/shop/object-types#money)!
 * total: [Money](/docs/graphql-api/shop/object-types#money)!
 * method: [String](/docs/graphql-api/shop/object-types#string)
 * state: [String](/docs/graphql-api/shop/object-types#string)!
 * transactionId: [String](/docs/graphql-api/shop/object-types#string)
 * reason: [String](/docs/graphql-api/shop/object-types#string)
 * lines: [[RefundLine](/docs/graphql-api/shop/object-types#refundline)!]!
 * paymentId: [ID](/docs/graphql-api/shop/object-types#id)!
 * metadata: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## RefundLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/docs/graphql-api/shop/object-types#orderline)!
 * orderLineId: [ID](/docs/graphql-api/shop/object-types#id)!
 * quantity: [Int](/docs/graphql-api/shop/object-types#int)!
 * refund: [Refund](/docs/graphql-api/shop/object-types#refund)!
 * refundId: [ID](/docs/graphql-api/shop/object-types#id)!
{{% /gql-fields %}}


## RegionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## RegisterCustomerAccountResult

{{% gql-fields %}}
union RegisterCustomerAccountResult = [Success](/docs/graphql-api/shop/object-types#success) | [MissingPasswordError](/docs/graphql-api/shop/object-types#missingpassworderror) | [PasswordValidationError](/docs/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## RelationCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * entity: [String](/docs/graphql-api/shop/object-types#string)!
 * scalarFields: [[String](/docs/graphql-api/shop/object-types#string)!]!
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## RemoveOrderItemsResult

{{% gql-fields %}}
union RemoveOrderItemsResult = [Order](/docs/graphql-api/shop/object-types#order) | [OrderModificationError](/docs/graphql-api/shop/object-types#ordermodificationerror)
{{% /gql-fields %}}

## RequestPasswordResetResult

{{% gql-fields %}}
union RequestPasswordResetResult = [Success](/docs/graphql-api/shop/object-types#success) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## RequestUpdateCustomerEmailAddressResult

{{% gql-fields %}}
union RequestUpdateCustomerEmailAddressResult = [Success](/docs/graphql-api/shop/object-types#success) | [InvalidCredentialsError](/docs/graphql-api/shop/object-types#invalidcredentialserror) | [EmailAddressConflictError](/docs/graphql-api/shop/object-types#emailaddressconflicterror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## ResetPasswordResult

{{% gql-fields %}}
union ResetPasswordResult = [CurrentUser](/docs/graphql-api/shop/object-types#currentuser) | [PasswordResetTokenInvalidError](/docs/graphql-api/shop/object-types#passwordresettokeninvaliderror) | [PasswordResetTokenExpiredError](/docs/graphql-api/shop/object-types#passwordresettokenexpirederror) | [PasswordValidationError](/docs/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror) | [NotVerifiedError](/docs/graphql-api/shop/object-types#notverifiederror)
{{% /gql-fields %}}

## Role

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * permissions: [[Permission](/docs/graphql-api/shop/enums#permission)!]!
 * channels: [[Channel](/docs/graphql-api/shop/object-types#channel)!]!
{{% /gql-fields %}}


## RoleList

{{% gql-fields %}}
 * items: [[Role](/docs/graphql-api/shop/object-types#role)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## SearchReindexResponse

{{% gql-fields %}}
 * success: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## SearchResponse

{{% gql-fields %}}
 * items: [[SearchResult](/docs/graphql-api/shop/object-types#searchresult)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
 * facetValues: [[FacetValueResult](/docs/graphql-api/shop/object-types#facetvalueresult)!]!
 * collections: [[CollectionResult](/docs/graphql-api/shop/object-types#collectionresult)!]!
{{% /gql-fields %}}


## SearchResult

{{% gql-fields %}}
 * sku: [String](/docs/graphql-api/shop/object-types#string)!
 * slug: [String](/docs/graphql-api/shop/object-types#string)!
 * productId: [ID](/docs/graphql-api/shop/object-types#id)!
 * productName: [String](/docs/graphql-api/shop/object-types#string)!
 * productAsset: [SearchResultAsset](/docs/graphql-api/shop/object-types#searchresultasset)
 * productVariantId: [ID](/docs/graphql-api/shop/object-types#id)!
 * productVariantName: [String](/docs/graphql-api/shop/object-types#string)!
 * productVariantAsset: [SearchResultAsset](/docs/graphql-api/shop/object-types#searchresultasset)
 * price: [SearchResultPrice](/docs/graphql-api/shop/object-types#searchresultprice)!
 * priceWithTax: [SearchResultPrice](/docs/graphql-api/shop/object-types#searchresultprice)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/shop/enums#currencycode)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * facetIds: [[ID](/docs/graphql-api/shop/object-types#id)!]!
 * facetValueIds: [[ID](/docs/graphql-api/shop/object-types#id)!]!
* *// An array of ids of the Collections in which this result appears*
 * collectionIds: [[ID](/docs/graphql-api/shop/object-types#id)!]!
* *// A relevance score for the result. Differs between database implementations*
 * score: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## SearchResultAsset

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * preview: [String](/docs/graphql-api/shop/object-types#string)!
 * focalPoint: [Coordinate](/docs/graphql-api/shop/object-types#coordinate)
{{% /gql-fields %}}


## SearchResultPrice

The price of a search result product, either as a range or as a single price

{{% gql-fields %}}
union SearchResultPrice = [PriceRange](/docs/graphql-api/shop/object-types#pricerange) | [SinglePrice](/docs/graphql-api/shop/object-types#singleprice)
{{% /gql-fields %}}

## Seller

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## SetCustomerForOrderResult

{{% gql-fields %}}
union SetCustomerForOrderResult = [Order](/docs/graphql-api/shop/object-types#order) | [AlreadyLoggedInError](/docs/graphql-api/shop/object-types#alreadyloggedinerror) | [EmailAddressConflictError](/docs/graphql-api/shop/object-types#emailaddressconflicterror) | [NoActiveOrderError](/docs/graphql-api/shop/object-types#noactiveordererror) | [GuestCheckoutError](/docs/graphql-api/shop/object-types#guestcheckouterror)
{{% /gql-fields %}}

## SetOrderShippingMethodResult

{{% gql-fields %}}
union SetOrderShippingMethodResult = [Order](/docs/graphql-api/shop/object-types#order) | [OrderModificationError](/docs/graphql-api/shop/object-types#ordermodificationerror) | [IneligibleShippingMethodError](/docs/graphql-api/shop/object-types#ineligibleshippingmethoderror) | [NoActiveOrderError](/docs/graphql-api/shop/object-types#noactiveordererror)
{{% /gql-fields %}}

## ShippingLine

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * shippingMethod: [ShippingMethod](/docs/graphql-api/shop/object-types#shippingmethod)!
 * price: [Money](/docs/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * discountedPrice: [Money](/docs/graphql-api/shop/object-types#money)!
 * discountedPriceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * discounts: [[Discount](/docs/graphql-api/shop/object-types#discount)!]!
{{% /gql-fields %}}


## ShippingMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * fulfillmentHandlerCode: [String](/docs/graphql-api/shop/object-types#string)!
 * checker: [ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!
 * calculator: [ConfigurableOperation](/docs/graphql-api/shop/object-types#configurableoperation)!
 * translations: [[ShippingMethodTranslation](/docs/graphql-api/shop/object-types#shippingmethodtranslation)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ShippingMethodList

{{% gql-fields %}}
 * items: [[ShippingMethod](/docs/graphql-api/shop/object-types#shippingmethod)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## ShippingMethodQuote

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * price: [Money](/docs/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * code: [String](/docs/graphql-api/shop/object-types#string)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
* *// Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult*
 * metadata: [JSON](/docs/graphql-api/shop/object-types#json)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## ShippingMethodTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/shop/enums#languagecode)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## SinglePrice

The price value where the result has a single price

{{% gql-fields %}}
 * value: [Money](/docs/graphql-api/shop/object-types#money)!
{{% /gql-fields %}}


## String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## StringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * length: [Int](/docs/graphql-api/shop/object-types#int)
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * pattern: [String](/docs/graphql-api/shop/object-types#string)
 * options: [[StringFieldOption](/docs/graphql-api/shop/object-types#stringfieldoption)!]
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## StringFieldOption

{{% gql-fields %}}
 * value: [String](/docs/graphql-api/shop/object-types#string)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
{{% /gql-fields %}}


## Success

Indicates that an operation succeeded, where we do not want to return any more specific information.

{{% gql-fields %}}
 * success: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
{{% /gql-fields %}}


## Surcharge

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * sku: [String](/docs/graphql-api/shop/object-types#string)
 * taxLines: [[TaxLine](/docs/graphql-api/shop/object-types#taxline)!]!
 * price: [Money](/docs/graphql-api/shop/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/shop/object-types#money)!
 * taxRate: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## Tag

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * value: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## TagList

{{% gql-fields %}}
 * items: [[Tag](/docs/graphql-api/shop/object-types#tag)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## TaxCategory

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * isDefault: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TaxLine

{{% gql-fields %}}
 * description: [String](/docs/graphql-api/shop/object-types#string)!
 * taxRate: [Float](/docs/graphql-api/shop/object-types#float)!
{{% /gql-fields %}}


## TaxRate

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * value: [Float](/docs/graphql-api/shop/object-types#float)!
 * category: [TaxCategory](/docs/graphql-api/shop/object-types#taxcategory)!
 * zone: [Zone](/docs/graphql-api/shop/object-types#zone)!
 * customerGroup: [CustomerGroup](/docs/graphql-api/shop/object-types#customergroup)
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TaxRateList

{{% gql-fields %}}
 * items: [[TaxRate](/docs/graphql-api/shop/object-types#taxrate)!]!
 * totalItems: [Int](/docs/graphql-api/shop/object-types#int)!
{{% /gql-fields %}}


## TextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * type: [String](/docs/graphql-api/shop/object-types#string)!
 * list: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/shop/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/shop/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## TransitionOrderToStateResult

{{% gql-fields %}}
union TransitionOrderToStateResult = [Order](/docs/graphql-api/shop/object-types#order) | [OrderStateTransitionError](/docs/graphql-api/shop/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## UpdateCustomerEmailAddressResult

{{% gql-fields %}}
union UpdateCustomerEmailAddressResult = [Success](/docs/graphql-api/shop/object-types#success) | [IdentifierChangeTokenInvalidError](/docs/graphql-api/shop/object-types#identifierchangetokeninvaliderror) | [IdentifierChangeTokenExpiredError](/docs/graphql-api/shop/object-types#identifierchangetokenexpirederror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## UpdateCustomerPasswordResult

{{% gql-fields %}}
union UpdateCustomerPasswordResult = [Success](/docs/graphql-api/shop/object-types#success) | [InvalidCredentialsError](/docs/graphql-api/shop/object-types#invalidcredentialserror) | [PasswordValidationError](/docs/graphql-api/shop/object-types#passwordvalidationerror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## UpdateOrderItemsResult

{{% gql-fields %}}
union UpdateOrderItemsResult = [Order](/docs/graphql-api/shop/object-types#order) | [OrderModificationError](/docs/graphql-api/shop/object-types#ordermodificationerror) | [OrderLimitError](/docs/graphql-api/shop/object-types#orderlimiterror) | [NegativeQuantityError](/docs/graphql-api/shop/object-types#negativequantityerror) | [InsufficientStockError](/docs/graphql-api/shop/object-types#insufficientstockerror)
{{% /gql-fields %}}

## Upload

The `Upload` scalar type represents a file upload.

## User

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * identifier: [String](/docs/graphql-api/shop/object-types#string)!
 * verified: [Boolean](/docs/graphql-api/shop/object-types#boolean)!
 * roles: [[Role](/docs/graphql-api/shop/object-types#role)!]!
 * lastLogin: [DateTime](/docs/graphql-api/shop/object-types#datetime)
 * authenticationMethods: [[AuthenticationMethod](/docs/graphql-api/shop/object-types#authenticationmethod)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


## VerificationTokenExpiredError

Returned if the verification token (used to verify a Customer's email address) is valid, but has
expired according to the `verificationTokenDuration` setting in the AuthOptions.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## VerificationTokenInvalidError

Returned if the verification token (used to verify a Customer's email address) is either
invalid or does not match any expected tokens.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/shop/enums#errorcode)!
 * message: [String](/docs/graphql-api/shop/object-types#string)!
{{% /gql-fields %}}


## VerifyCustomerAccountResult

{{% gql-fields %}}
union VerifyCustomerAccountResult = [CurrentUser](/docs/graphql-api/shop/object-types#currentuser) | [VerificationTokenInvalidError](/docs/graphql-api/shop/object-types#verificationtokeninvaliderror) | [VerificationTokenExpiredError](/docs/graphql-api/shop/object-types#verificationtokenexpirederror) | [MissingPasswordError](/docs/graphql-api/shop/object-types#missingpassworderror) | [PasswordValidationError](/docs/graphql-api/shop/object-types#passwordvalidationerror) | [PasswordAlreadySetError](/docs/graphql-api/shop/object-types#passwordalreadyseterror) | [NativeAuthStrategyError](/docs/graphql-api/shop/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## Zone

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/shop/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/shop/object-types#datetime)!
 * name: [String](/docs/graphql-api/shop/object-types#string)!
 * members: [[Region](/docs/graphql-api/shop/object-types#region)!]!
 * customFields: [JSON](/docs/graphql-api/shop/object-types#json)
{{% /gql-fields %}}


