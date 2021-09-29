import { LanguageCode, LogicalOperator, PriceRange, SortOrder } from '@vendure/common/lib/generated-types';
import { DeepRequired, ID, UserInputError } from '@vendure/core';

import { SearchConfig } from './options';
import { ElasticSearchInput, SearchRequestBody } from './types';

/**
 * Given a SearchInput object, returns the corresponding Elasticsearch body.
 */
export function buildElasticBody(
    input: ElasticSearchInput,
    searchConfig: DeepRequired<SearchConfig>,
    channelId: ID,
    languageCode: LanguageCode,
    enabledOnly: boolean = false,
): SearchRequestBody {
    const {
        term,
        facetValueIds,
        facetValueOperator,
        collectionId,
        collectionSlug,
        groupByProduct,
        skip,
        take,
        sort,
        priceRangeWithTax,
        priceRange,
        facetValueFilters,
    } = input;
    const query: any = {
        bool: {},
    };
    ensureBoolFilterExists(query);
    query.bool.filter.push({ term: { channelId } });
    query.bool.filter.push({ term: { languageCode } });

    if (term) {
        query.bool.must = [
            {
                multi_match: {
                    query: term,
                    type: searchConfig.multiMatchType,
                    fields: [
                        `productName^${searchConfig.boostFields.productName}`,
                        `productVariantName^${searchConfig.boostFields.productVariantName}`,
                        `description^${searchConfig.boostFields.description}`,
                        `sku^${searchConfig.boostFields.sku}`,
                    ],
                },
            },
        ];
    }
    if (facetValueIds && facetValueIds.length) {
        ensureBoolFilterExists(query);
        const operator = facetValueOperator === LogicalOperator.AND ? 'must' : 'should';
        query.bool.filter = query.bool.filter.concat([
            {
                bool: { [operator]: facetValueIds.map(id => ({ term: { facetValueIds: id } })) },
            },
        ]);
    }
    if (facetValueFilters && facetValueFilters.length) {
        ensureBoolFilterExists(query);
        facetValueFilters.forEach(facetValueFilter => {
            if (facetValueFilter.and && facetValueFilter.or && facetValueFilter.or.length) {
                throw new UserInputError('error.facetfilterinput-invalid-input');
            }

            if (facetValueFilter.and) {
                query.bool.filter.push({ term: { facetValueIds: facetValueFilter.and } });
            }

            if (facetValueFilter.or && facetValueFilter.or.length) {
                query.bool.filter.push({
                    bool: { ['should']: facetValueFilter.or.map(id => ({ term: { facetValueIds: id } })) },
                });
            }
        });
    }
    if (collectionId) {
        ensureBoolFilterExists(query);
        query.bool.filter.push({ term: { collectionIds: collectionId } });
    }
    if (collectionSlug) {
        ensureBoolFilterExists(query);
        query.bool.filter.push({ term: { collectionSlugs: collectionSlug } });
    }
    if (enabledOnly) {
        ensureBoolFilterExists(query);
        query.bool.filter.push({ term: { enabled: true } });
    }
    if (priceRange) {
        ensureBoolFilterExists(query);
        query.bool.filter = query.bool.filter.concat(createPriceFilters(priceRange, false, !!groupByProduct));
    }
    if (priceRangeWithTax) {
        ensureBoolFilterExists(query);
        query.bool.filter = query.bool.filter.concat(
            createPriceFilters(priceRangeWithTax, true, !!groupByProduct),
        );
    }

    const sortArray = [];
    if (sort) {
        if (sort.name) {
            sortArray.push({
                'productName.keyword': { order: sort.name === SortOrder.ASC ? 'asc' : 'desc' },
            });
        }
        if (sort.price) {
            const priceField = groupByProduct ? 'priceMin' : 'price';
            sortArray.push({ [priceField]: { order: sort.price === SortOrder.ASC ? 'asc' : 'desc' } });
        }
    }
    return {
        query: searchConfig.mapQuery
            ? searchConfig.mapQuery(query, input, searchConfig, channelId, enabledOnly)
            : query,
        sort: sortArray,
        from: skip || 0,
        size: take || 10,
        track_total_hits: searchConfig.totalItemsMaxSize,
    };
}

function ensureBoolFilterExists(query: { bool: { filter?: any } }) {
    if (!query.bool.filter) {
        query.bool.filter = [];
    }
}

function createPriceFilters(range: PriceRange, withTax: boolean, groupByProduct: boolean): any[] {
    const withTaxFix = withTax ? 'WithTax' : '';
    if (groupByProduct) {
        return [
            {
                range: {
                    [`price${withTaxFix}Min`]: {
                        gte: range.min,
                    },
                },
            },
            {
                range: {
                    [`price${withTaxFix}Max`]: {
                        lte: range.max,
                    },
                },
            },
        ];
    } else {
        return [
            {
                range: {
                    ['price' + withTaxFix]: {
                        gte: range.min,
                        lte: range.max,
                    },
                },
            },
        ];
    }
}
