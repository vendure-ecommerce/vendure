import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    Administrator,
    Ctx,
    InternalServerError,
    mergeConfig,
    NativeAuthenticationMethod,
    PluginCommonModule,
    RequestContext,
    Transaction,
    TransactionalConnection,
    User,
    VendurePlugin,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

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
        const user = this.connection.getRepository(User).save(
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
    constructor(private testAdminService: TestAdminService, private connection: TransactionalConnection) {}

    @Mutation()
    @Transaction
    createTestAdministrator(@Ctx() ctx: RequestContext, @Args() args: any) {
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
class TransactionTestPlugin {}

describe('Transaction infrastructure', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            plugins: [TransactionTestPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 0,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('non-failing mutation', async () => {
        const { createTestAdministrator } = await adminClient.query(CREATE_ADMIN, {
            emailAddress: 'test1',
            fail: false,
        });

        expect(createTestAdministrator.emailAddress).toBe('test1');
        expect(createTestAdministrator.user.identifier).toBe('test1');

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test1')).toBe(true);
        expect(!!verify.users.find((u: any) => u.identifier === 'test1')).toBe(true);
    });

    it('failing mutation', async () => {
        try {
            await adminClient.query(CREATE_ADMIN, {
                emailAddress: 'test2',
                fail: true,
            });
            fail('Should have thrown');
        } catch (e) {
            expect(e.message).toContain('Failed!');
        }

        const { verify } = await adminClient.query(VERIFY_TEST);

        expect(verify.admins.length).toBe(2);
        expect(verify.users.length).toBe(2);
        expect(!!verify.admins.find((a: any) => a.emailAddress === 'test2')).toBe(false);
        expect(!!verify.users.find((u: any) => u.identifier === 'test2')).toBe(false);
    });
});

const CREATE_ADMIN = gql`
    mutation CreateTestAdmin($emailAddress: String!, $fail: Boolean!) {
        createTestAdministrator(emailAddress: $emailAddress, fail: $fail) {
            id
            emailAddress
            user {
                id
                identifier
            }
        }
    }
`;

const VERIFY_TEST = gql`
    query VerifyTest {
        verify {
            admins {
                id
                emailAddress
            }
            users {
                id
                identifier
            }
        }
    }
`;
