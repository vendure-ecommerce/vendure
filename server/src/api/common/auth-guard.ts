import { CanActivate, ExecutionContext, Injectable, ReflectMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Permission } from 'shared/generated-types';

import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';

import { RequestContext } from './request-context';
import { REQUEST_CONTEXT_KEY, RequestContextService } from './request-context.service';

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
        private requestContextService: RequestContextService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: Request = GqlExecutionContext.create(context).getContext().req;
        const authDisabled = this.configService.authOptions.disableAuth;
        const permissions = this.reflector.get<string[]>(
            PERMISSIONS_METADATA_KEY,
            context.getHandler(),
        ) as Permission[];
        const requestContext = await this.requestContextService.fromRequest(req);
        req[REQUEST_CONTEXT_KEY] = requestContext;

        if (authDisabled || !permissions) {
            return true;
        } else {
            return this.userHasRequiredPermissionsOnChannel(permissions, requestContext);
        }
    }

    private isAuthenticatedSession(session?: Session): session is AuthenticatedSession {
        return !!session && !!(session as AuthenticatedSession).user;
    }

    private userHasRequiredPermissionsOnChannel(
        permissions: Permission[],
        requestContext: RequestContext,
    ): boolean {
        const user = requestContext.user;
        if (!user) {
            return false;
        }
        const permissionsOnChannel = user.roles
            .filter(role => role.channels.find(c => idsAreEqual(c.id, requestContext.channel.id)))
            .reduce((output, role) => [...output, ...role.permissions], [] as Permission[]);
        return arraysIntersect(permissions, permissionsOnChannel);
    }
}

/**
 * Returns true if any element of arr1 appears in arr2.
 */
function arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
    return arr1.reduce((intersects, role) => {
        return intersects || arr2.includes(role);
    }, false);
}
