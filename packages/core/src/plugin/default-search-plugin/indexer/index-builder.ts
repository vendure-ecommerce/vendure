import { Connection, ConnectionOptions, createConnection, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ID, Type } from '../../../../../common/lib/shared-types';
import { unique } from '../../../../../common/lib/unique';
import { RequestContext } from '../../../api/common/request-context';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { SearchIndexItem } from '../search-index-item.entity';

import { CompletedMessage, ConnectedMessage, Message, MessageType, ReturnRawBatchMessage, SaveVariantsPayload, VariantsSavedMessage } from './ipc';

export const BATCH_SIZE = 500;
export const variantRelations = [
    'product',
    'product.featuredAsset',
    'product.facetValues',
    'product.facetValues.facet',
    'featuredAsset',
    'facetValues',
    'facetValues.facet',
    'collections',
    'taxCategory',
];

export function getSearchIndexQueryBuilder(connection: Connection) {
    const qb = connection.getRepository(ProductVariant).createQueryBuilder('variants');
    FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
        relations: variantRelations,
    });
    FindOptionsUtils.joinEagerRelations(qb, qb.alias, connection.getMetadata(ProductVariant));
    return qb;
}

/**
 * This class is responsible for all updates to the search index.
 */
export class IndexBuilder {
    private connection: Connection;
    private indexQueryBuilder: SelectQueryBuilder<ProductVariant>;
    private onMessageHandlers = new Set<(message: string) => void>();

    /**
     * When running in the main process, it should be constructed with the existing connection.
     * Otherwise, the connection will be created in the .connect() method in response to an
     * IPC message.
     */
    constructor(connection?: Connection) {
        if (connection) {
            this.connection = connection;
            this.indexQueryBuilder = getSearchIndexQueryBuilder(this.connection);
        }
    }

    processMessage(message: Message): Promise<Message | undefined> {
        switch (message.type) {
            case MessageType.CONNECTION_OPTIONS: {
                return this.connect(message.value);
            }
            case MessageType.GET_RAW_BATCH: {
                return this.getRawBatch(message.value.batchNumber);
            }
            case MessageType.GET_RAW_BATCH_BY_IDS: {
                return this.getRawBatchByIds(message.value.ids);
            }
            case MessageType.SAVE_VARIANTS: {
                return this.saveVariants(message.value);
            }
            default:
                return Promise.resolve(undefined);
        }
    }

    async processMessageAndEmitResult(message: Message) {
        const result = await this.processMessage(message);
        if (result) {
            result.channelId = message.channelId;
            this.onMessageHandlers.forEach(handler => {
                handler(JSON.stringify(result));
            });
        }
    }

    addMessageListener<T extends Message>(handler: (message: string) => void) {
        this.onMessageHandlers.add(handler);
    }

    removeMessageListener<T extends Message>(handler: (message: string) => void) {
        this.onMessageHandlers.delete(handler);
    }

    private async connect(dbConnectionOptions: ConnectionOptions): Promise<ConnectedMessage> {
        const {coreEntitiesMap} = await import('../../../entity/entities');
        const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;
        this.connection = await createConnection({...dbConnectionOptions, entities: [SearchIndexItem, ...coreEntities]});
        this.indexQueryBuilder = getSearchIndexQueryBuilder(this.connection);
        return new ConnectedMessage(this.connection.isConnected);
    }

    private async getRawBatchByIds(ids: ID[]): Promise<ReturnRawBatchMessage> {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(ids, {
            relations: variantRelations,
        });
        return new ReturnRawBatchMessage({variants});
    }

    private async getRawBatch(batchNumber: string | number): Promise<ReturnRawBatchMessage> {
        const i = Number.parseInt(batchNumber.toString(), 10);
        const variants = await this.indexQueryBuilder
            .where('variants__product.deletedAt IS NULL')
            .take(BATCH_SIZE)
            .skip(i * BATCH_SIZE)
            .getMany();

        return new ReturnRawBatchMessage({variants});
    }

    private async saveVariants(payload: SaveVariantsPayload): Promise<VariantsSavedMessage | CompletedMessage> {
        const {variants, ctx, batch, total} = payload;
        const requestContext = new RequestContext(ctx);

        const items = variants.map((v: ProductVariant) =>
            new SearchIndexItem({
                sku: v.sku,
                enabled: v.enabled,
                slug: v.product.slug,
                price: v.price,
                priceWithTax: v.priceWithTax,
                languageCode: requestContext.languageCode,
                productVariantId: v.id,
                productId: v.product.id,
                productName: v.product.name,
                description: v.product.description,
                productVariantName: v.name,
                productPreview: v.product.featuredAsset ? v.product.featuredAsset.preview : '',
                productVariantPreview: v.featuredAsset ? v.featuredAsset.preview : '',
                facetIds: this.getFacetIds(v),
                facetValueIds: this.getFacetValueIds(v),
                collectionIds: v.collections.map(c => c.id.toString()),
            }),
        );
        await this.connection.getRepository(SearchIndexItem).save(items);
        if (batch === total - 1) {
            return new CompletedMessage(true);
        } else {
            return new VariantsSavedMessage({batchNumber: batch});
        }
    }

    private getFacetIds(variant: ProductVariant): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variant.facetValues.map(facetIds);
        const productFacetIds = variant.product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variant: ProductVariant): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variant.facetValues.map(facetValueIds);
        const productFacetValueIds = variant.product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }
}
