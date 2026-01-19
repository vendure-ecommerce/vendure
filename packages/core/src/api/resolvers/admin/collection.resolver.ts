import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    ConfigurableOperationDefinition,
    DeletionResponse,
    MutationAssignCollectionsToChannelArgs,
    MutationCreateCollectionArgs,
    MutationDeleteCollectionArgs,
    MutationDeleteCollectionsArgs,
    MutationMoveCollectionArgs,
    MutationRemoveCollectionsFromChannelArgs,
    MutationUpdateCollectionArgs,
    Permission,
    QueryCollectionArgs,
    QueryCollectionsArgs,
    QueryPreviewCollectionVariantsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { GraphQLResolveInfo } from 'graphql';

import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
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
        private requestContextCache: RequestContextCacheService,
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
        @Info() info: GraphQLResolveInfo,
    ): Promise<PaginatedList<Translated<Collection>>> {
        const collections = await this.collectionService.findAll(ctx, args.options || undefined, relations);
        // Only cache collection IDs if productVariantCount is requested in the query
        if (this.isFieldRequested(info, 'productVariantCount')) {
            const collectionIds = collections.items.map(c => c.id);
            this.requestContextCache.set(ctx, 'CollectionService.collectionIds', collectionIds);
        }
        return collections;
    }

    /**
     * Checks if a specific field is requested in the GraphQL query selection set.
     * Looks for the field within the 'items' selection of a paginated list.
     */
    private isFieldRequested(info: GraphQLResolveInfo, fieldName: string): boolean {
        for (const fieldNode of info.fieldNodes) {
            const selections = fieldNode.selectionSet?.selections ?? [];
            for (const selection of selections) {
                if (selection.kind === 'Field' && selection.name.value === 'items') {
                    const itemSelections = selection.selectionSet?.selections ?? [];
                    for (const itemSelection of itemSelections) {
                        if (itemSelection.kind === 'Field' && itemSelection.name.value === fieldName) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
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
                throw new UserInputError('error.collection-id-slug-mismatch');
            }
        } else if (args.slug) {
            collection = await this.collectionService.findOneBySlug(ctx, args.slug, relations);
        } else {
            throw new UserInputError('error.collection-id-or-slug-must-be-provided');
        }
        return collection;
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
        const collection = await this.collectionService.create(ctx, input);
        return collection;
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
        return this.collectionService.update(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateCollection)
    async moveCollection(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationMoveCollectionArgs,
    ): Promise<Translated<Collection>> {
        const { input } = args;
        return this.collectionService.move(ctx, input);
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

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog, Permission.DeleteCollection)
    async deleteCollections(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteCollectionsArgs,
    ): Promise<DeletionResponse[]> {
        return Promise.all(args.ids.map(id => this.collectionService.delete(ctx, id)));
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog, Permission.CreateCollection)
    async assignCollectionsToChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAssignCollectionsToChannelArgs,
    ): Promise<Array<Translated<Collection>>> {
        return await this.collectionService.assignCollectionsToChannel(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog, Permission.DeleteCollection)
    async removeCollectionsFromChannel(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveCollectionsFromChannelArgs,
    ): Promise<Array<Translated<Collection>>> {
        return await this.collectionService.removeCollectionsFromChannel(ctx, args.input);
    }
}
