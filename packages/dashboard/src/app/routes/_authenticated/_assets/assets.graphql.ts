import { assetFragment } from '@/vdb/graphql/fragments.js';
import { graphql } from '@/vdb/graphql/graphql.js';

export const assetDetailDocument = graphql(
    `
        query AssetDetail($id: ID!) {
            asset(id: $id) {
                ...Asset
                tags {
                    id
                    value
                }
                customFields
            }
        }
    `,
    [assetFragment],
);

export const assetUpdateDocument = graphql(`
    mutation AssetUpdate($input: UpdateAssetInput!) {
        updateAsset(input: $input) {
            id
        }
    }
`);

export const deleteAssetsDocument = graphql(`
    mutation DeleteAssets($input: DeleteAssetsInput!) {
        deleteAssets(input: $input) {
            ... on DeletionResponse {
                result
                message
            }
        }
    }
`);
