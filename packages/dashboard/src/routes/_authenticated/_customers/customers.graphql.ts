import { graphql } from '@/graphql/graphql.js';
import { gql } from 'awesome-graphql-client';

export const customerListDocument = graphql(`
    query GetCustomerList($options: CustomerListOptions) {
        customers(options: $options) {
            items {
                id
                createdAt
                updatedAt
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
`);

export const addressFragment = graphql(`
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
`);

export const customerDetailDocument = graphql(
    `
        query GetCustomerDetail($id: ID!) {
            customer(id: $id) {
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
        }
    `,
    [addressFragment],
);

export const createCustomerDocument = graphql(`
    mutation CreateCustomer($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
            __typename
            ... on Customer {
                id
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const updateCustomerDocument = graphql(`
    mutation UpdateCustomer($input: UpdateCustomerInput!) {
        updateCustomer(input: $input) {
            __typename
            ... on Customer {
                id
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`);

export const createCustomerAddressDocument = graphql(`
    mutation CreateCustomerAddress($customerId: ID!, $input: CreateAddressInput!) {
        createCustomerAddress(customerId: $customerId, input: $input) {
            id
        }
    }
`);

export const updateCustomerAddressDocument = graphql(`
    mutation UpdateCustomerAddress($input: UpdateAddressInput!) {
        updateCustomerAddress(input: $input) {
            id
        }
    }
`);
