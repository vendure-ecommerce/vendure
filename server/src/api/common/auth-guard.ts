import { CanActivate, ExecutionContext, Injectable, ReflectMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { Permission } from 'shared/generated-types';

import { ConfigService } from '../../config/config.service';
import { Session } from '../../entity/session/session.entity';
import { AuthService } from '../../service/providers/auth.service';

import { extractAuthToken } from './extract-auth-token';
import { REQUEST_CONTEXT_KEY, RequestContextService } from './request-context.service';
import { setAuthToken } from './set-auth-token';

export const PERMISSIONS_METADATA_KEY = '__permissions__';

/**
 * Attatches metadata to the resolver defining which permissions are required to execute the
 * operation.
 *
 * @example
 * ```
 *  @Allow(Permission.SuperAdmin)
 *  @Query()
 *  getAdministrators() {
 *      // ...
 *  }
 * ```
 */
export const Allow = (...permissions: Permission[]) => ReflectMetadata(PERMISSIONS_METADATA_KEY, permissions);

/**
 * A guard which checks for the existence of a valid session token in the request and if found,
 * attaches the current User entity to the request.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    strategy: any;

    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
        private authService: AuthService,
        private requestContextService: RequestContextService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        const req: Request = ctx.req;
        const res: Response = ctx.res;
        const authDisabled = this.configService.authOptions.disableAuth;
        const permissions = this.reflector.get<Permission[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        const hasOwnerPermission = !!permissions && permissions.includes(Permission.Owner);
        const session = await this.getSession(req, res, hasOwnerPermission);
        const requestContext = await this.requestContextService.fromRequest(req, permissions, session);
        req[REQUEST_CONTEXT_KEY] = requestContext;

        if (authDisabled || !permissions) {
            return true;
        } else {
            return requestContext.isAuthorized || requestContext.authorizedAsOwnerOnly;
        }
    }

    private async getSession(
        req: Request,
        res: Response,
        hasOwnerPermission: boolean,
    ): Promise<Session | undefined> {
        const authToken = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        if (authToken) {
            return await this.authService.validateSession(authToken);
        } else if (hasOwnerPermission) {
            const session = await this.authService.createAnonymousSession();
            setAuthToken({
                authToken: session.token,
                rememberMe: true,
                authOptions: this.configService.authOptions,
                req,
                res,
            });
            return session;
        }
    }
}
