---
title: "Types"
weight: 3
date: 2023-07-04T11:02:07.589Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->


# Types

## AddFulfillmentToOrderResult

{{% gql-fields %}}
union AddFulfillmentToOrderResult = [Fulfillment](/graphql-api/admin/object-types#fulfillment) | [EmptyOrderLineSelectionError](/graphql-api/admin/object-types#emptyorderlineselectionerror) | [ItemsAlreadyFulfilledError](/graphql-api/admin/object-types#itemsalreadyfulfillederror) | [InsufficientStockOnHandError](/graphql-api/admin/object-types#insufficientstockonhanderror) | [InvalidFulfillmentHandlerError](/graphql-api/admin/object-types#invalidfulfillmenthandlererror) | [FulfillmentStateTransitionError](/graphql-api/admin/object-types#fulfillmentstatetransitionerror) | [CreateFulfillmentError](/graphql-api/admin/object-types#createfulfillmenterror)
{{% /gql-fields %}}

## AddManualPaymentToOrderResult

{{% gql-fields %}}
union AddManualPaymentToOrderResult = [Order](/graphql-api/admin/object-types#order) | [ManualPaymentStateError](/graphql-api/admin/object-types#manualpaymentstateerror)
{{% /gql-fields %}}

## Address

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * fullName: [String](/graphql-api/admin/object-types#string)
 * company: [String](/graphql-api/admin/object-types#string)
 * streetLine1: [String](/graphql-api/admin/object-types#string)!
 * streetLine2: [String](/graphql-api/admin/object-types#string)
 * city: [String](/graphql-api/admin/object-types#string)
 * province: [String](/graphql-api/admin/object-types#string)
 * postalCode: [String](/graphql-api/admin/object-types#string)
 * country: [Country](/graphql-api/admin/object-types#country)!
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * defaultShippingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * defaultBillingAddress: [Boolean](/graphql-api/admin/object-types#boolean)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Adjustment

{{% gql-fields %}}
 * adjustmentSource: [String](/graphql-api/admin/object-types#string)!
 * type: [AdjustmentType](/graphql-api/admin/enums#adjustmenttype)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * amount: [Money](/graphql-api/admin/object-types#money)!
 * data: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Administrator

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * firstName: [String](/graphql-api/admin/object-types#string)!
 * lastName: [String](/graphql-api/admin/object-types#string)!
 * emailAddress: [String](/graphql-api/admin/object-types#string)!
 * user: [User](/graphql-api/admin/object-types#user)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AdministratorList

{{% gql-fields %}}
 * items: [[Administrator](/graphql-api/admin/object-types#administrator)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Allocation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
 * orderLine: [OrderLine](/graphql-api/admin/object-types#orderline)!
{{% /gql-fields %}}


## AlreadyRefundedError

Returned if an attempting to refund an OrderItem which has already been refunded

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * refundId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## ApplyCouponCodeResult

{{% gql-fields %}}
union ApplyCouponCodeResult = [Order](/graphql-api/admin/object-types#order) | [CouponCodeExpiredError](/graphql-api/admin/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/graphql-api/admin/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/graphql-api/admin/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Asset

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [AssetType](/graphql-api/admin/enums#assettype)!
 * fileSize: [Int](/graphql-api/admin/object-types#int)!
 * mimeType: [String](/graphql-api/admin/object-types#string)!
 * width: [Int](/graphql-api/admin/object-types#int)!
 * height: [Int](/graphql-api/admin/object-types#int)!
 * source: [String](/graphql-api/admin/object-types#string)!
 * preview: [String](/graphql-api/admin/object-types#string)!
 * focalPoint: [Coordinate](/graphql-api/admin/object-types#coordinate)
 * tags: [[Tag](/graphql-api/admin/object-types#tag)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## AssetList

{{% gql-fields %}}
 * items: [[Asset](/graphql-api/admin/object-types#asset)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## AuthenticationMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * strategy: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## AuthenticationResult

{{% gql-fields %}}
union AuthenticationResult = [CurrentUser](/graphql-api/admin/object-types#currentuser) | [InvalidCredentialsError](/graphql-api/admin/object-types#invalidcredentialserror)
{{% /gql-fields %}}

## Boolean

The `Boolean` scalar type represents `true` or `false`.

## BooleanCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CancelActiveOrderError

Returned if an attempting to cancel lines from an Order which is still active

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * orderState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CancelOrderResult

{{% gql-fields %}}
union CancelOrderResult = [Order](/graphql-api/admin/object-types#order) | [EmptyOrderLineSelectionError](/graphql-api/admin/object-types#emptyorderlineselectionerror) | [QuantityTooGreatError](/graphql-api/admin/object-types#quantitytoogreaterror) | [MultipleOrderError](/graphql-api/admin/object-types#multipleordererror) | [CancelActiveOrderError](/graphql-api/admin/object-types#cancelactiveordererror) | [OrderStateTransitionError](/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## CancelPaymentError

Returned if the Payment cancellation fails

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * paymentErrorMessage: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CancelPaymentResult

{{% gql-fields %}}
union CancelPaymentResult = [Payment](/graphql-api/admin/object-types#payment) | [CancelPaymentError](/graphql-api/admin/object-types#cancelpaymenterror) | [PaymentStateTransitionError](/graphql-api/admin/object-types#paymentstatetransitionerror)
{{% /gql-fields %}}

## Cancellation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
 * orderLine: [OrderLine](/graphql-api/admin/object-types#orderline)!
{{% /gql-fields %}}


## Channel

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * token: [String](/graphql-api/admin/object-types#string)!
 * defaultTaxZone: [Zone](/graphql-api/admin/object-types#zone)
 * defaultShippingZone: [Zone](/graphql-api/admin/object-types#zone)
 * defaultLanguageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * availableLanguageCodes: [[LanguageCode](/graphql-api/admin/enums#languagecode)!]
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * defaultCurrencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * availableCurrencyCodes: [[CurrencyCode](/graphql-api/admin/enums#currencycode)!]!
* *// Not yet used - will be implemented in a future release.*
 * trackInventory: [Boolean](/graphql-api/admin/object-types#boolean)
* *// Not yet used - will be implemented in a future release.*
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)
 * pricesIncludeTax: [Boolean](/graphql-api/admin/object-types#boolean)!
 * seller: [Seller](/graphql-api/admin/object-types#seller)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ChannelDefaultLanguageError

Returned when the default LanguageCode of a Channel is no longer found in the `availableLanguages`
of the GlobalSettings

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * language: [String](/graphql-api/admin/object-types#string)!
 * channelCode: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ChannelList

{{% gql-fields %}}
 * items: [[Channel](/graphql-api/admin/object-types#channel)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Collection

{{% gql-fields %}}
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)!
 * inheritFilters: [Boolean](/graphql-api/admin/object-types#boolean)!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * breadcrumbs: [[CollectionBreadcrumb](/graphql-api/admin/object-types#collectionbreadcrumb)!]!
 * position: [Int](/graphql-api/admin/object-types#int)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/graphql-api/admin/object-types#asset)!]!
 * parent: [Collection](/graphql-api/admin/object-types#collection)
 * parentId: [ID](/graphql-api/admin/object-types#id)!
 * children: [[Collection](/graphql-api/admin/object-types#collection)!]
 * filters: [[ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!]!
 * translations: [[CollectionTranslation](/graphql-api/admin/object-types#collectiontranslation)!]!
 * productVariants(options: [ProductVariantListOptions](/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/graphql-api/admin/object-types#productvariantlist)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CollectionBreadcrumb

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CollectionList

{{% gql-fields %}}
 * items: [[Collection](/graphql-api/admin/object-types#collection)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CollectionResult

Which Collections are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * collection: [Collection](/graphql-api/admin/object-types#collection)!
 * count: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CollectionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigArg

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * value: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ConfigArgDefinition

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * required: [Boolean](/graphql-api/admin/object-types#boolean)!
 * defaultValue: [JSON](/graphql-api/admin/object-types#json)
 * label: [String](/graphql-api/admin/object-types#string)
 * description: [String](/graphql-api/admin/object-types#string)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ConfigurableOperation

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * args: [[ConfigArg](/graphql-api/admin/object-types#configarg)!]!
{{% /gql-fields %}}


## ConfigurableOperationDefinition

{{% gql-fields %}}
 * code: [String](/graphql-api/admin/object-types#string)!
 * args: [[ConfigArgDefinition](/graphql-api/admin/object-types#configargdefinition)!]!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Coordinate

{{% gql-fields %}}
 * x: [Float](/graphql-api/admin/object-types#float)!
 * y: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## Country

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * parent: [Region](/graphql-api/admin/object-types#region)
 * parentId: [ID](/graphql-api/admin/object-types#id)
 * translations: [[RegionTranslation](/graphql-api/admin/object-types#regiontranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CountryList

{{% gql-fields %}}
 * items: [[Country](/graphql-api/admin/object-types#country)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CouponCodeExpiredError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * couponCode: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CouponCodeInvalidError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * couponCode: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CouponCodeLimitError

Returned if the provided coupon code is invalid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * couponCode: [String](/graphql-api/admin/object-types#string)!
 * limit: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CreateAssetResult

{{% gql-fields %}}
union CreateAssetResult = [Asset](/graphql-api/admin/object-types#asset) | [MimeTypeError](/graphql-api/admin/object-types#mimetypeerror)
{{% /gql-fields %}}

## CreateChannelResult

{{% gql-fields %}}
union CreateChannelResult = [Channel](/graphql-api/admin/object-types#channel) | [LanguageNotAvailableError](/graphql-api/admin/object-types#languagenotavailableerror)
{{% /gql-fields %}}

## CreateCustomerResult

{{% gql-fields %}}
union CreateCustomerResult = [Customer](/graphql-api/admin/object-types#customer) | [EmailAddressConflictError](/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## CreateFulfillmentError

Returned if an error is thrown in a FulfillmentHandler's createFulfillment method

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * fulfillmentHandlerError: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## CreatePromotionResult

{{% gql-fields %}}
union CreatePromotionResult = [Promotion](/graphql-api/admin/object-types#promotion) | [MissingConditionsError](/graphql-api/admin/object-types#missingconditionserror)
{{% /gql-fields %}}

## CurrentUser

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * identifier: [String](/graphql-api/admin/object-types#string)!
 * channels: [[CurrentUserChannel](/graphql-api/admin/object-types#currentuserchannel)!]!
{{% /gql-fields %}}


## CurrentUserChannel

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * token: [String](/graphql-api/admin/object-types#string)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/graphql-api/admin/enums#permission)!]!
{{% /gql-fields %}}


## CustomFieldConfig

{{% gql-fields %}}
union CustomFieldConfig = [StringCustomFieldConfig](/graphql-api/admin/object-types#stringcustomfieldconfig) | [LocaleStringCustomFieldConfig](/graphql-api/admin/object-types#localestringcustomfieldconfig) | [IntCustomFieldConfig](/graphql-api/admin/object-types#intcustomfieldconfig) | [FloatCustomFieldConfig](/graphql-api/admin/object-types#floatcustomfieldconfig) | [BooleanCustomFieldConfig](/graphql-api/admin/object-types#booleancustomfieldconfig) | [DateTimeCustomFieldConfig](/graphql-api/admin/object-types#datetimecustomfieldconfig) | [RelationCustomFieldConfig](/graphql-api/admin/object-types#relationcustomfieldconfig) | [TextCustomFieldConfig](/graphql-api/admin/object-types#textcustomfieldconfig) | [LocaleTextCustomFieldConfig](/graphql-api/admin/object-types#localetextcustomfieldconfig)
{{% /gql-fields %}}

## CustomFields

{{% gql-fields %}}
 * Address: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Administrator: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Asset: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Channel: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Collection: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Customer: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * CustomerGroup: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Facet: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * FacetValue: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Fulfillment: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * GlobalSettings: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Order: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * OrderLine: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * PaymentMethod: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Product: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductOption: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductOptionGroup: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * ProductVariant: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Promotion: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Region: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Seller: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * ShippingMethod: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * StockLocation: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * TaxCategory: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * TaxRate: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * User: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
 * Zone: [[CustomFieldConfig](/graphql-api/admin/object-types#customfieldconfig)!]!
{{% /gql-fields %}}


## Customer

{{% gql-fields %}}
 * groups: [[CustomerGroup](/graphql-api/admin/object-types#customergroup)!]!
 * history(options: [HistoryEntryListOptions](/graphql-api/admin/input-types#historyentrylistoptions)): [HistoryEntryList](/graphql-api/admin/object-types#historyentrylist)!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * title: [String](/graphql-api/admin/object-types#string)
 * firstName: [String](/graphql-api/admin/object-types#string)!
 * lastName: [String](/graphql-api/admin/object-types#string)!
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * emailAddress: [String](/graphql-api/admin/object-types#string)!
 * addresses: [[Address](/graphql-api/admin/object-types#address)!]
 * orders(options: [OrderListOptions](/graphql-api/admin/input-types#orderlistoptions)): [OrderList](/graphql-api/admin/object-types#orderlist)!
 * user: [User](/graphql-api/admin/object-types#user)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerGroup

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * customers(options: [CustomerListOptions](/graphql-api/admin/input-types#customerlistoptions)): [CustomerList](/graphql-api/admin/object-types#customerlist)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## CustomerGroupList

{{% gql-fields %}}
 * items: [[CustomerGroup](/graphql-api/admin/object-types#customergroup)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## CustomerList

{{% gql-fields %}}
 * items: [[Customer](/graphql-api/admin/object-types#customer)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## DateTime

A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.

## DateTimeCustomFieldConfig

Expects the same validation formats as the `<input type="datetime-local">` HTML element.
See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#Additional_attributes

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * min: [String](/graphql-api/admin/object-types#string)
 * max: [String](/graphql-api/admin/object-types#string)
 * step: [Int](/graphql-api/admin/object-types#int)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## DeletionResponse

{{% gql-fields %}}
 * result: [DeletionResult](/graphql-api/admin/enums#deletionresult)!
 * message: [String](/graphql-api/admin/object-types#string)
{{% /gql-fields %}}


## Discount

{{% gql-fields %}}
 * adjustmentSource: [String](/graphql-api/admin/object-types#string)!
 * type: [AdjustmentType](/graphql-api/admin/enums#adjustmenttype)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * amount: [Money](/graphql-api/admin/object-types#money)!
 * amountWithTax: [Money](/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## EmailAddressConflictError

Returned when attempting to create a Customer with an email address already registered to an existing User.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## EmptyOrderLineSelectionError

Returned if no OrderLines have been specified for the operation

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Facet

{{% gql-fields %}}
 * isPrivate: [Boolean](/graphql-api/admin/object-types#boolean)!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * values: [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[FacetTranslation](/graphql-api/admin/object-types#facettranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetInUseError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * facetCode: [String](/graphql-api/admin/object-types#string)!
 * productCount: [Int](/graphql-api/admin/object-types#int)!
 * variantCount: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetList

{{% gql-fields %}}
 * items: [[Facet](/graphql-api/admin/object-types#facet)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## FacetValue

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * facet: [Facet](/graphql-api/admin/object-types#facet)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * translations: [[FacetValueTranslation](/graphql-api/admin/object-types#facetvaluetranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FacetValueList

{{% gql-fields %}}
 * items: [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetValueResult

Which FacetValues are present in the products returned
by the search, and in what quantity.

{{% gql-fields %}}
 * facetValue: [FacetValue](/graphql-api/admin/object-types#facetvalue)!
 * count: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## FacetValueTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## FloatCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * min: [Float](/graphql-api/admin/object-types#float)
 * max: [Float](/graphql-api/admin/object-types#float)
 * step: [Float](/graphql-api/admin/object-types#float)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Fulfillment

{{% gql-fields %}}
 * nextStates: [[String](/graphql-api/admin/object-types#string)!]!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * lines: [[FulfillmentLine](/graphql-api/admin/object-types#fulfillmentline)!]!
 * summary: [[FulfillmentLine](/graphql-api/admin/object-types#fulfillmentline)!]!
 * state: [String](/graphql-api/admin/object-types#string)!
 * method: [String](/graphql-api/admin/object-types#string)!
 * trackingCode: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## FulfillmentLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
 * fulfillment: [Fulfillment](/graphql-api/admin/object-types#fulfillment)!
 * fulfillmentId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## FulfillmentStateTransitionError

Returned when there is an error in transitioning the Fulfillment state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * transitionError: [String](/graphql-api/admin/object-types#string)!
 * fromState: [String](/graphql-api/admin/object-types#string)!
 * toState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## GlobalSettings

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * availableLanguages: [[LanguageCode](/graphql-api/admin/enums#languagecode)!]!
 * trackInventory: [Boolean](/graphql-api/admin/object-types#boolean)!
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)!
 * serverConfig: [ServerConfig](/graphql-api/admin/object-types#serverconfig)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## GuestCheckoutError

Returned when attempting to set the Customer on a guest checkout when the configured GuestCheckoutStrategy does not allow it.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * errorDetail: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## HistoryEntry

{{% gql-fields %}}
 * isPublic: [Boolean](/graphql-api/admin/object-types#boolean)!
 * administrator: [Administrator](/graphql-api/admin/object-types#administrator)
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * type: [HistoryEntryType](/graphql-api/admin/enums#historyentrytype)!
 * data: [JSON](/graphql-api/admin/object-types#json)!
{{% /gql-fields %}}


## HistoryEntryList

{{% gql-fields %}}
 * items: [[HistoryEntry](/graphql-api/admin/object-types#historyentry)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ID

The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `"4"`) or integer (such as `4`) input value will be accepted as an ID.

## ImportInfo

{{% gql-fields %}}
 * errors: [[String](/graphql-api/admin/object-types#string)!]
 * processed: [Int](/graphql-api/admin/object-types#int)!
 * imported: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## IneligibleShippingMethodError

Returned when attempting to set a ShippingMethod for which the Order is not eligible

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## InsufficientStockError

Returned when attempting to add more items to the Order than are available

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * quantityAvailable: [Int](/graphql-api/admin/object-types#int)!
 * order: [Order](/graphql-api/admin/object-types#order)!
{{% /gql-fields %}}


## InsufficientStockOnHandError

Returned if attempting to create a Fulfillment when there is insufficient
stockOnHand of a ProductVariant to satisfy the requested quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * productVariantId: [ID](/graphql-api/admin/object-types#id)!
 * productVariantName: [String](/graphql-api/admin/object-types#string)!
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.

## IntCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * min: [Int](/graphql-api/admin/object-types#int)
 * max: [Int](/graphql-api/admin/object-types#int)
 * step: [Int](/graphql-api/admin/object-types#int)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## InvalidCredentialsError

Returned if the user authentication credentials are not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * authenticationError: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## InvalidFulfillmentHandlerError

Returned if the specified FulfillmentHandler code is not valid

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ItemsAlreadyFulfilledError

Returned if the specified items are already part of a Fulfillment

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## JSON

The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).

## Job

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * startedAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * settledAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * queueName: [String](/graphql-api/admin/object-types#string)!
 * state: [JobState](/graphql-api/admin/enums#jobstate)!
 * progress: [Float](/graphql-api/admin/object-types#float)!
 * data: [JSON](/graphql-api/admin/object-types#json)
 * result: [JSON](/graphql-api/admin/object-types#json)
 * error: [JSON](/graphql-api/admin/object-types#json)
 * isSettled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * duration: [Int](/graphql-api/admin/object-types#int)!
 * retries: [Int](/graphql-api/admin/object-types#int)!
 * attempts: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobBufferSize

{{% gql-fields %}}
 * bufferId: [String](/graphql-api/admin/object-types#string)!
 * size: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobList

{{% gql-fields %}}
 * items: [[Job](/graphql-api/admin/object-types#job)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## JobQueue

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * running: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## LanguageNotAvailableError

Returned if attempting to set a Channel's defaultLanguageCode to a language which is not enabled in GlobalSettings

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * languageCode: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## LocaleStringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * length: [Int](/graphql-api/admin/object-types#int)
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * pattern: [String](/graphql-api/admin/object-types#string)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## LocaleTextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## LocalizedString

{{% gql-fields %}}
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * value: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ManualPaymentStateError

Returned when a call to addManualPaymentToOrder is made but the Order
is not in the required state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## MetricSummary

{{% gql-fields %}}
 * interval: [MetricInterval](/graphql-api/admin/enums#metricinterval)!
 * type: [MetricType](/graphql-api/admin/enums#metrictype)!
 * title: [String](/graphql-api/admin/object-types#string)!
 * entries: [[MetricSummaryEntry](/graphql-api/admin/object-types#metricsummaryentry)!]!
{{% /gql-fields %}}


## MetricSummaryEntry

{{% gql-fields %}}
 * label: [String](/graphql-api/admin/object-types#string)!
 * value: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## MimeTypeError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * fileName: [String](/graphql-api/admin/object-types#string)!
 * mimeType: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## MissingConditionsError

Returned if a PromotionCondition has neither a couponCode nor any conditions set

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ModifyOrderResult

{{% gql-fields %}}
union ModifyOrderResult = [Order](/graphql-api/admin/object-types#order) | [NoChangesSpecifiedError](/graphql-api/admin/object-types#nochangesspecifiederror) | [OrderModificationStateError](/graphql-api/admin/object-types#ordermodificationstateerror) | [PaymentMethodMissingError](/graphql-api/admin/object-types#paymentmethodmissingerror) | [RefundPaymentIdMissingError](/graphql-api/admin/object-types#refundpaymentidmissingerror) | [OrderLimitError](/graphql-api/admin/object-types#orderlimiterror) | [NegativeQuantityError](/graphql-api/admin/object-types#negativequantityerror) | [InsufficientStockError](/graphql-api/admin/object-types#insufficientstockerror) | [CouponCodeExpiredError](/graphql-api/admin/object-types#couponcodeexpirederror) | [CouponCodeInvalidError](/graphql-api/admin/object-types#couponcodeinvaliderror) | [CouponCodeLimitError](/graphql-api/admin/object-types#couponcodelimiterror)
{{% /gql-fields %}}

## Money

The `Money` scalar type represents monetary values and supports signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).

## MultipleOrderError

Returned if an operation has specified OrderLines from multiple Orders

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NativeAuthStrategyError

Returned when attempting an operation that relies on the NativeAuthStrategy, if that strategy is not configured.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NativeAuthenticationResult

{{% gql-fields %}}
union NativeAuthenticationResult = [CurrentUser](/graphql-api/admin/object-types#currentuser) | [InvalidCredentialsError](/graphql-api/admin/object-types#invalidcredentialserror) | [NativeAuthStrategyError](/graphql-api/admin/object-types#nativeauthstrategyerror)
{{% /gql-fields %}}

## NegativeQuantityError

Returned when attempting to set a negative OrderLine quantity.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NoActiveOrderError

Returned when invoking a mutation which depends on there being an active Order on the
current session.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NoChangesSpecifiedError

Returned when a call to modifyOrder fails to specify any changes

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## NothingToRefundError

Returned if an attempting to refund an Order but neither items nor shipping refund was specified

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Order

{{% gql-fields %}}
 * nextStates: [[String](/graphql-api/admin/object-types#string)!]!
 * modifications: [[OrderModification](/graphql-api/admin/object-types#ordermodification)!]!
 * sellerOrders: [[Order](/graphql-api/admin/object-types#order)!]
 * aggregateOrder: [Order](/graphql-api/admin/object-types#order)
 * aggregateOrderId: [ID](/graphql-api/admin/object-types#id)
 * channels: [[Channel](/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * type: [OrderType](/graphql-api/admin/enums#ordertype)!
* *// The date & time that the Order was placed, i.e. the Customer
completed the checkout and the Order is no longer "active"*
 * orderPlacedAt: [DateTime](/graphql-api/admin/object-types#datetime)
* *// A unique code for the Order*
 * code: [String](/graphql-api/admin/object-types#string)!
 * state: [String](/graphql-api/admin/object-types#string)!
* *// An order is active as long as the payment process has not been completed*
 * active: [Boolean](/graphql-api/admin/object-types#boolean)!
 * customer: [Customer](/graphql-api/admin/object-types#customer)
 * shippingAddress: [OrderAddress](/graphql-api/admin/object-types#orderaddress)
 * billingAddress: [OrderAddress](/graphql-api/admin/object-types#orderaddress)
 * lines: [[OrderLine](/graphql-api/admin/object-types#orderline)!]!
* *// Surcharges are arbitrary modifications to the Order total which are neither
ProductVariants nor discounts resulting from applied Promotions. For example,
one-off discounts based on customer interaction, or surcharges based on payment
methods.*
 * surcharges: [[Surcharge](/graphql-api/admin/object-types#surcharge)!]!
 * discounts: [[Discount](/graphql-api/admin/object-types#discount)!]!
* *// An array of all coupon codes applied to the Order*
 * couponCodes: [[String](/graphql-api/admin/object-types#string)!]!
* *// Promotions applied to the order. Only gets populated after the payment process has completed.*
 * promotions: [[Promotion](/graphql-api/admin/object-types#promotion)!]!
 * payments: [[Payment](/graphql-api/admin/object-types#payment)!]
 * fulfillments: [[Fulfillment](/graphql-api/admin/object-types#fulfillment)!]
 * totalQuantity: [Int](/graphql-api/admin/object-types#int)!
* *// The subTotal is the total of all OrderLines in the Order. This figure also includes any Order-level
discounts which have been prorated (proportionally distributed) amongst the items of each OrderLine.
To get a total of all OrderLines which does not account for prorated discounts, use the
sum of `OrderLine.discountedLinePrice` values.*
 * subTotal: [Money](/graphql-api/admin/object-types#money)!
* *// Same as subTotal, but inclusive of tax*
 * subTotalWithTax: [Money](/graphql-api/admin/object-types#money)!
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * shippingLines: [[ShippingLine](/graphql-api/admin/object-types#shippingline)!]!
 * shipping: [Money](/graphql-api/admin/object-types#money)!
 * shippingWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// Equal to subTotal plus shipping*
 * total: [Money](/graphql-api/admin/object-types#money)!
* *// The final payable amount. Equal to subTotalWithTax plus shippingWithTax*
 * totalWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// A summary of the taxes being applied to this Order*
 * taxSummary: [[OrderTaxSummary](/graphql-api/admin/object-types#ordertaxsummary)!]!
 * history(options: [HistoryEntryListOptions](/graphql-api/admin/input-types#historyentrylistoptions)): [HistoryEntryList](/graphql-api/admin/object-types#historyentrylist)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderAddress

{{% gql-fields %}}
 * fullName: [String](/graphql-api/admin/object-types#string)
 * company: [String](/graphql-api/admin/object-types#string)
 * streetLine1: [String](/graphql-api/admin/object-types#string)
 * streetLine2: [String](/graphql-api/admin/object-types#string)
 * city: [String](/graphql-api/admin/object-types#string)
 * province: [String](/graphql-api/admin/object-types#string)
 * postalCode: [String](/graphql-api/admin/object-types#string)
 * country: [String](/graphql-api/admin/object-types#string)
 * countryCode: [String](/graphql-api/admin/object-types#string)
 * phoneNumber: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderLimitError

Returned when the maximum order size limit has been reached.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * maxItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderLine

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * featuredAsset: [Asset](/graphql-api/admin/object-types#asset)
* *// The price of a single unit, excluding tax and discounts*
 * unitPrice: [Money](/graphql-api/admin/object-types#money)!
* *// The price of a single unit, including tax but excluding discounts*
 * unitPriceWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// Non-zero if the unitPrice has changed since it was initially added to Order*
 * unitPriceChangeSinceAdded: [Money](/graphql-api/admin/object-types#money)!
* *// Non-zero if the unitPriceWithTax has changed since it was initially added to Order*
 * unitPriceWithTaxChangeSinceAdded: [Money](/graphql-api/admin/object-types#money)!
* *// The price of a single unit including discounts, excluding tax.

If Order-level discounts have been applied, this will not be the
actual taxable unit price (see `proratedUnitPrice`), but is generally the
correct price to display to customers to avoid confusion
about the internal handling of distributed Order-level discounts.*
 * discountedUnitPrice: [Money](/graphql-api/admin/object-types#money)!
* *// The price of a single unit including discounts and tax*
 * discountedUnitPriceWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// The actual unit price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderItem, and is used in tax
and refund calculations.*
 * proratedUnitPrice: [Money](/graphql-api/admin/object-types#money)!
* *// The proratedUnitPrice including tax*
 * proratedUnitPriceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
* *// The quantity at the time the Order was placed*
 * orderPlacedQuantity: [Int](/graphql-api/admin/object-types#int)!
 * taxRate: [Float](/graphql-api/admin/object-types#float)!
* *// The total price of the line excluding tax and discounts.*
 * linePrice: [Money](/graphql-api/admin/object-types#money)!
* *// The total price of the line including tax but excluding discounts.*
 * linePriceWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// The price of the line including discounts, excluding tax*
 * discountedLinePrice: [Money](/graphql-api/admin/object-types#money)!
* *// The price of the line including discounts and tax*
 * discountedLinePriceWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// The actual line price, taking into account both item discounts _and_ prorated (proportionally-distributed)
Order-level discounts. This value is the true economic value of the OrderLine, and is used in tax
and refund calculations.*
 * proratedLinePrice: [Money](/graphql-api/admin/object-types#money)!
* *// The proratedLinePrice including tax*
 * proratedLinePriceWithTax: [Money](/graphql-api/admin/object-types#money)!
* *// The total tax on this line*
 * lineTax: [Money](/graphql-api/admin/object-types#money)!
 * discounts: [[Discount](/graphql-api/admin/object-types#discount)!]!
 * taxLines: [[TaxLine](/graphql-api/admin/object-types#taxline)!]!
 * order: [Order](/graphql-api/admin/object-types#order)!
 * fulfillmentLines: [[FulfillmentLine](/graphql-api/admin/object-types#fulfillmentline)!]
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## OrderList

{{% gql-fields %}}
 * items: [[Order](/graphql-api/admin/object-types#order)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## OrderModification

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * priceChange: [Money](/graphql-api/admin/object-types#money)!
 * note: [String](/graphql-api/admin/object-types#string)!
 * lines: [[OrderModificationLine](/graphql-api/admin/object-types#ordermodificationline)!]!
 * surcharges: [[Surcharge](/graphql-api/admin/object-types#surcharge)!]
 * payment: [Payment](/graphql-api/admin/object-types#payment)
 * refund: [Refund](/graphql-api/admin/object-types#refund)
 * isSettled: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## OrderModificationError

Returned when attempting to modify the contents of an Order that is not in the `AddingItems` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderModificationLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
 * modification: [OrderModification](/graphql-api/admin/object-types#ordermodification)!
 * modificationId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## OrderModificationStateError

Returned when attempting to modify the contents of an Order that is not in the `Modifying` state.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderProcessState

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * to: [[String](/graphql-api/admin/object-types#string)!]!
{{% /gql-fields %}}


## OrderStateTransitionError

Returned if there is an error in transitioning the Order state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * transitionError: [String](/graphql-api/admin/object-types#string)!
 * fromState: [String](/graphql-api/admin/object-types#string)!
 * toState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## OrderTaxSummary

A summary of the taxes being applied to this order, grouped
by taxRate.

{{% gql-fields %}}
* *// A description of this tax*
 * description: [String](/graphql-api/admin/object-types#string)!
* *// The taxRate as a percentage*
 * taxRate: [Float](/graphql-api/admin/object-types#float)!
* *// The total net price of OrderLines to which this taxRate applies*
 * taxBase: [Money](/graphql-api/admin/object-types#money)!
* *// The total tax being applied to the Order at this taxRate*
 * taxTotal: [Money](/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## Payment

{{% gql-fields %}}
 * nextStates: [[String](/graphql-api/admin/object-types#string)!]!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * method: [String](/graphql-api/admin/object-types#string)!
 * amount: [Money](/graphql-api/admin/object-types#money)!
 * state: [String](/graphql-api/admin/object-types#string)!
 * transactionId: [String](/graphql-api/admin/object-types#string)
 * errorMessage: [String](/graphql-api/admin/object-types#string)
 * refunds: [[Refund](/graphql-api/admin/object-types#refund)!]!
 * metadata: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * checker: [ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)
 * handler: [ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!
 * translations: [[PaymentMethodTranslation](/graphql-api/admin/object-types#paymentmethodtranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethodList

{{% gql-fields %}}
 * items: [[PaymentMethod](/graphql-api/admin/object-types#paymentmethod)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## PaymentMethodMissingError

Returned when a call to modifyOrder fails to include a paymentMethod even
though the price has increased as a result of the changes.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentMethodQuote

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * isEligible: [Boolean](/graphql-api/admin/object-types#boolean)!
 * eligibilityMessage: [String](/graphql-api/admin/object-types#string)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PaymentMethodTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentOrderMismatchError

Returned if an attempting to refund a Payment against OrderLines from a different Order

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PaymentStateTransitionError

Returned when there is an error in transitioning the Payment state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * transitionError: [String](/graphql-api/admin/object-types#string)!
 * fromState: [String](/graphql-api/admin/object-types#string)!
 * toState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## PermissionDefinition

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * assignable: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## PriceRange

The price range where the result has more than one price

{{% gql-fields %}}
 * min: [Money](/graphql-api/admin/object-types#money)!
 * max: [Money](/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## Product

{{% gql-fields %}}
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * channels: [[Channel](/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/graphql-api/admin/object-types#asset)!]!
* *// Returns all ProductVariants*
 * variants: [[ProductVariant](/graphql-api/admin/object-types#productvariant)!]!
* *// Returns a paginated, sortable, filterable list of ProductVariants*
 * variantList(options: [ProductVariantListOptions](/graphql-api/admin/input-types#productvariantlistoptions)): [ProductVariantList](/graphql-api/admin/object-types#productvariantlist)!
 * optionGroups: [[ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)!]!
 * facetValues: [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[ProductTranslation](/graphql-api/admin/object-types#producttranslation)!]!
 * collections: [[Collection](/graphql-api/admin/object-types#collection)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductList

{{% gql-fields %}}
 * items: [[Product](/graphql-api/admin/object-types#product)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductOption

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * groupId: [ID](/graphql-api/admin/object-types#id)!
 * group: [ProductOptionGroup](/graphql-api/admin/object-types#productoptiongroup)!
 * translations: [[ProductOptionTranslation](/graphql-api/admin/object-types#productoptiontranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroup

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * options: [[ProductOption](/graphql-api/admin/object-types#productoption)!]!
 * translations: [[ProductOptionGroupTranslation](/graphql-api/admin/object-types#productoptiongrouptranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductOptionGroupTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductOptionInUseError

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * optionGroupCode: [String](/graphql-api/admin/object-types#string)!
 * productVariantCount: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductOptionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## ProductVariant

{{% gql-fields %}}
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * trackInventory: [GlobalFlag](/graphql-api/admin/enums#globalflag)!
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)!
 * stockAllocated: [Int](/graphql-api/admin/object-types#int)!
 * outOfStockThreshold: [Int](/graphql-api/admin/object-types#int)!
 * useGlobalOutOfStockThreshold: [Boolean](/graphql-api/admin/object-types#boolean)!
 * prices: [[ProductVariantPrice](/graphql-api/admin/object-types#productvariantprice)!]!
 * stockLevels: [[StockLevel](/graphql-api/admin/object-types#stocklevel)!]!
 * stockMovements(options: [StockMovementListOptions](/graphql-api/admin/input-types#stockmovementlistoptions)): [StockMovementList](/graphql-api/admin/object-types#stockmovementlist)!
 * channels: [[Channel](/graphql-api/admin/object-types#channel)!]!
 * id: [ID](/graphql-api/admin/object-types#id)!
 * product: [Product](/graphql-api/admin/object-types#product)!
 * productId: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * sku: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * featuredAsset: [Asset](/graphql-api/admin/object-types#asset)
 * assets: [[Asset](/graphql-api/admin/object-types#asset)!]!
 * price: [Money](/graphql-api/admin/object-types#money)!
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * priceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * stockLevel: [String](/graphql-api/admin/object-types#string)!
 * taxRateApplied: [TaxRate](/graphql-api/admin/object-types#taxrate)!
 * taxCategory: [TaxCategory](/graphql-api/admin/object-types#taxcategory)!
 * options: [[ProductOption](/graphql-api/admin/object-types#productoption)!]!
 * facetValues: [[FacetValue](/graphql-api/admin/object-types#facetvalue)!]!
 * translations: [[ProductVariantTranslation](/graphql-api/admin/object-types#productvarianttranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProductVariantList

{{% gql-fields %}}
 * items: [[ProductVariant](/graphql-api/admin/object-types#productvariant)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductVariantPrice

{{% gql-fields %}}
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * price: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ProductVariantTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Promotion

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * startsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * endsAt: [DateTime](/graphql-api/admin/object-types#datetime)
 * couponCode: [String](/graphql-api/admin/object-types#string)
 * perCustomerUsageLimit: [Int](/graphql-api/admin/object-types#int)
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * conditions: [[ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!]!
 * actions: [[ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!]!
 * translations: [[PromotionTranslation](/graphql-api/admin/object-types#promotiontranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## PromotionList

{{% gql-fields %}}
 * items: [[Promotion](/graphql-api/admin/object-types#promotion)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## PromotionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Province

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * parent: [Region](/graphql-api/admin/object-types#region)
 * parentId: [ID](/graphql-api/admin/object-types#id)
 * translations: [[RegionTranslation](/graphql-api/admin/object-types#regiontranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ProvinceList

{{% gql-fields %}}
 * items: [[Province](/graphql-api/admin/object-types#province)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## QuantityTooGreatError

Returned if the specified quantity of an OrderLine is greater than the number of items in that line

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## Refund

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * items: [Money](/graphql-api/admin/object-types#money)!
 * shipping: [Money](/graphql-api/admin/object-types#money)!
 * adjustment: [Money](/graphql-api/admin/object-types#money)!
 * total: [Money](/graphql-api/admin/object-types#money)!
 * method: [String](/graphql-api/admin/object-types#string)
 * state: [String](/graphql-api/admin/object-types#string)!
 * transactionId: [String](/graphql-api/admin/object-types#string)
 * reason: [String](/graphql-api/admin/object-types#string)
 * lines: [[RefundLine](/graphql-api/admin/object-types#refundline)!]!
 * paymentId: [ID](/graphql-api/admin/object-types#id)!
 * metadata: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## RefundLine

{{% gql-fields %}}
 * orderLine: [OrderLine](/graphql-api/admin/object-types#orderline)!
 * orderLineId: [ID](/graphql-api/admin/object-types#id)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
 * refund: [Refund](/graphql-api/admin/object-types#refund)!
 * refundId: [ID](/graphql-api/admin/object-types#id)!
{{% /gql-fields %}}


## RefundOrderResult

{{% gql-fields %}}
union RefundOrderResult = [Refund](/graphql-api/admin/object-types#refund) | [QuantityTooGreatError](/graphql-api/admin/object-types#quantitytoogreaterror) | [NothingToRefundError](/graphql-api/admin/object-types#nothingtorefunderror) | [OrderStateTransitionError](/graphql-api/admin/object-types#orderstatetransitionerror) | [MultipleOrderError](/graphql-api/admin/object-types#multipleordererror) | [PaymentOrderMismatchError](/graphql-api/admin/object-types#paymentordermismatcherror) | [RefundOrderStateError](/graphql-api/admin/object-types#refundorderstateerror) | [AlreadyRefundedError](/graphql-api/admin/object-types#alreadyrefundederror) | [RefundStateTransitionError](/graphql-api/admin/object-types#refundstatetransitionerror)
{{% /gql-fields %}}

## RefundOrderStateError

Returned if an attempting to refund an Order which is not in the expected state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * orderState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RefundPaymentIdMissingError

Returned when a call to modifyOrder fails to include a refundPaymentId even
though the price has decreased as a result of the changes.

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RefundStateTransitionError

Returned when there is an error in transitioning the Refund state

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * transitionError: [String](/graphql-api/admin/object-types#string)!
 * fromState: [String](/graphql-api/admin/object-types#string)!
 * toState: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RegionTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## RelationCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * entity: [String](/graphql-api/admin/object-types#string)!
 * scalarFields: [[String](/graphql-api/admin/object-types#string)!]!
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Release

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## RemoveFacetFromChannelResult

{{% gql-fields %}}
union RemoveFacetFromChannelResult = [Facet](/graphql-api/admin/object-types#facet) | [FacetInUseError](/graphql-api/admin/object-types#facetinuseerror)
{{% /gql-fields %}}

## RemoveOptionGroupFromProductResult

{{% gql-fields %}}
union RemoveOptionGroupFromProductResult = [Product](/graphql-api/admin/object-types#product) | [ProductOptionInUseError](/graphql-api/admin/object-types#productoptioninuseerror)
{{% /gql-fields %}}

## RemoveOrderItemsResult

{{% gql-fields %}}
union RemoveOrderItemsResult = [Order](/graphql-api/admin/object-types#order) | [OrderModificationError](/graphql-api/admin/object-types#ordermodificationerror)
{{% /gql-fields %}}

## Return

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Role

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * permissions: [[Permission](/graphql-api/admin/enums#permission)!]!
 * channels: [[Channel](/graphql-api/admin/object-types#channel)!]!
{{% /gql-fields %}}


## RoleList

{{% gql-fields %}}
 * items: [[Role](/graphql-api/admin/object-types#role)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## Sale

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## SearchReindexResponse

{{% gql-fields %}}
 * success: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## SearchResponse

{{% gql-fields %}}
 * items: [[SearchResult](/graphql-api/admin/object-types#searchresult)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
 * facetValues: [[FacetValueResult](/graphql-api/admin/object-types#facetvalueresult)!]!
 * collections: [[CollectionResult](/graphql-api/admin/object-types#collectionresult)!]!
{{% /gql-fields %}}


## SearchResult

{{% gql-fields %}}
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
* *// An array of ids of the Channels in which this result appears*
 * channelIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * sku: [String](/graphql-api/admin/object-types#string)!
 * slug: [String](/graphql-api/admin/object-types#string)!
 * productId: [ID](/graphql-api/admin/object-types#id)!
 * productName: [String](/graphql-api/admin/object-types#string)!
 * productAsset: [SearchResultAsset](/graphql-api/admin/object-types#searchresultasset)
 * productVariantId: [ID](/graphql-api/admin/object-types#id)!
 * productVariantName: [String](/graphql-api/admin/object-types#string)!
 * productVariantAsset: [SearchResultAsset](/graphql-api/admin/object-types#searchresultasset)
 * price: [SearchResultPrice](/graphql-api/admin/object-types#searchresultprice)!
 * priceWithTax: [SearchResultPrice](/graphql-api/admin/object-types#searchresultprice)!
 * currencyCode: [CurrencyCode](/graphql-api/admin/enums#currencycode)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * facetIds: [[ID](/graphql-api/admin/object-types#id)!]!
 * facetValueIds: [[ID](/graphql-api/admin/object-types#id)!]!
* *// An array of ids of the Collections in which this result appears*
 * collectionIds: [[ID](/graphql-api/admin/object-types#id)!]!
* *// A relevance score for the result. Differs between database implementations*
 * score: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## SearchResultAsset

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * preview: [String](/graphql-api/admin/object-types#string)!
 * focalPoint: [Coordinate](/graphql-api/admin/object-types#coordinate)
{{% /gql-fields %}}


## SearchResultPrice

The price of a search result product, either as a range or as a single price

{{% gql-fields %}}
union SearchResultPrice = [PriceRange](/graphql-api/admin/object-types#pricerange) | [SinglePrice](/graphql-api/admin/object-types#singleprice)
{{% /gql-fields %}}

## Seller

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## SellerList

{{% gql-fields %}}
 * items: [[Seller](/graphql-api/admin/object-types#seller)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ServerConfig

{{% gql-fields %}}
 * orderProcess: [[OrderProcessState](/graphql-api/admin/object-types#orderprocessstate)!]!
 * permittedAssetTypes: [[String](/graphql-api/admin/object-types#string)!]!
 * permissions: [[PermissionDefinition](/graphql-api/admin/object-types#permissiondefinition)!]!
 * customFieldConfig: [CustomFields](/graphql-api/admin/object-types#customfields)!
{{% /gql-fields %}}


## SetCustomerForDraftOrderResult

{{% gql-fields %}}
union SetCustomerForDraftOrderResult = [Order](/graphql-api/admin/object-types#order) | [EmailAddressConflictError](/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## SetOrderShippingMethodResult

{{% gql-fields %}}
union SetOrderShippingMethodResult = [Order](/graphql-api/admin/object-types#order) | [OrderModificationError](/graphql-api/admin/object-types#ordermodificationerror) | [IneligibleShippingMethodError](/graphql-api/admin/object-types#ineligibleshippingmethoderror) | [NoActiveOrderError](/graphql-api/admin/object-types#noactiveordererror)
{{% /gql-fields %}}

## SettlePaymentError

Returned if the Payment settlement fails

{{% gql-fields %}}
 * errorCode: [ErrorCode](/graphql-api/admin/enums#errorcode)!
 * message: [String](/graphql-api/admin/object-types#string)!
 * paymentErrorMessage: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## SettlePaymentResult

{{% gql-fields %}}
union SettlePaymentResult = [Payment](/graphql-api/admin/object-types#payment) | [SettlePaymentError](/graphql-api/admin/object-types#settlepaymenterror) | [PaymentStateTransitionError](/graphql-api/admin/object-types#paymentstatetransitionerror) | [OrderStateTransitionError](/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## SettleRefundResult

{{% gql-fields %}}
union SettleRefundResult = [Refund](/graphql-api/admin/object-types#refund) | [RefundStateTransitionError](/graphql-api/admin/object-types#refundstatetransitionerror)
{{% /gql-fields %}}

## ShippingLine

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * shippingMethod: [ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!
 * price: [Money](/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * discountedPrice: [Money](/graphql-api/admin/object-types#money)!
 * discountedPriceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * discounts: [[Discount](/graphql-api/admin/object-types#discount)!]!
{{% /gql-fields %}}


## ShippingMethod

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * fulfillmentHandlerCode: [String](/graphql-api/admin/object-types#string)!
 * checker: [ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!
 * calculator: [ConfigurableOperation](/graphql-api/admin/object-types#configurableoperation)!
 * translations: [[ShippingMethodTranslation](/graphql-api/admin/object-types#shippingmethodtranslation)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ShippingMethodList

{{% gql-fields %}}
 * items: [[ShippingMethod](/graphql-api/admin/object-types#shippingmethod)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## ShippingMethodQuote

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * price: [Money](/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * code: [String](/graphql-api/admin/object-types#string)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
* *// Any optional metadata returned by the ShippingCalculator in the ShippingCalculationResult*
 * metadata: [JSON](/graphql-api/admin/object-types#json)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ShippingMethodTranslation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * languageCode: [LanguageCode](/graphql-api/admin/enums#languagecode)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## SinglePrice

The price value where the result has a single price

{{% gql-fields %}}
 * value: [Money](/graphql-api/admin/object-types#money)!
{{% /gql-fields %}}


## StockAdjustment

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * productVariant: [ProductVariant](/graphql-api/admin/object-types#productvariant)!
 * type: [StockMovementType](/graphql-api/admin/enums#stockmovementtype)!
 * quantity: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockLevel

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * stockLocationId: [ID](/graphql-api/admin/object-types#id)!
 * stockOnHand: [Int](/graphql-api/admin/object-types#int)!
 * stockAllocated: [Int](/graphql-api/admin/object-types#int)!
 * stockLocation: [StockLocation](/graphql-api/admin/object-types#stocklocation)!
{{% /gql-fields %}}


## StockLocation

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StockLocationList

{{% gql-fields %}}
 * items: [[StockLocation](/graphql-api/admin/object-types#stocklocation)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## StockMovementItem

{{% gql-fields %}}
union StockMovementItem = [StockAdjustment](/graphql-api/admin/object-types#stockadjustment) | [Allocation](/graphql-api/admin/object-types#allocation) | [Sale](/graphql-api/admin/object-types#sale) | [Cancellation](/graphql-api/admin/object-types#cancellation) | [Return](/graphql-api/admin/object-types#return) | [Release](/graphql-api/admin/object-types#release)
{{% /gql-fields %}}

## StockMovementList

{{% gql-fields %}}
 * items: [[StockMovementItem](/graphql-api/admin/object-types#stockmovementitem)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

## StringCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * length: [Int](/graphql-api/admin/object-types#int)
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * pattern: [String](/graphql-api/admin/object-types#string)
 * options: [[StringFieldOption](/graphql-api/admin/object-types#stringfieldoption)!]
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## StringFieldOption

{{% gql-fields %}}
 * value: [String](/graphql-api/admin/object-types#string)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
{{% /gql-fields %}}


## Success

Indicates that an operation succeeded, where we do not want to return any more specific information.

{{% gql-fields %}}
 * success: [Boolean](/graphql-api/admin/object-types#boolean)!
{{% /gql-fields %}}


## Surcharge

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * description: [String](/graphql-api/admin/object-types#string)!
 * sku: [String](/graphql-api/admin/object-types#string)
 * taxLines: [[TaxLine](/graphql-api/admin/object-types#taxline)!]!
 * price: [Money](/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * taxRate: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## Tag

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * value: [String](/graphql-api/admin/object-types#string)!
{{% /gql-fields %}}


## TagList

{{% gql-fields %}}
 * items: [[Tag](/graphql-api/admin/object-types#tag)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TaxCategory

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * isDefault: [Boolean](/graphql-api/admin/object-types#boolean)!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TaxCategoryList

{{% gql-fields %}}
 * items: [[TaxCategory](/graphql-api/admin/object-types#taxcategory)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TaxLine

{{% gql-fields %}}
 * description: [String](/graphql-api/admin/object-types#string)!
 * taxRate: [Float](/graphql-api/admin/object-types#float)!
{{% /gql-fields %}}


## TaxRate

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * enabled: [Boolean](/graphql-api/admin/object-types#boolean)!
 * value: [Float](/graphql-api/admin/object-types#float)!
 * category: [TaxCategory](/graphql-api/admin/object-types#taxcategory)!
 * zone: [Zone](/graphql-api/admin/object-types#zone)!
 * customerGroup: [CustomerGroup](/graphql-api/admin/object-types#customergroup)
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TaxRateList

{{% gql-fields %}}
 * items: [[TaxRate](/graphql-api/admin/object-types#taxrate)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


## TestShippingMethodQuote

{{% gql-fields %}}
 * price: [Money](/graphql-api/admin/object-types#money)!
 * priceWithTax: [Money](/graphql-api/admin/object-types#money)!
 * metadata: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TestShippingMethodResult

{{% gql-fields %}}
 * eligible: [Boolean](/graphql-api/admin/object-types#boolean)!
 * quote: [TestShippingMethodQuote](/graphql-api/admin/object-types#testshippingmethodquote)
{{% /gql-fields %}}


## TextCustomFieldConfig

{{% gql-fields %}}
 * name: [String](/graphql-api/admin/object-types#string)!
 * type: [String](/graphql-api/admin/object-types#string)!
 * list: [Boolean](/graphql-api/admin/object-types#boolean)!
 * label: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * description: [[LocalizedString](/graphql-api/admin/object-types#localizedstring)!]
 * readonly: [Boolean](/graphql-api/admin/object-types#boolean)
 * internal: [Boolean](/graphql-api/admin/object-types#boolean)
 * nullable: [Boolean](/graphql-api/admin/object-types#boolean)
 * ui: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## TransitionFulfillmentToStateResult

{{% gql-fields %}}
union TransitionFulfillmentToStateResult = [Fulfillment](/graphql-api/admin/object-types#fulfillment) | [FulfillmentStateTransitionError](/graphql-api/admin/object-types#fulfillmentstatetransitionerror)
{{% /gql-fields %}}

## TransitionOrderToStateResult

{{% gql-fields %}}
union TransitionOrderToStateResult = [Order](/graphql-api/admin/object-types#order) | [OrderStateTransitionError](/graphql-api/admin/object-types#orderstatetransitionerror)
{{% /gql-fields %}}

## TransitionPaymentToStateResult

{{% gql-fields %}}
union TransitionPaymentToStateResult = [Payment](/graphql-api/admin/object-types#payment) | [PaymentStateTransitionError](/graphql-api/admin/object-types#paymentstatetransitionerror)
{{% /gql-fields %}}

## UpdateChannelResult

{{% gql-fields %}}
union UpdateChannelResult = [Channel](/graphql-api/admin/object-types#channel) | [LanguageNotAvailableError](/graphql-api/admin/object-types#languagenotavailableerror)
{{% /gql-fields %}}

## UpdateCustomerResult

{{% gql-fields %}}
union UpdateCustomerResult = [Customer](/graphql-api/admin/object-types#customer) | [EmailAddressConflictError](/graphql-api/admin/object-types#emailaddressconflicterror)
{{% /gql-fields %}}

## UpdateGlobalSettingsResult

{{% gql-fields %}}
union UpdateGlobalSettingsResult = [GlobalSettings](/graphql-api/admin/object-types#globalsettings) | [ChannelDefaultLanguageError](/graphql-api/admin/object-types#channeldefaultlanguageerror)
{{% /gql-fields %}}

## UpdateOrderItemsResult

{{% gql-fields %}}
union UpdateOrderItemsResult = [Order](/graphql-api/admin/object-types#order) | [OrderModificationError](/graphql-api/admin/object-types#ordermodificationerror) | [OrderLimitError](/graphql-api/admin/object-types#orderlimiterror) | [NegativeQuantityError](/graphql-api/admin/object-types#negativequantityerror) | [InsufficientStockError](/graphql-api/admin/object-types#insufficientstockerror)
{{% /gql-fields %}}

## UpdatePromotionResult

{{% gql-fields %}}
union UpdatePromotionResult = [Promotion](/graphql-api/admin/object-types#promotion) | [MissingConditionsError](/graphql-api/admin/object-types#missingconditionserror)
{{% /gql-fields %}}

## Upload

The `Upload` scalar type represents a file upload.

## User

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * identifier: [String](/graphql-api/admin/object-types#string)!
 * verified: [Boolean](/graphql-api/admin/object-types#boolean)!
 * roles: [[Role](/graphql-api/admin/object-types#role)!]!
 * lastLogin: [DateTime](/graphql-api/admin/object-types#datetime)
 * authenticationMethods: [[AuthenticationMethod](/graphql-api/admin/object-types#authenticationmethod)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## Zone

{{% gql-fields %}}
 * id: [ID](/graphql-api/admin/object-types#id)!
 * createdAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * updatedAt: [DateTime](/graphql-api/admin/object-types#datetime)!
 * name: [String](/graphql-api/admin/object-types#string)!
 * members: [[Region](/graphql-api/admin/object-types#region)!]!
 * customFields: [JSON](/graphql-api/admin/object-types#json)
{{% /gql-fields %}}


## ZoneList

{{% gql-fields %}}
 * items: [[Zone](/graphql-api/admin/object-types#zone)!]!
 * totalItems: [Int](/graphql-api/admin/object-types#int)!
{{% /gql-fields %}}


