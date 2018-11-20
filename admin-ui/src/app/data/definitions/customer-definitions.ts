import gql from 'graphql-tag';

export const ADDRESS_FRAGMENT = gql`
    fragment Address on Address {
        id
        fullName
        streetLine1
        streetLine2
        city
        province
        postalCode
        country
        phoneNumber
        defaultShippingAddress
        defaultBillingAddress
    }
`;

export const CUSTOMER_FRAGMENT = gql`
    fragment Customer on Customer {
        id
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
    query GetCustomerList($options: CustomerListOptions!) {
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

export const GET_CUSTOMER = gql`
    query GetCustomer($id: ID!) {
        customer(id: $id) {
            ...Customer
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

export const UPDATE_CUSTOMER_ADDRESS = gql`
    mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            ...Address
        }
    }
    ${ADDRESS_FRAGMENT}
`;
