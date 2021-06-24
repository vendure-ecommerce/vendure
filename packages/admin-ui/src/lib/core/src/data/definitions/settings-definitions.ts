import { gql } from 'apollo-angular';

import {
    CONFIGURABLE_OPERATION_DEF_FRAGMENT,
    CONFIGURABLE_OPERATION_FRAGMENT,
    ERROR_RESULT_FRAGMENT,
} from './shared-definitions';

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
            createdAt
            updatedAt
            name
            members {
                createdAt
                updatedAt
                id
                name
                code
                enabled
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

export const DELETE_ZONE = gql`
    mutation DeleteZone($id: ID!) {
        deleteZone(id: $id) {
            message
            result
        }
    }
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
        isDefault
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
            ...ErrorResult
        }
    }
    ${CHANNEL_FRAGMENT}
    ${ERROR_RESULT_FRAGMENT}
`;

export const UPDATE_CHANNEL = gql`
    mutation UpdateChannel($input: UpdateChannelInput!) {
        updateChannel(input: $input) {
            ...Channel
            ...ErrorResult
        }
    }
    ${CHANNEL_FRAGMENT}
    ${ERROR_RESULT_FRAGMENT}
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
        name
        code
        description
        enabled
        checker {
            ...ConfigurableOperation
        }
        handler {
            ...ConfigurableOperation
        }
    }
    ${CONFIGURABLE_OPERATION_FRAGMENT}
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

export const GET_PAYMENT_METHOD_OPERATIONS = gql`
    query GetPaymentMethodOperations {
        paymentMethodEligibilityCheckers {
            ...ConfigurableOperationDef
        }
        paymentMethodHandlers {
            ...ConfigurableOperationDef
        }
    }
    ${CONFIGURABLE_OPERATION_DEF_FRAGMENT}
`;

export const GET_PAYMENT_METHOD = gql`
    query GetPaymentMethod($id: ID!) {
        paymentMethod(id: $id) {
            ...PaymentMethod
        }
    }
    ${PAYMENT_METHOD_FRAGMENT}
`;

export const CREATE_PAYMENT_METHOD = gql`
    mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
        createPaymentMethod(input: $input) {
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

export const DELETE_PAYMENT_METHOD = gql`
    mutation DeletePaymentMethod($id: ID!, $force: Boolean) {
        deletePaymentMethod(id: $id, force: $force) {
            result
            message
        }
    }
`;

export const GLOBAL_SETTINGS_FRAGMENT = gql`
    fragment GlobalSettings on GlobalSettings {
        id
        availableLanguages
        trackInventory
        outOfStockThreshold
        serverConfig {
            permissions {
                name
                description
                assignable
            }
            orderProcess {
                name
            }
        }
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
            ...ErrorResult
        }
    }
    ${GLOBAL_SETTINGS_FRAGMENT}
    ${ERROR_RESULT_FRAGMENT}
`;

export const CUSTOM_FIELD_CONFIG_FRAGMENT = gql`
    fragment CustomFieldConfig on CustomField {
        name
        type
        list
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
export const TEXT_CUSTOM_FIELD_FRAGMENT = gql`
    fragment TextCustomField on TextCustomFieldConfig {
        ...CustomFieldConfig
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
export const RELATION_CUSTOM_FIELD_FRAGMENT = gql`
    fragment RelationCustomField on RelationCustomFieldConfig {
        ...CustomFieldConfig
        entity
        scalarFields
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
        ... on TextCustomFieldConfig {
            ...TextCustomField
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
        ... on RelationCustomFieldConfig {
            ...RelationCustomField
        }
    }
    ${STRING_CUSTOM_FIELD_FRAGMENT}
    ${LOCALE_STRING_CUSTOM_FIELD_FRAGMENT}
    ${TEXT_CUSTOM_FIELD_FRAGMENT}
    ${BOOLEAN_CUSTOM_FIELD_FRAGMENT}
    ${INT_CUSTOM_FIELD_FRAGMENT}
    ${FLOAT_CUSTOM_FIELD_FRAGMENT}
    ${DATE_TIME_CUSTOM_FIELD_FRAGMENT}
    ${RELATION_CUSTOM_FIELD_FRAGMENT}
`;

export const GET_SERVER_CONFIG = gql`
    query GetServerConfig {
        globalSettings {
            id
            serverConfig {
                orderProcess {
                    name
                    to
                }
                permittedAssetTypes
                permissions {
                    name
                    description
                    assignable
                }
                customFieldConfig {
                    Address {
                        ...CustomFields
                    }
                    Administrator {
                        ...CustomFields
                    }
                    Asset {
                        ...CustomFields
                    }
                    Channel {
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
                    Fulfillment {
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
                    ShippingMethod {
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
    fragment JobInfo on Job {
        id
        createdAt
        startedAt
        settledAt
        queueName
        state
        isSettled
        progress
        duration
        data
        result
        error
    }
`;

export const GET_JOB_INFO = gql`
    query GetJobInfo($id: ID!) {
        job(jobId: $id) {
            ...JobInfo
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const GET_JOBS_LIST = gql`
    query GetAllJobs($options: JobListOptions) {
        jobs(options: $options) {
            items {
                ...JobInfo
            }
            totalItems
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const GET_JOBS_BY_ID = gql`
    query GetJobsById($ids: [ID!]!) {
        jobsById(jobIds: $ids) {
            ...JobInfo
        }
    }
    ${JOB_INFO_FRAGMENT}
`;

export const GET_JOB_QUEUE_LIST = gql`
    query GetJobQueueList {
        jobQueues {
            name
            running
        }
    }
`;

export const CANCEL_JOB = gql`
    mutation CancelJob($id: ID!) {
        cancelJob(jobId: $id) {
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
