import { Brackets, SelectQueryBuilder } from 'typeorm';

import { ConfigArg } from '../../../../shared/generated-types';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { argsArrayToHash, ConfigArgs, ConfigArgValues } from '../common/config-args';

export type CollectionFilterArgType = 'facetValueIds';
export type CollectionFilterArgs = ConfigArgs<CollectionFilterArgType>;

export type ApplyCollectionFilterFn<T extends CollectionFilterArgs> = (
    qb: SelectQueryBuilder<ProductVariant>,
    args: ConfigArgValues<T>,
) => SelectQueryBuilder<ProductVariant>;

export interface CollectionFilterConfig<T extends CollectionFilterArgs> {
    args: T;
    code: string;
    description: string;
    apply: ApplyCollectionFilterFn<T>;
}

export class CollectionFilter<T extends CollectionFilterArgs = {}> {
    readonly code: string;
    readonly args: CollectionFilterArgs;
    readonly description: string;
    private readonly applyFn: ApplyCollectionFilterFn<T>;

    constructor(config: CollectionFilterConfig<T>) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.applyFn = config.apply;
    }

    apply(qb: SelectQueryBuilder<ProductVariant>, args: ConfigArg[]) {
        return this.applyFn(qb, argsArrayToHash(args));
    }
}

export const facetValueCollectionFilter = new CollectionFilter({
    args: {
        facetValueIds: 'facetValueIds',
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
