import { ExecutionContext, Injectable, ReflectMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Permission } from 'shared/generated-types';

import { idsAreEqual } from '../common/utils';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user/user.entity';

import { RequestContextService } from './common/request-context.service';

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

@Injectable()
export class RolesGuard {
    constructor(
        private readonly reflector: Reflector,
        private requestContextService: RequestContextService,
        private configService: ConfigService,
    ) {}

    canActivate(context: ExecutionContext): boolean {
        const permissions = this.reflector.get<string[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        if (this.configService.disableAuth || !permissions) {
            return true;
        }
        const req = context.getArgByIndex(2).req;
        const ctx = this.requestContextService.fromRequest(req);
        const user: User = req.user;
        if (!user) {
            return false;
        }
        const permissionsOnChannel = user.roles
            .filter(role => role.channels.find(c => idsAreEqual(c.id, ctx.channel.id)))
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
