import { ConfigArgType } from '@vendure/common/lib/generated-types';
import { Brackets } from 'typeorm';

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
            .having(`COUNT(1) >= :count`, { count: args.facetValueIds.length });
        return qb;
    },
});

export const variantNameCollectionFilter = new CollectionFilter({
    args: {
        operator: ConfigArgType.STRING_OPERATOR,
        term: ConfigArgType.STRING,
    },
    code: 'variant-name-filter',
    description: 'Filter by ProductVariant name',
    apply: (qb, args) => {
        qb.leftJoin('productVariant.translations', 'translation');
        switch (args.operator) {
            case 'contains':
                return qb.andWhere('translation.name LIKE :term', { term: `%${args.term}%` });
            case 'doesNotContain':
                return qb.andWhere('translation.name NOT LIKE :term', { term: `%${args.term}%` });
            case 'startsWith':
                return qb.andWhere('translation.name LIKE :term', { term: `${args.term}%` });
            case 'endsWith':
                return qb.andWhere('translation.name LIKE :term', { term: `%${args.term}` });
        }
    },
});
