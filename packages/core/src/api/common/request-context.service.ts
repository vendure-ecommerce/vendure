import { Injectable } from '@nestjs/common';
import { LanguageCode, Permission } from '@vendure/common/lib/generated-types';
import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';

import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Channel } from '../../entity/channel/channel.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { ChannelService } from '../../service/services/channel.service';

import { getApiType } from './get-api-type';
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
        info?: GraphQLResolveInfo,
        requiredPermissions?: Permission[],
        session?: Session,
    ): Promise<RequestContext> {
        const channelToken = this.getChannelToken(req);
        const channel = this.channelService.getChannelFromToken(channelToken);
        const apiType = getApiType(info);

        const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(Permission.Owner);
        const languageCode = this.getLanguageCode(req, channel);
        const user = session && (session as AuthenticatedSession).user;
        const isAuthorized = this.userHasRequiredPermissionsOnChannel(requiredPermissions, channel, user);
        const authorizedAsOwnerOnly = !isAuthorized && hasOwnerPermission;
        const translationFn = (req as any).t;
        return new RequestContext({
            apiType,
            channel,
            languageCode,
            session,
            isAuthorized,
            authorizedAsOwnerOnly,
            translationFn,
        });
    }

    private getChannelToken(req: Request): string {
        const tokenKey = this.configService.apiOptions.channelTokenKey;
        let channelToken = '';

        if (req && req.query && req.query[tokenKey]) {
            channelToken = req.query[tokenKey];
        } else if (req && req.headers && req.headers[tokenKey]) {
            channelToken = req.headers[tokenKey] as string;
        }
        return channelToken;
    }

    private getLanguageCode(req: Request, channel: Channel): LanguageCode | undefined {
        return (
            (req.query && req.query.languageCode) ??
            channel.defaultLanguageCode ??
            this.configService.defaultLanguageCode
        );
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
        }, false as boolean);
    }
}
