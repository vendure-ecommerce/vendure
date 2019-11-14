import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreatePromotionArgs,
    MutationDeletePromotionArgs,
    MutationUpdatePromotionArgs,
    Permission,
    QueryPromotionArgs,
    QueryPromotionsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Promotion } from '../../../entity/promotion/promotion.entity';
import { PromotionService } from '../../../service/services/promotion.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Promotion')
export class PromotionResolver {
    constructor(private promotionService: PromotionService, private idCodecService: IdCodecService) {}

    @Query()
    @Allow(Permission.ReadPromotion)
    promotions(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryPromotionsArgs,
    ): Promise<PaginatedList<Promotion>> {
        return this.promotionService.findAll(ctx, args.options || undefined).then(res => {
            res.items.forEach(this.encodeConditionsAndActions);
            return res;
        });
    }

    @Query()
    @Allow(Permission.ReadPromotion)
    promotion(@Ctx() ctx: RequestContext, @Args() args: QueryPromotionArgs): Promise<Promotion | undefined> {
        return this.promotionService.findOne(ctx, args.id).then(this.encodeConditionsAndActions);
    }

    @Query()
    @Allow(Permission.ReadPromotion)
    promotionConditions(@Ctx() ctx: RequestContext) {
        return this.promotionService.getPromotionConditions(ctx);
    }

    @Query()
    @Allow(Permission.ReadPromotion)
    promotionActions(@Ctx() ctx: RequestContext) {
        return this.promotionService.getPromotionActions(ctx);
    }

    @Mutation()
    @Allow(Permission.CreatePromotion)
    createPromotion(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreatePromotionArgs,
    ): Promise<Promotion> {
        this.idCodecService.decodeConfigurableOperation(args.input.actions);
        this.idCodecService.decodeConfigurableOperation(args.input.conditions);
        return this.promotionService.createPromotion(ctx, args.input).then(this.encodeConditionsAndActions);
    }

    @Mutation()
    @Allow(Permission.UpdatePromotion)
    updatePromotion(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdatePromotionArgs,
    ): Promise<Promotion> {
        this.idCodecService.decodeConfigurableOperation(args.input.actions || []);
        this.idCodecService.decodeConfigurableOperation(args.input.conditions || []);
        return this.promotionService.updatePromotion(ctx, args.input).then(this.encodeConditionsAndActions);
    }

    @Mutation()
    @Allow(Permission.DeletePromotion)
    deletePromotion(@Args() args: MutationDeletePromotionArgs): Promise<DeletionResponse> {
        return this.promotionService.softDeletePromotion(args.id);
    }

    /**
     * Encodes any entity IDs used in the filter arguments.
     */
    private encodeConditionsAndActions = <T extends Promotion | undefined>(collection: T): T => {
        if (collection) {
            this.idCodecService.encodeConfigurableOperation(collection.conditions);
            this.idCodecService.encodeConfigurableOperation(collection.actions);
        }
        return collection;
    };
}
