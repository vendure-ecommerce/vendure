import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Observable } from 'rxjs';
import { Connection } from 'typeorm';

import {
    facetValueCollectionFilter,
    variantNameCollectionFilter,
} from '../../config/collection/default-collection-filters';
import { Logger } from '../../config/logger/vendure-logger';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { CollectionService } from '../services/collection.service';
import { ApplyCollectionFiltersMessage } from '../types/collection-messages';

/**
 * Updates collections on the worker process because running the CollectionFilters
 * is computationally expensive.
 */
@Controller()
export class CollectionController {
    constructor(
        @InjectConnection() private connection: Connection,
        private collectionService: CollectionService,
    ) {}

    @MessagePattern(ApplyCollectionFiltersMessage.pattern)
    applyCollectionFilters({
        collectionIds,
    }: ApplyCollectionFiltersMessage['data']): Observable<ApplyCollectionFiltersMessage['response']> {
        return new Observable(observer => {
            (async () => {
                Logger.verbose(`Processing ${collectionIds.length} Collections`);
                const timeStart = Date.now();
                const collections = await this.connection.getRepository(Collection).findByIds(collectionIds, {
                    relations: ['productVariants'],
                });
                let completed = 0;
                for (const collection of collections) {
                    const affectedVariantIds = await this.applyCollectionFiltersInternal(collection);

                    observer.next({
                        total: collectionIds.length,
                        completed: ++completed,
                        duration: +new Date() - timeStart,
                        collectionId: collection.id,
                        affectedVariantIds,
                    });
                }
                observer.complete();
            })();
        });
    }

    /**
     * Applies the CollectionFilters and returns an array of all affected ProductVariant ids.
     */
    private async applyCollectionFiltersInternal(collection: Collection): Promise<ID[]> {
        const ancestorFilters = await this.collectionService
            .getAncestors(collection.id)
            .then(ancestors =>
                ancestors.reduce(
                    (filters, c) => [...filters, ...(c.filters || [])],
                    [] as ConfigurableOperation[],
                ),
            );
        const preIds = await this.collectionService.getCollectionProductVariantIds(collection);
        collection.productVariants = await this.getFilteredProductVariants([
            ...ancestorFilters,
            ...(collection.filters || []),
        ]);
        const postIds = collection.productVariants.map(v => v.id);
        await this.connection
            .getRepository(Collection)
            .save(collection, { chunk: Math.ceil(collection.productVariants.length / 500) });

        const preIdsSet = new Set(preIds);
        const postIdsSet = new Set(postIds);
        const difference = [
            ...preIds.filter(id => !postIdsSet.has(id)),
            ...postIds.filter(id => !preIdsSet.has(id)),
        ];
        return difference;
    }

    /**
     * Applies the CollectionFilters and returns an array of ProductVariant entities which match.
     */
    private async getFilteredProductVariants(filters: ConfigurableOperation[]): Promise<ProductVariant[]> {
        if (filters.length === 0) {
            return [];
        }
        const facetFilters = filters.filter(f => f.code === facetValueCollectionFilter.code);
        const variantNameFilters = filters.filter(f => f.code === variantNameCollectionFilter.code);
        let qb = this.connection.getRepository(ProductVariant).createQueryBuilder('productVariant');

        // Apply any facetValue-based filters
        if (facetFilters.length) {
            const [idsArg, containsAnyArg] = facetFilters[0].args;
            const mergedArgs = facetFilters
                .map(f => f.args[0].value)
                .filter(notNullOrUndefined)
                .map(value => JSON.parse(value))
                .reduce((all, ids) => [...all, ...ids]);

            qb = facetValueCollectionFilter.apply(qb, [
                {
                    name: idsArg.name,
                    type: idsArg.type,
                    value: JSON.stringify(Array.from(new Set(mergedArgs))),
                },
                containsAnyArg,
            ]);
        }

        // Apply any variant name-based filters
        if (variantNameFilters.length) {
            for (const filter of variantNameFilters) {
                qb = variantNameCollectionFilter.apply(qb, filter.args);
            }
        }

        return qb.getMany();
    }
}
