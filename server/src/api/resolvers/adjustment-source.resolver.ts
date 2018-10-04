import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AdjustmentOperationsQueryArgs,
    AdjustmentSourceQueryArgs,
    AdjustmentSourcesQueryArgs,
    CreateAdjustmentSourceMutationArgs,
    Permission,
    UpdateAdjustmentSourceMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { AdjustmentSource } from '../../entity/adjustment-source/adjustment-source.entity';
import { Order } from '../../entity/order/order.entity';
import { AdjustmentSourceService } from '../../service/providers/adjustment-source.service';
import { Allow } from '../common/auth-guard';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

@Resolver('Order')
export class AdjustmentSourceResolver {
    constructor(private adjustmentSourceService: AdjustmentSourceService) {}

    @Query()
    @Allow(Permission.ReadAdjustmentSource)
    adjustmentSources(
        @Ctx() ctx: RequestContext,
        @Args() args: AdjustmentSourcesQueryArgs,
    ): Promise<PaginatedList<AdjustmentSource>> {
        if (!args.options) {
            args.options = {};
        }
        if (!args.options.filter) {
            args.options.filter = {};
        }
        args.options.filter.type = {
            eq: args.type,
        };
        return this.adjustmentSourceService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadAdjustmentSource)
    adjustmentSource(
        @Ctx() ctx: RequestContext,
        @Args() args: AdjustmentSourceQueryArgs,
    ): Promise<AdjustmentSource | undefined> {
        return this.adjustmentSourceService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.ReadAdjustmentSource)
    adjustmentOperations(@Ctx() ctx: RequestContext, @Args() args: AdjustmentOperationsQueryArgs) {
        return this.adjustmentSourceService.getAdjustmentOperations(args.type);
    }

    @Mutation()
    @Allow(Permission.CreateAdjustmentSource)
    createAdjustmentSource(
        @Ctx() ctx: RequestContext,
        @Args() args: CreateAdjustmentSourceMutationArgs,
    ): Promise<AdjustmentSource> {
        return this.adjustmentSourceService.createAdjustmentSource(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateAdjustmentSource)
    updateAdjustmentSource(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdateAdjustmentSourceMutationArgs,
    ): Promise<AdjustmentSource> {
        return this.adjustmentSourceService.updateAdjustmentSource(ctx, args.input);
    }
}
