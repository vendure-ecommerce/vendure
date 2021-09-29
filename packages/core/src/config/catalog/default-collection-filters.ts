import { LanguageCode } from '@vendure/common/lib/generated-types';
import { customAlphabet } from 'nanoid';

import { UserInputError } from '../../common/error/errors';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

import { CollectionFilter } from './collection-filter';

/**
 * Filters for ProductVariants having the given facetValueIds (including parent Product)
 */
export const facetValueCollectionFilter = new CollectionFilter({
    args: {
        facetValueIds: {
            type: 'ID',
            list: true,
            ui: {
                component: 'facet-value-form-input',
            },
        },
        containsAny: { type: 'boolean' },
    },
    code: 'facet-value-filter',
    description: [{ languageCode: LanguageCode.en, value: 'Filter by FacetValues' }],
    apply: (qb, args) => {
        const ids = args.facetValueIds;

        if (ids.length) {
            const idsName = `ids_${ids.join('_')}`;
            const countName = `count_${ids.join('_')}`;
            const productFacetValues = qb.connection
                .createQueryBuilder(ProductVariant, 'product_variant')
                .select('product_variant.id', 'variant_id')
                .addSelect('facet_value.id', 'facet_value_id')
                .leftJoin('product_variant.facetValues', 'facet_value')
                .where(`facet_value.id IN (:...${idsName})`);

            const variantFacetValues = qb.connection
                .createQueryBuilder(ProductVariant, 'product_variant')
                .select('product_variant.id', 'variant_id')
                .addSelect('facet_value.id', 'facet_value_id')
                .leftJoin('product_variant.product', 'product')
                .leftJoin('product.facetValues', 'facet_value')
                .where(`facet_value.id IN (:...${idsName})`);

            const union = qb.connection
                .createQueryBuilder()
                .select('union_table.variant_id')
                .from(
                    `(${productFacetValues.getQuery()} UNION ${variantFacetValues.getQuery()})`,
                    'union_table',
                )
                .groupBy('variant_id')
                .having(`COUNT(*) >= :${countName}`);

            const variantIds = qb.connection
                .createQueryBuilder()
                .select('variant_ids_table.variant_id')
                .from(`(${union.getQuery()})`, 'variant_ids_table');

            qb.andWhere(`productVariant.id IN (${variantIds.getQuery()})`).setParameters({
                [idsName]: ids,
                [countName]: args.containsAny ? 1 : ids.length,
            });
        } else {
            // If no facetValueIds are specified, no ProductVariants will be matched.
            qb.andWhere('1 = 0');
        }
        return qb;
    },
});

export const variantNameCollectionFilter = new CollectionFilter({
    args: {
        operator: {
            type: 'string',
            ui: {
                component: 'select-form-input',
                options: [
                    { value: 'startsWith' },
                    { value: 'endsWith' },
                    { value: 'contains' },
                    { value: 'doesNotContain' },
                ],
            },
        },
        term: { type: 'string' },
    },
    code: 'variant-name-filter',
    description: [{ languageCode: LanguageCode.en, value: 'Filter by ProductVariant name' }],
    apply: (qb, args) => {
        const translationAlias = `variant_name_filter_translation`;
        const nanoid = customAlphabet('123456789abcdefghijklmnopqrstuvwxyz', 6);
        const termName = `term_${nanoid()}`;
        const hasJoinOnTranslations = !!qb.expressionMap.joinAttributes.find(
            ja => ja.entityOrProperty === 'productVariant.translations',
        );
        if (!hasJoinOnTranslations) {
            qb.leftJoin('productVariant.translations', translationAlias);
        }
        const LIKE = qb.connection.options.type === 'postgres' ? 'ILIKE' : 'LIKE';
        switch (args.operator) {
            case 'contains':
                return qb.andWhere(`${translationAlias}.name ${LIKE} :${termName}`, {
                    [termName]: `%${args.term}%`,
                });
            case 'doesNotContain':
                return qb.andWhere(`${translationAlias}.name NOT ${LIKE} :${termName}`, {
                    [termName]: `%${args.term}%`,
                });
            case 'startsWith':
                return qb.andWhere(`${translationAlias}.name ${LIKE} :${termName}`, {
                    [termName]: `${args.term}%`,
                });
            case 'endsWith':
                return qb.andWhere(`${translationAlias}.name ${LIKE} :${termName}`, {
                    [termName]: `%${args.term}`,
                });
            default:
                throw new UserInputError(`${args.operator} is not a valid operator`);
        }
    },
});

export const defaultCollectionFilters = [facetValueCollectionFilter, variantNameCollectionFilter];
