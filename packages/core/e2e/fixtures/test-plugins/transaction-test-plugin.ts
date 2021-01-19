import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Administrator,
    Ctx,
    EventBus,
    InternalServerError,
    NativeAuthenticationMethod,
    PluginCommonModule,
    RequestContext,
    Transaction,
    TransactionalConnection,
    User,
    VendureEvent,
    VendurePlugin,
} from '@vendure/core';
import gql from 'graphql-tag';
import { ReplaySubject, Subscription } from 'rxjs';

export class TestEvent extends VendureEvent {
    constructor(public ctx: RequestContext, public administrator: Administrator) {
        super();
    }
}

export const TRIGGER_EMAIL = 'trigger-email';

@Injectable()
class TestUserService {
    constructor(private connection: TransactionalConnection) {}

    async createUser(ctx: RequestContext, identifier: string) {
        const authMethod = await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(
            new NativeAuthenticationMethod({
                identifier,
                passwordHash: 'abc',
            }),
        );
        const user = await this.connection.getRepository(ctx, User).save(
            new User({
                authenticationMethods: [authMethod],
                identifier,
                roles: [],
                verified: true,
            }),
        );
        return user;
    }
}

@Injectable()
class TestAdminService {
    constructor(private connection: TransactionalConnection, private userService: TestUserService) {}

    async createAdministrator(ctx: RequestContext, emailAddress: string, fail: boolean) {
        const user = await this.userService.createUser(ctx, emailAddress);
        if (fail) {
            throw new InternalServerError('Failed!');
        }
        const admin = await this.connection.getRepository(ctx, Administrator).save(
            new Administrator({
                emailAddress,
                user,
                firstName: 'jim',
                lastName: 'jiminy',
            }),
        );
        return admin;
    }
}

@Resolver()
class TestResolver {
    constructor(
        private testAdminService: TestAdminService,
        private connection: TransactionalConnection,
        private eventBus: EventBus,
    ) {}

    @Mutation()
    @Transaction()
    async createTestAdministrator(@Ctx() ctx: RequestContext, @Args() args: any) {
        const admin = await this.testAdminService.createAdministrator(ctx, args.emailAddress, args.fail);
        this.eventBus.publish(new TestEvent(ctx, admin));
        return admin;
    }

    @Mutation()
    @Transaction('manual')
    async createTestAdministrator2(@Ctx() ctx: RequestContext, @Args() args: any) {
        await this.connection.startTransaction(ctx);
        return this.testAdminService.createAdministrator(ctx, args.emailAddress, args.fail);
    }

    @Mutation()
    @Transaction('manual')
    async createTestAdministrator3(@Ctx() ctx: RequestContext, @Args() args: any) {
        // no transaction started
        return this.testAdminService.createAdministrator(ctx, args.emailAddress, args.fail);
    }

    @Query()
    async verify() {
        const admins = await this.connection.getRepository(Administrator).find();
        const users = await this.connection.getRepository(User).find();
        return {
            admins,
            users,
        };
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [TestAdminService, TestUserService],
    adminApiExtensions: {
        schema: gql`
            extend type Mutation {
                createTestAdministrator(emailAddress: String!, fail: Boolean!): Administrator
                createTestAdministrator2(emailAddress: String!, fail: Boolean!): Administrator
                createTestAdministrator3(emailAddress: String!, fail: Boolean!): Administrator
            }
            type VerifyResult {
                admins: [Administrator!]!
                users: [User!]!
            }
            extend type Query {
                verify: VerifyResult!
            }
        `,
        resolvers: [TestResolver],
    },
})
export class TransactionTestPlugin implements OnApplicationBootstrap {
    private subscription: Subscription;
    static errorHandler = jest.fn();
    static eventHandlerComplete$ = new ReplaySubject(1);

    constructor(private eventBus: EventBus, private connection: TransactionalConnection) {}

    onApplicationBootstrap(): any {
        // This part is used to test how RequestContext with transactions behave
        // when used in an Event subscription
        this.subscription = this.eventBus.ofType(TestEvent).subscribe(async event => {
            const { ctx, administrator } = event;
            if (administrator.emailAddress === TRIGGER_EMAIL) {
                administrator.lastName = 'modified';
                try {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    await this.connection.getRepository(ctx, Administrator).save(administrator);
                } catch (e) {
                    TransactionTestPlugin.errorHandler(e);
                } finally {
                    TransactionTestPlugin.eventHandlerComplete$.complete();
                }
            }
        });
    }
}
