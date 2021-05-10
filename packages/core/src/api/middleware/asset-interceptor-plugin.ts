import { Asset } from '@vendure/common/lib/generated-types';
import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServiceContext } from 'apollo-server-plugin-base';
import { DocumentNode, GraphQLNamedType, isUnionType } from 'graphql';

import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';
import { ConfigService } from '../../config/config.service';
import { GraphqlValueTransformer } from '../common/graphql-value-transformer';

/**
 * Transforms outputs so that any Asset instances are run through the {@link AssetStorageStrategy.toAbsoluteUrl}
 * method before being returned in the response.
 */
export class AssetInterceptorPlugin implements ApolloServerPlugin {
    private graphqlValueTransformer: GraphqlValueTransformer;
    private readonly toAbsoluteUrl: AssetStorageStrategy['toAbsoluteUrl'] | undefined;

    constructor(private configService: ConfigService) {
        const { assetOptions } = this.configService;
        if (assetOptions.assetStorageStrategy.toAbsoluteUrl) {
            this.toAbsoluteUrl = assetOptions.assetStorageStrategy.toAbsoluteUrl.bind(
                assetOptions.assetStorageStrategy,
            );
        }
    }

    serverWillStart(service: GraphQLServiceContext): Promise<void> | void {
        this.graphqlValueTransformer = new GraphqlValueTransformer(service.schema);
    }

    requestDidStart(): GraphQLRequestListener {
        return {
            willSendResponse: requestContext => {
                const { document } = requestContext;
                if (document) {
                    const data = requestContext.response.data;
                    const req = requestContext.context.req;
                    if (data) {
                        this.prefixAssetUrls(req, document, data);
                    }
                }
            },
        };
    }

    private prefixAssetUrls(request: any, document: DocumentNode, data: Record<string, any>) {
        const typeTree = this.graphqlValueTransformer.getOutputTypeTree(document);
        const toAbsoluteUrl = this.toAbsoluteUrl;
        if (!toAbsoluteUrl) {
            return;
        }
        this.graphqlValueTransformer.transformValues(typeTree, data, (value, type) => {
            if (!type) {
                return value;
            }
            const isAssetType = this.isAssetType(type);
            const isUnionWithAssetType = isUnionType(type) && type.getTypes().find(t => this.isAssetType(t));
            if (isAssetType || isUnionWithAssetType) {
                if (value && !Array.isArray(value)) {
                    if (value.preview) {
                        value.preview = toAbsoluteUrl(request, value.preview);
                    }
                    if (value.source) {
                        value.source = toAbsoluteUrl(request, value.source);
                    }
                }
            }
            return value;
        });
    }

    private isAssetType(type: GraphQLNamedType): boolean {
        const assetTypeNames = ['Asset', 'SearchResultAsset'];
        return assetTypeNames.includes(type.name);
    }
}
