import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import { ForbiddenError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { Session } from '../../entity/session/session.entity';
import { AuthService } from '../../service/services/auth.service';
import { extractAuthToken } from '../common/extract-auth-token';
import { parseContext } from '../common/parse-context';
import { RequestContextService, REQUEST_CONTEXT_KEY } from '../common/request-context.service';
import { setAuthToken } from '../common/set-auth-token';
import { PERMISSIONS_METADATA_KEY } from '../decorators/allow.decorator';

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
        const { req, res, info } = parseContext(context);
        const authDisabled = this.configService.authOptions.disableAuth;
        const permissions = this.reflector.get<Permission[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        const isPublic = !!permissions && permissions.includes(Permission.Public);
        const hasOwnerPermission = !!permissions && permissions.includes(Permission.Owner);
        const session = await this.getSession(req, res, hasOwnerPermission);
        const requestContext = await this.requestContextService.fromRequest(req, info, permissions, session);
        (req as any)[REQUEST_CONTEXT_KEY] = requestContext;

        if (authDisabled || !permissions || isPublic) {
            return true;
        } else {
            const canActivate = requestContext.isAuthorized || requestContext.authorizedAsOwnerOnly;
            if (!canActivate) {
                throw new ForbiddenError();
            } else {
                return canActivate;
            }
        }
    }

    private async getSession(
        req: Request,
        res: Response,
        hasOwnerPermission: boolean,
    ): Promise<Session | undefined> {
        const authToken = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        let session: Session | undefined;
        if (authToken) {
            session = await this.authService.validateSession(authToken);
            if (session) {
                return session;
            }
            // if there is a token but it cannot be validated to a Session,
            // then the token is no longer valid and should be unset.
            setAuthToken({
                req,
                res,
                authOptions: this.configService.authOptions,
                rememberMe: false,
                authToken: '',
            });
        }

        if (hasOwnerPermission && !session) {
            session = await this.authService.createAnonymousSession();
            setAuthToken({
                authToken: session.token,
                rememberMe: true,
                authOptions: this.configService.authOptions,
                req,
                res,
            });
        }
        return session;
    }
}
