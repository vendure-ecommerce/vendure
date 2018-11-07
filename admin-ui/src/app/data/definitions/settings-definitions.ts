import gql from 'graphql-tag';

export const COUNTRY_FRAGMENT = gql`
    fragment Country on Country {
        id
        code
        name
        enabled
        translations {
            id
            languageCode
            name
        }
    }
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

export const GET_COUNTRY = gql`
    query GetCountry($id: ID!) {
        country(id: $id) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const CREATE_COUNTRY = gql`
    mutation CreateCountry($input: CreateCountryInput!) {
        createCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const UPDATE_COUNTRY = gql`
    mutation UpdateCountry($input: UpdateCountryInput!) {
        updateCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const ZONE_FRAGMENT = gql`
    fragment Zone on Zone {
        id
        name
        members {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const GET_ZONES = gql`
    query GetZones {
        zones {
            id
            name
            members {
                id
                name
                code
            }
        }
    }
`;

export const GET_ZONE = gql`
    query GetZone($id: ID!) {
        zone(id: $id) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const CREATE_ZONE = gql`
    mutation CreateZone($input: CreateZoneInput!) {
        createZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const UPDATE_ZONE = gql`
    mutation UpdateZone($input: UpdateZoneInput!) {
        updateZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const ADD_MEMBERS_TO_ZONE = gql`
    mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
        addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const REMOVE_MEMBERS_FROM_ZONE = gql`
    mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {
        removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const TAX_CATEGORY_FRAGMENT = gql`
    fragment TaxCategory on TaxCategory {
        id
        name
    }
`;

export const GET_TAX_CATEGORIES = gql`
    query GetTaxCategories {
        taxCategories {
            ...TaxCategory
        }
    }
    ${TAX_CATEGORY_FRAGMENT}
`;

export const GET_TAX_CATEGORY = gql`
    query GetTaxCategory($id: ID!) {
        taxCategory(id: $id) {
            ...TaxCategory
        }
    }
    ${TAX_CATEGORY_FRAGMENT}
`;

export const CREATE_TAX_CATEGORY = gql`
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
        createTaxCategory(input: $input) {
            ...TaxCategory
        }
    }
    ${TAX_CATEGORY_FRAGMENT}
`;

export const UPDATE_TAX_CATEGORY = gql`
    mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
        updateTaxCategory(input: $input) {
            ...TaxCategory
        }
    }
    ${TAX_CATEGORY_FRAGMENT}
`;

export const TAX_RATE_FRAGMENT = gql`
    fragment TaxRate on TaxRate {
        id
        name
        enabled
        value
        category {
            id
            name
        }
        zone {
            id
            name
        }
        customerGroup {
            id
            name
        }
    }
`;

export const GET_TAX_RATE_LIST = gql`
    query GetTaxRateList($options: TaxRateListOptions) {
        taxRates(options: $options) {
            items {
                ...TaxRate
            }
            totalItems
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const GET_TAX_RATE = gql`
    query GetTaxRate($id: ID!) {
        taxRate(id: $id) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const CREATE_TAX_RATE = gql`
    mutation CreateTaxRate($input: CreateTaxRateInput!) {
        createTaxRate(input: $input) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const UPDATE_TAX_RATE = gql`
    mutation UpdateTaxRate($input: UpdateTaxRateInput!) {
        updateTaxRate(input: $input) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const CHANNEL_FRAGMENT = gql`
    fragment Channel on Channel {
        id
        code
        token
        pricesIncludeTax
        defaultLanguageCode
        defaultShippingZone {
            id
            name
        }
        defaultTaxZone {
            id
            name
        }
    }
`;

export const GET_CHANNELS = gql`
    query GetChannels {
        channels {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const GET_CHANNEL = gql`
    query GetChannel($id: ID!) {
        channel(id: $id) {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const GET_ACTIVE_CHANNEL = gql`
    query GetActiveChannel {
        activeChannel {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const CREATE_CHANNEL = gql`
    mutation CreateChannel($input: CreateChannelInput!) {
        createChannel(input: $input) {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const UPDATE_CHANNEL = gql`
    mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        code
        enabled
        configArgs {
            name
            type
            value
        }
    }
`;

export const GET_PAYMENT_METHOD_LIST = gql`
    query GetPaymentMethodList($options: PaymentMethodListOptions!) {
        paymentMethods(options: $options) {
            items {
                ...PaymentMethod
            }
            totalItems
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const GET_PAYMENT_METHOD = gql`
    query GetPaymentMethod($id: ID!) {
        paymentMethod(id: $id) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const UPDATE_PAYMENT_METHOD = gql`
    mutation UpdatePaymentMethod($input: UpdatePaymentMethodInput!) {
        updatePaymentMethod(input: $input) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;
