import gql from 'graphql-tag';

export const ADDRESS_FRAGMENT = gql`
    fragment Address on Address {
        id
        createdAt
        updatedAt
        fullName
        company
        streetLine1
        streetLine2
        city
        province
        postalCode
        country {
            id
            code
            name
        }
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
    }
`;

export const CUSTOMER_FRAGMENT = gql`
    fragment Customer on Customer {
        id
        createdAt
        updatedAt
        title
        firstName
        lastName
        phoneNumber
        emailAddress
        user {
            id
            identifier
            verified
            lastLogin
        }
        addresses {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const GET_CUSTOMER_LIST = gql`
    query GetCustomerList($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                createdAt
                updatedAt
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

export const CREATE_CUSTOMER = gql`
    mutation CreateCustomer($input: CreateCustomerInput!, $password: String) {
        createCustomer(input: $input, password: $password) {
            ...Customer
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

export const UPDATE_CUSTOMER = gql`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            ...Customer
        }
    }
    ${CUSTOMER_FRAGMENT}
`;

export const CREATE_CUSTOMER_ADDRESS = gql`
    mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {
        createCustomerAddress(customerId: $customerId, input: $input) {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;

export const CREATE_CUSTOMER_GROUP = gql`
    mutation CreateCustomerGroup($input: CreateCustomerGroupInput!) {
        createCustomerGroup(input: $input) {
            id
            createdAt
            updatedAt
            name
        }
    }
`;

export const UPDATE_CUSTOMER_GROUP = gql`
    mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
        updateCustomerGroup(input: $input) {
            id
            createdAt
            updatedAt
            name
        }
    }
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
                createdAt
                updatedAt
                name
            }
            totalItems
        }
    }
`;

export const GET_CUSTOMER_GROUP_WITH_CUSTOMERS = gql`
    query GetCustomerGroupWithCustomers($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            id
            createdAt
            updatedAt
            name
            customers(options: $options) {
                items {
                    id
                    createdAt
                    updatedAt
                    emailAddress
                    firstName
                    lastName
                }
                totalItems
            }
        }
    }
`;

export const ADD_CUSTOMERS_TO_GROUP = gql`
    mutation AddCustomersToGroup($groupId: ID!, $customerIds: [ID!]!) {
        addCustomersToGroup(customerGroupId: $groupId, customerIds: $customerIds) {
            id
            createdAt
            updatedAt
            name
        }
    }
`;

export const REMOVE_CUSTOMERS_FROM_GROUP = gql`
    mutation RemoveCustomersFromGroup($groupId: ID!, $customerIds: [ID!]!) {
        removeCustomersFromGroup(customerGroupId: $groupId, customerIds: $customerIds) {
            id
            createdAt
            updatedAt
            name
        }
    }
`;
