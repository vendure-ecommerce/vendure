import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { LanguageCode } from 'shared/generated-types';

import { ConfigService } from '../../config/config.service';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { I18nError } from '../../i18n/i18n-error';
import { AuthService } from '../../service/providers/auth.service';
import { ChannelService } from '../../service/providers/channel.service';

import { extractAuthToken } from './extract-auth-token';
import { RequestContext } from './request-context';

export const REQUEST_CONTEXT_KEY = 'vendureRequestContext';

/**
 * Creates new RequestContext instances.
 */
@Injectable()
export class RequestContextService {
    constructor(
        private channelService: ChannelService,
        private authService: AuthService,
        private configService: ConfigService,
    ) {}

    /**
     * Creates a new RequestContext based on an Express request object.
     */
    async fromRequest(req: Request): Promise<RequestContext> {
        const channelToken = this.getChannelToken(req);
        const channel = channelToken && this.channelService.getChannelFromToken(channelToken);
        if (channel) {
            const session = await this.getSession(req);
            let user: User | undefined;
            if (this.isAuthenticatedSession(session)) {
                user = session.user;
            }
            const languageCode = this.getLanguageCode(req);
            return new RequestContext({
                channel,
                languageCode,
                user,
                session,
            });
        }
        throw new I18nError(`error.unexpected-request-context`);
    }

    private getChannelToken(req: Request): string | undefined {
        const tokenKey = this.configService.channelTokenKey;
        let channelToken: string | undefined;

        if (req && req.query && req.query[tokenKey]) {
            channelToken = req.query[tokenKey];
        } else if (req && req.headers && req.headers[tokenKey]) {
            channelToken = req.headers[tokenKey] as string;
        }
        return channelToken;
    }

    private async getSession(req: Request): Promise<Session | undefined> {
        const authToken = extractAuthToken(req, this.configService.authOptions.tokenMethod);
        if (authToken) {
            return await this.authService.validateSession(authToken);
        }
    }

    private getLanguageCode(req: Request): LanguageCode | undefined {
        return req.body && req.body.variables && req.body.variables.languageCode;
    }

    private isAuthenticatedSession(session?: Session): session is AuthenticatedSession {
        return !!session && !!(session as AuthenticatedSession).user;
    }
}
