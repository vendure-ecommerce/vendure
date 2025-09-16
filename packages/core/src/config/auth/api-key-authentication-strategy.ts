import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

import { RequestContext } from '../../api/common/request-context';
import { Injector } from '../../common/injector';
import { User } from '../../entity/user/user.entity';

import { AuthenticationStrategy } from './authentication-strategy';

export interface ApiKeyAuthenticationData {
    apiKey: string;
}

export const API_KEY_AUTH_STRATEGY_NAME = 'apikey';
export const API_KEY_AUTH_STRATEGY_DEFAULT_DURATION = '100y';

export interface ApiKeyAuthenticationOptions {
    /**
     * @description
     * Session duration, i.e. the time which must elapse from the last authenticated request
     * after which the user must re-authenticate.
     *
     * If passed as a number should represent milliseconds and if passed as a string describes a time span per
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
     *
     * @default '100y'
     */
    sessionDuration?: string | number;

    // TODO ideally you could customize how the apikeys get generated via a strategy
    // seems fitting that the option would be here but is it right? where do we generate them?
}

/**
 * @description
 * This strategy implements an API key-based authentication, with the credentials (the keys)
 * being stored in the Vendure database. API key based auth is mostly useful for machine-to-machine
 * communication with very long lived sessions to avoid having scripts login and logout between requests.
 *
 * @docsCategory auth
 */
export class ApiKeyAuthenticationStrategy implements AuthenticationStrategy<ApiKeyAuthenticationData> {
    readonly name = API_KEY_AUTH_STRATEGY_NAME;
    /**
     * @description
     * Session duration, i.e. the time which must elapse from the last authenticated request
     * after which the user must re-authenticate.
     *
     * If passed as a number should represent milliseconds and if passed as a string describes a time span per
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
     *
     * @default '100y'
     */
    static sessionDuration: string | number = API_KEY_AUTH_STRATEGY_DEFAULT_DURATION;

    private apiKeyAuthService: import('../../service/helpers/api-key-authentication/api-key-authentication.service').ApiKeyAuthenticationService;

    constructor(input?: ApiKeyAuthenticationOptions) {
        if (!input) return;

        ApiKeyAuthenticationStrategy.sessionDuration =
            input.sessionDuration ?? API_KEY_AUTH_STRATEGY_DEFAULT_DURATION;
    }

    async init(injector: Injector) {
        // Lazily-loaded to avoid a circular dependency
        const { ApiKeyAuthenticationService } = await import(
            '../../service/helpers/api-key-authentication/api-key-authentication.service.js'
        );
        this.apiKeyAuthService = injector.get(ApiKeyAuthenticationService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input ApiKeyAuthInput {
                apiKey: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: ApiKeyAuthenticationData): Promise<User | false> {
        const user = await this.apiKeyAuthService.findUser(ctx, data.apiKey);
        if (!user) return false;

        return user;
    }
}
