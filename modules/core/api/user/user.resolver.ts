import { Query, ResolveProperty, Resolver } from '@nestjs/graphql';
import { UserEntity } from '../../entity/user/user.entity';
import { UserService } from './user.service';
import { Address } from '../../entity/address/address.interface';
import { User } from '../../entity/user/user.interface';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}

    @Query('users')
    users(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Query('user')
    user(obj, args): Promise<User> {
        return this.userService.findOne(args.id);
    }

    @ResolveProperty('addresses')
    addresses(user: UserEntity): Promise<Address[]> {
        return this.userService.findAddressesByUserId(user.id);
    }
}
