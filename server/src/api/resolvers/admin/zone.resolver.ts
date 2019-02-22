import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import {
    AddMembersToZoneMutationArgs,
    CreateZoneMutationArgs,
    DeleteZoneMutationArgs,
    DeletionResponse,
    Permission,
    RemoveMembersFromZoneMutationArgs,
    UpdateZoneMutationArgs,
    ZoneQueryArgs,
} from '../../../../../shared/generated-types';
import { Zone } from '../../../entity/zone/zone.entity';
import { ZoneService } from '../../../service/services/zone.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

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
    async zone(@Ctx() ctx: RequestContext, @Args() args: ZoneQueryArgs): Promise<Zone | undefined> {
        return this.zoneService.findOne(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    @Decode('memberIds')
    async createZone(@Ctx() ctx: RequestContext, @Args() args: CreateZoneMutationArgs): Promise<Zone> {
        return this.zoneService.create(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateZone(@Ctx() ctx: RequestContext, @Args() args: UpdateZoneMutationArgs): Promise<Zone> {
        return this.zoneService.update(ctx, args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteSettings)
    async deleteZone(
        @Ctx() ctx: RequestContext,
        @Args() args: DeleteZoneMutationArgs,
    ): Promise<DeletionResponse> {
        return this.zoneService.delete(ctx, args.id);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    @Decode('zoneId', 'memberIds')
    async addMembersToZone(
        @Ctx() ctx: RequestContext,
        @Args() args: AddMembersToZoneMutationArgs,
    ): Promise<Zone> {
        return this.zoneService.addMembersToZone(ctx, args);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    @Decode('zoneId', 'memberIds')
    async removeMembersFromZone(
        @Ctx() ctx: RequestContext,
        @Args() args: RemoveMembersFromZoneMutationArgs,
    ): Promise<Zone> {
        return this.zoneService.removeMembersFromZone(ctx, args);
    }
}
