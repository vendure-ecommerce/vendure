import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateAssetsArgs,
    MutationUpdateAssetArgs,
    Permission,
    QueryAssetArgs,
    QueryAssetsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Asset } from '../../../entity/asset/asset.entity';
import { AssetService } from '../../../service/services/asset.service';
import { Allow } from '../../decorators/allow.decorator';

@Resolver('Asset')
export class AssetResolver {
    constructor(private assetService: AssetService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    async asset(@Args() args: QueryAssetArgs): Promise<Asset | undefined> {
        return this.assetService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async assets(@Args() args: QueryAssetsArgs): Promise<PaginatedList<Asset>> {
        return this.assetService.findAll(args.options || undefined);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createAssets(@Args() args: MutationCreateAssetsArgs): Promise<Asset[]> {
        // TODO: Is there some way to parellelize this while still preserving
        // the order of files in the upload? Non-deterministic IDs mess up the e2e test snapshots.
        const assets: Asset[] = [];
        for (const input of args.input) {
            const asset = await this.assetService.create(input);
            assets.push(asset);
        }
        return assets;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateAsset(@Args() { input }: MutationUpdateAssetArgs) {
        return this.assetService.update(input);
    }
}
