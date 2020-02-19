import {
    Coordinate,
    CurrencyCode,
    PriceRange,
    SearchInput,
    SearchResponse,
    SearchResult,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { Asset, RequestContext, WorkerMessage } from '@vendure/core';

export type ElasticSearchInput = SearchInput & {
    priceRange?: PriceRange;
    priceRangeWithTax?: PriceRange;
};

export type ElasticSearchResponse = SearchResponse & {
    priceRange: SearchPriceData;
};

export type SearchPriceData = {
    range: PriceRange;
    rangeWithTax: PriceRange;
    buckets: PriceRangeBucket[];
    bucketsWithTax: PriceRangeBucket[];
};

export type PriceRangeBucket = {
    to: number;
    count: number;
};

export type IndexItemAssets = {
    productAssetId: ID | null;
    productPreview: string;
    productPreviewFocalPoint: Coordinate | null;
    productVariantAssetId: ID | null;
    productVariantPreview: string;
    productVariantPreviewFocalPoint: Coordinate | null;
};

export type VariantIndexItem = Omit<
    SearchResult,
    'score' | 'price' | 'priceWithTax' | 'productAsset' | 'productVariantAsset'
> &
    IndexItemAssets & {
        channelId: ID;
        price: number;
        priceWithTax: number;
        [customMapping: string]: any;
    };

export type ProductIndexItem = IndexItemAssets & {
    sku: string;
    slug: string;
    productId: ID;
    channelId: ID;
    productName: string;
    productVariantId: ID;
    productVariantName: string;
    currencyCode: CurrencyCode;
    description: string;
    facetIds: ID[];
    facetValueIds: ID[];
    collectionIds: ID[];
    channelIds: ID[];
    enabled: boolean;
    priceMin: number;
    priceMax: number;
    priceWithTaxMin: number;
    priceWithTaxMax: number;
    [customMapping: string]: any;
};

export type SearchHit<T> = {
    _id: string;
    _index: string;
    _score: number;
    _source: T;
    _type: string;
};

export type SearchRequestBody = {
    query?: any;
    sort?: any[];
    from?: number;
    size?: number;
    aggs?: any;
};

export type SearchResponseBody<T = any> = {
    hits: {
        hits: Array<SearchHit<T>>;
        total: {
            relation: string;
            value: number;
        };
        max_score: number;
    };
    timed_out: boolean;
    took: number;
    _shards: {
        failed: number;
        skipped: number;
        successful: number;
        total: number;
    };
    aggregations?: {
        [key: string]: {
            doc_count_error_upper_bound: 0;
            sum_other_doc_count: 89;
            buckets: Array<{ key: string; doc_count: number }>;
            value: any;
        };
    };
};

export type BulkOperationType = 'index' | 'update' | 'delete';
export type BulkOperation = { [operation in BulkOperationType]?: { _id: string } };
export type BulkOperationDoc<T> = T | { doc: T; doc_as_upsert?: boolean };
export type BulkResponseResult = {
    [operation in BulkOperationType]?: {
        _index: string;
        _type: string;
        _id: string;
        _version?: number;
        result?: string;
        _shards: {
            total: number;
            successful: number;
            failed: number;
        };
        status: number;
        _seq_no?: number;
        _primary_term?: number;
        error?: any;
    };
};
export type BulkResponseBody = {
    took: number;
    errors: boolean;
    items: BulkResponseResult[];
};

export interface ReindexMessageResponse {
    total: number;
    completed: number;
    duration: number;
}

export type ReindexMessageData = {
    ctx: RequestContext;
    dropIndices: boolean;
};

export type UpdateProductMessageData = {
    ctx: RequestContext;
    productId: ID;
};

export type UpdateVariantMessageData = {
    ctx: RequestContext;
    variantIds: ID[];
};

export interface UpdateVariantsByIdMessageData {
    ctx: RequestContext;
    ids: ID[];
}

export interface ProductChannelMessageData {
    ctx: RequestContext;
    productId: ID;
    channelId: ID;
}
export interface UpdateAssetMessageData {
    ctx: RequestContext;
    asset: Asset;
}

export class ReindexMessage extends WorkerMessage<ReindexMessageData, ReindexMessageResponse> {
    static readonly pattern = 'Reindex';
}
export class UpdateVariantMessage extends WorkerMessage<UpdateVariantMessageData, boolean> {
    static readonly pattern = 'UpdateProduct';
}
export class UpdateProductMessage extends WorkerMessage<UpdateProductMessageData, boolean> {
    static readonly pattern = 'UpdateVariant';
}
export class DeleteVariantMessage extends WorkerMessage<UpdateVariantMessageData, boolean> {
    static readonly pattern = 'DeleteProduct';
}
export class DeleteProductMessage extends WorkerMessage<UpdateProductMessageData, boolean> {
    static readonly pattern = 'DeleteVariant';
}
export class UpdateVariantsByIdMessage extends WorkerMessage<
    UpdateVariantsByIdMessageData,
    ReindexMessageResponse
> {
    static readonly pattern = 'UpdateVariantsById';
}
export class AssignProductToChannelMessage extends WorkerMessage<ProductChannelMessageData, boolean> {
    static readonly pattern = 'AssignProductToChannel';
}
export class RemoveProductFromChannelMessage extends WorkerMessage<ProductChannelMessageData, boolean> {
    static readonly pattern = 'RemoveProductFromChannel';
}
export class UpdateAssetMessage extends WorkerMessage<UpdateAssetMessageData, boolean> {
    static readonly pattern = 'UpdateAsset';
}

type Maybe<T> = T | null | undefined;
type CustomMappingDefinition<Args extends any[], T extends string, R> = {
    graphQlType: T;
    valueFn: (...args: Args) => R;
};

type CustomStringMapping<Args extends any[]> = CustomMappingDefinition<Args, 'String!', string>;
type CustomStringMappingNullable<Args extends any[]> = CustomMappingDefinition<Args, 'String', Maybe<string>>;
type CustomIntMapping<Args extends any[]> = CustomMappingDefinition<Args, 'Int!', number>;
type CustomIntMappingNullable<Args extends any[]> = CustomMappingDefinition<Args, 'Int', Maybe<number>>;
type CustomFloatMapping<Args extends any[]> = CustomMappingDefinition<Args, 'Float!', number>;
type CustomFloatMappingNullable<Args extends any[]> = CustomMappingDefinition<Args, 'Float', Maybe<number>>;
type CustomBooleanMapping<Args extends any[]> = CustomMappingDefinition<Args, 'Boolean!', boolean>;
type CustomBooleanMappingNullable<Args extends any[]> = CustomMappingDefinition<
    Args,
    'Boolean',
    Maybe<boolean>
>;

export type CustomMapping<Args extends any[]> =
    | CustomStringMapping<Args>
    | CustomStringMappingNullable<Args>
    | CustomIntMapping<Args>
    | CustomIntMappingNullable<Args>
    | CustomFloatMapping<Args>
    | CustomFloatMappingNullable<Args>
    | CustomBooleanMapping<Args>
    | CustomBooleanMappingNullable<Args>;
