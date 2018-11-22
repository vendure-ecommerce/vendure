import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LanguageCode, Permission } from 'shared/generated-types';

import { NoValidChannelError } from '../../common/error/errors';
import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Channel } from '../../entity/channel/channel.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { ChannelService } from '../../service/services/channel.service';

import { RequestContext } from './request-context';

export const REQUEST_CONTEXT_KEY = 'vendureRequestContext';

/**
 * Creates new RequestContext instances.
 */
@Injectable()
export class RequestContextService {
    constructor(private channelService: ChannelService, private configService: ConfigService) {}

    /**
     * Creates a new RequestContext based on an Express request object.
     */
    async fromRequest(
        req: Request,
        requiredPermissions?: Permission[],
        session?: Session,
    ): Promise<RequestContext> {
        const channelToken = this.getChannelToken(req);
        const channel = this.channelService.getChannelFromToken(channelToken);

        const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(Permission.Owner);
        const languageCode = this.getLanguageCode(req);
        const user = session && (session as AuthenticatedSession).user;
        const isAuthorized = this.userHasRequiredPermissionsOnChannel(requiredPermissions, channel, user);
        const authorizedAsOwnerOnly = !isAuthorized && hasOwnerPermission;
        return new RequestContext({
            channel,
            languageCode,
            session,
            isAuthorized,
            authorizedAsOwnerOnly,
        });
    }

    private getChannelToken(req: Request): string {
        const tokenKey = this.configService.channelTokenKey;
        let channelToken: string;

        if (req && req.query && req.query[tokenKey]) {
            channelToken = req.query[tokenKey];
        } else if (req && req.headers && req.headers[tokenKey]) {
            channelToken = req.headers[tokenKey] as string;
        } else {
            throw new NoValidChannelError();
        }
        return channelToken;
    }

    private getLanguageCode(req: Request): LanguageCode | undefined {
        return req.body && req.body.variables && req.body.variables.languageCode;
    }

    private isAuthenticatedSession(session?: Session): session is AuthenticatedSession {
        return !!session && !!(session as AuthenticatedSession).user;
    }

    private userHasRequiredPermissionsOnChannel(
        permissions: Permission[] = [],
        channel?: Channel,
        user?: User,
    ): boolean {
        if (!user || !channel) {
            return false;
        }
        const permissionsOnChannel = user.roles
            .filter(role => role.channels.find(c => idsAreEqual(c.id, channel.id)))
            .reduce((output, role) => [...output, ...role.permissions], [] as Permission[]);
        return this.arraysIntersect(permissions, permissionsOnChannel);
    }

    /**
     * Returns true if any element of arr1 appears in arr2.
     */
    private arraysIntersect<T>(arr1: T[], arr2: T[]): boolean {
        return arr1.reduce((intersects, role) => {
            return intersects || arr2.includes(role);
        }, false);
    }
}
