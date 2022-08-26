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
    QueryPreviewCollectionVariantsArgs,
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
import { RelationPaths, Relations } from '../../decorators/relations.decorator';
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
        @Relations({
            entity: Collection,
            omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
        })
        relations: RelationPaths<Collection>,
    ): Promise<PaginatedList<Translated<Collection>>> {
        return this.collectionService.findAll(ctx, args.options || undefined, relations).then(res => {
            res.items.forEach(this.encodeFilters);
            return res;
        });
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    async collection(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryCollectionArgs,
        @Relations({
            entity: Collection,
            omit: ['productVariants', 'assets', 'parent.productVariants', 'children.productVariants'],
        })
        relations: RelationPaths<Collection>,
    ): Promise<Translated<Collection> | undefined> {
        let collection: Translated<Collection> | undefined;
        if (args.id) {
            collection = await this.collectionService.findOne(ctx, args.id, relations);
            if (args.slug && collection && collection.slug !== args.slug) {
                throw new UserInputError(`error.collection-id-slug-mismatch`);
            }
        } else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug, relations);
        } else {
            throw new UserInputError(`error.collection-id-or-slug-must-be-provided`);
        }

        return this.encodeFilters(collection);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadCollection)
    previewCollectionVariants(@Ctx() ctx: RequestContext, @Args() args: QueryPreviewCollectionVariantsArgs) {
        this.configurableOperationCodec.decodeConfigurableOperationIds(CollectionFilter, args.input.filters);
        return this.collectionService.previewCollectionVariants(ctx, args.input, args.options || undefined);
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
