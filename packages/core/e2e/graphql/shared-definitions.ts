import {
    administratorFragment,
    assetFragment,
    canceledOrderFragment,
    channelFragment,
    collectionFragment,
    countryFragment,
    currentUserFragment,
    customerFragment,
    customerGroupFragment,
    facetValueFragment,
    facetWithValuesFragment,
    fulfillmentFragment,
    globalSettingsFragment,
    orderFragment,
    orderWithLinesFragment,
    orderWithModificationsFragment,
    paymentFragment,
    productOptionGroupFragment,
    productVariantFragment,
    productWithOptionsFragment,
    productWithVariantsFragment,
    promotionFragment,
    refundFragment,
    roleFragment,
    shippingMethodFragment,
    taxRateFragment,
    variantWithStockFragment,
} from './fragments-admin';
import { graphql } from './graphql-admin';

export const createAdministratorDocument = graphql(
    `
        mutation CreateAdministrator($input: CreateAdministratorInput!) {
            createAdministrator(input: $input) {
                ...Administrator
            }
        }
    `,
    [administratorFragment],
);

export const updateProductDocument = graphql(
    `
        mutation UpdateProduct($input: UpdateProductInput!) {
            updateProduct(input: $input) {
                ...ProductWithVariants
            }
        }
    `,
    [productWithVariantsFragment],
);

export const createProductDocument = graphql(
    `
        mutation CreateProduct($input: CreateProductInput!) {
            createProduct(input: $input) {
                ...ProductWithVariants
            }
        }
    `,
    [productWithVariantsFragment],
);

export const getProductWithVariantsDocument = graphql(
    `
        query GetProductWithVariants($id: ID, $slug: String) {
            product(slug: $slug, id: $id) {
                ...ProductWithVariants
            }
        }
    `,
    [productWithVariantsFragment],
);

export const getProductListDocument = graphql(`
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
`);

export const getProductWithFacetValuesDocument = graphql(`
    query GetProductWithFacetValues($id: ID!) {
        product(id: $id) {
            id
            facetValues {
                id
                name
                code
            }
            variants {
                id
                facetValues {
                    id
                    name
                    code
                }
            }
        }
    }
`);

export const getProductsListWithVariantsDocument = graphql(`
    query GetProductListWithVariants {
        products {
            items {
                id
                name
                variants {
                    id
                    name
                }
            }
            totalItems
        }
    }
`);

export const createProductVariantsDocument = graphql(
    `
        mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
            createProductVariants(input: $input) {
                ...ProductVariant
            }
        }
    `,
    [productVariantFragment],
);

export const updateProductVariantsDocument = graphql(
    `
        mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
            updateProductVariants(input: $input) {
                ...ProductVariant
            }
        }
    `,
    [productVariantFragment],
);

export const updateTaxRateDocument = graphql(
    `
        mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
            updateTaxRate(input: $input) {
                ...TaxRate
            }
        }
    `,
    [taxRateFragment],
);

export const createFacetDocument = graphql(
    `
        mutation CreateFacet($input: CreateFacetInput!) {
            createFacet(input: $input) {
                ...FacetWithValues
            }
        }
    `,
    [facetWithValuesFragment],
);

export const updateFacetDocument = graphql(
    `
        mutation UpdateFacet($input: UpdateFacetInput!) {
            updateFacet(input: $input) {
                ...FacetWithValues
            }
        }
    `,
    [facetWithValuesFragment],
);

export const createFacetValueDocument = graphql(
    `
        mutation CreateFacetValue($input: CreateFacetValueInput!) {
            createFacetValue(input: $input) {
                ...FacetValue
            }
        }
    `,
    [facetValueFragment],
);

export const updateFacetValueDocument = graphql(
    `
        mutation UpdateFacetValue($input: UpdateFacetValueInput!) {
            updateFacetValue(input: $input) {
                ...FacetValue
            }
        }
    `,
    [facetValueFragment],
);

export const createFacetValuesDocument = graphql(
    `
        mutation CreateFacetValues($input: [CreateFacetValueInput!]!) {
            createFacetValues(input: $input) {
                ...FacetValue
            }
        }
    `,
    [facetValueFragment],
);

