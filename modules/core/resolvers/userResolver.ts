import {Connection, EntityManager, Repository} from 'typeorm';
import { User } from '../entities/User';
import {FieldResolver, Query, Resolver, Root} from 'type-graphql';
import {InjectConnection, InjectManager, InjectRepository} from 'typeorm-typedi-extensions';
import {Address} from '../entities/Address';

@Resolver(User)
export class UserResolver {
    constructor(@InjectManager() private entityManager: EntityManager,
                @InjectConnection() private connection: Connection) {}

    @Query(() => [User])
    users() {
        return this.entityManager.find(User);
    }

    @FieldResolver()
    addresses(@Root() user: User) {
        return this.connection.createQueryBuilder()
            .relation(User, 'addresses')
            .of(user)
            .loadMany();
    }
}
