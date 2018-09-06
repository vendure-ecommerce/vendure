import { CanActivate, ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '../config/config.service';
import { Permission } from '../entity/role/permission';
import { User } from '../entity/user/user.entity';

import { AuthGuard } from './auth-guard';
import { RequestContextService } from './common/request-context.service';

/**
 * A guard which combines the JWT passport auth method with restrictions based on
 * the authenticated user's roles.
 *
 * @example
 * ```
 *  @RolesGuard([Permission.SuperAdmin])
 *  @Query('administrators')
 *  getAdministrators() {
 *      // ...
 *  }
 * ```
 */
export function RolesGuard(permissions: Permission[]) {
    // tslint:disable-next-line:ban-types
    const guards: Array<CanActivate | Function> = [AuthGuard];

    if (permissions.length && !authenticatedOnly(permissions)) {
        guards.push(forPermissions(permissions));
    }

    return UseGuards(...guards);
}

function authenticatedOnly(permissions: Permission[]): boolean {
    return permissions.length === 1 && permissions[0] === Permission.Authenticated;
}

/**
 * A guard which specifies which permissions are authorized to access a given
 * route or property in a Resolver.
 */
function forPermissions(permissions: Permission[]) {
    @Injectable()
    class RoleGuard implements CanActivate {
        constructor(
            private requestContextService: RequestContextService,
            private configService: ConfigService,
        ) {}

        canActivate(context: ExecutionContext) {
            if (this.configService.disableAuth) {
                return true;
            }
            const req = context.getArgByIndex(2).req;
            const ctx = this.requestContextService.fromRequest(req);
            const user: User = req.user;
            if (!user) {
                return false;
            }
            const permissionsOnChannel = user.roles
                .filter(role => role.channels.find(c => c.id === ctx.channel.id))
                .reduce((output, role) => [...output, ...role.permissions], [] as Permission[]);
            return arraysIntersect(permissions, permissionsOnChannel);
        }
    }
    return RoleGuard;
}

/**
 * Returns true if any element of arr1 appears in arr2.
 */
function arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
    return arr1.reduce((intersects, role) => {
        return intersects || arr2.includes(role);
    }, false);
}
