import {
    CurrencyCode,
    PriceRange,
    SearchInput,
    SearchResponse,
    SearchResult,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

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

export type VariantIndexItem = Omit<SearchResult, 'score' | 'price' | 'priceWithTax'> & {
    price: number;
    priceWithTax: number;
};
export type ProductIndexItem = {
    sku: string[];
    slug: string[];
    productId: ID;
    productName: string[];
    productPreview: string;
    productVariantId: ID[];
    productVariantName: string[];
    productVariantPreview: string[];
    currencyCode: CurrencyCode;
    description: string;
    facetIds: ID[];
    facetValueIds: ID[];
    collectionIds: ID[];
    enabled: boolean;
    priceMin: number;
    priceMax: number;
    priceWithTaxMin: number;
    priceWithTaxMax: number;
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
    }
};
export type BulkResponseBody = {
    took: number;
    errors: boolean;
    items: BulkResponseResult[];
};
