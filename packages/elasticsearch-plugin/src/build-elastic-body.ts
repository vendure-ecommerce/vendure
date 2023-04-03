import { LanguageCode, LogicalOperator, PriceRange, SortOrder } from '@vendure/common/lib/generated-types';
import { DeepRequired, ID, UserInputError } from '@vendure/core';

import { SearchConfig } from './options';
import { CustomScriptMapping, ElasticSearchInput, ElasticSearchSortInput, SearchRequestBody } from './types';

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
        inStock,
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
        query.bool.filter = query.bool.filter.concat(createPriceFilters(priceRange, false));
    }
    if (priceRangeWithTax) {
        ensureBoolFilterExists(query);
        query.bool.filter = query.bool.filter.concat(createPriceFilters(priceRangeWithTax, true));
    }

    if (inStock !== undefined) {
        ensureBoolFilterExists(query);
        if (groupByProduct) {
            query.bool.filter.push({ term: { productInStock: inStock } });
        } else {
            query.bool.filter.push({ term: { inStock } });
        }
    }

    const sortArray: ElasticSearchSortInput = [];
    if (sort) {
        if (sort.name) {
            sortArray.push({
                'productName.keyword': { order: sort.name === SortOrder.ASC ? 'asc' : 'desc' },
            });
        }
        if (sort.price) {
            const priceField = 'price';
            sortArray.push({ [priceField]: { order: sort.price === SortOrder.ASC ? 'asc' : 'desc' } });
        }
    }
    const scriptFields: any | undefined = createScriptFields(
        searchConfig.scriptFields,
        input,
        groupByProduct,
    );

    const body: SearchRequestBody = {
        query: searchConfig.mapQuery
            ? searchConfig.mapQuery(query, input, searchConfig, channelId, enabledOnly)
            : query,
        sort: searchConfig.mapSort ? searchConfig.mapSort(sortArray, input) : sortArray,
        from: skip || 0,
        size: take || 10,
        track_total_hits: searchConfig.totalItemsMaxSize,
        ...(scriptFields !== undefined
            ? {
                  _source: true,
                  script_fields: scriptFields,
              }
            : undefined),
    };
    if (groupByProduct) {
        body.collapse = { field: 'productId' };
    }
    return body;
}

function ensureBoolFilterExists(query: { bool: { filter?: any } }) {
    if (!query.bool.filter) {
        query.bool.filter = [];
    }
}

function createScriptFields(
    scriptFields: { [fieldName: string]: CustomScriptMapping<[ElasticSearchInput]> },
    input: ElasticSearchInput,
    groupByProduct?: boolean,
): any | undefined {
    if (scriptFields) {
        const fields = Object.keys(scriptFields);
        if (fields.length) {
            const result: any = {};
            for (const name of fields) {
                const scriptField = scriptFields[name];
                if (scriptField.context === 'product' && groupByProduct === true) {
                    (result )[name] = scriptField.scriptFn(input);
                }
                if (scriptField.context === 'variant' && groupByProduct === false) {
                    (result )[name] = scriptField.scriptFn(input);
                }
                if (scriptField.context === 'both' || scriptField.context === undefined) {
                    (result )[name] = scriptField.scriptFn(input);
                }
            }
            return result;
        }
    }
    return undefined;
}

function createPriceFilters(range: PriceRange, withTax: boolean): any[] {
    const withTaxFix = withTax ? 'WithTax' : '';
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