export const updateFacetValuesDocument = graphql(
    `
        mutation UpdateFacetValues($input: [UpdateFacetValueInput!]!) {
            updateFacetValues(input: $input) {
                ...FacetValue
            }
        }
    `,
    [facetValueFragment],
);

export const deleteFacetValuesDocument = graphql(`
    mutation DeleteFacetValues($ids: [ID!]!, $force: Boolean) {
        deleteFacetValues(ids: $ids, force: $force) {
            result
            message
        }
    }
`);

export const deleteFacetDocument = graphql(`
    mutation DeleteFacet($id: ID!, $force: Boolean) {
        deleteFacet(id: $id, force: $force) {
            result
            message
        }
    }
`);

export const getCustomerListDocument = graphql(`
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
`);

export const getCustomerIdsDocument = graphql(`
    query GetCustomerIds {
        customers {
            items {
                id
            }
        }
    }
`);

export const getAssetListDocument = graphql(
    `
        query GetAssetList($options: AssetListOptions) {
            assets(options: $options) {
                items {
                    ...Asset
                }
                totalItems
            }
        }
    `,
    [assetFragment],
);

export const createRoleDocument = graphql(
    `
        mutation CreateRole($input: CreateRoleInput!) {
            createRole(input: $input) {
                ...Role
            }
        }
    `,
    [roleFragment],
);

export const createCollectionDocument = graphql(
    `
        mutation CreateCollection($input: CreateCollectionInput!) {
            createCollection(input: $input) {
                ...Collection
            }
        }
    `,
    [collectionFragment],
);

export const updateCollectionDocument = graphql(
    `
        mutation UpdateCollection($input: UpdateCollectionInput!) {
            updateCollection(input: $input) {
                ...Collection
            }
        }
    `,
    [collectionFragment],
);

export const getCustomerDocument = graphql(
    `
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
    `,
    [customerFragment],
);

