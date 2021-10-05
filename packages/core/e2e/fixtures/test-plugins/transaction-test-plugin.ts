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

export const TRIGGER_ATTEMPTED_UPDATE_EMAIL = 'trigger-attempted-update-email';
export const TRIGGER_ATTEMPTED_READ_EMAIL = 'trigger-attempted-read-email';

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

    @Mutation()
    @Transaction()
    async createTestAdministrator4(@Ctx() ctx: RequestContext, @Args() args: any) {
        const admin = await this.testAdminService.createAdministrator(ctx, args.emailAddress, args.fail);
        this.eventBus.publish(new TestEvent(ctx, admin));
        await new Promise(resolve => setTimeout(resolve, 50));
        return admin;
    }

    @Mutation()
    async createTestAdministrator5(@Ctx() ctx: RequestContext, @Args() args: any) {
        if (args.noContext === true) {
            return this.connection.withTransaction(ctx, async _ctx => {
                const admin = await this.testAdminService.createAdministrator(
                    _ctx,
                    args.emailAddress,
                    args.fail,
                );
                return admin;
            });
        } else {
            return this.connection.withTransaction(async _ctx => {
                const admin = await this.testAdminService.createAdministrator(
                    _ctx,
                    args.emailAddress,
                    args.fail,
                );
                return admin;
            });
        }
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
                createTestAdministrator4(emailAddress: String!, fail: Boolean!): Administrator
                createTestAdministrator5(
                    emailAddress: String!
                    fail: Boolean!
                    noContext: Boolean!
                ): Administrator
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

    static reset() {
        this.eventHandlerComplete$ = new ReplaySubject(1);
        this.errorHandler.mockClear();
    }

    onApplicationBootstrap(): any {
        // This part is used to test how RequestContext with transactions behave
        // when used in an Event subscription
        this.subscription = this.eventBus.ofType(TestEvent).subscribe(async event => {
            const { ctx, administrator } = event;
            if (administrator.emailAddress === TRIGGER_ATTEMPTED_UPDATE_EMAIL) {
                const adminRepository = this.connection.getRepository(ctx, Administrator);
                await new Promise(resolve => setTimeout(resolve, 50));
                administrator.lastName = 'modified';
                try {
                    await adminRepository.save(administrator);
                } catch (e) {
                    TransactionTestPlugin.errorHandler(e);
                } finally {
                    TransactionTestPlugin.eventHandlerComplete$.complete();
                }
            }
            if (administrator.emailAddress === TRIGGER_ATTEMPTED_READ_EMAIL) {
                // note the ctx is not passed here, so we are not inside the ongoing transaction
                const adminRepository = this.connection.getRepository(Administrator);
                try {
                    await adminRepository.findOneOrFail(administrator.id);
                } catch (e) {
                    TransactionTestPlugin.errorHandler(e);
                } finally {
                    TransactionTestPlugin.eventHandlerComplete$.complete();
                }
            }
        });
    }
}
