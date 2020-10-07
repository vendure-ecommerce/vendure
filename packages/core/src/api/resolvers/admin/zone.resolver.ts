import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationAddMembersToZoneArgs,
    MutationCreateZoneArgs,
    MutationDeleteZoneArgs,
    MutationRemoveMembersFromZoneArgs,
    MutationUpdateZoneArgs,
    Permission,
    QueryZoneArgs,
} from '@vendure/common/lib/generated-types';

import { Zone } from '../../../entity/zone/zone.entity';
import { ZoneService } from '../../../service/services/zone.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Zone')
export class ZoneResolver {
    constructor(private zoneService: ZoneService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    zones(@Ctx() ctx: RequestContext): Zone[] {
        return this.zoneService.findAll(ctx);
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async zone(@Ctx() ctx: RequestContext, @Args() args: QueryZoneArgs): Promise<Zone | undefined> {
        return this.zoneService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateSettings)
    async createZone(@Ctx() ctx: RequestContext, @Args() args: MutationCreateZoneArgs): Promise<Zone> {
        return this.zoneService.create(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateZone(@Ctx() ctx: RequestContext, @Args() args: MutationUpdateZoneArgs): Promise<Zone> {
        return this.zoneService.update(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteSettings)
    async deleteZone(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteZoneArgs,
    ): Promise<DeletionResponse> {
        return this.zoneService.delete(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async addMembersToZone(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationAddMembersToZoneArgs,
    ): Promise<Zone> {
        return this.zoneService.addMembersToZone(ctx, args);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateSettings)
    async removeMembersFromZone(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationRemoveMembersFromZoneArgs,
    ): Promise<Zone> {
        return this.zoneService.removeMembersFromZone(ctx, args);
    }
}
