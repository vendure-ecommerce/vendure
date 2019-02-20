import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    CreatePromotionMutationArgs,
    DeletePromotionMutationArgs,
    DeletionResponse,
    Permission,
    PromotionQueryArgs,
    PromotionsQueryArgs,
    UpdatePromotionMutationArgs,
} from '../../../../../shared/generated-types';
import { PaginatedList } from '../../../../../shared/shared-types';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { PromotionService } from '../../../service/services/promotion.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Promotion')
export class PromotionResolver {
    constructor(private promotionService: PromotionService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    promotions(
        @Ctx() ctx: RequestContext,
        @Args() args: PromotionsQueryArgs,
    ): Promise<PaginatedList<Promotion>> {
        return this.promotionService.findAll(args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    promotion(@Ctx() ctx: RequestContext, @Args() args: PromotionQueryArgs): Promise<Promotion | undefined> {
        return this.promotionService.findOne(args.id);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    adjustmentOperations(@Ctx() ctx: RequestContext) {
        // TODO: split this into 2 queries, one for PromotionConditions and one for PromotionActions
        return this.promotionService.getAdjustmentOperations();
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    createPromotion(
        @Ctx() ctx: RequestContext,
        @Args() args: CreatePromotionMutationArgs,
    ): Promise<Promotion> {
        return this.promotionService.createPromotion(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    updatePromotion(
        @Ctx() ctx: RequestContext,
        @Args() args: UpdatePromotionMutationArgs,
    ): Promise<Promotion> {
        return this.promotionService.updatePromotion(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    deletePromotion(@Args() args: DeletePromotionMutationArgs): Promise<DeletionResponse> {
        return this.promotionService.softDeletePromotion(args.id);
    }
}
