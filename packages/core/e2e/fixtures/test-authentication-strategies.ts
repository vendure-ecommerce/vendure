import {
    AuthenticationStrategy,
    ExternalAuthenticationService,
    Injector,
    RequestContext,
    User,
} from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

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
    private externalAuthenticationService: ExternalAuthenticationService;

    init(injector: Injector) {
        this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
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
        const user = await this.externalAuthenticationService.findUser(this.name, data.token);

        if (user) {
            return user;
        }
        return this.externalAuthenticationService.createCustomerAndUser(ctx, {
            strategy: this.name,
            externalIdentifier: data.token,
            emailAddress: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            verified: true,
        });
    }
}
