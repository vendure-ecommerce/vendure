import gql from 'graphql-tag';

import {
    ADMINISTRATOR_FRAGMENT,
    ASSET_FRAGMENT,
    COLLECTION_FRAGMENT,
    COUNTRY_FRAGMENT,
    CURRENT_USER_FRAGMENT,
    CUSTOMER_FRAGMENT,
    FACET_WITH_VALUES_FRAGMENT,
    PRODUCT_VARIANT_FRAGMENT,
    PRODUCT_WITH_VARIANTS_FRAGMENT,
    ROLE_FRAGMENT,
    TAX_RATE_FRAGMENT
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
    query GetProductWithVariants($id: ID, $slug: String, $languageCode: LanguageCode) {
        product(languageCode: $languageCode, slug: $slug, id: $id) {
            ...ProductWithVariants
        }
    }
    ${PRODUCT_WITH_VARIANTS_FRAGMENT}
`;

export const GET_PRODUCT_LIST = gql`
    query GetProductList($options: ProductListOptions, $languageCode: LanguageCode) {
        products(languageCode: $languageCode, options: $options) {
            items {
                id
                enabled
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
                user {
                    id
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
    mutation AttemptLogin($username: String!, $password: String!, $rememberMe: Boolean!) {
        login(username: $username, password: $password, rememberMe: $rememberMe) {
            user {
                ...CurrentUser
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
    query GetFacetList($options: FacetListOptions, $languageCode: LanguageCode) {
        facets(languageCode: $languageCode, options: $options) {
            items {
                ...FacetWithValues
            }
            totalItems
        }
    }
    ${FACET_WITH_VALUES_FRAGMENT}
`;

export const DELETE_PRODUCT = gql`
    mutation DeleteProduct($id: ID!) {
        deleteProduct(id: $id) {
            result
        }
    }
`;

export const GET_PRODUCT_SIMPLE = gql`
    query GetProductSimple($id: ID, $slug: String, $languageCode: LanguageCode) {
        product(languageCode: $languageCode, slug: $slug, id: $id) {
            id
            slug
        }
    }
`;
