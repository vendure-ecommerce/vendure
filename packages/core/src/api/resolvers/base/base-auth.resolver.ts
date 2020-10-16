import { AuthenticationResult as ShopAuthenticationResult } from '@vendure/common/lib/generated-shop-types';
import {
    AuthenticationResult as AdminAuthenticationResult,
    CurrentUser,
    CurrentUserChannel,
    MutationAuthenticateArgs,
    MutationLoginArgs,
    Success,
} from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import { isGraphQlErrorResult } from '../../../common/error/error-result';
import { ForbiddenError } from '../../../common/error/errors';
import { NativeAuthStrategyError as AdminNativeAuthStrategyError } from '../../../common/error/generated-graphql-admin-errors';
import {
    InvalidCredentialsError,
    NativeAuthStrategyError as ShopNativeAuthStrategyError,
    NotVerifiedError,
} from '../../../common/error/generated-graphql-shop-errors';
import { NATIVE_AUTH_STRATEGY_NAME } from '../../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { User } from '../../../entity/user/user.entity';
import { getUserChannelsPermissions } from '../../../service/helpers/utils/get-user-channels-permissions';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { UserService } from '../../../service/services/user.service';
import { extractSessionToken } from '../../common/extract-session-token';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { setSessionToken } from '../../common/set-session-token';

export class BaseAuthResolver {
    protected readonly nativeAuthStrategyIsConfigured: boolean;

    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected administratorService: AdministratorService,
        protected configService: ConfigService,
    ) {
        this.nativeAuthStrategyIsConfigured = !!this.configService.authOptions.shopAuthenticationStrategy.find(
            strategy => strategy.name === NATIVE_AUTH_STRATEGY_NAME,
        );
    }

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and returns the token either in a cookie or in the response body.
     */
    async baseLogin(
        args: MutationLoginArgs,
        ctx: RequestContext,
        req: Request,
        res: Response,
    ): Promise<AdminAuthenticationResult | ShopAuthenticationResult | NotVerifiedError> {
        return await this.authenticateAndCreateSession(
            ctx,
            {
                input: { [NATIVE_AUTH_STRATEGY_NAME]: args },
            },
            req,
            res,
        );
    }

    async logout(ctx: RequestContext, req: Request, res: Response): Promise<Success> {
        const token = extractSessionToken(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return { success: false };
        }
        await this.authService.destroyAuthenticatedSession(ctx, token);
        setSessionToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            sessionToken: '',
        });
        return { success: true };
    }

    /**
     * Returns information about the current authenticated user.
     */
    async me(ctx: RequestContext, apiType: ApiType) {
        const userId = ctx.activeUserId;
        if (!userId) {
            throw new ForbiddenError();
        }
        if (apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(ctx, userId);
            if (!administrator) {
                throw new ForbiddenError();
            }
        }
        const user = userId && (await this.userService.getUserById(ctx, userId));
        return user ? this.publiclyAccessibleUser(user) : null;
    }

    /**
     * Creates an authenticated session and sets the session token.
     */
    protected async authenticateAndCreateSession(
        ctx: RequestContext,
        args: MutationAuthenticateArgs,
        req: Request,
        res: Response,
    ): Promise<AdminAuthenticationResult | ShopAuthenticationResult | NotVerifiedError> {
        const [method, data] = Object.entries(args.input)[0];
        const { apiType } = ctx;
        const session = await this.authService.authenticate(ctx, apiType, method, data);
        if (isGraphQlErrorResult(session)) {
            return session;
        }
        if (apiType && apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(ctx, session.user.id);
            if (!administrator) {
                return new InvalidCredentialsError('');
            }
        }
        setSessionToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: args.rememberMe || false,
            sessionToken: session.token,
        });
        return this.publiclyAccessibleUser(session.user);
    }

    /**
     * Updates the password of an existing User.
     */
    protected async updatePassword(
        ctx: RequestContext,
        currentPassword: string,
        newPassword: string,
    ): Promise<boolean | InvalidCredentialsError> {
        const { activeUserId } = ctx;
        if (!activeUserId) {
            throw new ForbiddenError();
        }
        return this.userService.updatePassword(ctx, activeUserId, currentPassword, newPassword);
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    protected publiclyAccessibleUser(user: User): CurrentUser {
        return {
            id: user.id,
            identifier: user.identifier,
            channels: getUserChannelsPermissions(user) as CurrentUserChannel[],
        };
    }

    protected requireNativeAuthStrategy():
        | AdminNativeAuthStrategyError
        | ShopNativeAuthStrategyError
        | undefined {
        if (!this.nativeAuthStrategyIsConfigured) {
            const authStrategyNames = this.configService.authOptions.shopAuthenticationStrategy
                .map(s => s.name)
                .join(', ');
            const errorMessage =
                'This GraphQL operation requires that the NativeAuthenticationStrategy be configured for the Shop API.\n' +
                `Currently the following AuthenticationStrategies are enabled: ${authStrategyNames}`;
            Logger.error(errorMessage);
            return new AdminNativeAuthStrategyError();
        }
    }
}
