import gql from 'graphql-tag';

import {
    ADMINISTRATOR_FRAGMENT,
    ASSET_FRAGMENT,
    CHANNEL_FRAGMENT,
    COLLECTION_FRAGMENT,
    COUNTRY_FRAGMENT,
    CURRENT_USER_FRAGMENT,
    CUSTOMER_FRAGMENT,
    CUSTOMER_GROUP_FRAGMENT,
    FACET_WITH_VALUES_FRAGMENT,
    FULFILLMENT_FRAGMENT,
    GLOBAL_SETTINGS_FRAGMENT,
    ORDER_FRAGMENT,
    ORDER_WITH_LINES_FRAGMENT,
    PAYMENT_FRAGMENT,
    PRODUCT_OPTION_GROUP_FRAGMENT,
    PRODUCT_VARIANT_FRAGMENT,
    PRODUCT_WITH_OPTIONS_FRAGMENT,
    PRODUCT_WITH_VARIANTS_FRAGMENT,
    PROMOTION_FRAGMENT,
    ROLE_FRAGMENT,
    SHIPPING_METHOD_FRAGMENT,
    TAX_RATE_FRAGMENT,
    VARIANT_WITH_STOCK_FRAGMENT,
} from './fragments';

export const CREATE_ADMINISTRATOR = gql`
    mutation CreateAdministrator($input: CreateAdministratorInput!) {
        createAdministrator(input: $input) {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const UPDATE_PRODUCT = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
        updateProduct(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const GET_PRODUCT_WITH_VARIANTS = gql`
    query GetProductWithVariants($id: ID, $slug: String) {
        product(slug: $slug, id: $id) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const GET_PRODUCT_LIST = gql`
    query GetProductList($options: ProductListOptions) {
        products(options: $options) {
            items {
                id
                languageCode
                name
                slug
                featuredAsset {
                    id
                    preview
                }
            }
            totalItems
        }
    }
`;

export const CREATE_PRODUCT_VARIANTS = gql`
    mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
        createProductVariants(input: $input) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;

export const UPDATE_PRODUCT_VARIANTS = gql`
    mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
        updateProductVariants(input: $input) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;

export const UPDATE_TAX_RATE = gql`
    mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
        updateTaxRate(input: $input) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const CREATE_FACET = gql`
    mutation CreateFacet($input: CreateFacetInput!) {
        createFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const UPDATE_FACET = gql`
    mutation UpdateFacet($input: UpdateFacetInput!) {
        updateFacet(input: $input) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const GET_CUSTOMER_LIST = gql`
    query GetCustomerList($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                title
                firstName
                lastName
                emailAddress
                phoneNumber
                user {
                    id
                    identifier
                    verified
                }
            }
            totalItems
        }
    }
`;

export const GET_ASSET_LIST = gql`
    query GetAssetList($options: AssetListOptions) {
        assets(options: $options) {
            items {
                ...Asset
            }
            totalItems
        }
    }
    ${ASSET_FRAGMENT}
`;

export const CREATE_ROLE = gql`
    mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) {
            ...Role
        }
    }
    ${ROLE_FRAGMENT}
`;

export const CREATE_COLLECTION = gql`
    mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

