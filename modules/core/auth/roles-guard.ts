import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entity/user/user.entity';
import { Role } from './role';

/**
 * A guard which combines the JWT passport auth method with restrictions based on
 * the authenticated user's roles.
 *
 * @example
 * ```
 *  @RolesGuard([Role.Superadmin])
 *  @Query('administrators')
 *  getAdministrators() {
 *      // ...
 *  }
 * ```
 */
export function RolesGuard(roles: Role[]) {
    const guards: CanActivate[] = [AuthGuard('jwt')];

    if (roles.length && !authenticatedOnly(roles)) {
        guards.push(forRoles(roles));
    }

    return UseGuards(...guards);
}

function authenticatedOnly(roles: Role[]): boolean {
    return roles.length === 1 && roles[0] === Role.Authenticated;
}

/**
 * A guard which specifies which roles are authorized to access a given
 * route or property in a Controller / Resolver.
 */
function forRoles(roles: Role[]) {
    return {
        canActivate(context: ExecutionContext) {
            const user: User = context.switchToHttp().getRequest().user;
            if (!user) {
                return false;
            }
            return arraysIntersect(roles, user.roles);
        },
    } as CanActivate;
}

/**
 * Returns true if any element of arr1 appears in arr2.
 */
function arraysIntersect(arr1, arr2): boolean {
    return arr1.reduce((intersects, role) => {
        return intersects || arr2.includes(role);
    }, false);
}
