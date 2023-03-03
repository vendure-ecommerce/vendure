import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    MutationCreateStockLocationArgs,
    MutationDeleteStockLocationArgs,
    MutationUpdateStockLocationArgs,
    Permission,
    QueryStockLocationArgs,
    QueryStockLocationsArgs,
    StockLocationList,
} from '@vendure/common/lib/generated-types';

import { StockLocationService } from '../../../service/services/stock-location.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver()
export class StockLocationResolver {
    constructor(private stockLocationService: StockLocationService) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    stockLocation(@Ctx() ctx: RequestContext, @Args() args: QueryStockLocationArgs) {
        return this.stockLocationService.findOne(ctx, args.id);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    stockLocations(@Ctx() ctx: RequestContext, @Args() args: QueryStockLocationsArgs) {
        return this.stockLocationService.findAll(ctx, args.options);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.CreateCatalog, Permission.CreateProduct)
    createStockLocation(@Ctx() ctx: RequestContext, @Args() args: MutationCreateStockLocationArgs) {
        return this.stockLocationService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    updateStockLocation(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateStockLocationArgs) {
        return this.stockLocationService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.DeleteCatalog, Permission.DeleteProduct)
    deleteStockLocation(@Ctx() ctx: RequestContext, @Args() args: MutationDeleteStockLocationArgs) {
        return this.stockLocationService.delete(ctx, args.input);
    }
}
