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

export type ElasticSearchResult = SearchResult & {
    inStock: boolean;
};

export type ElasticSearchInput = SearchInput & {
    priceRange?: PriceRange;
    priceRangeWithTax?: PriceRange;
    inStock?: boolean;
    [extendedInputField: string]: any;
};

export type ElasticSearchResponse = SearchResponse & {
    priceRange: SearchPriceData;
    items: ElasticSearchResult[];
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

export enum ElasticSearchSortMode {
    /** Pick the lowest value */
    MIN = 'min',
    /** Pick the highest value */
    MAX = 'max',
    /** Use the sum of all values as sort value. Only applicable for number based array fields */
    SUM = 'sum',
    /** Use the average of all values as sort value. Only applicable for number based array fields */
    AVG = 'avg',
    /** Use the median of all values as sort value. Only applicable for number based array fields */
    MEDIAN = 'median',
}

export type ElasticSearchSortParameter = {
    missing?: '_last' | '_first' | string;
    mode?: ElasticSearchSortMode;
    order: 'asc' | 'desc';
} & { [key: string]: any };

export type ElasticSearchSortInput = Array<{ [key: string]: ElasticSearchSortParameter }>;

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
        productEnabled: boolean;
        productPriceMin: number;
        productPriceMax: number;
        productPriceWithTaxMin: number;
        productPriceWithTaxMax: number;
        productFacetIds: ID[];
        productFacetValueIds: ID[];
        productCollectionIds: ID[];
        productCollectionSlugs: string[];
        productChannelIds: ID[];
        [customMapping: string]: any;
        inStock: boolean;
        productInStock: boolean;
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
    productEnabled: boolean;
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
    fields?: any;
};

export type SearchRequestBody = {
    query?: any;
    sort?: any[];
    from?: number;
    size?: number;
    track_total_hits?: number | boolean;
    aggs?: any;
    collapse?: any;
    _source?: boolean;
    script_fields?: any;
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
            buckets: Array<{ key: string; doc_count: number; total: { value: number } }>;
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

export type GraphQlPrimitive = 'ID' | 'String' | 'Int' | 'Float' | 'Boolean';
export type PrimitiveTypeVariations<T extends GraphQlPrimitive> = T | `${T}!` | `[${T}!]` | `[${T}!]!`;
type GraphQlPermittedReturnType = PrimitiveTypeVariations<GraphQlPrimitive>;

type CustomMappingDefinition<Args extends any[], T extends GraphQlPermittedReturnType, R> = {
    graphQlType: T;
    public?: boolean;
    valueFn: (...args: Args) => Promise<R> | R;
};

type TypeVariationMap<GqlType extends GraphQlPrimitive, TsType> = {
    [Key in PrimitiveTypeVariations<GqlType>]: Key extends `[${string}!]!`
        ? TsType[]
        : Key extends `[${string}!]`
        ? Maybe<TsType[]>
        : Key extends `${string}!`
        ? TsType
        : Maybe<TsType>;
};

type GraphQlTypeMap = TypeVariationMap<'ID', ID> &
    TypeVariationMap<'String', string> &
    TypeVariationMap<'Int', number> &
    TypeVariationMap<'Float', number> &
    TypeVariationMap<'Boolean', boolean>;

export type CustomMapping<Args extends any[]> = {
    [Type in GraphQlPermittedReturnType]: CustomMappingDefinition<Args, Type, GraphQlTypeMap[Type]>;
}[GraphQlPermittedReturnType];

export type CustomScriptContext = 'product' | 'variant' | 'both';
type CustomScriptMappingDefinition<Args extends any[], T extends GraphQlPermittedReturnType> = {
    graphQlType: T;
    context: CustomScriptContext;
    scriptFn: (...args: Args) => { script: string };
};

export type CustomScriptMapping<Args extends any[]> = {
    [Type in GraphQlPermittedReturnType]: CustomScriptMappingDefinition<Args, Type>;
}[GraphQlPermittedReturnType];
