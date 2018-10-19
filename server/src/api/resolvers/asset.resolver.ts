import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AssetQueryArgs,
    AssetsQueryArgs,
    CreateAssetsMutationArgs,
    Permission,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Asset } from '../../entity/asset/asset.entity';
import { AssetService } from '../../service/services/asset.service';
import { Allow } from '../common/auth-guard';

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
        return Promise.all(args.input.map(asset => this.assetService.create(asset)));
    }
}
