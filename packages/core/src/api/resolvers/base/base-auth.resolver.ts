import {
    CurrentUser,
    CurrentUserChannel,
    LoginResult,
    MutationAuthenticateArgs,
    MutationLoginArgs,
} from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import { ForbiddenError, InternalServerError, UnauthorizedError } from '../../../common/error/errors';
import { NATIVE_AUTH_STRATEGY_NAME } from '../../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../../config/config.service';
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
    constructor(
        protected authService: AuthService,
        protected userService: UserService,
        protected administratorService: AdministratorService,
        protected configService: ConfigService,
    ) {}

    /**
     * Attempts a login given the username and password of a user. If successful, returns
     * the user data and returns the token either in a cookie or in the response body.
     */
    async login(
        args: MutationLoginArgs,
        ctx: RequestContext,
        req: Request,
        res: Response,
    ): Promise<LoginResult> {
        return await this.authenticateAndCreateSession(
            ctx,
            {
                input: { [NATIVE_AUTH_STRATEGY_NAME]: args },
            },
            req,
            res,
        );
    }

    async logout(ctx: RequestContext, req: Request, res: Response): Promise<boolean> {
        const token = extractSessionToken(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return false;
        }
        await this.authService.destroyAuthenticatedSession(ctx, token);
        setSessionToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            sessionToken: '',
        });
        return true;
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
    ): Promise<LoginResult> {
        const [method, data] = Object.entries(args.input)[0];
        const { apiType } = ctx;
        const session = await this.authService.authenticate(ctx, apiType, method, data);
        if (apiType && apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(ctx, session.user.id);
            if (!administrator) {
                throw new UnauthorizedError();
            }
        }
        setSessionToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: args.rememberMe || false,
            sessionToken: session.token,
        });
        return {
            user: this.publiclyAccessibleUser(session.user),
        };
    }

    /**
     * Updates the password of an existing User.
     */
    protected async updatePassword(
        ctx: RequestContext,
        currentPassword: string,
        newPassword: string,
    ): Promise<boolean> {
        const { activeUserId } = ctx;
        if (!activeUserId) {
            throw new InternalServerError(`error.no-active-user-id`);
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
}