export const UPDATE_COLLECTION = gql`
    mutation UpdateCollection($input: UpdateCollectionInput!) {
        updateCollection(input: $input) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

export const GET_CUSTOMER = gql`
    query GetCustomer($id: ID!, $orderListOptions: OrderListOptions) {
        customer(id: $id) {
            ...Customer
            orders(options: $orderListOptions) {
                items {
                    id
                    code
                    state
                    total
                    currencyCode
                    updatedAt
                }
                totalItems
            }
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

export const ATTEMPT_LOGIN = gql`
    mutation AttemptLogin($username: String!, $password: String!, $rememberMe: Boolean) {
        login(username: $username, password: $password, rememberMe: $rememberMe) {
            ...CurrentUser
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;

export const GET_COUNTRY_LIST = gql`
    query GetCountryList($options: CountryListOptions) {
        countries(options: $options) {
            items {
                id
                code
                name
                enabled
            }
            totalItems
        }
    }
`;

export const UPDATE_COUNTRY = gql`
    mutation UpdateCountry($input: UpdateCountryInput!) {
        updateCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_FACET_LIST = gql`
    query GetFacetList($options: FacetListOptions) {
        facets(options: $options) {
            items {
                ...FacetWithValues
            }
            totalItems
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const GET_FACET_LIST_SIMPLE = gql`
    query GetFacetListSimple($options: FacetListOptions) {
        facets(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            result
        }
    }
`;

export const GET_PRODUCT_SIMPLE = gql`
    query GetProductSimple($id: ID, $slug: String) {
        product(slug: $slug, id: $id) {
            id
            slug
        }
    }
`;

export const GET_STOCK_MOVEMENT = gql`
    query GetStockMovement($id: ID!) {
        product(id: $id) {
            id
            variants {
                ...VariantWithStock
            }
        }
    }
    ${VARIANT_WITH_STOCK_FRAGMENT}
`;
export const GET_RUNNING_JOBS = gql`
    query GetRunningJobs($options: JobListOptions) {
        jobs(options: $options) {
            items {
                id
                queueName
                state
                isSettled
                duration
            }
            totalItems
        }
    }
`;
export const CREATE_PROMOTION = gql`
    mutation CreatePromotion($input: CreatePromotionInput!) {
        createPromotion(input: $input) {
            ...Promotion
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${PROMOTION_FRAGMENT}
`;
export const ME = gql`
    query Me {
        me {
            ...CurrentUser
        }
    }
    ${CURRENT_USER_FRAGMENT}
`;

export const CREATE_CHANNEL = gql`
    mutation CreateChannel($input: CreateChannelInput!) {
        createChannel(input: $input) {
            ...Channel
            ... on LanguageNotAvailableError {
                errorCode
                message
                languageCode
            }
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const DELETE_PRODUCT_VARIANT = gql`
    mutation DeleteProductVariant($id: ID!) {
        deleteProductVariant(id: $id) {
            result
            message
        }
    }
`;

export const ASSIGN_PRODUCT_TO_CHANNEL = gql`
    mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {
        assignProductsToChannel(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const REMOVE_PRODUCT_FROM_CHANNEL = gql`
    mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {
        removeProductsFromChannel(input: $input) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const ASSIGN_PRODUCTVARIANT_TO_CHANNEL = gql`
    mutation AssignProductVariantsToChannel($input: AssignProductVariantsToChannelInput!) {
        assignProductVariantsToChannel(input: $input) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;

export const REMOVE_PRODUCTVARIANT_FROM_CHANNEL = gql`
    mutation RemoveProductVariantsFromChannel($input: RemoveProductVariantsFromChannelInput!) {
        removeProductVariantsFromChannel(input: $input) {
            ...ProductVariant
        }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
`;

export const UPDATE_ASSET = gql`
    mutation UpdateAsset($input: UpdateAssetInput!) {
        updateAsset(input: $input) {
            ...Asset
            ... on Asset {
                tags {
                    id
                    value
                }
                focalPoint {
                    x
                    y
                }
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const DELETE_ASSET = gql`
    mutation DeleteAsset($input: DeleteAssetInput!) {
        deleteAsset(input: $input) {
            result
            message
        }
    }
`;

export const UPDATE_CHANNEL = gql`
    mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            ...Channel
            ... on LanguageNotAvailableError {
                errorCode
                message
                languageCode
            }
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const GET_CUSTOMER_HISTORY = gql`
    query GetCustomerHistory($id: ID!, $options: HistoryEntryListOptions) {
        customer(id: $id) {
            id
            history(options: $options) {
                totalItems
                items {
                    id
                    administrator {
                        id
                    }
                    type
                    data
                }
            }
        }
    }
`;

export const GET_ORDER = gql`
    query GetOrder($id: ID!) {
        order(id: $id) {
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const CREATE_CUSTOMER_GROUP = gql`
    mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
        createCustomerGroup(input: $input) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const REMOVE_CUSTOMERS_FROM_GROUP = gql`
    mutation RemoveCustomersFromGroup($groupId: ID!, $customerIds: [ID!]!) {
        removeCustomersFromGroup(customerGroupId: $groupId, customerIds: $customerIds) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const CREATE_FULFILLMENT = gql`
    mutation CreateFulfillment($input: FulfillOrderInput!) {
        addFulfillmentToOrder(input: $input) {
            ...Fulfillment
            ... on ErrorResult {
                errorCode
                message
            }
            ... on CreateFulfillmentError {
                fulfillmentHandlerError
            }
        }
    }
    ${FULFILLMENT_FRAGMENT}
`;

export const TRANSIT_FULFILLMENT = gql`
    mutation TransitFulfillment($id: ID!, $state: String!) {
        transitionFulfillmentToState(id: $id, state: $state) {
            ...Fulfillment
            ... on FulfillmentStateTransitionError {
                errorCode
                message
                transitionError
                fromState
                toState
            }
        }
    }
    ${FULFILLMENT_FRAGMENT}
`;

export const GET_ORDER_FULFILLMENTS = gql`
    query GetOrderFulfillments($id: ID!) {
        order(id: $id) {
            id
            state
            fulfillments {
                id
                state
                nextStates
                method
                summary {
                    orderLine {
                        id
                    }
                    quantity
                }
            }
        }
    }
`;

export const GET_ORDERS_LIST = gql`
    query GetOrderList($options: OrderListOptions) {
        orders(options: $options) {
            items {
                ...Order
            }
            totalItems
        }
    }
    ${ORDER_FRAGMENT}
`;

export const CREATE_ADDRESS = gql`
    mutation CreateAddress($id: ID!, $input: CreateAddressInput!) {
        createCustomerAddress(customerId: $id, input: $input) {
            id
            fullName
            company
            streetLine1
            streetLine2
            city
            province
            postalCode
            country {
                code
                name
            }
            phoneNumber
            defaultShippingAddress
            defaultBillingAddress
        }
    }
`;

export const UPDATE_ADDRESS = gql`
    mutation UpdateAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            id
            defaultShippingAddress
            defaultBillingAddress
            country {
                code
                name
            }
        }
    }
`;

export const CREATE_CUSTOMER = gql`
    mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
        createCustomer(input: $input, password: $password) {
            ...Customer
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            ...Customer
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

export const DELETE_CUSTOMER = gql`
    mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id) {
            result
        }
    }
`;

export const UPDATE_CUSTOMER_NOTE = gql`
    mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {
        updateCustomerNote(input: $input) {
            id
            data
            isPublic
        }
    }
`;

export const DELETE_CUSTOMER_NOTE = gql`
    mutation DeleteCustomerNote($id: ID!) {
        deleteCustomerNote(id: $id) {
            result
            message
        }
    }
`;

export const UPDATE_CUSTOMER_GROUP = gql`
    mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
        updateCustomerGroup(input: $input) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const DELETE_CUSTOMER_GROUP = gql`
    mutation DeleteCustomerGroup($id: ID!) {
        deleteCustomerGroup(id: $id) {
            result
            message
        }
    }
`;

export const GET_CUSTOMER_GROUPS = gql`
    query GetCustomerGroups($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

export const GET_CUSTOMER_GROUP = gql`
    query GetCustomerGroup($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            id
            name
            customers(options: $options) {
                items {
                    id
                }
                totalItems
            }
        }
    }
`;

export const ADD_CUSTOMERS_TO_GROUP = gql`
    mutation AddCustomersToGroup($groupId: ID!, $customerIds: [ID!]!) {
        addCustomersToGroup(customerGroupId: $groupId, customerIds: $customerIds) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const GET_CUSTOMER_WITH_GROUPS = gql`
    query GetCustomerWithGroups($id: ID!) {
        customer(id: $id) {
            id
            groups {
                id
                name
            }
        }
    }
`;

export const ADMIN_TRANSITION_TO_STATE = gql`
    mutation AdminTransition($id: ID!, $state: String!) {
        transitionOrderToState(id: $id, state: $state) {
            ...Order
            ... on OrderStateTransitionError {
                errorCode
                message
                transitionError
                fromState
                toState
            }
        }
    }
    ${ORDER_FRAGMENT}
`;

export const CANCEL_ORDER = gql`
    mutation CancelOrder($input: CancelOrderInput!) {
        cancelOrder(input: $input) {
            ...CanceledOrder
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    fragment CanceledOrder on Order {
        id
        state
        lines {
            id
            quantity
        }
    }
`;

export const UPDATE_GLOBAL_SETTINGS = gql`
    mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
        updateGlobalSettings(input: $input) {
            ...GlobalSettings
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${GLOBAL_SETTINGS_FRAGMENT}
`;

export const UPDATE_ROLE = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
        updateRole(input: $input) {
            ...Role
        }
    }
    ${ROLE_FRAGMENT}
`;

export const GET_PRODUCTS_WITH_VARIANT_PRICES = gql`
    query GetProductsWithVariantPrices {
        products {
            items {
                id
                slug
                variants {
                    id
                    price
                    priceWithTax
                    currencyCode
                    sku
                    facetValues {
                        id
                        code
                    }
                }
            }
        }
    }
`;

export const CREATE_PRODUCT_OPTION_GROUP = gql`
    mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

export const ADD_OPTION_GROUP_TO_PRODUCT = gql`
    mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
        addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
            ...ProductWithOptions
        }
    }
    ${PRODUCT_WITH_OPTIONS_FRAGMENT}
`;

export const CREATE_SHIPPING_METHOD = gql`
    mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
        createShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const SETTLE_PAYMENT = gql`
    mutation SettlePayment($id: ID!) {
        settlePayment(id: $id) {
            ...Payment
            ... on ErrorResult {
                errorCode
                message
            }
            ... on SettlePaymentError {
                paymentErrorMessage
            }
        }
    }
    ${PAYMENT_FRAGMENT}
`;

export const GET_ORDER_HISTORY = gql`
    query GetOrderHistory($id: ID!, $options: HistoryEntryListOptions) {
        order(id: $id) {
            id
            history(options: $options) {
                totalItems
                items {
                    id
                    type
                    administrator {
                        id
                    }
                    data
                }
            }
        }
    }
`;

export const UPDATE_SHIPPING_METHOD = gql`
    mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
        updateShippingMethod(input: $input) {
            ...ShippingMethod
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const GET_ASSET = gql`
    query GetAsset($id: ID!) {
        asset(id: $id) {
            ...Asset
            width
            height
        }
    }
    ${ASSET_FRAGMENT}
`;

export const GET_ASSET_FRAGMENT_FIRST = gql`
    fragment AssetFragFirst on Asset {
        id
        preview
    }

    query GetAssetFragmentFirst($id: ID!) {
        asset(id: $id) {
            ...AssetFragFirst
        }
    }
`;

export const ASSET_WITH_TAGS_AND_FOCAL_POINT_FRAGMENT = gql`
    fragment AssetWithTagsAndFocalPoint on Asset {
        ...Asset
        focalPoint {
            x
            y
        }
        tags {
            id
            value
        }
    }
    ${ASSET_FRAGMENT}
`;

export const CREATE_ASSETS = gql`
    mutation CreateAssets($input: [CreateAssetInput!]!) {
        createAssets(input: $input) {
            ...AssetWithTagsAndFocalPoint
            ... on MimeTypeError {
                message
                fileName
                mimeType
            }
        }
    }
    ${ASSET_WITH_TAGS_AND_FOCAL_POINT_FRAGMENT}
`;

export const DELETE_SHIPPING_METHOD = gql`
    mutation DeleteShippingMethod($id: ID!) {
        deleteShippingMethod(id: $id) {
            result
            message
        }
    }
`;

export const ASSIGN_PROMOTIONS_TO_CHANNEL = gql`
    mutation AssignPromotionToChannel($input: AssignPromotionsToChannelInput!) {
        assignPromotionsToChannel(input: $input) {
            id
            name
        }
    }
`;

export const REMOVE_PROMOTIONS_FROM_CHANNEL = gql`
    mutation RemovePromotionFromChannel($input: RemovePromotionsFromChannelInput!) {
        removePromotionsFromChannel(input: $input) {
            id
            name
        }
    }
`;

export const GET_TAX_RATES_LIST = gql`
    query GetTaxRates($options: TaxRateListOptions) {
        taxRates(options: $options) {
            items {
                ...TaxRate
            }
            totalItems
        }
    }
    ${TAX_RATE_FRAGMENT}
`;
export const GET_SHIPPING_METHOD_LIST = gql`
    query GetShippingMethodList {
        shippingMethods {
            items {
                ...ShippingMethod
            }
            totalItems
        }
    }
    ${SHIPPING_METHOD_FRAGMENT}
`;

export const GET_COLLECTIONS = gql`
    query GetCollections {
        collections {
            items {
                id
                name
                position
                parent {
                    id
                    name
                }
            }
        }
    }
`;

export const TRANSITION_PAYMENT_TO_STATE = gql`
    mutation TransitionPaymentToState($id: ID!, $state: String!) {
        transitionPaymentToState(id: $id, state: $state) {
            ...Payment
            ... on ErrorResult {
                errorCode
                message
            }
            ... on PaymentStateTransitionError {
                transitionError
            }
        }
    }
    ${PAYMENT_FRAGMENT}
`;

export const GET_PRODUCT_VARIANT_LIST = gql`
    query GetProductVariantList($options: ProductVariantListOptions, $productId: ID) {
        productVariants(options: $options, productId: $productId) {
            items {
                id
                name
                sku
                price
                priceWithTax
                currencyCode
                prices {
                    currencyCode
                    price
                }
            }
            totalItems
        }
    }
`;

export const DELETE_PROMOTION = gql`
    mutation DeletePromotion($id: ID!) {
        deletePromotion(id: $id) {
            result
        }
    }
`;

export const GET_CHANNELS = gql`
    query GetChannels {
        channels {
            items {
                id
                code
                token
            }
        }
    }
`;

export const UPDATE_ADMINISTRATOR = gql`
    mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
        updateAdministrator(input: $input) {
            ...Administrator
        }
    }
    ${ADMINISTRATOR_FRAGMENT}
`;

export const ASSIGN_COLLECTIONS_TO_CHANNEL = gql`
    mutation AssignCollectionsToChannel($input: AssignCollectionsToChannelInput!) {
        assignCollectionsToChannel(input: $input) {
            ...Collection
        }
    }
    ${COLLECTION_FRAGMENT}
`;

export const GET_COLLECTION = gql`
    query GetCollection($id: ID, $slug: String, $variantListOptions: ProductVariantListOptions) {
        collection(id: $id, slug: $slug) {
            ...Collection
            productVariants(options: $variantListOptions) {
                items {
                    id
                    name
                    price
                }
            }
        }
    }
    ${COLLECTION_FRAGMENT}
`;

export const GET_FACET_WITH_VALUES = gql`
    query GetFacetWithValues($id: ID!) {
        facet(id: $id) {
            ...FacetWithValues
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const GET_PROMOTION = gql`
    query GetPromotion($id: ID!) {
        promotion(id: $id) {
            ...Promotion
        }
    }
    ${PROMOTION_FRAGMENT}
`;
