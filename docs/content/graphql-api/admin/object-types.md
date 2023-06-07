---
title: "Types"
weight: 3
date: 2023-06-07T09:42:15.213Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Types

## AddFulfillmentToOrderResult

{{% gql-fields %}}
union AddFulfillmentToOrderResult = [Fulfillment](/docs/graphql-api/admin/object-types#fulfillment) | [EmptyOrderLineSelectionError](/docs/graphql-api/admin/object-types#emptyorderlineselectionerror) | [ItemsAlreadyFulfilledError](/docs/graphql-api/admin/object-types#itemsalreadyfulfillederror) | [InsufficientStockOnHandError](/docs/graphql-api/admin/object-types#insufficientstockonhanderror) | [InvalidFulfillmentHandlerError](/docs/graphql-api/admin/object-types#invalidfulfillmenthandlererror) | [FulfillmentStateTransitionError](/docs/graphql-api/admin/object-types#fulfillmentstatetransitionerror) | [CreateFulfillmentError](/docs/graphql-api/admin/object-types#createfulfillmenterror)
{{% /gql-fields %}}

## AddManualPaymentToOrderResult

{{% gql-fields %}}
union AddManualPaymentToOrderResult = [Order](/docs/graphql-api/admin/object-types#order) | [ManualPaymentStateError](/docs/graphql-api/admin/object-types#manualpaymentstateerror)
{{% /gql-fields %}}

## Address

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * fullName: [String](/docs/graphql-api/admin/object-types#string)
 * company: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine1: [String](/docs/graphql-api/admin/object-types#string)!
 * streetLine2: [String](/docs/graphql-api/admin/object-types#string)
 * city: [String](/docs/graphql-api/admin/object-types#string)
 * province: [String](/docs/graphql-api/admin/object-types#string)
 * postalCode: [String](/docs/graphql-api/admin/object-types#string)
 * country: [Country](/docs/graphql-api/admin/object-types#country)!
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Adjustment

{{% gql-fields %}}
 * adjustmentSource: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [AdjustmentType](/docs/graphql-api/admin/enums#adjustmenttype)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * amount: [Money](/docs/graphql-api/admin/object-types#money)!
 * data: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Administrator

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * firstName: [String](/docs/graphql-api/admin/object-types#string)!
 * lastName: [String](/docs/graphql-api/admin/object-types#string)!
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)!
 * user: [User](/docs/graphql-api/admin/object-types#user)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AdministratorList

{{% gql-fields %}}
 * items: [[Administrator](/docs/graphql-api/admin/object-types#administrator)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Allocation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * orderLine: [OrderLine](/docs/graphql-api/admin/object-types#orderline)!
{{% /gql-fields %}}


## AlreadyRefundedError

Returned if an attempting to refund an OrderItem which has already been refunded

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * refundId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## ApplyCouponCodeResult

{{% gql-fields %}}
union ApplyCouponCodeResult = [Order](/docs/graphql-api/admin/object-types#order) | [CouponCodeExpiredError](/docs/graphql-api/admin/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/docs/graphql-api/admin/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/docs/graphql-api/admin/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Asset

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [AssetType](/docs/graphql-api/admin/enums#assettype)!
 * fileSize: [Int](/docs/graphql-api/admin/object-types#int)!
 * mimeType: [String](/docs/graphql-api/admin/object-types#string)!
 * width: [Int](/docs/graphql-api/admin/object-types#int)!
 * height: [Int](/docs/graphql-api/admin/object-types#int)!
 * source: [String](/docs/graphql-api/admin/object-types#string)!
 * preview: [String](/docs/graphql-api/admin/object-types#string)!
 * focalPoint: [Coordinate](/docs/graphql-api/admin/object-types#coordinate)
 * tags: [[Tag](/docs/graphql-api/admin/object-types#tag)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AssetList

{{% gql-fields %}}
 * items: [[Asset](/docs/graphql-api/admin/object-types#asset)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AuthenticationMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * strategy: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## AuthenticationResult

{{% gql-fields %}}
union AuthenticationResult = [CurrentUser](/docs/graphql-api/admin/object-types#currentuser) | [InvalidCredentialsError](/docs/graphql-api/admin/object-types#invalidcredentialserror)
{{% /gql-fields %}}

## Boolean

The `Boolean` scalar type represents `true` or `false`.

## BooleanCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CancelActiveOrderError

Returned if an attempting to cancel lines from an Order which is still active

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * orderState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CancelOrderResult

{{% gql-fields %}}
union CancelOrderResult = [Order](/docs/graphql-api/admin/object-types#order) | [EmptyOrderLineSelectionError](/docs/graphql-api/admin/object-types#emptyorderlineselectionerror) | [QuantityTooGreatError](/docs/graphql-api/admin/object-types#quantitytoogreaterror) | [MultipleOrderError](/docs/graphql-api/admin/object-types#multipleordererror) | [CancelActiveOrderError](/docs/graphql-api/admin/object-types#cancelactiveordererror) | [OrderStateTransitionError](/docs/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## CancelPaymentError

Returned if the Payment cancellation fails

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * paymentErrorMessage: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CancelPaymentResult

{{% gql-fields %}}
union CancelPaymentResult = [Payment](/docs/graphql-api/admin/object-types#payment) | [CancelPaymentError](/docs/graphql-api/admin/object-types#cancelpaymenterror) | [PaymentStateTransitionError](/docs/graphql-api/admin/object-types#paymentstatetransitionerror)
{{% /gql-fields %}}

## Cancellation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * orderLine: [OrderLine](/docs/graphql-api/admin/object-types#orderline)!
{{% /gql-fields %}}


## Channel

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * token: [String](/docs/graphql-api/admin/object-types#string)!
 * defaultTaxZone: [Zone](/docs/graphql-api/admin/object-types#zone)
 * defaultShippingZone: [Zone](/docs/graphql-api/admin/object-types#zone)
 * defaultLanguageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/docs/graphql-api/admin/enums#languagecode)!]
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * defaultCurrencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * availableCurrencyCodes: [[CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!]!
* *// Not yet used - will be implemented in a future release.*
 * trackInventory: [Boolean](/docs/graphql-api/admin/object-types#boolean)
* *// Not yet used - will be implemented in a future release.*
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)
 * pricesIncludeTax: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * seller: [Seller](/docs/graphql-api/admin/object-types#seller)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ChannelDefaultLanguageError

Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`
of the GlobalSettings

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * language: [String](/docs/graphql-api/admin/object-types#string)!
 * channelCode: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ChannelList

{{% gql-fields %}}
 * items: [[Channel](/docs/graphql-api/admin/object-types#channel)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Collection

{{% gql-fields %}}
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * inheritFilters: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * breadcrumbs: [[CollectionBreadcrumb](/docs/graphql-api/admin/object-types#collectionbreadcrumb)!]!
 * position: [Int](/docs/graphql-api/admin/object-types#int)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/admin/object-types#asset)!]!
 * parent: [Collection](/docs/graphql-api/admin/object-types#collection)
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)!
 * children: [[Collection](/docs/graphql-api/admin/object-types#collection)!]
 * filters: [[ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!]!
 * translations: [[CollectionTranslation](/docs/graphql-api/admin/object-types#collectiontranslation)!]!
 * productVariants(options: [ProductVariantListOptions](/docs/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/docs/graphql-api/admin/object-types#productvariantlist)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CollectionBreadcrumb

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CollectionList

{{% gql-fields %}}
 * items: [[Collection](/docs/graphql-api/admin/object-types#collection)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CollectionResult

Which Collections are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * collection: [Collection](/docs/graphql-api/admin/object-types#collection)!
 * count: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CollectionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigArg

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * value: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigArgDefinition

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * required: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * defaultValue: [JSON](/docs/graphql-api/admin/object-types#json)
 * label: [String](/docs/graphql-api/admin/object-types#string)
 * description: [String](/docs/graphql-api/admin/object-types#string)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ConfigurableOperation

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * args: [[ConfigArg](/docs/graphql-api/admin/object-types#configarg)!]!
{{% /gql-fields %}}


## ConfigurableOperationDefinition

{{% gql-fields %}}
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * args: [[ConfigArgDefinition](/docs/graphql-api/admin/object-types#configargdefinition)!]!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Coordinate

{{% gql-fields %}}
 * x: [Float](/docs/graphql-api/admin/object-types#float)!
 * y: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## Country

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * parent: [Region](/docs/graphql-api/admin/object-types#region)
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)
 * translations: [[RegionTranslation](/docs/graphql-api/admin/object-types#regiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CountryList

{{% gql-fields %}}
 * items: [[Country](/docs/graphql-api/admin/object-types#country)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CouponCodeExpiredError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CouponCodeInvalidError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CouponCodeLimitError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)!
 * limit: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CreateAssetResult

{{% gql-fields %}}
union CreateAssetResult = [Asset](/docs/graphql-api/admin/object-types#asset) | [MimeTypeError](/docs/graphql-api/admin/object-types#mimetypeerror)
{{% /gql-fields %}}

## CreateChannelResult

{{% gql-fields %}}
union CreateChannelResult = [Channel](/docs/graphql-api/admin/object-types#channel) | [LanguageNotAvailableError](/docs/graphql-api/admin/object-types#languagenotavailableerror)
{{% /gql-fields %}}

## CreateCustomerResult

{{% gql-fields %}}
union CreateCustomerResult = [Customer](/docs/graphql-api/admin/object-types#customer) | [EmailAddressConflictError](/docs/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## CreateFulfillmentError

Returned if an error is thrown in a FulfillmentHandler's createFulfillment method

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * fulfillmentHandlerError: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CreatePromotionResult

{{% gql-fields %}}
union CreatePromotionResult = [Promotion](/docs/graphql-api/admin/object-types#promotion) | [MissingConditionsError](/docs/graphql-api/admin/object-types#missingconditionserror)
{{% /gql-fields %}}

## CurrentUser

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * identifier: [String](/docs/graphql-api/admin/object-types#string)!
 * channels: [[CurrentUserChannel](/docs/graphql-api/admin/object-types#currentuserchannel)!]!
{{% /gql-fields %}}


## CurrentUserChannel

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * token: [String](/docs/graphql-api/admin/object-types#string)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/docs/graphql-api/admin/enums#permission)!]!
{{% /gql-fields %}}


## CustomFieldConfig

{{% gql-fields %}}
union CustomFieldConfig = [StringCustomFieldConfig](/docs/graphql-api/admin/object-types#stringcustomfieldconfig) | [LocaleStringCustomFieldConfig](/docs/graphql-api/admin/object-types#localestringcustomfieldconfig) | [IntCustomFieldConfig](/docs/graphql-api/admin/object-types#intcustomfieldconfig) | [FloatCustomFieldConfig](/docs/graphql-api/admin/object-types#floatcustomfieldconfig) | [BooleanCustomFieldConfig](/docs/graphql-api/admin/object-types#booleancustomfieldconfig) | [DateTimeCustomFieldConfig](/docs/graphql-api/admin/object-types#datetimecustomfieldconfig) | [RelationCustomFieldConfig](/docs/graphql-api/admin/object-types#relationcustomfieldconfig) | [TextCustomFieldConfig](/docs/graphql-api/admin/object-types#textcustomfieldconfig) | [LocaleTextCustomFieldConfig](/docs/graphql-api/admin/object-types#localetextcustomfieldconfig)
{{% /gql-fields %}}

## CustomFields

{{% gql-fields %}}
 * Address: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Administrator: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Asset: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Channel: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Collection: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Customer: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * CustomerGroup: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Facet: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * FacetValue: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Fulfillment: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * GlobalSettings: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Order: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * OrderLine: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * PaymentMethod: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Product: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductOption: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductOptionGroup: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductVariant: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Promotion: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Region: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Seller: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * ShippingMethod: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * StockLocation: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * TaxCategory: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * TaxRate: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * User: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
 * Zone: [[CustomFieldConfig](/docs/graphql-api/admin/object-types#customfieldconfig)!]!
{{% /gql-fields %}}


## Customer

{{% gql-fields %}}
 * groups: [[CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!]!
 * history(options: [HistoryEntryListOptions](/docs/graphql-api/admin/input-types#historyentrylistoptions)): [HistoryEntryList](/docs/graphql-api/admin/object-types#historyentrylist)!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * title: [String](/docs/graphql-api/admin/object-types#string)
 * firstName: [String](/docs/graphql-api/admin/object-types#string)!
 * lastName: [String](/docs/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * emailAddress: [String](/docs/graphql-api/admin/object-types#string)!
 * addresses: [[Address](/docs/graphql-api/admin/object-types#address)!]
 * orders(options: [OrderListOptions](/docs/graphql-api/admin/input-types#orderlistoptions)): [OrderList](/docs/graphql-api/admin/object-types#orderlist)!
 * user: [User](/docs/graphql-api/admin/object-types#user)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerGroup

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * customers(options: [CustomerListOptions](/docs/graphql-api/admin/input-types#customerlistoptions)): [CustomerList](/docs/graphql-api/admin/object-types#customerlist)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerGroupList

{{% gql-fields %}}
 * items: [[CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CustomerList

{{% gql-fields %}}
 * items: [[Customer](/docs/graphql-api/admin/object-types#customer)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## DateTime

A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

## DateTimeCustomFieldConfig

Expects the same validation formats as the `<input type="datetime-local">` HTML element.
See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * min: [String](/docs/graphql-api/admin/object-types#string)
 * max: [String](/docs/graphql-api/admin/object-types#string)
 * step: [Int](/docs/graphql-api/admin/object-types#int)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## DeletionResponse

{{% gql-fields %}}
 * result: [DeletionResult](/docs/graphql-api/admin/enums#deletionresult)!
 * message: [String](/docs/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## Discount

{{% gql-fields %}}
 * adjustmentSource: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [AdjustmentType](/docs/graphql-api/admin/enums#adjustmenttype)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * amount: [Money](/docs/graphql-api/admin/object-types#money)!
 * amountWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## EmailAddressConflictError

Returned when attempting to create a Customer with an email address already registered to an existing User.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## EmptyOrderLineSelectionError

Returned if no OrderLines have been specified for the operation

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Facet

{{% gql-fields %}}
 * isPrivate: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * values: [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[FacetTranslation](/docs/graphql-api/admin/object-types#facettranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetInUseError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * facetCode: [String](/docs/graphql-api/admin/object-types#string)!
 * productCount: [Int](/docs/graphql-api/admin/object-types#int)!
 * variantCount: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetList

{{% gql-fields %}}
 * items: [[Facet](/docs/graphql-api/admin/object-types#facet)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## FacetValue

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * facet: [Facet](/docs/graphql-api/admin/object-types#facet)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslation](/docs/graphql-api/admin/object-types#facetvaluetranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetValueList

{{% gql-fields %}}
 * items: [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetValueResult

Which FacetValues are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * facetValue: [FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!
 * count: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetValueTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## FloatCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * min: [Float](/docs/graphql-api/admin/object-types#float)
 * max: [Float](/docs/graphql-api/admin/object-types#float)
 * step: [Float](/docs/graphql-api/admin/object-types#float)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Fulfillment

{{% gql-fields %}}
 * nextStates: [[String](/docs/graphql-api/admin/object-types#string)!]!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * lines: [[FulfillmentLine](/docs/graphql-api/admin/object-types#fulfillmentline)!]!
 * summary: [[FulfillmentLine](/docs/graphql-api/admin/object-types#fulfillmentline)!]!
 * state: [String](/docs/graphql-api/admin/object-types#string)!
 * method: [String](/docs/graphql-api/admin/object-types#string)!
 * trackingCode: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FulfillmentLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/docs/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * fulfillment: [Fulfillment](/docs/graphql-api/admin/object-types#fulfillment)!
 * fulfillmentId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## FulfillmentStateTransitionError

Returned when there is an error in transitioning the Fulfillment state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * transitionError: [String](/docs/graphql-api/admin/object-types#string)!
 * fromState: [String](/docs/graphql-api/admin/object-types#string)!
 * toState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## GlobalSettings

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * availableLanguages: [[LanguageCode](/docs/graphql-api/admin/enums#languagecode)!]!
 * trackInventory: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)!
 * serverConfig: [ServerConfig](/docs/graphql-api/admin/object-types#serverconfig)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## GuestCheckoutError

Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * errorDetail: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## HistoryEntry

{{% gql-fields %}}
 * isPublic: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * administrator: [Administrator](/docs/graphql-api/admin/object-types#administrator)
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * type: [HistoryEntryType](/docs/graphql-api/admin/enums#historyentrytype)!
 * data: [JSON](/docs/graphql-api/admin/object-types#json)!
{{% /gql-fields %}}


## HistoryEntryList

{{% gql-fields %}}
 * items: [[HistoryEntry](/docs/graphql-api/admin/object-types#historyentry)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## ImportInfo

{{% gql-fields %}}
 * errors: [[String](/docs/graphql-api/admin/object-types#string)!]
 * processed: [Int](/docs/graphql-api/admin/object-types#int)!
 * imported: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## IneligibleShippingMethodError

Returned when attempting to set a ShippingMethod for which the Order is not eligible

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## InsufficientStockError

Returned when attempting to add more items to the Order than are available

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * quantityAvailable: [Int](/docs/graphql-api/admin/object-types#int)!
 * order: [Order](/docs/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}


## InsufficientStockOnHandError

Returned if attempting to create a Fulfillment when there is insufficient
stockOnHand of a ProductVariant to satisfy the requested quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * productVariantId: [ID](/docs/graphql-api/admin/object-types#id)!
 * productVariantName: [String](/docs/graphql-api/admin/object-types#string)!
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

## IntCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * min: [Int](/docs/graphql-api/admin/object-types#int)
 * max: [Int](/docs/graphql-api/admin/object-types#int)
 * step: [Int](/docs/graphql-api/admin/object-types#int)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## InvalidCredentialsError

Returned if the user authentication credentials are not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * authenticationError: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## InvalidFulfillmentHandlerError

Returned if the specified FulfillmentHandler code is not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ItemsAlreadyFulfilledError

Returned if the specified items are already part of a Fulfillment

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## JSON

The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).

## Job

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * startedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * settledAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * queueName: [String](/docs/graphql-api/admin/object-types#string)!
 * state: [JobState](/docs/graphql-api/admin/enums#jobstate)!
 * progress: [Float](/docs/graphql-api/admin/object-types#float)!
 * data: [JSON](/docs/graphql-api/admin/object-types#json)
 * result: [JSON](/docs/graphql-api/admin/object-types#json)
 * error: [JSON](/docs/graphql-api/admin/object-types#json)
 * isSettled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * duration: [Int](/docs/graphql-api/admin/object-types#int)!
 * retries: [Int](/docs/graphql-api/admin/object-types#int)!
 * attempts: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobBufferSize

{{% gql-fields %}}
 * bufferId: [String](/docs/graphql-api/admin/object-types#string)!
 * size: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobList

{{% gql-fields %}}
 * items: [[Job](/docs/graphql-api/admin/object-types#job)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobQueue

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * running: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## LanguageNotAvailableError

Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * languageCode: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## LocaleStringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * length: [Int](/docs/graphql-api/admin/object-types#int)
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * pattern: [String](/docs/graphql-api/admin/object-types#string)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## LocaleTextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## LocalizedString

{{% gql-fields %}}
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * value: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ManualPaymentStateError

Returned when a call to addManualPaymentToOrder is made but the Order
is not in the required state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## MetricSummary

{{% gql-fields %}}
 * interval: [MetricInterval](/docs/graphql-api/admin/enums#metricinterval)!
 * type: [MetricType](/docs/graphql-api/admin/enums#metrictype)!
 * title: [String](/docs/graphql-api/admin/object-types#string)!
 * entries: [[MetricSummaryEntry](/docs/graphql-api/admin/object-types#metricsummaryentry)!]!
{{% /gql-fields %}}


## MetricSummaryEntry

{{% gql-fields %}}
 * label: [String](/docs/graphql-api/admin/object-types#string)!
 * value: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## MimeTypeError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * fileName: [String](/docs/graphql-api/admin/object-types#string)!
 * mimeType: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## MissingConditionsError

Returned if a PromotionCondition has neither a couponCode nor any conditions set

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ModifyOrderResult

{{% gql-fields %}}
union ModifyOrderResult = [Order](/docs/graphql-api/admin/object-types#order) | [NoChangesSpecifiedError](/docs/graphql-api/admin/object-types#nochangesspecifiederror) | [OrderModificationStateError](/docs/graphql-api/admin/object-types#ordermodificationstateerror) | [PaymentMethodMissingError](/docs/graphql-api/admin/object-types#paymentmethodmissingerror) | [RefundPaymentIdMissingError](/docs/graphql-api/admin/object-types#refundpaymentidmissingerror) | [OrderLimitError](/docs/graphql-api/admin/object-types#orderlimiterror) | [NegativeQuantityError](/docs/graphql-api/admin/object-types#negativequantityerror) | [InsufficientStockError](/docs/graphql-api/admin/object-types#insufficientstockerror) | [CouponCodeExpiredError](/docs/graphql-api/admin/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/docs/graphql-api/admin/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/docs/graphql-api/admin/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Money

The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## MultipleOrderError

Returned if an operation has specified OrderLines from multiple Orders

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NativeAuthStrategyError

Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NativeAuthenticationResult

{{% gql-fields %}}
union NativeAuthenticationResult = [CurrentUser](/docs/graphql-api/admin/object-types#currentuser) | [InvalidCredentialsError](/docs/graphql-api/admin/object-types#invalidcredentialserror) | [NativeAuthStrategyError](/docs/graphql-api/admin/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## NegativeQuantityError

Returned when attempting to set a negative OrderLine quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NoActiveOrderError

Returned when invoking a mutation which depends on there being an active Order on the
current session.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NoChangesSpecifiedError

Returned when a call to modifyOrder fails to specify any changes

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NothingToRefundError

Returned if an attempting to refund an Order but neither items nor shipping refund was specified

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Order

{{% gql-fields %}}
 * nextStates: [[String](/docs/graphql-api/admin/object-types#string)!]!
 * modifications: [[OrderModification](/docs/graphql-api/admin/object-types#ordermodification)!]!
 * sellerOrders: [[Order](/docs/graphql-api/admin/object-types#order)!]
 * aggregateOrder: [Order](/docs/graphql-api/admin/object-types#order)
 * aggregateOrderId: [ID](/docs/graphql-api/admin/object-types#id)
 * channels: [[Channel](/docs/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * type: [OrderType](/docs/graphql-api/admin/enums#ordertype)!
* *// The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active"*
 * orderPlacedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
* *// A unique code for the Order*
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * state: [String](/docs/graphql-api/admin/object-types#string)!
* *// An order is active as long as the payment process has not been completed*
 * active: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * customer: [Customer](/docs/graphql-api/admin/object-types#customer)
 * shippingAddress: [OrderAddress](/docs/graphql-api/admin/object-types#orderaddress)
 * billingAddress: [OrderAddress](/docs/graphql-api/admin/object-types#orderaddress)
 * lines: [[OrderLine](/docs/graphql-api/admin/object-types#orderline)!]!
* *// Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.*
 * surcharges: [[Surcharge](/docs/graphql-api/admin/object-types#surcharge)!]!
 * discounts: [[Discount](/docs/graphql-api/admin/object-types#discount)!]!
* *// An array of all coupon codes applied to the Order*
 * couponCodes: [[String](/docs/graphql-api/admin/object-types#string)!]!
* *// Promotions applied to the order. Only gets populated after the payment process has completed.*
 * promotions: [[Promotion](/docs/graphql-api/admin/object-types#promotion)!]!
 * payments: [[Payment](/docs/graphql-api/admin/object-types#payment)!]
 * fulfillments: [[Fulfillment](/docs/graphql-api/admin/object-types#fulfillment)!]
 * totalQuantity: [Int](/docs/graphql-api/admin/object-types#int)!
* *// The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of `OrderLine.discountedLinePrice` values.*
 * subTotal: [Money](/docs/graphql-api/admin/object-types#money)!
* *// Same as subTotal, but inclusive of tax*
 * subTotalWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * shippingLines: [[ShippingLine](/docs/graphql-api/admin/object-types#shippingline)!]!
 * shipping: [Money](/docs/graphql-api/admin/object-types#money)!
 * shippingWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// Equal to subTotal plus shipping*
 * total: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The final payable amount. Equal to subTotalWithTax plus shippingWithTax*
 * totalWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// A summary of the taxes being applied to this Order*
 * taxSummary: [[OrderTaxSummary](/docs/graphql-api/admin/object-types#ordertaxsummary)!]!
 * history(options: [HistoryEntryListOptions](/docs/graphql-api/admin/input-types#historyentrylistoptions)): [HistoryEntryList](/docs/graphql-api/admin/object-types#historyentrylist)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderAddress

{{% gql-fields %}}
 * fullName: [String](/docs/graphql-api/admin/object-types#string)
 * company: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine1: [String](/docs/graphql-api/admin/object-types#string)
 * streetLine2: [String](/docs/graphql-api/admin/object-types#string)
 * city: [String](/docs/graphql-api/admin/object-types#string)
 * province: [String](/docs/graphql-api/admin/object-types#string)
 * postalCode: [String](/docs/graphql-api/admin/object-types#string)
 * country: [String](/docs/graphql-api/admin/object-types#string)
 * countryCode: [String](/docs/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderLimitError

Returned when the maximum order size limit has been reached.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * maxItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderLine

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * featuredAsset: [Asset](/docs/graphql-api/admin/object-types#asset)
* *// The price of a single unit, excluding tax and discounts*
 * unitPrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The price of a single unit, including tax but excluding discounts*
 * unitPriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// Non-zero if the unitPrice has changed since it was initially added to Order*
 * unitPriceChangeSinceAdded: [Money](/docs/graphql-api/admin/object-types#money)!
* *// Non-zero if the unitPriceWithTax has changed since it was initially added to Order*
 * unitPriceWithTaxChangeSinceAdded: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.*
 * discountedUnitPrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The price of a single unit including discounts and tax*
 * discountedUnitPriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
and refund calculations.*
 * proratedUnitPrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The proratedUnitPrice including tax*
 * proratedUnitPriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
* *// The quantity at the time the Order was placed*
 * orderPlacedQuantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * taxRate: [Float](/docs/graphql-api/admin/object-types#float)!
* *// The total price of the line excluding tax and discounts.*
 * linePrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The total price of the line including tax but excluding discounts.*
 * linePriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The price of the line including discounts, excluding tax*
 * discountedLinePrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The price of the line including discounts and tax*
 * discountedLinePriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.*
 * proratedLinePrice: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The proratedLinePrice including tax*
 * proratedLinePriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The total tax on this line*
 * lineTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * discounts: [[Discount](/docs/graphql-api/admin/object-types#discount)!]!
 * taxLines: [[TaxLine](/docs/graphql-api/admin/object-types#taxline)!]!
 * order: [Order](/docs/graphql-api/admin/object-types#order)!
 * fulfillmentLines: [[FulfillmentLine](/docs/graphql-api/admin/object-types#fulfillmentline)!]
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderList

{{% gql-fields %}}
 * items: [[Order](/docs/graphql-api/admin/object-types#order)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderModification

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * priceChange: [Money](/docs/graphql-api/admin/object-types#money)!
 * note: [String](/docs/graphql-api/admin/object-types#string)!
 * lines: [[OrderModificationLine](/docs/graphql-api/admin/object-types#ordermodificationline)!]!
 * surcharges: [[Surcharge](/docs/graphql-api/admin/object-types#surcharge)!]
 * payment: [Payment](/docs/graphql-api/admin/object-types#payment)
 * refund: [Refund](/docs/graphql-api/admin/object-types#refund)
 * isSettled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## OrderModificationError

Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderModificationLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/docs/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * modification: [OrderModification](/docs/graphql-api/admin/object-types#ordermodification)!
 * modificationId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## OrderModificationStateError

Returned when attempting to modify the contents of an Order that is not in the `Modifying` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderProcessState

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * to: [[String](/docs/graphql-api/admin/object-types#string)!]!
{{% /gql-fields %}}


## OrderStateTransitionError

Returned if there is an error in transitioning the Order state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * transitionError: [String](/docs/graphql-api/admin/object-types#string)!
 * fromState: [String](/docs/graphql-api/admin/object-types#string)!
 * toState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderTaxSummary

A summary of the taxes being applied to this order, grouped
by taxRate.

{{% gql-fields %}}
* *// A description of this tax*
 * description: [String](/docs/graphql-api/admin/object-types#string)!
* *// The taxRate as a percentage*
 * taxRate: [Float](/docs/graphql-api/admin/object-types#float)!
* *// The total net price of OrderLines to which this taxRate applies*
 * taxBase: [Money](/docs/graphql-api/admin/object-types#money)!
* *// The total tax being applied to the Order at this taxRate*
 * taxTotal: [Money](/docs/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## Payment

{{% gql-fields %}}
 * nextStates: [[String](/docs/graphql-api/admin/object-types#string)!]!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * method: [String](/docs/graphql-api/admin/object-types#string)!
 * amount: [Money](/docs/graphql-api/admin/object-types#money)!
 * state: [String](/docs/graphql-api/admin/object-types#string)!
 * transactionId: [String](/docs/graphql-api/admin/object-types#string)
 * errorMessage: [String](/docs/graphql-api/admin/object-types#string)
 * refunds: [[Refund](/docs/graphql-api/admin/object-types#refund)!]!
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * checker: [ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)
 * handler: [ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!
 * translations: [[PaymentMethodTranslation](/docs/graphql-api/admin/object-types#paymentmethodtranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethodList

{{% gql-fields %}}
 * items: [[PaymentMethod](/docs/graphql-api/admin/object-types#paymentmethod)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## PaymentMethodMissingError

Returned when a call to modifyOrder fails to include a paymentMethod even
though the price has increased as a result of the changes.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentMethodQuote

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * isEligible: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * eligibilityMessage: [String](/docs/graphql-api/admin/object-types#string)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethodTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentOrderMismatchError

Returned if an attempting to refund a Payment against OrderLines from a different Order

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentStateTransitionError

Returned when there is an error in transitioning the Payment state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * transitionError: [String](/docs/graphql-api/admin/object-types#string)!
 * fromState: [String](/docs/graphql-api/admin/object-types#string)!
 * toState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PermissionDefinition

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * assignable: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## PriceRange

The price range where the result has more than one price

{{% gql-fields %}}
 * min: [Money](/docs/graphql-api/admin/object-types#money)!
 * max: [Money](/docs/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## Product

{{% gql-fields %}}
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * channels: [[Channel](/docs/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/admin/object-types#asset)!]!
* *// Returns all ProductVariants*
 * variants: [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!]!
* *// Returns a paginated, sortable, filterable list of ProductVariants*
 * variantList(options: [ProductVariantListOptions](/docs/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/docs/graphql-api/admin/object-types#productvariantlist)!
 * optionGroups: [[ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)!]!
 * facetValues: [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[ProductTranslation](/docs/graphql-api/admin/object-types#producttranslation)!]!
 * collections: [[Collection](/docs/graphql-api/admin/object-types#collection)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductList

{{% gql-fields %}}
 * items: [[Product](/docs/graphql-api/admin/object-types#product)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductOption

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * groupId: [ID](/docs/graphql-api/admin/object-types#id)!
 * group: [ProductOptionGroup](/docs/graphql-api/admin/object-types#productoptiongroup)!
 * translations: [[ProductOptionTranslation](/docs/graphql-api/admin/object-types#productoptiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroup

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * options: [[ProductOption](/docs/graphql-api/admin/object-types#productoption)!]!
 * translations: [[ProductOptionGroupTranslation](/docs/graphql-api/admin/object-types#productoptiongrouptranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroupTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductOptionInUseError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * optionGroupCode: [String](/docs/graphql-api/admin/object-types#string)!
 * productVariantCount: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductOptionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductVariant

{{% gql-fields %}}
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * trackInventory: [GlobalFlag](/docs/graphql-api/admin/enums#globalflag)!
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)!
 * stockAllocated: [Int](/docs/graphql-api/admin/object-types#int)!
 * outOfStockThreshold: [Int](/docs/graphql-api/admin/object-types#int)!
 * useGlobalOutOfStockThreshold: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * prices: [[ProductVariantPrice](/docs/graphql-api/admin/object-types#productvariantprice)!]!
 * stockLevels: [[StockLevel](/docs/graphql-api/admin/object-types#stocklevel)!]!
 * stockMovements(options: [StockMovementListOptions](/docs/graphql-api/admin/input-types#stockmovementlistoptions)): [StockMovementList](/docs/graphql-api/admin/object-types#stockmovementlist)!
 * channels: [[Channel](/docs/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * product: [Product](/docs/graphql-api/admin/object-types#product)!
 * productId: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * sku: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/docs/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/docs/graphql-api/admin/object-types#asset)!]!
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * priceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * stockLevel: [String](/docs/graphql-api/admin/object-types#string)!
 * taxRateApplied: [TaxRate](/docs/graphql-api/admin/object-types#taxrate)!
 * taxCategory: [TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)!
 * options: [[ProductOption](/docs/graphql-api/admin/object-types#productoption)!]!
 * facetValues: [[FacetValue](/docs/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[ProductVariantTranslation](/docs/graphql-api/admin/object-types#productvarianttranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductVariantList

{{% gql-fields %}}
 * items: [[ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductVariantPrice

{{% gql-fields %}}
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * price: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductVariantTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Promotion

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * startsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/docs/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/docs/graphql-api/admin/object-types#int)
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * conditions: [[ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!]!
 * actions: [[ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!]!
 * translations: [[PromotionTranslation](/docs/graphql-api/admin/object-types#promotiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PromotionList

{{% gql-fields %}}
 * items: [[Promotion](/docs/graphql-api/admin/object-types#promotion)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## PromotionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Province

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * parent: [Region](/docs/graphql-api/admin/object-types#region)
 * parentId: [ID](/docs/graphql-api/admin/object-types#id)
 * translations: [[RegionTranslation](/docs/graphql-api/admin/object-types#regiontranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProvinceList

{{% gql-fields %}}
 * items: [[Province](/docs/graphql-api/admin/object-types#province)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## QuantityTooGreatError

Returned if the specified quantity of an OrderLine is greater than the number of items in that line

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Refund

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * items: [Money](/docs/graphql-api/admin/object-types#money)!
 * shipping: [Money](/docs/graphql-api/admin/object-types#money)!
 * adjustment: [Money](/docs/graphql-api/admin/object-types#money)!
 * total: [Money](/docs/graphql-api/admin/object-types#money)!
 * method: [String](/docs/graphql-api/admin/object-types#string)
 * state: [String](/docs/graphql-api/admin/object-types#string)!
 * transactionId: [String](/docs/graphql-api/admin/object-types#string)
 * reason: [String](/docs/graphql-api/admin/object-types#string)
 * lines: [[RefundLine](/docs/graphql-api/admin/object-types#refundline)!]!
 * paymentId: [ID](/docs/graphql-api/admin/object-types#id)!
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## RefundLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/docs/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/docs/graphql-api/admin/object-types#id)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
 * refund: [Refund](/docs/graphql-api/admin/object-types#refund)!
 * refundId: [ID](/docs/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RefundOrderResult

{{% gql-fields %}}
union RefundOrderResult = [Refund](/docs/graphql-api/admin/object-types#refund) | [QuantityTooGreatError](/docs/graphql-api/admin/object-types#quantitytoogreaterror) | [NothingToRefundError](/docs/graphql-api/admin/object-types#nothingtorefunderror) | [OrderStateTransitionError](/docs/graphql-api/admin/object-types#orderstatetransitionerror) | [MultipleOrderError](/docs/graphql-api/admin/object-types#multipleordererror) | [PaymentOrderMismatchError](/docs/graphql-api/admin/object-types#paymentordermismatcherror) | [RefundOrderStateError](/docs/graphql-api/admin/object-types#refundorderstateerror) | [AlreadyRefundedError](/docs/graphql-api/admin/object-types#alreadyrefundederror) | [RefundStateTransitionError](/docs/graphql-api/admin/object-types#refundstatetransitionerror)
{{% /gql-fields %}}

## RefundOrderStateError

Returned if an attempting to refund an Order which is not in the expected state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * orderState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RefundPaymentIdMissingError

Returned when a call to modifyOrder fails to include a refundPaymentId even
though the price has decreased as a result of the changes.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RefundStateTransitionError

Returned when there is an error in transitioning the Refund state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * transitionError: [String](/docs/graphql-api/admin/object-types#string)!
 * fromState: [String](/docs/graphql-api/admin/object-types#string)!
 * toState: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RegionTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RelationCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * entity: [String](/docs/graphql-api/admin/object-types#string)!
 * scalarFields: [[String](/docs/graphql-api/admin/object-types#string)!]!
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Release

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## RemoveFacetFromChannelResult

{{% gql-fields %}}
union RemoveFacetFromChannelResult = [Facet](/docs/graphql-api/admin/object-types#facet) | [FacetInUseError](/docs/graphql-api/admin/object-types#facetinuseerror)
{{% /gql-fields %}}

## RemoveOptionGroupFromProductResult

{{% gql-fields %}}
union RemoveOptionGroupFromProductResult = [Product](/docs/graphql-api/admin/object-types#product) | [ProductOptionInUseError](/docs/graphql-api/admin/object-types#productoptioninuseerror)
{{% /gql-fields %}}

## RemoveOrderItemsResult

{{% gql-fields %}}
union RemoveOrderItemsResult = [Order](/docs/graphql-api/admin/object-types#order) | [OrderModificationError](/docs/graphql-api/admin/object-types#ordermodificationerror)
{{% /gql-fields %}}

## Return

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Role

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/docs/graphql-api/admin/enums#permission)!]!
 * channels: [[Channel](/docs/graphql-api/admin/object-types#channel)!]!
{{% /gql-fields %}}


## RoleList

{{% gql-fields %}}
 * items: [[Role](/docs/graphql-api/admin/object-types#role)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Sale

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## SearchReindexResponse

{{% gql-fields %}}
 * success: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## SearchResponse

{{% gql-fields %}}
 * items: [[SearchResult](/docs/graphql-api/admin/object-types#searchresult)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
 * facetValues: [[FacetValueResult](/docs/graphql-api/admin/object-types#facetvalueresult)!]!
 * collections: [[CollectionResult](/docs/graphql-api/admin/object-types#collectionresult)!]!
{{% /gql-fields %}}


## SearchResult

{{% gql-fields %}}
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
* *// An array of ids of the Channels in which this result appears*
 * channelIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * sku: [String](/docs/graphql-api/admin/object-types#string)!
 * slug: [String](/docs/graphql-api/admin/object-types#string)!
 * productId: [ID](/docs/graphql-api/admin/object-types#id)!
 * productName: [String](/docs/graphql-api/admin/object-types#string)!
 * productAsset: [SearchResultAsset](/docs/graphql-api/admin/object-types#searchresultasset)
 * productVariantId: [ID](/docs/graphql-api/admin/object-types#id)!
 * productVariantName: [String](/docs/graphql-api/admin/object-types#string)!
 * productVariantAsset: [SearchResultAsset](/docs/graphql-api/admin/object-types#searchresultasset)
 * price: [SearchResultPrice](/docs/graphql-api/admin/object-types#searchresultprice)!
 * priceWithTax: [SearchResultPrice](/docs/graphql-api/admin/object-types#searchresultprice)!
 * currencyCode: [CurrencyCode](/docs/graphql-api/admin/enums#currencycode)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * facetIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
 * facetValueIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
* *// An array of ids of the Collections in which this result appears*
 * collectionIds: [[ID](/docs/graphql-api/admin/object-types#id)!]!
* *// A relevance score for the result. Differs between database implementations*
 * score: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## SearchResultAsset

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * preview: [String](/docs/graphql-api/admin/object-types#string)!
 * focalPoint: [Coordinate](/docs/graphql-api/admin/object-types#coordinate)
{{% /gql-fields %}}


## SearchResultPrice

The price of a search result product, either as a range or as a single price

{{% gql-fields %}}
union SearchResultPrice = [PriceRange](/docs/graphql-api/admin/object-types#pricerange) | [SinglePrice](/docs/graphql-api/admin/object-types#singleprice)
{{% /gql-fields %}}

## Seller

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## SellerList

{{% gql-fields %}}
 * items: [[Seller](/docs/graphql-api/admin/object-types#seller)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ServerConfig

{{% gql-fields %}}
 * orderProcess: [[OrderProcessState](/docs/graphql-api/admin/object-types#orderprocessstate)!]!
 * permittedAssetTypes: [[String](/docs/graphql-api/admin/object-types#string)!]!
 * permissions: [[PermissionDefinition](/docs/graphql-api/admin/object-types#permissiondefinition)!]!
 * customFieldConfig: [CustomFields](/docs/graphql-api/admin/object-types#customfields)!
{{% /gql-fields %}}


## SetCustomerForDraftOrderResult

{{% gql-fields %}}
union SetCustomerForDraftOrderResult = [Order](/docs/graphql-api/admin/object-types#order) | [EmailAddressConflictError](/docs/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## SetOrderShippingMethodResult

{{% gql-fields %}}
union SetOrderShippingMethodResult = [Order](/docs/graphql-api/admin/object-types#order) | [OrderModificationError](/docs/graphql-api/admin/object-types#ordermodificationerror) | [IneligibleShippingMethodError](/docs/graphql-api/admin/object-types#ineligibleshippingmethoderror) | [NoActiveOrderError](/docs/graphql-api/admin/object-types#noactiveordererror)
{{% /gql-fields %}}

## SettlePaymentError

Returned if the Payment settlement fails

{{% gql-fields %}}
 * errorCode: [ErrorCode](/docs/graphql-api/admin/enums#errorcode)!
 * message: [String](/docs/graphql-api/admin/object-types#string)!
 * paymentErrorMessage: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## SettlePaymentResult

{{% gql-fields %}}
union SettlePaymentResult = [Payment](/docs/graphql-api/admin/object-types#payment) | [SettlePaymentError](/docs/graphql-api/admin/object-types#settlepaymenterror) | [PaymentStateTransitionError](/docs/graphql-api/admin/object-types#paymentstatetransitionerror) | [OrderStateTransitionError](/docs/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## SettleRefundResult

{{% gql-fields %}}
union SettleRefundResult = [Refund](/docs/graphql-api/admin/object-types#refund) | [RefundStateTransitionError](/docs/graphql-api/admin/object-types#refundstatetransitionerror)
{{% /gql-fields %}}

## ShippingLine

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * shippingMethod: [ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * discountedPrice: [Money](/docs/graphql-api/admin/object-types#money)!
 * discountedPriceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * discounts: [[Discount](/docs/graphql-api/admin/object-types#discount)!]!
{{% /gql-fields %}}


## ShippingMethod

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * fulfillmentHandlerCode: [String](/docs/graphql-api/admin/object-types#string)!
 * checker: [ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!
 * calculator: [ConfigurableOperation](/docs/graphql-api/admin/object-types#configurableoperation)!
 * translations: [[ShippingMethodTranslation](/docs/graphql-api/admin/object-types#shippingmethodtranslation)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ShippingMethodList

{{% gql-fields %}}
 * items: [[ShippingMethod](/docs/graphql-api/admin/object-types#shippingmethod)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ShippingMethodQuote

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * code: [String](/docs/graphql-api/admin/object-types#string)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
* *// Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult*
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ShippingMethodTranslation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/docs/graphql-api/admin/enums#languagecode)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## SinglePrice

The price value where the result has a single price

{{% gql-fields %}}
 * value: [Money](/docs/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## StockAdjustment

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/docs/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/docs/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockLevel

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * stockLocationId: [ID](/docs/graphql-api/admin/object-types#id)!
 * stockOnHand: [Int](/docs/graphql-api/admin/object-types#int)!
 * stockAllocated: [Int](/docs/graphql-api/admin/object-types#int)!
 * stockLocation: [StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}


## StockLocation

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StockLocationList

{{% gql-fields %}}
 * items: [[StockLocation](/docs/graphql-api/admin/object-types#stocklocation)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockMovementItem

{{% gql-fields %}}
union StockMovementItem = [StockAdjustment](/docs/graphql-api/admin/object-types#stockadjustment) | [Allocation](/docs/graphql-api/admin/object-types#allocation) | [Sale](/docs/graphql-api/admin/object-types#sale) | [Cancellation](/docs/graphql-api/admin/object-types#cancellation) | [Return](/docs/graphql-api/admin/object-types#return) | [Release](/docs/graphql-api/admin/object-types#release)
{{% /gql-fields %}}

## StockMovementList

{{% gql-fields %}}
 * items: [[StockMovementItem](/docs/graphql-api/admin/object-types#stockmovementitem)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## StringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * length: [Int](/docs/graphql-api/admin/object-types#int)
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * pattern: [String](/docs/graphql-api/admin/object-types#string)
 * options: [[StringFieldOption](/docs/graphql-api/admin/object-types#stringfieldoption)!]
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StringFieldOption

{{% gql-fields %}}
 * value: [String](/docs/graphql-api/admin/object-types#string)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
{{% /gql-fields %}}


## Success

Indicates that an operation succeeded, where we do not want to return any more specific information.

{{% gql-fields %}}
 * success: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## Surcharge

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * sku: [String](/docs/graphql-api/admin/object-types#string)
 * taxLines: [[TaxLine](/docs/graphql-api/admin/object-types#taxline)!]!
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * taxRate: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## Tag

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * value: [String](/docs/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## TagList

{{% gql-fields %}}
 * items: [[Tag](/docs/graphql-api/admin/object-types#tag)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TaxCategory

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * isDefault: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TaxCategoryList

{{% gql-fields %}}
 * items: [[TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TaxLine

{{% gql-fields %}}
 * description: [String](/docs/graphql-api/admin/object-types#string)!
 * taxRate: [Float](/docs/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## TaxRate

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * value: [Float](/docs/graphql-api/admin/object-types#float)!
 * category: [TaxCategory](/docs/graphql-api/admin/object-types#taxcategory)!
 * zone: [Zone](/docs/graphql-api/admin/object-types#zone)!
 * customerGroup: [CustomerGroup](/docs/graphql-api/admin/object-types#customergroup)
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TaxRateList

{{% gql-fields %}}
 * items: [[TaxRate](/docs/graphql-api/admin/object-types#taxrate)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TestShippingMethodQuote

{{% gql-fields %}}
 * price: [Money](/docs/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/docs/graphql-api/admin/object-types#money)!
 * metadata: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TestShippingMethodResult

{{% gql-fields %}}
 * eligible: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * quote: [TestShippingMethodQuote](/docs/graphql-api/admin/object-types#testshippingmethodquote)
{{% /gql-fields %}}


## TextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * type: [String](/docs/graphql-api/admin/object-types#string)!
 * list: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/docs/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/docs/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TransitionFulfillmentToStateResult

{{% gql-fields %}}
union TransitionFulfillmentToStateResult = [Fulfillment](/docs/graphql-api/admin/object-types#fulfillment) | [FulfillmentStateTransitionError](/docs/graphql-api/admin/object-types#fulfillmentstatetransitionerror)
{{% /gql-fields %}}

## TransitionOrderToStateResult

{{% gql-fields %}}
union TransitionOrderToStateResult = [Order](/docs/graphql-api/admin/object-types#order) | [OrderStateTransitionError](/docs/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## TransitionPaymentToStateResult

{{% gql-fields %}}
union TransitionPaymentToStateResult = [Payment](/docs/graphql-api/admin/object-types#payment) | [PaymentStateTransitionError](/docs/graphql-api/admin/object-types#paymentstatetransitionerror)
{{% /gql-fields %}}

## UpdateChannelResult

{{% gql-fields %}}
union UpdateChannelResult = [Channel](/docs/graphql-api/admin/object-types#channel) | [LanguageNotAvailableError](/docs/graphql-api/admin/object-types#languagenotavailableerror)
{{% /gql-fields %}}

## UpdateCustomerResult

{{% gql-fields %}}
union UpdateCustomerResult = [Customer](/docs/graphql-api/admin/object-types#customer) | [EmailAddressConflictError](/docs/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## UpdateGlobalSettingsResult

{{% gql-fields %}}
union UpdateGlobalSettingsResult = [GlobalSettings](/docs/graphql-api/admin/object-types#globalsettings) | [ChannelDefaultLanguageError](/docs/graphql-api/admin/object-types#channeldefaultlanguageerror)
{{% /gql-fields %}}

## UpdateOrderItemsResult

{{% gql-fields %}}
union UpdateOrderItemsResult = [Order](/docs/graphql-api/admin/object-types#order) | [OrderModificationError](/docs/graphql-api/admin/object-types#ordermodificationerror) | [OrderLimitError](/docs/graphql-api/admin/object-types#orderlimiterror) | [NegativeQuantityError](/docs/graphql-api/admin/object-types#negativequantityerror) | [InsufficientStockError](/docs/graphql-api/admin/object-types#insufficientstockerror)
{{% /gql-fields %}}

## UpdatePromotionResult

{{% gql-fields %}}
union UpdatePromotionResult = [Promotion](/docs/graphql-api/admin/object-types#promotion) | [MissingConditionsError](/docs/graphql-api/admin/object-types#missingconditionserror)
{{% /gql-fields %}}

## Upload

The `Upload` scalar type represents a file upload.

## User

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * identifier: [String](/docs/graphql-api/admin/object-types#string)!
 * verified: [Boolean](/docs/graphql-api/admin/object-types#boolean)!
 * roles: [[Role](/docs/graphql-api/admin/object-types#role)!]!
 * lastLogin: [DateTime](/docs/graphql-api/admin/object-types#datetime)
 * authenticationMethods: [[AuthenticationMethod](/docs/graphql-api/admin/object-types#authenticationmethod)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Zone

{{% gql-fields %}}
 * id: [ID](/docs/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/docs/graphql-api/admin/object-types#datetime)!
 * name: [String](/docs/graphql-api/admin/object-types#string)!
 * members: [[Region](/docs/graphql-api/admin/object-types#region)!]!
 * customFields: [JSON](/docs/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ZoneList

{{% gql-fields %}}
 * items: [[Zone](/docs/graphql-api/admin/object-types#zone)!]!
 * totalItems: [Int](/docs/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


