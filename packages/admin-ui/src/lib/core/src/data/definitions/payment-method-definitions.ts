import { gql } from 'apollo-angular';

import { CONFIGURABLE_OPERATION_DEF_FRAGMENT, CONFIGURABLE_OPERATION_FRAGMENT } from './shared-definitions';

export const PAYMENT_METHOD_FRAGMENT = gql`
    fragment PaymentMethod on PaymentMethod {
        id
        createdAt
        updatedAt
        name
        code
        description
        enabled
        translations {
            id
            languageCode
            name
            description
        }
        checker {
            ...ConfigurableOperation
        }
        handler {
            ...ConfigurableOperation
        }
    }
    ${CONFIGURABLE_OPERATION_FRAGMENT}
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

export const DELETE_PAYMENT_METHODS = gql`
    mutation DeletePaymentMethods($ids: [ID!]!, $force: Boolean) {
        deletePaymentMethods(ids: $ids, force: $force) {
            result
            message
        }
    }
`;
