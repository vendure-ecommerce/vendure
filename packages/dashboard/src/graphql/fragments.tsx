import { graphql, ResultOf } from "./graphql.js";

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
