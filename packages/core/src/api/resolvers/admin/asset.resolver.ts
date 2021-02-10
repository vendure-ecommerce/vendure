import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateAssetResult,
    MutationAssignAssetsToChannelArgs,
    MutationCreateAssetsArgs,
    MutationDeleteAssetArgs,
    MutationDeleteAssetsArgs,
    MutationUpdateAssetArgs,
    Permission,
    QueryAssetArgs,
    QueryAssetsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Asset } from '../../../entity/asset/asset.entity';
import { AssetService } from '../../../service/services/asset.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Asset')
export class AssetResolver {
    constructor(private assetService: AssetService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async asset(@Ctx() ctx: RequestContext, @Args() args: QueryAssetArgs): Promise<Asset | undefined> {
        return this.assetService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async assets(@Ctx() ctx: RequestContext, @Args() args: QueryAssetsArgs): Promise<PaginatedList<Asset>> {
        return this.assetService.findAll(ctx, args.options || undefined);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createAssets(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateAssetsArgs,
    ): Promise<CreateAssetResult[]> {
        // TODO: Is there some way to parellelize this while still preserving
        // the order of files in the upload? Non-deterministic IDs mess up the e2e test snapshots.
        const assets: CreateAssetResult[] = [];
        for (const input of args.input) {
            const asset = await this.assetService.create(ctx, input);
            assets.push(asset);
        }
        return assets;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateAsset(@Ctx() ctx: RequestContext, @Args() { input }: MutationUpdateAssetArgs) {
        return this.assetService.update(ctx, input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteAsset(
        @Ctx() ctx: RequestContext,
        @Args() { input: { assetId, force, deleteFromAllChannels } }: MutationDeleteAssetArgs,
    ) {
        return this.assetService.delete(
            ctx,
            [assetId],
            force || undefined,
            deleteFromAllChannels || undefined,
        );
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteAssets(
        @Ctx() ctx: RequestContext,
        @Args() { input: { assetIds, force, deleteFromAllChannels } }: MutationDeleteAssetsArgs,
    ) {
        return this.assetService.delete(
            ctx,
            assetIds,
            force || undefined,
            deleteFromAllChannels || undefined,
        );
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async assignAssetsToChannel(
        @Ctx() ctx: RequestContext,
        @Args() { input }: MutationAssignAssetsToChannelArgs,
    ) {
        return this.assetService.assignToChannel(ctx, input);
    }
}
