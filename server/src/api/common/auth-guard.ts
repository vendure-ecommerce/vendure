import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

import { ConfigService } from '../../config/config.service';
import { AuthService } from '../../service/providers/auth.service';

import { PERMISSIONS_METADATA_KEY } from './roles-guard';

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
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<string[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        if (this.configService.authOptions.disableAuth || !permissions) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        const token = this.getToken(ctx.req);
        if (!token) {
            return false;
        }
        const activeSession = await this.authService.validateSession(token);
        if (activeSession) {
            ctx.req.user = activeSession.user;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the session token from either the cookie or the Authorization header, depending
     * on the configured tokenMethod.
     */
    private getToken(req: Request): string | undefined {
        if (this.configService.authOptions.tokenMethod === 'cookie') {
            if (req.session && req.session.token) {
                return req.session.token;
            }
        } else {
            const authHeader = req.get('Authorization');
            if (authHeader) {
                const matches = authHeader.match(/bearer\s+(.+)$/i);
                if (matches) {
                    return matches[1];
                }
            }
        }
    }
}
