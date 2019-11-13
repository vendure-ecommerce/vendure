import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Channel } from '../../../entity/channel/channel.entity';
import { Role } from '../../../entity/role/role.entity';
import { RoleService } from '../../../service/services/role.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Role')
export class RoleEntityResolver {
    constructor(private roleService: RoleService) {}

    @ResolveProperty()
    async channels(@Ctx() ctx: RequestContext, @Parent() role: Role): Promise<Channel[]> {
        if (role.channels) {
            return role.channels;
        }
        return this.roleService.getChannelsForRole(role.id);
    }
}
