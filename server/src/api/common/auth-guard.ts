import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

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
        const session = ctx.req.session;
        if (!session || !session.token) {
            return false;
        }
        const activeSession = await this.authService.validateSession(session.token);
        if (activeSession) {
            ctx.req.user = activeSession.user;
            return true;
        } else {
            return false;
        }
    }
}
