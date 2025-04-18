import { ApolloServerPlugin, GraphQLRequestListener, GraphQLServerContext } from '@apollo/server';
import { getActiveSpan } from '@vendure/telemetry';
import { DocumentNode, GraphQLNamedType, isUnionType } from 'graphql';

import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';
import { ConfigService } from '../../config/config.service';
import { Span } from '../../instrumentation';
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

    async serverWillStart(service: GraphQLServerContext): Promise<void> {
        this.graphqlValueTransformer = new GraphqlValueTransformer(service.schema);
    }

    async requestDidStart(): Promise<GraphQLRequestListener<any>> {
        return {
            willSendResponse: async requestContext => {
                const { document } = requestContext;
                if (document) {
                    const { body } = requestContext.response;
                    const req = requestContext.contextValue.req;
                    if (body.kind === 'single') {
                        this.prefixAssetUrls(req, document, body.singleResult.data);
                    }
                }
            },
        };
    }

    @Span('vendure.asset-interceptor-plugin.prefix-asset-urls')
    private prefixAssetUrls(request: any, document: DocumentNode, data?: Record<string, unknown> | null) {
        const span = getActiveSpan();
        const typeTree = this.graphqlValueTransformer.getOutputTypeTree(document);
        const toAbsoluteUrl = this.toAbsoluteUrl;
        if (!toAbsoluteUrl || !data) {
            span?.addEvent('no-data');
            span?.end();
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
                        span?.setAttribute('preview_relative_url', value.preview);
                        value.preview = toAbsoluteUrl(request, value.preview);
                        span?.setAttribute('preview_absolute_url', value.preview);
                    }
                    if (value.source) {
                        span?.setAttribute('source_relative_url', value.source);
                        value.source = toAbsoluteUrl(request, value.source);
                        span?.setAttribute('source_absolute_url', value.source);
                    }
                }
            }
            span?.end();
            return value;
        });
    }

    private isAssetType(type: GraphQLNamedType): boolean {
        const assetTypeNames = ['Asset', 'SearchResultAsset'];
        return assetTypeNames.includes(type.name);
    }
}
