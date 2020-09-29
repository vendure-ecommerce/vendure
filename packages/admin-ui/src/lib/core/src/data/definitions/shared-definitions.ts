import gql from 'graphql-tag';

export const CONFIGURABLE_OPERATION_FRAGMENT = gql`
    fragment ConfigurableOperation on ConfigurableOperation {
        args {
            name
            value
        }
        code
    }
`;

export const CONFIGURABLE_OPERATION_DEF_FRAGMENT = gql`
    fragment ConfigurableOperationDef on ConfigurableOperationDefinition {
        args {
            name
            type
            list
            ui
            label
        }
        code
        description
    }
`;

export const ERROR_RESULT_FRAGMENT = gql`
    fragment ErrorResult on ErrorResult {
        errorCode
        message
    }
`;
