import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
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

    @Transaction
    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createAssets(@Ctx() ctx: RequestContext, @Args() args: MutationCreateAssetsArgs): Promise<Asset[]> {
        // TODO: Currently we validate _all_ mime types up-front due to limitations
        // with the existing error handling mechanisms. With a solution as described
        // in https://github.com/vendure-ecommerce/vendure/issues/437 we could defer
        // this check to the individual processing of a single Asset.
        await this.assetService.validateInputMimeTypes(args.input);
        // TODO: Is there some way to parellelize this while still preserving
        // the order of files in the upload? Non-deterministic IDs mess up the e2e test snapshots.
        const assets: Asset[] = [];
        for (const input of args.input) {
            const asset = await this.assetService.create(ctx, input);
            assets.push(asset);
        }
        return assets;
    }

    @Transaction
    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateAsset(@Ctx() ctx: RequestContext, @Args() { input }: MutationUpdateAssetArgs) {
        return this.assetService.update(ctx, input);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteAsset(@Ctx() ctx: RequestContext, @Args() { id, force }: MutationDeleteAssetArgs) {
        return this.assetService.delete(ctx, [id], force || undefined);
    }

    @Transaction
    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteAssets(@Ctx() ctx: RequestContext, @Args() { ids, force }: MutationDeleteAssetsArgs) {
        return this.assetService.delete(ctx, ids, force || undefined);
    }
}
