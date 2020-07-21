import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset } from '@vendure/common/lib/shared-types';
import { SelectQueryBuilder } from 'typeorm';

import {
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    ConfigurableOperationDefOptions,
} from '../../common/configurable-operation';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

export type CollectionFilterArgType = ConfigArgSubset<'facetValueIds' | 'string' | 'boolean'>;
export type CollectionFilterArgs = ConfigArgs<CollectionFilterArgType>;

export type ApplyCollectionFilterFn<T extends CollectionFilterArgs> = (
    qb: SelectQueryBuilder<ProductVariant>,
    args: ConfigArgValues<T>,
) => SelectQueryBuilder<ProductVariant>;

export interface CollectionFilterConfig<T extends CollectionFilterArgs>
    extends ConfigurableOperationDefOptions<T> {
    apply: ApplyCollectionFilterFn<T>;
}
// tslint:disable:max-line-length
/**
 * @description
 * A CollectionFilter defines a rule which can be used to associate ProductVariants with a Collection.
 * The filtering is done by defining the `apply()` function, which receives a TypeORM
 * [`QueryBuilder`](https://typeorm.io/#/select-query-builder) object to which clauses may be added.
 *
 * Creating a CollectionFilter is considered an advanced Vendure topic. For more insight into how
 * they work, study the [default collection filters](https://github.com/vendure-ecommerce/vendure/blob/master/packages/core/src/config/collection/default-collection-filters.ts)
 *
 * @docsCategory configuration
 */
export class CollectionFilter<T extends CollectionFilterArgs = {}> extends ConfigurableOperationDef<T> {
    // tslint:enable:max-line-length
    private readonly applyFn: ApplyCollectionFilterFn<T>;
    constructor(config: CollectionFilterConfig<T>) {
        super(config);
        this.applyFn = config.apply;
    }

    apply(qb: SelectQueryBuilder<ProductVariant>, args: ConfigArg[]): SelectQueryBuilder<ProductVariant> {
        return this.applyFn(qb, this.argsArrayToHash(args));
    }
}
