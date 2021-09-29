import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ConfigurableOperationDefinition,
    DeletionResponse,
    MutationCreateCollectionArgs,
    MutationDeleteCollectionArgs,
    MutationMoveCollectionArgs,
    MutationUpdateCollectionArgs,
    Permission,
    QueryCollectionArgs,
    QueryCollectionsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { UserInputError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { CollectionFilter } from '../../../config/catalog/collection-filter';
import { Collection } from '../../../entity/collection/collection.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ConfigurableOperationCodec } from '../../common/configurable-operation-codec';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver()
export class CollectionResolver {
    constructor(
        private collectionService: CollectionService,
        private facetValueService: FacetValueService,
        private configurableOperationCodec: ConfigurableOperationCodec,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    async collectionFilters(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionsArgs,
    ): Promise<ConfigurableOperationDefinition[]> {
        return this.collectionService.getAvailableFilters(ctx);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    async collections(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionsArgs,
    ): Promise<PaginatedList<Translated<Collection>>> {
        return this.collectionService.findAll(ctx, args.options || undefined).then(res => {
            res.items.forEach(this.encodeFilters);
            return res;
        });
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    async collection(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionArgs,
    ): Promise<Translated<Collection> | undefined> {
        let collection: Translated<Collection> | undefined;
        if (args.id) {
            collection = await this.collectionService.findOne(ctx, args.id);
            if (args.slug && collection && collection.slug !== args.slug) {
                throw new UserInputError(`error.collection-id-slug-mismatch`);
            }
        } else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug);
        } else {
            throw new UserInputError(`error.collection-id-or-slug-must-be-provided`);
        }

        return this.encodeFilters(collection);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog, Permission.CreateCollection)
    async createCollection(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateCollectionArgs,
    ): Promise<Translated<Collection>> {
        const { input } = args;
        this.configurableOperationCodec.decodeConfigurableOperationIds(CollectionFilter, input.filters);
        return this.collectionService.create(ctx, input).then(this.encodeFilters);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateCollection)
    async updateCollection(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateCollectionArgs,
    ): Promise<Translated<Collection>> {
        const { input } = args;
        this.configurableOperationCodec.decodeConfigurableOperationIds(CollectionFilter, input.filters || []);
        return this.collectionService.update(ctx, input).then(this.encodeFilters);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateCollection)
    async moveCollection(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationMoveCollectionArgs,
    ): Promise<Translated<Collection>> {
        const { input } = args;
        return this.collectionService.move(ctx, input).then(this.encodeFilters);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog, Permission.DeleteCollection)
    async deleteCollection(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCollectionArgs,
    ): Promise<DeletionResponse> {
        return this.collectionService.delete(ctx, args.id);
    }

    /**
     * Encodes any entity IDs used in the filter arguments.
     */
    private encodeFilters = <T extends Collection | undefined>(collection: T): T => {
        if (collection) {
            this.configurableOperationCodec.encodeConfigurableOperationIds(
                CollectionFilter,
                collection.filters,
            );
        }
        return collection;
    };
}
