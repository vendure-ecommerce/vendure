import gql from 'graphql-tag';

export const CONFIGURABLE_OPERATION_FRAGMENT = gql`
    fragment ConfigurableOperation on ConfigurableOperation {
        args {
            name
            type
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
            config
        }
        code
        description
    }
`;
