// tslint:disable

export interface IntrospectionResultData {
    __schema: {
        types: {
            kind: string;
            name: string;
            possibleTypes: {
                name: string;
            }[];
        }[];
    };
}
const result: IntrospectionResultData = {
    __schema: {
        types: [
            {
                kind: 'INTERFACE',
                name: 'Node',
                possibleTypes: [
                    {
                        name: 'Channel',
                    },
                    {
                        name: 'Zone',
                    },
                    {
                        name: 'Country',
                    },
                    {
                        name: 'Administrator',
                    },
                    {
                        name: 'User',
                    },
                    {
                        name: 'Role',
                    },
                    {
                        name: 'AuthenticationMethod',
                    },
                    {
                        name: 'Asset',
                    },
                    {
                        name: 'Collection',
                    },
                    {
                        name: 'ProductVariant',
                    },
                    {
                        name: 'StockAdjustment',
                    },
                    {
                        name: 'Sale',
                    },
                    {
                        name: 'OrderLine',
                    },
                    {
                        name: 'OrderItem',
                    },
                    {
                        name: 'Fulfillment',
                    },
                    {
                        name: 'Order',
                    },
                    {
                        name: 'Customer',
                    },
                    {
                        name: 'CustomerGroup',
                    },
                    {
                        name: 'HistoryEntry',
                    },
                    {
                        name: 'Address',
                    },
                    {
                        name: 'Promotion',
                    },
                    {
                        name: 'Payment',
                    },
                    {
                        name: 'Refund',
                    },
                    {
                        name: 'ShippingMethod',
                    },
                    {
                        name: 'Cancellation',
                    },
                    {
                        name: 'Return',
                    },
                    {
                        name: 'Product',
                    },
                    {
                        name: 'ProductOptionGroup',
                    },
                    {
                        name: 'ProductOption',
                    },
                    {
                        name: 'FacetValue',
                    },
                    {
                        name: 'Facet',
                    },
                    {
                        name: 'TaxRate',
                    },
                    {
                        name: 'TaxCategory',
                    },
                    {
                        name: 'Job',
                    },
                    {
                        name: 'PaymentMethod',
                    },
                ],
            },
            {
                kind: 'INTERFACE',
                name: 'PaginatedList',
                possibleTypes: [
                    {
                        name: 'AdministratorList',
                    },
                    {
                        name: 'AssetList',
                    },
                    {
                        name: 'ProductVariantList',
                    },
                    {
                        name: 'CustomerList',
                    },
                    {
                        name: 'HistoryEntryList',
                    },
                    {
                        name: 'OrderList',
                    },
                    {
                        name: 'CollectionList',
                    },
                    {
                        name: 'CountryList',
                    },
                    {
                        name: 'CustomerGroupList',
                    },
                    {
                        name: 'FacetList',
                    },
                    {
                        name: 'JobList',
                    },
                    {
                        name: 'PaymentMethodList',
                    },
                    {
                        name: 'ProductList',
                    },
                    {
                        name: 'PromotionList',
                    },
                    {
                        name: 'RoleList',
                    },
                    {
                        name: 'ShippingMethodList',
                    },
                    {
                        name: 'TaxRateList',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'StockMovementItem',
                possibleTypes: [
                    {
                        name: 'StockAdjustment',
                    },
                    {
                        name: 'Sale',
                    },
                    {
                        name: 'Cancellation',
                    },
                    {
                        name: 'Return',
                    },
                ],
            },
            {
                kind: 'INTERFACE',
                name: 'StockMovement',
                possibleTypes: [
                    {
                        name: 'StockAdjustment',
                    },
                    {
                        name: 'Sale',
                    },
                    {
                        name: 'Cancellation',
                    },
                    {
                        name: 'Return',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CustomFieldConfig',
                possibleTypes: [
                    {
                        name: 'StringCustomFieldConfig',
                    },
                    {
                        name: 'LocaleStringCustomFieldConfig',
                    },
                    {
                        name: 'IntCustomFieldConfig',
                    },
                    {
                        name: 'FloatCustomFieldConfig',
                    },
                    {
                        name: 'BooleanCustomFieldConfig',
                    },
                    {
                        name: 'DateTimeCustomFieldConfig',
                    },
                ],
            },
            {
                kind: 'INTERFACE',
                name: 'CustomField',
                possibleTypes: [
                    {
                        name: 'StringCustomFieldConfig',
                    },
                    {
                        name: 'LocaleStringCustomFieldConfig',
                    },
                    {
                        name: 'IntCustomFieldConfig',
                    },
                    {
                        name: 'FloatCustomFieldConfig',
                    },
                    {
                        name: 'BooleanCustomFieldConfig',
                    },
                    {
                        name: 'DateTimeCustomFieldConfig',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'SearchResultPrice',
                possibleTypes: [
                    {
                        name: 'PriceRange',
                    },
                    {
                        name: 'SinglePrice',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'AddFulfillmentToOrderResult',
                possibleTypes: [
                    {
                        name: 'Fulfillment',
                    },
                    {
                        name: 'EmptyOrderLineSelectionError',
                    },
                    {
                        name: 'ItemsAlreadyFulfilledError',
                    },
                ],
            },
            {
                kind: 'INTERFACE',
                name: 'ErrorResult',
                possibleTypes: [
                    {
                        name: 'EmptyOrderLineSelectionError',
                    },
                    {
                        name: 'ItemsAlreadyFulfilledError',
                    },
                    {
                        name: 'InvalidCredentialsError',
                    },
                    {
                        name: 'QuantityTooGreatError',
                    },
                    {
                        name: 'MultipleOrderError',
                    },
                    {
                        name: 'CancelActiveOrderError',
                    },
                    {
                        name: 'OrderStateTransitionError',
                    },
                    {
                        name: 'MimeTypeError',
                    },
                    {
                        name: 'LanguageNotAvailableError',
                    },
                    {
                        name: 'EmailAddressConflictError',
                    },
                    {
                        name: 'MissingConditionsError',
                    },
                    {
                        name: 'NativeAuthStrategyError',
                    },
                    {
                        name: 'NothingToRefundError',
                    },
                    {
                        name: 'PaymentOrderMismatchError',
                    },
                    {
                        name: 'RefundOrderStateError',
                    },
                    {
                        name: 'AlreadyRefundedError',
                    },
                    {
                        name: 'RefundStateTransitionError',
                    },
                    {
                        name: 'ProductOptionInUseError',
                    },
                    {
                        name: 'SettlePaymentError',
                    },
                    {
                        name: 'PaymentStateTransitionError',
                    },
                    {
                        name: 'FulfillmentStateTransitionError',
                    },
                    {
                        name: 'ChannelDefaultLanguageError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'AuthenticationResult',
                possibleTypes: [
                    {
                        name: 'CurrentUser',
                    },
                    {
                        name: 'InvalidCredentialsError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CancelOrderResult',
                possibleTypes: [
                    {
                        name: 'Order',
                    },
                    {
                        name: 'EmptyOrderLineSelectionError',
                    },
                    {
                        name: 'QuantityTooGreatError',
                    },
                    {
                        name: 'MultipleOrderError',
                    },
                    {
                        name: 'CancelActiveOrderError',
                    },
                    {
                        name: 'OrderStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CreateAssetResult',
                possibleTypes: [
                    {
                        name: 'Asset',
                    },
                    {
                        name: 'MimeTypeError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CreateChannelResult',
                possibleTypes: [
                    {
                        name: 'Channel',
                    },
                    {
                        name: 'LanguageNotAvailableError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CreateCustomerResult',
                possibleTypes: [
                    {
                        name: 'Customer',
                    },
                    {
                        name: 'EmailAddressConflictError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'CreatePromotionResult',
                possibleTypes: [
                    {
                        name: 'Promotion',
                    },
                    {
                        name: 'MissingConditionsError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'NativeAuthenticationResult',
                possibleTypes: [
                    {
                        name: 'CurrentUser',
                    },
                    {
                        name: 'InvalidCredentialsError',
                    },
                    {
                        name: 'NativeAuthStrategyError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'RefundOrderResult',
                possibleTypes: [
                    {
                        name: 'Refund',
                    },
                    {
                        name: 'QuantityTooGreatError',
                    },
                    {
                        name: 'NothingToRefundError',
                    },
                    {
                        name: 'OrderStateTransitionError',
                    },
                    {
                        name: 'MultipleOrderError',
                    },
                    {
                        name: 'PaymentOrderMismatchError',
                    },
                    {
                        name: 'RefundOrderStateError',
                    },
                    {
                        name: 'AlreadyRefundedError',
                    },
                    {
                        name: 'RefundStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'RemoveOptionGroupFromProductResult',
                possibleTypes: [
                    {
                        name: 'Product',
                    },
                    {
                        name: 'ProductOptionInUseError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'SettlePaymentResult',
                possibleTypes: [
                    {
                        name: 'Payment',
                    },
                    {
                        name: 'SettlePaymentError',
                    },
                    {
                        name: 'PaymentStateTransitionError',
                    },
                    {
                        name: 'OrderStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'SettleRefundResult',
                possibleTypes: [
                    {
                        name: 'Refund',
                    },
                    {
                        name: 'RefundStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'TransitionFulfillmentToStateResult',
                possibleTypes: [
                    {
                        name: 'Fulfillment',
                    },
                    {
                        name: 'FulfillmentStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'TransitionOrderToStateResult',
                possibleTypes: [
                    {
                        name: 'Order',
                    },
                    {
                        name: 'OrderStateTransitionError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'UpdateChannelResult',
                possibleTypes: [
                    {
                        name: 'Channel',
                    },
                    {
                        name: 'LanguageNotAvailableError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'UpdateCustomerResult',
                possibleTypes: [
                    {
                        name: 'Customer',
                    },
                    {
                        name: 'EmailAddressConflictError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'UpdateGlobalSettingsResult',
                possibleTypes: [
                    {
                        name: 'GlobalSettings',
                    },
                    {
                        name: 'ChannelDefaultLanguageError',
                    },
                ],
            },
            {
                kind: 'UNION',
                name: 'UpdatePromotionResult',
                possibleTypes: [
                    {
                        name: 'Promotion',
                    },
                    {
                        name: 'MissingConditionsError',
                    },
                ],
            },
        ],
    },
};
export default result;
