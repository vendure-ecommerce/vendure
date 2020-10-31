import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigurableOperation } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { ID } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';

import { ConfigService } from '../../config/config.service';
import { Logger } from '../../config/logger/vendure-logger';
import { Collection } from '../../entity/collection/collection.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { asyncObservable } from '../../worker/async-observable';
import { CollectionService } from '../services/collection.service';
import { TransactionalConnection } from '../transaction/transactional-connection';
import { ApplyCollectionFiltersMessage } from '../types/collection-messages';

/**
 * Updates collections on the worker process because running the CollectionFilters
 * is computationally expensive.
 */
@Controller()
export class CollectionController {
    constructor(
        private connection: TransactionalConnection,
        private collectionService: CollectionService,
        private configService: ConfigService,
    ) {}

    @MessagePattern(ApplyCollectionFiltersMessage.pattern)
    applyCollectionFilters({
        collectionIds,
    }: ApplyCollectionFiltersMessage['data']): Observable<ApplyCollectionFiltersMessage['response']> {
        return asyncObservable(async observer => {
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
        try {
            await this.connection
                .getRepository(Collection)
                // Only update the exact changed properties, to avoid VERY hard-to-debug
                // non-deterministic race conditions e.g. when the "position" is changed
                // by moving a Collection and then this save operation clobbers it back
                // to the old value.
                .save(pick(collection, ['id', 'productVariants']), {
                    chunk: Math.ceil(collection.productVariants.length / 500),
                    reload: false,
                });
        } catch (e) {
            Logger.error(e);
        }

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
        const { collectionFilters } = this.configService.catalogOptions;
        let qb = this.connection.getRepository(ProductVariant).createQueryBuilder('productVariant');

        for (const filterType of collectionFilters) {
            const filtersOfType = filters.filter(f => f.code === filterType.code);
            if (filtersOfType.length) {
                for (const filter of filtersOfType) {
                    qb = filterType.apply(qb, filter.args);
                }
            }
        }

        return qb.getMany();
    }
}
