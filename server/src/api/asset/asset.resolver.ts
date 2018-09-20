import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAssetsVariables, Permission } from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Asset } from '../../entity/asset/asset.entity';
import { AssetService } from '../../service/asset.service';
import { RequestContextPipe } from '../common/request-context.pipe';
import { Allow } from '../roles-guard';

@Resolver('Assets')
export class AssetResolver {
    constructor(private assetService: AssetService) {}

    /**
     * Returns a list of Assets
     */
    @Query()
    @Allow(Permission.ReadCatalog)
    async asset(@Args() args: any): Promise<Asset | undefined> {
        return this.assetService.findOne(args.id);
    }

    /**
     * Returns a list of Assets
     */
    @Query()
    @Allow(Permission.ReadCatalog)
    async assets(@Args() args: any): Promise<PaginatedList<Asset>> {
        return this.assetService.findAll(args.options);
    }

    /**
     * Create a new Asset
     */
    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createAssets(@Args() args: CreateAssetsVariables): Promise<Asset[]> {
        return Promise.all(args.input.map(asset => this.assetService.create(asset)));
    }
}
