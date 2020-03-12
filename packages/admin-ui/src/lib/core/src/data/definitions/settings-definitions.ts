import gql from 'graphql-tag';

export const COUNTRY_FRAGMENT = gql`
    fragment Country on Country {
        id
        createdAt
        updatedAt
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

export const GET_AVAILABLE_COUNTRIES = gql`
    query GetAvailableCountries {
        countries(options: { filter: { enabled: { eq: true } } }) {
            items {
                id
                code
                name
                enabled
            }
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

export const DELETE_COUNTRY = gql`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
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
        createdAt
        updatedAt
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

export const DELETE_TAX_CATEGORY = gql`
    mutation DeleteTaxCategory($id: ID!) {
        deleteTaxCategory(id: $id) {
            result
            message
        }
    }
`;

export const TAX_RATE_FRAGMENT = gql`
    fragment TaxRate on TaxRate {
        id
        createdAt
        updatedAt
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

export const DELETE_TAX_RATE = gql`
    mutation DeleteTaxRate($id: ID!) {
        deleteTaxRate(id: $id) {
            result
            message
        }
    }
`;

export const CHANNEL_FRAGMENT = gql`
    fragment Channel on Channel {
        id
        createdAt
        updatedAt
        code
        token
        pricesIncludeTax
        currencyCode
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

export const DELETE_CHANNEL = gql`
    mutation DeleteChannel($id: ID!) {
        deleteChannel(id: $id) {
            result
            message
        }
    }
`;

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        createdAt
        updatedAt
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

export const GLOBAL_SETTINGS_FRAGMENT = gql`
    fragment GlobalSettings on GlobalSettings {
        availableLanguages
        trackInventory
    }
`;

export const GET_GLOBAL_SETTINGS = gql`
    query GetGlobalSettings {
        globalSettings {
            ...GlobalSettings
        }
    }
    ${GLOBAL_SETTINGS_FRAGMENT}
`;

export const UPDATE_GLOBAL_SETTINGS = gql`
    mutation UpdateGlobalSettings($input: UpdateGlobalSettingsInput!) {
        updateGlobalSettings(input: $input) {
            ...GlobalSettings
        }
    }
    ${GLOBAL_SETTINGS_FRAGMENT}
`;

export const CUSTOM_FIELD_CONFIG_FRAGMENT = gql`
    fragment CustomFieldConfig on CustomField {
        name
        type
        description {
            languageCode
            value
        }
        label {
            languageCode
            value
        }
        readonly
    }
`;

export const STRING_CUSTOM_FIELD_FRAGMENT = gql`
    fragment StringCustomField on StringCustomFieldConfig {
        ...CustomFieldConfig
        pattern
        options {
            label {
                languageCode
                value
            }
            value
        }
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;
export const LOCALE_STRING_CUSTOM_FIELD_FRAGMENT = gql`
    fragment LocaleStringCustomField on LocaleStringCustomFieldConfig {
        ...CustomFieldConfig
        pattern
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;
export const BOOLEAN_CUSTOM_FIELD_FRAGMENT = gql`
    fragment BooleanCustomField on BooleanCustomFieldConfig {
        ...CustomFieldConfig
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;
export const INT_CUSTOM_FIELD_FRAGMENT = gql`
    fragment IntCustomField on IntCustomFieldConfig {
        ...CustomFieldConfig
        intMin: min
        intMax: max
        intStep: step
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;
export const FLOAT_CUSTOM_FIELD_FRAGMENT = gql`
    fragment FloatCustomField on FloatCustomFieldConfig {
        ...CustomFieldConfig
        floatMin: min
        floatMax: max
        floatStep: step
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;
export const DATE_TIME_CUSTOM_FIELD_FRAGMENT = gql`
    fragment DateTimeCustomField on DateTimeCustomFieldConfig {
        ...CustomFieldConfig
        datetimeMin: min
        datetimeMax: max
        datetimeStep: step
    }
    ${CUSTOM_FIELD_CONFIG_FRAGMENT}
`;

export const ALL_CUSTOM_FIELDS_FRAGMENT = gql`
    fragment CustomFields on CustomField {
        ... on StringCustomFieldConfig {
            ...StringCustomField
        }
        ... on LocaleStringCustomFieldConfig {
            ...LocaleStringCustomField
        }
        ... on BooleanCustomFieldConfig {
            ...BooleanCustomField
        }
        ... on IntCustomFieldConfig {
            ...IntCustomField
        }
        ... on FloatCustomFieldConfig {
            ...FloatCustomField
        }
        ... on DateTimeCustomFieldConfig {
            ...DateTimeCustomField
        }
    }
    ${STRING_CUSTOM_FIELD_FRAGMENT}
    ${LOCALE_STRING_CUSTOM_FIELD_FRAGMENT}
    ${BOOLEAN_CUSTOM_FIELD_FRAGMENT}
    ${INT_CUSTOM_FIELD_FRAGMENT}
    ${FLOAT_CUSTOM_FIELD_FRAGMENT}
    ${DATE_TIME_CUSTOM_FIELD_FRAGMENT}
`;

export const GET_SERVER_CONFIG = gql`
    query GetServerConfig {
        globalSettings {
            serverConfig {
                customFieldConfig {
                    Address {
                        ...CustomFields
                    }
                    Collection {
                        ...CustomFields
                    }
                    Customer {
                        ...CustomFields
                    }
                    Facet {
                        ...CustomFields
                    }
                    FacetValue {
                        ...CustomFields
                    }
                    GlobalSettings {
                        ...CustomFields
                    }
                    Order {
                        ...CustomFields
                    }
                    OrderLine {
                        ...CustomFields
                    }
                    Product {
                        ...CustomFields
                    }
                    ProductOption {
                        ...CustomFields
                    }
                    ProductOptionGroup {
                        ...CustomFields
                    }
                    ProductVariant {
                        ...CustomFields
                    }
                    User {
                        ...CustomFields
                    }
                }
            }
        }
    }
    ${ALL_CUSTOM_FIELDS_FRAGMENT}
`;

export const JOB_INFO_FRAGMENT = gql`
    fragment JobInfo on JobInfo {
        id
        name
        state
        progress
        duration
        result
    }
`;

export const GET_JOB_INFO = gql`
    query GetJobInfo($id: String!) {
        job(jobId: $id) {
            ...JobInfo
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const GET_ALL_JOBS = gql`
    query GetAllJobs($input: JobListInput) {
        jobs(input: $input) {
            ...JobInfo
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const REINDEX = gql`
    mutation Reindex {
        reindex {
            ...JobInfo
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const SEARCH_FOR_TEST_ORDER = gql`
    query SearchForTestOrder($term: String!, $take: Int!) {
        search(input: { groupByProduct: false, term: $term, take: $take }) {
            items {
                productVariantId
                productVariantName
                productPreview
                price {
                    ... on SinglePrice {
                        value
                    }
                }
                priceWithTax {
                    ... on SinglePrice {
                        value
                    }
                }
                sku
            }
        }
    }
`;
