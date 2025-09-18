import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { ConfigService } from '../../config/config.service';
import { RequestContextService } from '../../service/helpers/request-context/request-context.service';
import { ApiKeyService } from '../../service/services/api-key.service';
import { SessionService } from '../../service/services/session.service';
import { setSessionToken } from '../common/set-session-token';

/**
 * Middleware that authenticates requests using an API key passed in the Authorization header.
 * If valid, it reuses or creates a persisted session and sets the session token on the response,
 * so that the standard AuthGuard will see a normal session for the same request.
 */
@Injectable()
export class ApiKeyHeaderAuthMiddleware implements NestMiddleware {
    constructor(
        private configService: ConfigService,
        private requestContextService: RequestContextService,
        private apiKeyService: ApiKeyService,
        private sessionService: SessionService,
    ) {}

    async use(req: Request, res: Response, next: () => void) {
        try {
            const authHeader = req.get('Authorization');
            if (!authHeader) return next();
            const apiKeyMatch = authHeader.trim().match(/^apikey\s+(.+)$/i);
            if (!apiKeyMatch) return next();

            const path = ((req.baseUrl ?? '') + (req.path ?? '')).toLowerCase();
            const adminBase = `/${this.configService.apiOptions.adminApiPath}`.toLowerCase();
            const shopBase = `/${this.configService.apiOptions.shopApiPath}`.toLowerCase();
            const isAdminApiRequest = path === adminBase || path.startsWith(adminBase + '/');
            const isShopApiRequest = path === shopBase || path.startsWith(shopBase + '/');

            const apiKeyConfig = (this.configService.authOptions as any).apiKey ?? {};
            const adminEnabled = apiKeyConfig.admin?.enabled ?? true;
            const shopEnabled = apiKeyConfig.shop?.enabled ?? false;

            if (isAdminApiRequest && !adminEnabled) return next();
            if (isShopApiRequest && !shopEnabled) return next();

            // Determine API type for verification and session creation
            const apiType: 'admin' | 'shop' | undefined = isAdminApiRequest
                ? 'admin'
                : isShopApiRequest
                  ? 'shop'
                  : undefined;
            if (!apiType) return next();

            const tmpCtx = await this.requestContextService.create({ apiType, req });
            const result = await this.apiKeyService.verifyRawKey(tmpCtx, apiKeyMatch[1]);
            if (!result) return next();
            if (apiType === 'admin' && result.apiKey.scope !== 'admin') return next();
            if (apiType === 'shop' && result.apiKey.scope !== 'shop') return next();

            // Reuse active session for this key or create a new one; TTL logic handled in SessionService
            const existing = await this.sessionService.findActiveSessionByApiKeyId(
                tmpCtx,
                result.apiKey.id as any,
            );
            const effective =
                existing ??
                (await this.sessionService.createNewAuthenticatedSession(
                    tmpCtx,
                    result.user as any,
                    'apiKey',
                    result.apiKey.id as any,
                ));
            const serialized = await this.sessionService.getSessionFromToken(effective.token);
            if (serialized) {
                setSessionToken({
                    sessionToken: serialized.token,
                    rememberMe: true,
                    authOptions: this.configService.authOptions,
                    req,
                    res,
                });
            }
        } catch (e) {
            // Swallow errors to not block the request; AuthGuard and resolvers will handle auth failures.
        } finally {
            next();
        }
    }
}
