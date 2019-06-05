/* tslint:disable:no-non-null-assertion no-console */
import { Type } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection, ConnectionOptions, createConnection, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../api/common/request-context';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

import {
    CompletedMessage,
    ConnectedMessage,
    ConnectionOptionsMessage,
    GetRawBatchMessage,
    MessageType,
    ReturnRawBatchMessage,
    SaveVariantsMessage,
    SaveVariantsPayload,
    sendIPCMessage,
    VariantsSavedMessage,
} from './ipc';
import { SearchIndexItem } from './search-index-item.entity';

export const BATCH_SIZE = 100;
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

export type IncomingMessage = ConnectionOptionsMessage | GetRawBatchMessage | SaveVariantsMessage;

export class SearchIndexWorker {

    private connection: Connection;
    private indexQueryBuilder: SelectQueryBuilder<ProductVariant>;

    async connect(dbConnectionOptions: ConnectionOptions) {
        const { coreEntitiesMap } = await import('../../entity/entities');
        const coreEntities = Object.values(coreEntitiesMap) as Array<Type<any>>;
        this.connection = await createConnection({ ...dbConnectionOptions, entities: [SearchIndexItem, ...coreEntities] });

        this.indexQueryBuilder = await this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(this.indexQueryBuilder, {
            relations: variantRelations,
        });
        FindOptionsUtils.joinEagerRelations(this.indexQueryBuilder, this.indexQueryBuilder.alias, this.connection.getMetadata(ProductVariant));

        sendIPCMessage(process, new ConnectedMessage(this.connection.isConnected));
    }

    async getRawBatch(batchNumber: string | number) {
        const i = Number.parseInt(batchNumber.toString(), 10);
        const variants = await this.indexQueryBuilder
            .where('variants__product.deletedAt IS NULL')
            .take(BATCH_SIZE)
            .skip(i * BATCH_SIZE)
            .getMany();

        sendIPCMessage(process, new ReturnRawBatchMessage({variants}));
    }

    async saveVariants(payload: SaveVariantsPayload) {
        const { variants, ctx, batch, total } = payload;
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
        sendIPCMessage(process, new VariantsSavedMessage({batchNumber: batch}));
        if (batch === total - 1) {
            sendIPCMessage(process, new CompletedMessage(true));
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

const worker = new SearchIndexWorker();

process.on('message', (messageString) => {
    const message: IncomingMessage = JSON.parse(messageString);
    switch (message.type) {
        case MessageType.CONNECTION_OPTIONS:
            worker.connect(message.value);
            break;
        case MessageType.GET_RAW_BATCH:
            worker.getRawBatch(message.value.batchNumber);
            break;
        case MessageType.SAVE_VARIANTS:
            worker.saveVariants(message.value);
            break;
        default:
            // ignore
    }
});
