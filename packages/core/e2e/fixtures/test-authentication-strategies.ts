import {
    AuthenticationStrategy,
    Customer,
    ExternalAuthenticationMethod,
    Injector,
    RequestContext,
    RoleService,
    User,
} from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Connection } from 'typeorm';

export const VALID_AUTH_TOKEN = 'valid-auth-token';

export type TestAuthPayload = {
    token: string;
    userData: {
        email: string;
        firstName: string;
        lastName: string;
    };
};

export class TestAuthenticationStrategy implements AuthenticationStrategy<TestAuthPayload> {
    readonly name = 'test_strategy';
    private connection: Connection;
    private roleService: RoleService;

    init(injector: Injector) {
        this.connection = injector.getConnection();
        this.roleService = injector.get(RoleService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input TestAuthInput {
                token: String!
                userData: UserDataInput
            }

            input UserDataInput {
                email: String!
                firstName: String!
                lastName: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: TestAuthPayload): Promise<User | false> {
        const { token, userData } = data;
        if (data.token !== VALID_AUTH_TOKEN) {
            return false;
        }
        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authMethod')
            .where('authMethod.externalIdentifier = :token', { token: data.token })
            .getOne();

        if (user) {
            return user;
        }
        return this.createNewCustomerAndUser(data);
    }

    private async createNewCustomerAndUser(data: TestAuthPayload) {
        const { token, userData } = data;
        const customerRole = await this.roleService.getCustomerRole();
        const newUser = new User({
            identifier: data.userData.email,
            roles: [customerRole],
            verified: true,
        });

        const authMethod = await this.connection.manager.save(
            new ExternalAuthenticationMethod({
                externalIdentifier: data.token,
                provider: this.name,
            }),
        );

        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.manager.save(newUser);

        const customer = await this.connection.manager.save(
            new Customer({
                emailAddress: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                user: savedUser,
            }),
        );

        return savedUser;
    }
}
