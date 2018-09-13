import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAssetVariables, Permission } from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { Asset } from '../../entity/asset/asset.entity';
import { AssetService } from '../../service/asset.service';
import { RequestContextPipe } from '../common/request-context.pipe';
import { Allow } from '../roles-guard';

@Resolver('Auth')
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
    async createAsset(@Args() args: CreateAssetVariables): Promise<Asset> {
        return this.assetService.create(args.input);
    }
}
