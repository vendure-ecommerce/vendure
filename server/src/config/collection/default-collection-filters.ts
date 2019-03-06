import { Brackets } from 'typeorm';

import { ConfigArgType } from '../../../../shared/generated-types';

import { CollectionFilter } from './collection-filter';

/**
 * Filters for ProductVariants having the given facetValueIds (including parent Product)
 */
export const facetValueCollectionFilter = new CollectionFilter({
    args: {
        facetValueIds: ConfigArgType.FACET_VALUE_IDS,
    },
    code: 'facet-value-filter',
    description: 'Filter by FacetValues',
    apply: (qb, args) => {
        qb.leftJoin('productVariant.product', 'product')
            .leftJoin('product.facetValues', 'productFacetValues')
            .leftJoin('productVariant.facetValues', 'variantFacetValues')
            .andWhere(
                new Brackets(qb1 => {
                    const ids = args.facetValueIds;
                    return qb1
                        .where(`productFacetValues.id IN (:...ids)`, { ids })
                        .orWhere(`variantFacetValues.id IN (:...ids)`, { ids });
                }),
            )
            .groupBy('productVariant.id')
            .having(`COUNT(1) = :count`, { count: args.facetValueIds.length });
        return qb;
    },
});
