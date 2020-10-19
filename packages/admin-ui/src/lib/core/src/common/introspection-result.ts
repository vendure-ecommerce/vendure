// tslint:disable

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "CreateAssetResult": [
      "Asset",
      "MimeTypeError"
    ],
    "NativeAuthenticationResult": [
      "CurrentUser",
      "InvalidCredentialsError",
      "NativeAuthStrategyError"
    ],
    "AuthenticationResult": [
      "CurrentUser",
      "InvalidCredentialsError"
    ],
    "CreateChannelResult": [
      "Channel",
      "LanguageNotAvailableError"
    ],
    "UpdateChannelResult": [
      "Channel",
      "LanguageNotAvailableError"
    ],
    "CreateCustomerResult": [
      "Customer",
      "EmailAddressConflictError"
    ],
    "UpdateCustomerResult": [
      "Customer",
      "EmailAddressConflictError"
    ],
    "UpdateGlobalSettingsResult": [
      "GlobalSettings",
      "ChannelDefaultLanguageError"
    ],
    "TransitionOrderToStateResult": [
      "Order",
      "OrderStateTransitionError"
    ],
    "SettlePaymentResult": [
      "Payment",
      "SettlePaymentError",
      "PaymentStateTransitionError",
      "OrderStateTransitionError"
    ],
    "AddFulfillmentToOrderResult": [
      "Fulfillment",
      "EmptyOrderLineSelectionError",
      "ItemsAlreadyFulfilledError"
    ],
    "CancelOrderResult": [
      "Order",
      "EmptyOrderLineSelectionError",
      "QuantityTooGreatError",
      "MultipleOrderError",
      "CancelActiveOrderError",
      "OrderStateTransitionError"
    ],
    "RefundOrderResult": [
      "Refund",
      "QuantityTooGreatError",
      "NothingToRefundError",
      "OrderStateTransitionError",
      "MultipleOrderError",
      "PaymentOrderMismatchError",
      "RefundOrderStateError",
      "AlreadyRefundedError",
      "RefundStateTransitionError"
    ],
    "SettleRefundResult": [
      "Refund",
      "RefundStateTransitionError"
    ],
    "TransitionFulfillmentToStateResult": [
      "Fulfillment",
      "FulfillmentStateTransitionError"
    ],
    "RemoveOptionGroupFromProductResult": [
      "Product",
      "ProductOptionInUseError"
    ],
    "CreatePromotionResult": [
      "Promotion",
      "MissingConditionsError"
    ],
    "UpdatePromotionResult": [
      "Promotion",
      "MissingConditionsError"
    ],
    "PaginatedList": [
      "CustomerGroupList",
      "JobList",
      "PaymentMethodList",
      "AdministratorList",
      "AssetList",
      "CollectionList",
      "ProductVariantList",
      "CountryList",
      "CustomerList",
      "FacetList",
      "HistoryEntryList",
      "OrderList",
      "ProductList",
      "PromotionList",
      "RoleList",
      "ShippingMethodList",
      "TaxRateList"
    ],
    "Node": [
      "Collection",
      "Customer",
      "Facet",
      "Fulfillment",
      "Job",
      "Order",
      "Product",
      "ProductVariant",
      "Address",
      "Administrator",
      "Asset",
      "Channel",
      "Country",
      "CustomerGroup",
      "FacetValue",
      "HistoryEntry",
      "OrderItem",
      "OrderLine",
      "Payment",
      "Refund",
      "PaymentMethod",
      "ProductOptionGroup",
      "ProductOption",
      "Promotion",
      "Role",
      "ShippingMethod",
      "StockAdjustment",
      "Sale",
      "Cancellation",
      "Return",
      "TaxCategory",
      "TaxRate",
      "User",
      "AuthenticationMethod",
      "Zone"
    ],
    "ErrorResult": [
      "MimeTypeError",
      "LanguageNotAvailableError",
      "ChannelDefaultLanguageError",
      "SettlePaymentError",
      "EmptyOrderLineSelectionError",
      "ItemsAlreadyFulfilledError",
      "MultipleOrderError",
      "CancelActiveOrderError",
      "PaymentOrderMismatchError",
      "RefundOrderStateError",
      "NothingToRefundError",
      "AlreadyRefundedError",
      "QuantityTooGreatError",
      "RefundStateTransitionError",
      "PaymentStateTransitionError",
      "FulfillmentStateTransitionError",
      "ProductOptionInUseError",
      "MissingConditionsError",
      "NativeAuthStrategyError",
      "InvalidCredentialsError",
      "OrderStateTransitionError",
      "EmailAddressConflictError"
    ],
    "CustomField": [
      "StringCustomFieldConfig",
      "LocaleStringCustomFieldConfig",
      "IntCustomFieldConfig",
      "FloatCustomFieldConfig",
      "BooleanCustomFieldConfig",
      "DateTimeCustomFieldConfig"
    ],
    "CustomFieldConfig": [
      "StringCustomFieldConfig",
      "LocaleStringCustomFieldConfig",
      "IntCustomFieldConfig",
      "FloatCustomFieldConfig",
      "BooleanCustomFieldConfig",
      "DateTimeCustomFieldConfig"
    ],
    "SearchResultPrice": [
      "PriceRange",
      "SinglePrice"
    ],
    "StockMovement": [
      "StockAdjustment",
      "Sale",
      "Cancellation",
      "Return"
    ],
    "StockMovementItem": [
      "StockAdjustment",
      "Sale",
      "Cancellation",
      "Return"
    ]
  }
};
      export default result;
    