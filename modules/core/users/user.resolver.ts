import { Resolver, Query, ResolveProperty } from '@nestjs/graphql';
import { Connection, EntityManager, Repository } from 'typeorm';
import { User } from '../entities/User';
import { Address } from '../entities/Address';
import { UserService } from './user.service';

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
    addresses(user: User): Promise<Address[]> {
        return this.userService.findAddressesByUserId(user.id);
    }
}
