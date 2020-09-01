import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Permission } from '@vendure/common/lib/generated-types';
import { MutationTransitionFulfillmentToStateArgs } from '@vendure/common/lib/generated-types';

import { FulfillmentState } from '../../../service/helpers/fulfillment-state-machine/fulfillment-state';
import { FulfillmentService } from '../../../service/services/fulfillment.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver()
export class FulfillmentResolver {
    constructor(private fulfillmentService: FulfillmentService) {}
    @Mutation()
    @Allow(Permission.UpdateOrder)
    async transitionFulfillmentToState(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationTransitionFulfillmentToStateArgs,
    ) {
        return this.fulfillmentService.transitionToState(ctx, args.id, args.state as FulfillmentState);
    }
}
