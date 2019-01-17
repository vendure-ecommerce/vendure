import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    AssetQueryArgs,
    AssetsQueryArgs,
    CreateAssetsMutationArgs,
    Permission,
} from '../../../../shared/generated-types';
import { PaginatedList } from '../../../../shared/shared-types';
import { Asset } from '../../entity/asset/asset.entity';
import { AssetService } from '../../service/services/asset.service';
import { Allow } from '../decorators/allow.decorator';

@Resolver('Assets')
export class AssetResolver {
    constructor(private assetService: AssetService) {}

    /**
     * Returns a list of Assets
     */
    @Query()
    @Allow(Permission.ReadCatalog)
    async asset(@Args() args: AssetQueryArgs): Promise<Asset | undefined> {
        return this.assetService.findOne(args.id);
    }

    /**
     * Returns a list of Assets
     */
    @Query()
    @Allow(Permission.ReadCatalog)
    async assets(@Args() args: AssetsQueryArgs): Promise<PaginatedList<Asset>> {
        return this.assetService.findAll(args.options || undefined);
    }

    /**
     * Create a new Asset
     */
    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createAssets(@Args() args: CreateAssetsMutationArgs): Promise<Asset[]> {
        // TODO: Is there some way to parellelize this while still preserving
        // the order of files in the upload? Non-deterministic IDs mess up the e2e test snapshots.
        const assets: Asset[] = [];
        for (const input of args.input) {
            const asset = await this.assetService.create(input);
            assets.push(asset);
        }
        return assets;
    }
}
