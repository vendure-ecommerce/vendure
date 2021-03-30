import { Injectable } from '@nestjs/common';
import { LanguageCode, Permission } from '@vendure/common/lib/generated-types';
import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';

import { idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { CachedSession, CachedSessionUser } from '../../config/session-cache/session-cache-strategy';
import { Channel } from '../../entity/channel/channel.entity';
import { ChannelService } from '../../service/services/channel.service';

import { getApiType } from './get-api-type';
import { RequestContext } from './request-context';

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
        session?: CachedSession,
    ): Promise<RequestContext> {
        const channelToken = this.getChannelToken(req);
        const channel = this.channelService.getChannelFromToken(channelToken);
        const apiType = getApiType(info);

        const hasOwnerPermission = !!requiredPermissions && requiredPermissions.includes(Permission.Owner);
        const languageCode = this.getLanguageCode(req, channel);
        const user = session && session.user;
        const isAuthorized = this.userHasRequiredPermissionsOnChannel(requiredPermissions, channel, user);
        const authorizedAsOwnerOnly = !isAuthorized && hasOwnerPermission;
        const translationFn = (req as any).t;
        return new RequestContext({
            req,
            apiType,
            channel,
            languageCode,
            session,
            isAuthorized,
            authorizedAsOwnerOnly,
            translationFn,
        });
    }

    private getChannelToken(req: Request<any, any, any, { [key: string]: any }>): string {
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
            (req.query && (req.query.languageCode as LanguageCode)) ??
            channel.defaultLanguageCode ??
            this.configService.defaultLanguageCode
        );
    }

    /**
     * TODO: Deprecate and remove, since this function is now handled internally in the RequestContext.
     * @private
     */
    private userHasRequiredPermissionsOnChannel(
        permissions: Permission[] = [],
        channel?: Channel,
        user?: CachedSessionUser,
    ): boolean {
        if (!user || !channel) {
            return false;
        }
        const permissionsOnChannel = user.channelPermissions.find(c => idsAreEqual(c.id, channel.id));
        if (permissionsOnChannel) {
            return this.arraysIntersect(permissionsOnChannel.permissions, permissions);
        }
        return false;
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
