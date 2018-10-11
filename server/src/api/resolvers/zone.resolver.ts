import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    AddMembersToZoneMutationArgs,
    CreateZoneMutationArgs,
    Permission,
    RemoveMembersFromZoneMutationArgs,
    UpdateZoneMutationArgs,
    ZoneQueryArgs,
} from 'shared/generated-types';

import { Zone } from '../../entity/zone/zone.entity';
import { ZoneService } from '../../service/providers/zone.service';
import { Allow } from '../common/auth-guard';
import { Decode } from '../common/id-interceptor';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

@Resolver('Zone')
export class ZoneResolver {
    constructor(private zoneService: ZoneService) {}

    @Query()
    @Allow(Permission.ReadSettings)
    zones(@Ctx() ctx: RequestContext): Promise<Zone[]> {
        return this.zoneService.findAll();
    }

    @Query()
    @Allow(Permission.ReadSettings)
    async zone(@Ctx() ctx: RequestContext, @Args() args: ZoneQueryArgs): Promise<Zone | undefined> {
        return this.zoneService.findOne(args.id);
    }

    @Mutation()
    @Allow(Permission.CreateSettings)
    @Decode('memberIds')
    async createZone(@Args() args: CreateZoneMutationArgs): Promise<Zone> {
        return this.zoneService.create(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    async updateZone(@Args() args: UpdateZoneMutationArgs): Promise<Zone> {
        return this.zoneService.update(args.input);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    @Decode('zoneId', 'memberIds')
    async addMembersToZone(@Args() args: AddMembersToZoneMutationArgs): Promise<Zone> {
        return this.zoneService.addMembersToZone(args);
    }

    @Mutation()
    @Allow(Permission.UpdateSettings)
    @Decode('zoneId', 'memberIds')
    async removeMembersFromZone(@Args() args: RemoveMembersFromZoneMutationArgs): Promise<Zone> {
        return this.zoneService.removeMembersFromZone(args);
    }
}
