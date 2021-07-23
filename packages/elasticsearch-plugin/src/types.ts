import {
    Coordinate,
    CurrencyCode,
    LanguageCode,
    PriceRange,
    SearchInput,
    SearchResponse,
    SearchResult,
} from '@vendure/common/lib/generated-types';
import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';
import { Asset, SerializedRequestContext } from '@vendure/core';

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
    productAssetId: ID | undefined;
    productPreview: string;
    productPreviewFocalPoint: Coordinate | undefined;
    productVariantAssetId: ID | undefined;
    productVariantPreview: string;
    productVariantPreviewFocalPoint: Coordinate | undefined;
};

export type VariantIndexItem = Omit<
    SearchResult,
    'score' | 'price' | 'priceWithTax' | 'productAsset' | 'productVariantAsset'
> &
    IndexItemAssets & {
        channelId: ID;
        languageCode: LanguageCode;
        price: number;
        priceWithTax: number;
        collectionSlugs: string[];
        [customMapping: string]: any;
    };

export type ProductIndexItem = IndexItemAssets & {
    sku: string;
    slug: string;
    productId: ID;
    channelId: ID;
    languageCode: LanguageCode;
    productName: string;
    productVariantId: ID;
    productVariantName: string;
    currencyCode: CurrencyCode;
    description: string;
    facetIds: ID[];
    facetValueIds: ID[];
    collectionIds: ID[];
    collectionSlugs: string[];
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
    track_total_hits?: number | boolean;
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
    ctx: SerializedRequestContext;
};

export type UpdateProductMessageData = {
    ctx: SerializedRequestContext;
    productId: ID;
};

export type UpdateVariantMessageData = {
    ctx: SerializedRequestContext;
    variantIds: ID[];
};

export interface UpdateVariantsByIdMessageData {
    ctx: SerializedRequestContext;
    ids: ID[];
}

export interface ProductChannelMessageData {
    ctx: SerializedRequestContext;
    productId: ID;
    channelId: ID;
}

export type VariantChannelMessageData = {
    ctx: SerializedRequestContext;
    productVariantId: ID;
    channelId: ID;
};

export interface UpdateAssetMessageData {
    ctx: SerializedRequestContext;
    asset: JsonCompatible<Required<Asset>>;
}

type Maybe<T> = T | undefined;
type CustomMappingDefinition<Args extends any[], T extends string, R> = {
    graphQlType: T;
    valueFn: (...args: Args) => R;
};

type NamedJobData<Type extends string, MessageData> = { type: Type } & MessageData;

export type ReindexJobData = NamedJobData<'reindex', ReindexMessageData>;
type UpdateProductJobData = NamedJobData<'update-product', UpdateProductMessageData>;
type UpdateVariantsJobData = NamedJobData<'update-variants', UpdateVariantMessageData>;
type DeleteProductJobData = NamedJobData<'delete-product', UpdateProductMessageData>;
type DeleteVariantJobData = NamedJobData<'delete-variant', UpdateVariantMessageData>;
type UpdateVariantsByIdJobData = NamedJobData<'update-variants-by-id', UpdateVariantsByIdMessageData>;
type UpdateAssetJobData = NamedJobData<'update-asset', UpdateAssetMessageData>;
type DeleteAssetJobData = NamedJobData<'delete-asset', UpdateAssetMessageData>;
type AssignProductToChannelJobData = NamedJobData<'assign-product-to-channel', ProductChannelMessageData>;
type RemoveProductFromChannelJobData = NamedJobData<'remove-product-from-channel', ProductChannelMessageData>;
type AssignVariantToChannelJobData = NamedJobData<'assign-variant-to-channel', VariantChannelMessageData>;
type RemoveVariantFromChannelJobData = NamedJobData<'remove-variant-from-channel', VariantChannelMessageData>;
export type UpdateIndexQueueJobData =
    | ReindexJobData
    | UpdateProductJobData
    | UpdateVariantsJobData
    | DeleteProductJobData
    | DeleteVariantJobData
    | UpdateVariantsByIdJobData
    | UpdateAssetJobData
    | DeleteAssetJobData
    | AssignProductToChannelJobData
    | RemoveProductFromChannelJobData
    | AssignVariantToChannelJobData
    | RemoveVariantFromChannelJobData;

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
