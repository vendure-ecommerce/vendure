/* eslint-disable */

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "AddFulfillmentToOrderResult": [
      "CreateFulfillmentError",
      "EmptyOrderLineSelectionError",
      "Fulfillment",
      "FulfillmentStateTransitionError",
      "InsufficientStockOnHandError",
      "InvalidFulfillmentHandlerError",
      "ItemsAlreadyFulfilledError"
    ],
    "AddManualPaymentToOrderResult": [
      "ManualPaymentStateError",
      "Order"
    ],
    "ApplyCouponCodeResult": [
      "CouponCodeExpiredError",
      "CouponCodeInvalidError",
      "CouponCodeLimitError",
      "Order"
    ],
    "AuthenticationResult": [
      "CurrentUser",
      "InvalidCredentialsError"
    ],
    "CancelOrderResult": [
      "CancelActiveOrderError",
      "EmptyOrderLineSelectionError",
      "MultipleOrderError",
      "Order",
      "OrderStateTransitionError",
      "QuantityTooGreatError"
    ],
    "CancelPaymentResult": [
      "CancelPaymentError",
      "Payment",
      "PaymentStateTransitionError"
    ],
    "CreateAssetResult": [
      "Asset",
      "MimeTypeError"
    ],
    "CreateChannelResult": [
      "Channel",
      "LanguageNotAvailableError"
    ],
    "CreateCustomerResult": [
      "Customer",
      "EmailAddressConflictError"
    ],
    "CreatePromotionResult": [
      "MissingConditionsError",
      "Promotion"
    ],
    "CustomField": [
      "BooleanCustomFieldConfig",
      "DateTimeCustomFieldConfig",
      "FloatCustomFieldConfig",
      "IntCustomFieldConfig",
      "LocaleStringCustomFieldConfig",
      "LocaleTextCustomFieldConfig",
      "RelationCustomFieldConfig",
      "StringCustomFieldConfig",
      "TextCustomFieldConfig"
    ],
    "CustomFieldConfig": [
      "BooleanCustomFieldConfig",
      "DateTimeCustomFieldConfig",
      "FloatCustomFieldConfig",
      "IntCustomFieldConfig",
      "LocaleStringCustomFieldConfig",
      "LocaleTextCustomFieldConfig",
      "RelationCustomFieldConfig",
      "StringCustomFieldConfig",
      "TextCustomFieldConfig"
    ],
    "DuplicateEntityResult": [
      "DuplicateEntityError",
      "DuplicateEntitySuccess"
    ],
    "ErrorResult": [
      "AlreadyRefundedError",
      "CancelActiveOrderError",
      "CancelPaymentError",
      "ChannelDefaultLanguageError",
      "CouponCodeExpiredError",
      "CouponCodeInvalidError",
      "CouponCodeLimitError",
      "CreateFulfillmentError",
      "DuplicateEntityError",
      "EmailAddressConflictError",
      "EmptyOrderLineSelectionError",
      "FacetInUseError",
      "FulfillmentStateTransitionError",
      "GuestCheckoutError",
      "IneligibleShippingMethodError",
      "InsufficientStockError",
      "InsufficientStockOnHandError",
      "InvalidCredentialsError",
      "InvalidFulfillmentHandlerError",
      "ItemsAlreadyFulfilledError",
      "LanguageNotAvailableError",
      "ManualPaymentStateError",
      "MimeTypeError",
      "MissingConditionsError",
      "MultipleOrderError",
      "NativeAuthStrategyError",
      "NegativeQuantityError",
      "NoActiveOrderError",
      "NoChangesSpecifiedError",
      "NothingToRefundError",
      "OrderLimitError",
      "OrderModificationError",
      "OrderModificationStateError",
      "OrderStateTransitionError",
      "PaymentMethodMissingError",
      "PaymentOrderMismatchError",
      "PaymentStateTransitionError",
      "ProductOptionInUseError",
      "QuantityTooGreatError",
      "RefundAmountError",
      "RefundOrderStateError",
      "RefundPaymentIdMissingError",
      "RefundStateTransitionError",
      "SettlePaymentError"
    ],
    "ModifyOrderResult": [
      "CouponCodeExpiredError",
      "CouponCodeInvalidError",
      "CouponCodeLimitError",
      "IneligibleShippingMethodError",
      "InsufficientStockError",
      "NegativeQuantityError",
      "NoChangesSpecifiedError",
      "Order",
      "OrderLimitError",
      "OrderModificationStateError",
      "PaymentMethodMissingError",
      "RefundPaymentIdMissingError"
    ],
    "NativeAuthenticationResult": [
      "CurrentUser",
      "InvalidCredentialsError",
      "NativeAuthStrategyError"
    ],
    "Node": [
      "Address",
      "Administrator",
      "Allocation",
      "Asset",
      "AuthenticationMethod",
      "Cancellation",
      "Channel",
      "Collection",
      "Country",
      "Customer",
      "CustomerGroup",
      "Facet",
      "FacetValue",
      "Fulfillment",
      "HistoryEntry",
      "Job",
      "Order",
      "OrderLine",
      "OrderModification",
      "Payment",
      "PaymentMethod",
      "Product",
      "ProductOption",
      "ProductOptionGroup",
      "ProductVariant",
      "Promotion",
      "Province",
      "Refund",
      "Release",
      "Return",
      "Role",
      "Sale",
      "Seller",
      "ShippingMethod",
      "StockAdjustment",
      "StockLevel",
      "StockLocation",
      "Surcharge",
      "Tag",
      "TaxCategory",
      "TaxRate",
      "User",
      "Zone"
    ],
    "PaginatedList": [
      "AdministratorList",
      "AssetList",
      "ChannelList",
      "CollectionList",
      "CountryList",
      "CustomerGroupList",
      "CustomerList",
      "FacetList",
      "FacetValueList",
      "HistoryEntryList",
      "JobList",
      "OrderList",
      "PaymentMethodList",
      "ProductList",
      "ProductVariantList",
      "PromotionList",
      "ProvinceList",
      "RoleList",
      "SellerList",
      "ShippingMethodList",
      "StockLocationList",
      "TagList",
      "TaxCategoryList",
      "TaxRateList",
      "ZoneList"
    ],
    "RefundOrderResult": [
      "AlreadyRefundedError",
      "MultipleOrderError",
      "NothingToRefundError",
      "OrderStateTransitionError",
      "PaymentOrderMismatchError",
      "QuantityTooGreatError",
      "Refund",
      "RefundAmountError",
      "RefundOrderStateError",
      "RefundStateTransitionError"
    ],
    "Region": [
      "Country",
      "Province"
    ],
    "RemoveFacetFromChannelResult": [
      "Facet",
      "FacetInUseError"
    ],
    "RemoveOptionGroupFromProductResult": [
      "Product",
      "ProductOptionInUseError"
    ],
    "RemoveOrderItemsResult": [
      "Order",
      "OrderModificationError"
    ],
    "SearchResultPrice": [
      "PriceRange",
      "SinglePrice"
    ],
    "SetCustomerForDraftOrderResult": [
      "EmailAddressConflictError",
      "Order"
    ],
    "SetOrderShippingMethodResult": [
      "IneligibleShippingMethodError",
      "NoActiveOrderError",
      "Order",
      "OrderModificationError"
    ],
    "SettlePaymentResult": [
      "OrderStateTransitionError",
      "Payment",
      "PaymentStateTransitionError",
      "SettlePaymentError"
    ],
    "SettleRefundResult": [
      "Refund",
      "RefundStateTransitionError"
    ],
    "StockMovement": [
      "Allocation",
      "Cancellation",
      "Release",
      "Return",
      "Sale",
      "StockAdjustment"
    ],
    "StockMovementItem": [
      "Allocation",
      "Cancellation",
      "Release",
      "Return",
      "Sale",
      "StockAdjustment"
    ],
    "TransitionFulfillmentToStateResult": [
      "Fulfillment",
      "FulfillmentStateTransitionError"
    ],
    "TransitionOrderToStateResult": [
      "Order",
      "OrderStateTransitionError"
    ],
    "TransitionPaymentToStateResult": [
      "Payment",
      "PaymentStateTransitionError"
    ],
    "UpdateChannelResult": [
      "Channel",
      "LanguageNotAvailableError"
    ],
    "UpdateCustomerResult": [
      "Customer",
      "EmailAddressConflictError"
    ],
    "UpdateGlobalSettingsResult": [
      "ChannelDefaultLanguageError",
      "GlobalSettings"
    ],
    "UpdateOrderItemsResult": [
      "InsufficientStockError",
      "NegativeQuantityError",
      "Order",
      "OrderLimitError",
      "OrderModificationError"
    ],
    "UpdatePromotionResult": [
      "MissingConditionsError",
      "Promotion"
    ]
  }
};
      export default result;
    