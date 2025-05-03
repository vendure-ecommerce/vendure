import { assetFragment } from '@/graphql/fragments.js';
import { graphql } from '@/graphql/graphql.js';

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
