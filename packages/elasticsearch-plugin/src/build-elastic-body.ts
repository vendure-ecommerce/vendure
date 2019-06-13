import { SearchInput, SortOrder } from '@vendure/common/lib/generated-types';

import { SearchRequestBody } from './types';

/**
 * Given a SearchInput object, returns the corresponding Elasticsearch body.
 */
export function buildElasticBody(input: SearchInput, enabledOnly: boolean = false): SearchRequestBody {
    const { term, facetValueIds, collectionId, groupByProduct, skip, take, sort } = input;
    const query: any = {
        bool: {},
    };
    if (term) {
        query.bool.must = [
            {
                multi_match: {
                    query: term,
                    type: 'best_fields',
                    fields: [
                        'productName',
                        'productVariantName',
                        'description',
                        'sku',
                    ],
                },
            },
        ];
    }
    if (facetValueIds && facetValueIds.length) {
        ensureBoolFilterExists(query);
        query.bool.filter = query.bool.filter.concat(
            facetValueIds.map(id => ({ term: { facetValueIds: id }})),
        );
    }
    if (collectionId) {
        ensureBoolFilterExists(query);
        query.bool.filter.push(
            { term: { collectionIds: collectionId } },
        );
    }
    if (enabledOnly) {
        ensureBoolFilterExists(query);
        query.bool.filter.push(
            { term: { enabled: true } },
        );
    }

    const sortArray = [];
    if (sort) {
        if (sort.name) {
            sortArray.push({ productName: { order: (sort.name === SortOrder.ASC) ? 'asc' : 'desc' } });
        }
        if (sort.price) {
            const priceField = groupByProduct ? 'priceMin' : 'price';
            sortArray.push({ [priceField]: { order: (sort.price === SortOrder.ASC) ? 'asc' : 'desc' } });
        }
    }
    return {
        query,
        sort: sortArray,
        from: skip || 0,
        size: take || 10,
    };
}

function ensureBoolFilterExists(query: { bool: { filter?: any; } }) {
    if (!query.bool.filter) {
        query.bool.filter = [];
    }
}