export const attemptLoginDocument = graphql(
    `
        mutation AttemptLogin($username: String!, $password: String!, $rememberMe: Boolean) {
            login(username: $username, password: $password, rememberMe: $rememberMe) {
                ...CurrentUser
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [currentUserFragment],
);

export const getCountryListDocument = graphql(`
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
`);

export const updateCountryDocument = graphql(
    `
        mutation UpdateCountry($input: UpdateCountryInput!) {
            updateCountry(input: $input) {
                ...Country
            }
        }
    `,
    [countryFragment],
);

export const getFacetListDocument = graphql(
    `
        query GetFacetList($options: FacetListOptions) {
            facets(options: $options) {
                items {
                    ...FacetWithValues
                }
                totalItems
            }
        }
    `,
    [facetWithValuesFragment],
);

export const getFacetListSimpleDocument = graphql(`
    query GetFacetListSimple($options: FacetListOptions) {
        facets(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`);

export const deleteProductDocument = graphql(`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            result
        }
    }
`);

export const getProductSimpleDocument = graphql(`
    query GetProductSimple($id: ID, $slug: String) {
        product(slug: $slug, id: $id) {
            id
            slug
        }
    }
`);

export const getStockMovementDocument = graphql(
    `
        query GetStockMovement($id: ID!) {
            product(id: $id) {
                id
                variants {
                    ...VariantWithStock
                }
            }
        }
    `,
    [variantWithStockFragment],
);

export const getStockMovementByTypeDocument = graphql(`
    query GetStockMovementByType($id: ID!, $type: StockMovementType!) {
        product(id: $id) {
            id
            variants {
                stockMovements(options: { type: $type }) {
                    items {
                        ... on StockMovement {
                            id
                            type
                            quantity
                        }
                    }
                    totalItems
                }
            }
        }
    }
`);

export const getRunningJobsDocument = graphql(`
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
`);
export const createPromotionDocument = graphql(
    `
        mutation CreatePromotion($input: CreatePromotionInput!) {
            createPromotion(input: $input) {
                ...Promotion
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [promotionFragment],
);
export const MeDocument = graphql(
    `
        query Me {
            me {
                ...CurrentUser
            }
        }
    `,
    [currentUserFragment],
);

export const createChannelDocument = graphql(
    `
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
    `,
    [channelFragment],
);

export const deleteProductVariantDocument = graphql(`
    mutation DeleteProductVariant($id: ID!) {
        deleteProductVariant(id: $id) {
            result
            message
        }
    }
`);

export const assignProductToChannelDocument = graphql(
    `
        mutation AssignProductsToChannel($input: AssignProductsToChannelInput!) {
            assignProductsToChannel(input: $input) {
                ...ProductWithVariants
            }
        }
    `,
    [productWithVariantsFragment],
);

export const removeProductFromChannelDocument = graphql(
    `
        mutation RemoveProductsFromChannel($input: RemoveProductsFromChannelInput!) {
            removeProductsFromChannel(input: $input) {
                ...ProductWithVariants
            }
        }
    `,
    [productWithVariantsFragment],
);

export const assignProductVariantToChannelDocument = graphql(
    `
        mutation AssignProductVariantsToChannel($input: AssignProductVariantsToChannelInput!) {
            assignProductVariantsToChannel(input: $input) {
                ...ProductVariant
            }
        }
    `,
    [productVariantFragment],
);

export const removeProductVariantFromChannelDocument = graphql(
    `
        mutation RemoveProductVariantsFromChannel($input: RemoveProductVariantsFromChannelInput!) {
            removeProductVariantsFromChannel(input: $input) {
                ...ProductVariant
            }
        }
    `,
    [productVariantFragment],
);

export const assignFacetsToChannelDocument = graphql(`
    mutation AssignFacetsToChannel($input: AssignFacetsToChannelInput!) {
        assignFacetsToChannel(input: $input) {
            id
            name
        }
    }
`);

export const removeFacetsFromChannelDocument = graphql(`
    mutation RemoveFacetsFromChannel($input: RemoveFacetsFromChannelInput!) {
        removeFacetsFromChannel(input: $input) {
            ... on Facet {
                id
                name
            }
            ... on FacetInUseError {
                errorCode
                message
                productCount
                variantCount
            }
        }
    }
`);

export const getEntityDuplicatorsDocument = graphql(`
    query GetEntityDuplicators {
        entityDuplicators {
            code
            description
            requiresPermission
            forEntities
            args {
                name
                type
                defaultValue
            }
        }
    }
`);

export const duplicateEntityDocument = graphql(`
    mutation DuplicateEntity($input: DuplicateEntityInput!) {
        duplicateEntity(input: $input) {
            ... on DuplicateEntitySuccess {
                newEntityId
            }
            ... on DuplicateEntityError {
                errorCode
                message
                duplicationError
            }
        }
    }
`);

export const updateAssetDocument = graphql(
    `
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
    `,
    [assetFragment],
);

export const deleteAssetDocument = graphql(`
    mutation DeleteAsset($input: DeleteAssetInput!) {
        deleteAsset(input: $input) {
            result
            message
        }
    }
`);

export const updateChannelDocument = graphql(
    `
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
    `,
    [channelFragment],
);

export const getCustomerHistoryDocument = graphql(`
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
`);

export const getOrderDocument = graphql(
    `
        query GetOrder($id: ID!) {
            order(id: $id) {
                ...OrderWithLines
            }
        }
    `,
    [orderWithLinesFragment],
);

export const createCustomerGroupDocument = graphql(
    `
        mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
            createCustomerGroup(input: $input) {
                ...CustomerGroup
            }
        }
    `,
    [customerGroupFragment],
);

export const removeCustomersFromGroupDocument = graphql(
    `
        mutation RemoveCustomersFromGroup($groupId: ID!, $customerIds: [ID!]!) {
            removeCustomersFromGroup(customerGroupId: $groupId, customerIds: $customerIds) {
                ...CustomerGroup
            }
        }
    `,
    [customerGroupFragment],
);

export const createFulfillmentDocument = graphql(
    `
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
    `,
    [fulfillmentFragment],
);

export const transitFulfillmentDocument = graphql(
    `
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
    `,
    [fulfillmentFragment],
);

export const getOrderFulfillmentsDocument = graphql(`
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
`);

export const getOrdersListDocument = graphql(
    `
        query GetOrderList($options: OrderListOptions) {
            orders(options: $options) {
                items {
                    ...Order
                }
                totalItems
            }
        }
    `,
    [orderFragment],
);

export const createAddressDocument = graphql(`
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
`);

export const updateAddressDocument = graphql(`
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
`);

export const createCustomerDocument = graphql(
    `
        mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
            createCustomer(input: $input, password: $password) {
                ...Customer
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [customerFragment],
);

export const updateCustomerDocument = graphql(
    `
        mutation UpdateCustomer($input: UpdateCustomerInput!) {
            updateCustomer(input: $input) {
                ...Customer
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [customerFragment],
);

export const deleteCustomerDocument = graphql(`
    mutation DeleteCustomer($id: ID!) {
        deleteCustomer(id: $id) {
            result
        }
    }
`);

export const updateCustomerNoteDocument = graphql(`
    mutation UpdateCustomerNote($input: UpdateCustomerNoteInput!) {
        updateCustomerNote(input: $input) {
            id
            data
            isPublic
        }
    }
`);

export const deleteCustomerNoteDocument = graphql(`
    mutation DeleteCustomerNote($id: ID!) {
        deleteCustomerNote(id: $id) {
            result
            message
        }
    }
`);

export const updateCustomerGroupDocument = graphql(
    `
        mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
            updateCustomerGroup(input: $input) {
                ...CustomerGroup
            }
        }
    `,
    [customerGroupFragment],
);

export const deleteCustomerGroupDocument = graphql(`
    mutation DeleteCustomerGroup($id: ID!) {
        deleteCustomerGroup(id: $id) {
            result
            message
        }
    }
`);

export const getCustomerGroupsDocument = graphql(`
    query GetCustomerGroups($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`);

export const getCustomerGroupDocument = graphql(`
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
`);

export const addCustomersToGroupDocument = graphql(
    `
        mutation AddCustomersToGroup($groupId: ID!, $customerIds: [ID!]!) {
            addCustomersToGroup(customerGroupId: $groupId, customerIds: $customerIds) {
                ...CustomerGroup
            }
        }
    `,
    [customerGroupFragment],
);

export const getCustomerWithGroupsDocument = graphql(`
    query GetCustomerWithGroups($id: ID!) {
        customer(id: $id) {
            id
            groups {
                id
                name
            }
        }
    }
`);

export const adminTransitionToStateDocument = graphql(
    `
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
    `,
    [orderFragment],
);

export const cancelOrderDocument = graphql(
    `
        mutation CancelOrder($input: CancelOrderInput!) {
            cancelOrder(input: $input) {
                ...CanceledOrder
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [canceledOrderFragment],
);

export const updateGlobalSettingsDocument = graphql(
    `
        mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
            updateGlobalSettings(input: $input) {
                ...GlobalSettings
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [globalSettingsFragment],
);

export const updateRoleDocument = graphql(
    `
        mutation UpdateRole($input: UpdateRoleInput!) {
            updateRole(input: $input) {
                ...Role
            }
        }
    `,
    [roleFragment],
);

export const getProductsWithVariantPricesDocument = graphql(`
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
`);

export const createProductOptionGroupDocument = graphql(
    `
        mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
            createProductOptionGroup(input: $input) {
                ...ProductOptionGroup
            }
        }
    `,
    [productOptionGroupFragment],
);

export const addOptionGroupToProductDocument = graphql(
    `
        mutation AddOptionGroupToProduct($productId: ID!, $optionGroupId: ID!) {
            addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
                ...ProductWithOptions
            }
        }
    `,
    [productWithOptionsFragment],
);

export const createShippingMethodDocument = graphql(
    `
        mutation CreateShippingMethod($input: CreateShippingMethodInput!) {
            createShippingMethod(input: $input) {
                ...ShippingMethod
            }
        }
    `,
    [shippingMethodFragment],
);

export const settlePaymentDocument = graphql(
    `
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
    `,
    [paymentFragment],
);

export const getOrderHistoryDocument = graphql(`
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
`);

export const updateShippingMethodDocument = graphql(
    `
        mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
            updateShippingMethod(input: $input) {
                ...ShippingMethod
            }
        }
    `,
    [shippingMethodFragment],
);

export const getAssetDocument = graphql(
    `
        query GetAsset($id: ID!) {
            asset(id: $id) {
                ...Asset
                width
                height
            }
        }
    `,
    [assetFragment],
);

export const getAssetFragmentFirstDocument = graphql(`
    fragment AssetFragFirst on Asset {
        id
        preview
    }

    query GetAssetFragmentFirst($id: ID!) {
        asset(id: $id) {
            ...AssetFragFirst
        }
    }
`);

export const assetWithTagsAndFocalPointFragmentDocument = graphql(
    `
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
    `,
    [assetFragment],
);

export const createAssetsDocument = graphql(
    `
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
    `,
    [assetWithTagsAndFocalPointFragmentDocument],
);

export const deleteShippingMethodDocument = graphql(`
    mutation DeleteShippingMethod($id: ID!) {
        deleteShippingMethod(id: $id) {
            result
            message
        }
    }
`);

export const assignPromotionsToChannelDocument = graphql(`
    mutation AssignPromotionToChannel($input: AssignPromotionsToChannelInput!) {
        assignPromotionsToChannel(input: $input) {
            id
            name
        }
    }
`);

export const removePromotionsFromChannelDocument = graphql(`
    mutation RemovePromotionFromChannel($input: RemovePromotionsFromChannelInput!) {
        removePromotionsFromChannel(input: $input) {
            id
            name
        }
    }
`);

export const getTaxRatesListDocument = graphql(
    `
        query GetTaxRates($options: TaxRateListOptions) {
            taxRates(options: $options) {
                items {
                    ...TaxRate
                }
                totalItems
            }
        }
    `,
    [taxRateFragment],
);
export const getShippingMethodListDocument = graphql(
    `
        query GetShippingMethodList {
            shippingMethods {
                items {
                    ...ShippingMethod
                }
                totalItems
            }
        }
    `,
    [shippingMethodFragment],
);

export const getCollectionsDocument = graphql(`
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
`);

export const transitionPaymentToStateDocument = graphql(
    `
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
    `,
    [paymentFragment],
);

export const getProductVariantListDocument = graphql(`
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
`);

export const deletePromotionDocument = graphql(`
    mutation DeletePromotion($id: ID!) {
        deletePromotion(id: $id) {
            result
        }
    }
`);

export const getChannelsDocument = graphql(`
    query GetChannels {
        channels {
            items {
                id
                code
                token
            }
        }
    }
`);

export const updateAdministratorDocument = graphql(
    `
        mutation UpdateAdministrator($input: UpdateAdministratorInput!) {
            updateAdministrator(input: $input) {
                ...Administrator
            }
        }
    `,
    [administratorFragment],
);

export const assignCollectionsToChannelDocument = graphql(
    `
        mutation AssignCollectionsToChannel($input: AssignCollectionsToChannelInput!) {
            assignCollectionsToChannel(input: $input) {
                ...Collection
            }
        }
    `,
    [collectionFragment],
);

export const getCollectionDocument = graphql(
    `
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
    `,
    [collectionFragment],
);

export const getFacetWithValuesDocument = graphql(
    `
        query GetFacetWithValues($id: ID!) {
            facet(id: $id) {
                ...FacetWithValues
            }
        }
    `,
    [facetWithValuesFragment],
);

export const getFacetWithValueListDocument = graphql(
    `
        query GetFacetWithValueList($id: ID!, $options: FacetValueListOptions) {
            facet(id: $id) {
                id
                languageCode
                isPrivate
                code
                name
                valueList(options: $options) {
                    items {
                        ...FacetValue
                    }
                    totalItems
                }
            }
        }
    `,
    [facetValueFragment],
);

export const getFacetValuesDocument = graphql(
    `
        query GetFacetValues($options: FacetValueListOptions) {
            facetValues(options: $options) {
                items {
                    ...FacetValue
                }
                totalItems
            }
        }
    `,
    [facetValueFragment],
);

export const getFacetValueDocument = graphql(
    `
        query GetFacetValue($id: ID!) {
            facetValue(id: $id) {
                ...FacetValue
            }
        }
    `,
    [facetValueFragment],
);

export const getPromotionDocument = graphql(
    `
        query GetPromotion($id: ID!) {
            promotion(id: $id) {
                ...Promotion
            }
        }
    `,
    [promotionFragment],
);

export const getOrderListDocument = graphql(`
    query GetOrderList($options: OrderListOptions) {
        orders(options: $options) {
            items {
                id
                code
                state
                total
                totalWithTax
                totalQuantity
                customer {
                    id
                    emailAddress
                    lastName
                }
            }
            totalItems
        }
    }
`);

export const getOrderWithPaymentsDocument = graphql(`
    query GetOrderWithPayments($id: ID!) {
        order(id: $id) {
            id
            payments {
                id
                errorMessage
                metadata
                refunds {
                    id
                    total
                }
            }
        }
    }
`);

export const getOrderListWithQtyDocument = graphql(`
    query GetOrderListWithQty($options: OrderListOptions) {
        orders(options: $options) {
            items {
                id
                code
                totalQuantity
                lines {
                    id
                    quantity
                }
            }
        }
    }
`);

export const refundOrderDocument = graphql(
    `
        mutation RefundOrder($input: RefundOrderInput!) {
            refundOrder(input: $input) {
                ...Refund
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [refundFragment],
);

export const settleRefundDocument = graphql(
    `
        mutation SettleRefund($input: SettleRefundInput!) {
            settleRefund(input: $input) {
                ...Refund
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [refundFragment],
);

export const addNoteToOrderDocument = graphql(`
    mutation AddNoteToOrder($input: AddNoteToOrderInput!) {
        addNoteToOrder(input: $input) {
            id
        }
    }
`);

export const updateOrderNoteDocument = graphql(`
    mutation UpdateOrderNote($input: UpdateOrderNoteInput!) {
        updateOrderNote(input: $input) {
            id
            data
            isPublic
        }
    }
`);

export const deleteOrderNoteDocument = graphql(`
    mutation DeleteOrderNote($id: ID!) {
        deleteOrderNote(id: $id) {
            result
            message
        }
    }
`);

export const getOrderLineFulfillmentsDocument = graphql(`
    query GetOrderLineFulfillments($id: ID!) {
        order(id: $id) {
            id
            lines {
                id
                fulfillmentLines {
                    fulfillment {
                        id
                        state
                    }
                    orderLineId
                    quantity
                }
            }
        }
    }
`);

export const getOrderListFulfillmentsDocument = graphql(`
    query GetOrderListFulfillments {
        orders {
            items {
                id
                state
                fulfillments {
                    id
                    state
                    nextStates
                    method
                }
            }
        }
    }
`);

export const cancelPaymentDocument = graphql(
    `
        mutation CancelPayment($paymentId: ID!) {
            cancelPayment(id: $paymentId) {
                ...Payment
                ... on ErrorResult {
                    errorCode
                    message
                }
                ... on PaymentStateTransitionError {
                    transitionError
                }
                ... on CancelPaymentError {
                    paymentErrorMessage
                }
            }
        }
    `,
    [paymentFragment],
);

export const setOrderCustomerDocument = graphql(`
    mutation SetOrderCustomer($input: SetOrderCustomerInput!) {
        setOrderCustomer(input: $input) {
            id
            customer {
                id
            }
        }
    }
`);

export const getOrderAssetEdgeCaseDocument = graphql(`
    query OrderAssetEdgeCase($id: ID!) {
        order(id: $id) {
            lines {
                id
            }
            id
            lines {
                id
                featuredAsset {
                    preview
                }
            }
        }
    }
`);

export const getOrderWithLineCalculatedPropsDocument = graphql(`
    query GetOrderWithLineCalculatedProps($id: ID!) {
        order(id: $id) {
            id
            lines {
                id
                linePriceWithTax
                quantity
            }
        }
    }
`);

export const addManualPaymentDocument = graphql(`
    mutation AddManualPaymentToOrder($input: ManualPaymentInput!) {
        addManualPaymentToOrder(input: $input) {
            ... on Order {
                id
                code
                state
                active
                total
                totalWithTax
                lines {
                    id
                }
                payments {
                    id
                    state
                }
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const modifyOrderDocument = graphql(
    `
        mutation ModifyOrder($input: ModifyOrderInput!) {
            modifyOrder(input: $input) {
                ...OrderWithModifications
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [orderWithModificationsFragment],
);

export const addManualPaymentToOrderDocument = graphql(
    `
        mutation AddManualPayment($input: ManualPaymentInput!) {
            addManualPaymentToOrder(input: $input) {
                ...OrderWithModifications
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `,
    [orderWithModificationsFragment],
);

export const getOrderWithModificationsDocument = graphql(
    `
        query GetOrderWithModifications($id: ID!) {
            order(id: $id) {
                ...OrderWithModifications
            }
        }
    `,
    [orderWithModificationsFragment],
);
