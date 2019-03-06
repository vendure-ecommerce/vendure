import { SelectQueryBuilder } from 'typeorm';

import { ConfigArg, ConfigArgType } from '../../../../shared/generated-types';
import {
    argsArrayToHash,
    ConfigArgs,
    ConfigArgValues,
    ConfigurableOperationDef,
} from '../../common/configurable-operation';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

export type CollectionFilterArgType = ConfigArgType.FACET_VALUE_IDS;
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

export class CollectionFilter<T extends CollectionFilterArgs = {}> implements ConfigurableOperationDef {
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
