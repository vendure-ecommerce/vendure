import gql from 'graphql-tag';

export const CUSTOMER_FRAGMENT = gql`
    fragment Customer on Customer {
        id
        firstName
        lastName
        emailAddress
        user {
            id
            identifier
            lastLogin
        }
    }
`;

export const GET_CUSTOMER_LIST = gql`
    query GetCustomerList($options: CustomerListOptions!) {
        customers(options: $options) {
            items {
                id
                firstName
                lastName
                emailAddress
                user {
                    id
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
