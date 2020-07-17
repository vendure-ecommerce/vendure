import { HttpService } from '@nestjs/common';
import {
    AuthenticationStrategy,
    ExternalAuthenticationService,
    Injector,
    Logger,
    RequestContext,
    RoleService,
    User,
} from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export type KeycloakAuthData = {
    token: string;
};

export type OpenIdUserInfo = {
    name: string;
    sub: string;
    email?: string;
    email_verified: boolean;
    preferred_username: string;
    given_name?: string;
    family_name?: string;
};

export class KeycloakAuthenticationStrategy implements AuthenticationStrategy<KeycloakAuthData> {
    readonly name = 'keycloak';
    private externalAuthenticationService: ExternalAuthenticationService;
    private httpService: HttpService;
    private roleService: RoleService;
    private bearerToken: string;

    init(injector: Injector) {
        this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
        this.httpService = injector.get(HttpService);
        this.roleService = injector.get(RoleService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input KeycloakAuthInput {
                token: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: KeycloakAuthData): Promise<User | false> {
        let userInfo: OpenIdUserInfo;
        this.bearerToken = data.token;
        try {
            const response = await this.httpService
                .get('http://localhost:9000/auth/realms/myrealm/protocol/openid-connect/userinfo', {
                    headers: {
                        Authorization: `Bearer ${this.bearerToken}`,
                    },
                })
                .toPromise();
            userInfo = response.data;
        } catch (e) {
            Logger.error(e);
            return false;
        }

        if (!userInfo) {
            return false;
        }
        const user = await this.externalAuthenticationService.findAdministratorUser(this.name, userInfo.sub);
        if (user) {
            return user;
        }

        const roles = await this.roleService.findAll();
        const merchantRole = roles.items.find((r) => r.code === 'merchant');

        if (!merchantRole) {
            Logger.error(`Could not find "merchant" role`);
            return false;
        }

        return this.externalAuthenticationService.createAdministratorAndUser(ctx, {
            strategy: this.name,
            externalIdentifier: userInfo.sub,
            identifier: userInfo.preferred_username,
            emailAddress: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            roles: [merchantRole],
        });
    }
}
