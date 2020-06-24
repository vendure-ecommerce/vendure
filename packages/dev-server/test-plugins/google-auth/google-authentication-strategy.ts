import {
    AuthenticationStrategy,
    Customer,
    ExternalAuthenticationMethod,
    Injector,
    RequestContext,
    RoleService,
    User,
} from '@vendure/core';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Connection } from 'typeorm';

export type GoogleAuthData = {
    token: string;
};

export class GoogleAuthenticationStrategy implements AuthenticationStrategy<GoogleAuthData> {
    readonly name = 'google';
    private client: OAuth2Client;
    private connection: Connection;
    private roleService: RoleService;

    constructor(private clientId: string) {
        this.client = new OAuth2Client(clientId);
    }

    init(injector: Injector) {
        this.connection = injector.getConnection();
        this.roleService = injector.get(RoleService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input GoogleAuthInput {
                token: String!
            }
        `;
    }

    /**
     * Implements https://developers.google.com/identity/sign-in/web/backend-auth
     */
    async authenticate(ctx: RequestContext, data: GoogleAuthData): Promise<User | false> {
        const ticket = await this.client.verifyIdToken({
            idToken: data.token,
            audience: this.clientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return false;
        }

        const user = await this.connection
            .getRepository(User)
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.authenticationMethods', 'authMethod')
            .where('authMethod.externalIdentifier = :sub', { sub: payload.sub })
            .getOne();

        if (user) {
            return user;
        }
        return this.createNewCustomerAndUser(payload);
    }

    private async createNewCustomerAndUser(data: TokenPayload) {
        const customerRole = await this.roleService.getCustomerRole();
        const newUser = new User({
            identifier: data.email,
            roles: [customerRole],
            verified: data.email_verified || false,
        });

        const authMethod = await this.connection.manager.save(
            new ExternalAuthenticationMethod({
                externalIdentifier: data.sub,
                provider: this.name,
            }),
        );

        newUser.authenticationMethods = [authMethod];
        const savedUser = await this.connection.manager.save(newUser);

        const customer = await this.connection.manager.save(
            new Customer({
                emailAddress: data.email,
                firstName: data.given_name,
                lastName: data.family_name,
                user: savedUser,
            }),
        );

        return savedUser;
    }
}
