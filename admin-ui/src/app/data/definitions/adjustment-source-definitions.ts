import gql from 'graphql-tag';

export const ADJUSTMENT_OPERATION_FRAGMENT = gql`
    fragment AdjustmentOperation on AdjustmentOperation {
        args {
            name
            type
            value
        }
        code
        description
        type
    }
`;

export const ADJUSTMENT_SOURCE_FRAGMENT = gql`
    fragment AdjustmentSource on AdjustmentSource {
        id
        createdAt
        updatedAt
        name
        type
        enabled
        conditions {
            ...AdjustmentOperation
        }
        actions {
            ...AdjustmentOperation
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const GET_ADJUSTMENT_SOURCE_LIST = gql`
    query GetAdjustmentSourceList($type: AdjustmentType!, $options: AdjustmentSourceListOptions) {
        adjustmentSources(type: $type, options: $options) {
            items {
                ...AdjustmentSource
            }
            totalItems
        }
    }
    ${ADJUSTMENT_SOURCE_FRAGMENT}
`;

export const GET_ADJUSTMENT_SOURCE = gql`
    query GetAdjustmentSource($id: ID!) {
        adjustmentSource(id: $id) {
            ...AdjustmentSource
        }
    }
    ${ADJUSTMENT_SOURCE_FRAGMENT}
`;

export const GET_ADJUSTMENT_OPERATIONS = gql`
    query GetAdjustmentOperations($type: AdjustmentType!) {
        adjustmentOperations(type: $type) {
            actions {
                ...AdjustmentOperation
            }
            conditions {
                ...AdjustmentOperation
            }
        }
    }
    ${ADJUSTMENT_OPERATION_FRAGMENT}
`;

export const CREATE_ADJUSTMENT_SOURCE = gql`
    mutation CreateAdjustmentSource($input: CreateAdjustmentSourceInput!) {
        createAdjustmentSource(input: $input) {
            ...AdjustmentSource
        }
    }
    ${ADJUSTMENT_SOURCE_FRAGMENT}
`;

export const UPDATE_ADJUSTMENT_SOURCE = gql`
    mutation UpdateAdjustmentSource($input: UpdateAdjustmentSourceInput!) {
        updateAdjustmentSource(input: $input) {
            ...AdjustmentSource
        }
    }
    ${ADJUSTMENT_SOURCE_FRAGMENT}
`;
