import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { EntityNotFoundError, InternalServerError } from '../../../common/error/errors';
import { Administrator } from '../../../entity/administrator/administrator.entity';
import { User } from '../../../entity/user/user.entity';
import { UserService } from '../../../service/services/user.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Administrator')
export class AdministratorEntityResolver {
    constructor(private userService: UserService) {}

    @ResolveField()
    async user(@Ctx() ctx: RequestContext, @Parent() administrator: Administrator): Promise<User> {
        if (administrator.user) {
            return administrator.user;
        }
        const user = await this.userService.getUserByEmailAddress(ctx, administrator.emailAddress);
        if (!user) {
            throw new EntityNotFoundError('User', '<not found>');
        }
        return user;
    }
}
