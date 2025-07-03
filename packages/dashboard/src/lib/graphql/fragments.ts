import { graphql, ResultOf } from './graphql.js';

export const assetFragment = graphql(`
    fragment Asset on Asset {
        id
        createdAt
        updatedAt
        name
        fileSize
        mimeType
        type
        preview
        source
        width
        height
        focalPoint {
            x
            y
        }
    }
`);

export type AssetFragment = ResultOf<typeof assetFragment>;

export const configurableOperationFragment = graphql(`
    fragment ConfigurableOperation on ConfigurableOperation {
        args {
            name
            value
        }
        code
    }
`);

export type ConfigurableOperationFragment = ResultOf<typeof configurableOperationFragment>;

export const configurableOperationDefFragment = graphql(`
    fragment ConfigurableOperationDef on ConfigurableOperationDefinition {
        args {
            name
            type
            required
            defaultValue
            list
            ui
            label
            description
        }
        code
        description
    }
`);

export const errorResultFragment = graphql(`
    fragment ErrorResult on ErrorResult {
        errorCode
        message
    }
`);

export type ConfigurableOperationDefFragment = ResultOf<typeof configurableOperationDefFragment>;
