import { ConfigArg } from '@vendure/common/lib/generated-types';
import { ConfigArgSubset, ConfigArgType } from '@vendure/common/lib/shared-types';
import { SelectQueryBuilder } from 'typeorm';

import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
    LocalizedStringArray,
} from '../../common/configurable-operation';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

export type CollectionFilterArgType = ConfigArgSubset<'facetValueIds' | 'string' | 'boolean'>;
export type CollectionFilterArgs = ConfigArgs<CollectionFilterArgType>;

export type ApplyCollectionFilterFn<T extends CollectionFilterArgs> = (
    qb: SelectQueryBuilder<ProductVariant>,
    args: ConfigArgValues<T>,
) => SelectQueryBuilder<ProductVariant>;

export interface CollectionFilterConfig<T extends CollectionFilterArgs> {
    args: T;
    code: string;
    description: LocalizedStringArray;
    apply: ApplyCollectionFilterFn<T>;
}

export class CollectionFilter<T extends CollectionFilterArgs = {}> implements ConfigurableOperationDef {
    readonly code: string;
    readonly args: CollectionFilterArgs;
    readonly description: LocalizedStringArray;
    private readonly applyFn: ApplyCollectionFilterFn<T>;

    constructor(config: CollectionFilterConfig<T>) {
        this.code = config.code;
        this.description = config.description;
        this.args = config.args;
        this.applyFn = config.apply;
    }

    apply(qb: SelectQueryBuilder<ProductVariant>, args: ConfigArg[]): SelectQueryBuilder<ProductVariant> {
        return this.applyFn(qb, argsArrayToHash(args));
    }
}
