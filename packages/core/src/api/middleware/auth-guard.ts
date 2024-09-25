import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@vendure/common/lib/generated-types';
import { Request, Response } from 'express';

import { ForbiddenError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { LogLevel } from '../../config/logger/vendure-logger';
import { CachedSession } from '../../config/session-cache/session-cache-strategy';
import { Customer } from '../../entity/customer/customer.entity';
import { RequestContextService } from '../../service/helpers/request-context/request-context.service';
import { ChannelService } from '../../service/services/channel.service';
import { CustomerService } from '../../service/services/customer.service';
import { SessionService } from '../../service/services/session.service';
import { extractSessionToken } from '../common/extract-session-token';
import { isFieldResolver } from '../common/is-field-resolver';
import { parseContext } from '../common/parse-context';
import {
    internal_getRequestContext,
    internal_setRequestContext,
    RequestContext,
} from '../common/request-context';
import { setSessionToken } from '../common/set-session-token';
import { PERMISSIONS_METADATA_KEY } from '../decorators/allow.decorator';

/**
 * @description
 * A guard which:
 *
 * 1. checks for the existence of a valid session token in the request and if found,
 * attaches the current User entity to the request.
 * 2. enforces any permissions required by the target handler (resolver, field resolver or route),
 * and throws a ForbiddenError if those permissions are not present.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    strategy: any;

    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
        private requestContextService: RequestContextService,
        private sessionService: SessionService,
        private customerService: CustomerService,
        private channelService: ChannelService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { req, res, info } = parseContext(context);
        const targetIsFieldResolver = isFieldResolver(info);
        const permissions = this.reflector.get<Permission[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        if (targetIsFieldResolver && !permissions) {
            return true;
        }
        const authDisabled = this.configService.authOptions.disableAuth;
        const isPublic = !!permissions && permissions.includes(Permission.Public);
        const hasOwnerPermission = !!permissions && permissions.includes(Permission.Owner);
        let requestContext: RequestContext;
        if (targetIsFieldResolver) {
            requestContext = internal_getRequestContext(req);
        } else {
            const session = await this.getSession(req, res, hasOwnerPermission);
            requestContext = await this.requestContextService.fromRequest(req, info, permissions, session);

            const requestContextShouldBeReinitialized = await this.setActiveChannel(requestContext, session);
            if (requestContextShouldBeReinitialized) {
                requestContext = await this.requestContextService.fromRequest(
                    req,
                    info,
                    permissions,
                    session,
                );
            }
            internal_setRequestContext(req, requestContext, context);
        }

        if (authDisabled || !permissions || isPublic) {
            return true;
        } else {
            const canActivate =
                requestContext.userHasPermissions(permissions) || requestContext.authorizedAsOwnerOnly;
            if (!canActivate) {
                throw new ForbiddenError(LogLevel.Verbose);
            } else {
                return canActivate;
            }
        }
    }

    private async setActiveChannel(
        requestContext: RequestContext,
        session?: CachedSession,
    ): Promise<boolean> {
        if (!session) {
            return false;
        }
        // In case the session does not have an activeChannelId or the activeChannelId
        // does not correspond to the current channel, the activeChannelId on the session is set
        const activeChannelShouldBeSet =
            !session.activeChannelId || session.activeChannelId !== requestContext.channelId;
        if (activeChannelShouldBeSet) {
            await this.sessionService.setActiveChannel(session, requestContext.channel);
            if (requestContext.activeUserId) {
                const customer = await this.customerService.findOneByUserId(
                    requestContext,
                    requestContext.activeUserId,
                    false,
                );
                // To avoid assigning the customer to the active channel on every request,
                // it is only done on the first request and whenever the channel changes
                if (customer) {
                    try {
                        await this.channelService.assignToChannels(requestContext, Customer, customer.id, [
                            requestContext.channelId,
                        ]);
                    } catch (e: any) {
                        const isDuplicateError =
                            e.code === 'ER_DUP_ENTRY' /* mySQL/MariaDB */ ||
                            e.code === '23505'; /* postgres */
                        if (isDuplicateError) {
                            // For a duplicate error, this means that concurrent requests have resulted in attempting to
                            // assign the Customer to the channel more than once. In this case we can safely ignore the
                            // error as the Customer was successfully assigned in the earlier call.
                            // See https://github.com/vendure-ecommerce/vendure/issues/834
                        } else {
                            throw e;
                        }
                    }
                }
            }
            return true;
        }
        return false;
    }

    private async getSession(
        req: Request,
        res: Response,
        hasOwnerPermission: boolean,
    ): Promise<CachedSession | undefined> {
        const sessionToken = extractSessionToken(req, this.configService.authOptions.tokenMethod);
        let serializedSession: CachedSession | undefined;
        if (sessionToken) {
            serializedSession = await this.sessionService.getSessionFromToken(sessionToken);
            if (serializedSession) {
                return serializedSession;
            }
            // if there is a token but it cannot be validated to a Session,
            // then the token is no longer valid and should be unset.
            setSessionToken({
                req,
                res,
                authOptions: this.configService.authOptions,
                rememberMe: false,
                sessionToken: '',
            });
        }

        if (hasOwnerPermission && !serializedSession) {
            serializedSession = await this.sessionService.createAnonymousSession();
            setSessionToken({
                sessionToken: serializedSession.token,
                rememberMe: true,
                authOptions: this.configService.authOptions,
                req,
                res,
            });
        }
        return serializedSession;
    }
}
