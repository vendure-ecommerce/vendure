import { MutationAuthenticateArgs } from '@vendure/common/lib/generated-shop-types';
import {
    CurrentUser,
    CurrentUserChannel,
    LoginResult,
    MutationLoginArgs,
} from '@vendure/common/lib/generated-types';
import { unique } from '@vendure/common/lib/unique';
import { Request, Response } from 'express';

import { ForbiddenError, InternalServerError, UnauthorizedError } from '../../../common/error/errors';
import { NATIVE_AUTH_STRATEGY_NAME } from '../../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../../config/config.service';
import { User } from '../../../entity/user/user.entity';
import { getUserChannelsPermissions } from '../../../service/helpers/utils/get-user-channels-permissions';
import { AdministratorService } from '../../../service/services/administrator.service';
import { AuthService } from '../../../service/services/auth.service';
import { UserService } from '../../../service/services/user.service';
import { extractAuthToken } from '../../common/extract-auth-token';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { setAuthToken } from '../../common/set-auth-token';

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
        apiType: ApiType,
    ): Promise<LoginResult> {
        return await this.createAuthenticatedSession(
            ctx,
            {
                input: { [NATIVE_AUTH_STRATEGY_NAME]: args },
            },
            req,
            res,
            apiType,
        );
    }

    async logout(ctx: RequestContext, req: Request, res: Response): Promise<boolean> {
        const token = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        if (!token) {
            return false;
        }
        await this.authService.deleteSessionByToken(ctx, token);
        setAuthToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: false,
            authToken: '',
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
            const administrator = await this.administratorService.findOneByUserId(userId);
            if (!administrator) {
                throw new ForbiddenError();
            }
        }
        const user = userId && (await this.userService.getUserById(userId));
        return user ? this.publiclyAccessibleUser(user) : null;
    }

    /**
     * Creates an authenticated session and sets the session token.
     */
    protected async createAuthenticatedSession(
        ctx: RequestContext,
        args: MutationAuthenticateArgs,
        req: Request,
        res: Response,
        apiType: ApiType,
    ) {
        const [method, data] = Object.entries(args.input)[0];
        const session = await this.authService.authenticate(ctx, apiType, method, data);
        if (apiType && apiType === 'admin') {
            const administrator = await this.administratorService.findOneByUserId(session.user.id);
            if (!administrator) {
                throw new UnauthorizedError();
            }
        }
        setAuthToken({
            req,
            res,
            authOptions: this.configService.authOptions,
            rememberMe: args.rememberMe || false,
            authToken: session.token,
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
        return this.userService.updatePassword(activeUserId, currentPassword, newPassword);
    }

    /**
     * Exposes a subset of the User properties which we want to expose to the public API.
     */
    private publiclyAccessibleUser(user: User): CurrentUser {
        return {
            id: user.id as string,
            identifier: user.identifier,
            channels: getUserChannelsPermissions(user) as CurrentUserChannel[],
        };
    }
}
