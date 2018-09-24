import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'shared/shared-constants';

import { JwtPayload } from '../../common/types/auth-types';
import { ConfigService } from '../../config/config.service';
import { AuthService } from '../../service/providers/auth.service';

import { PERMISSIONS_METADATA_KEY } from './roles-guard';

/**
 * A guard which uses passport.js & the passport-jwt strategy to authenticate incoming GraphQL requests.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    strategy: any;

    constructor(
        private reflector: Reflector,
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        this.strategy = new Strategy(
            {
                secretOrKey: configService.authOptions.jwtSecret,
                algorithms: ['HS256'],
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                jsonWebTokenOptions: {
                    expiresIn: this.configService.authOptions.expiresIn,
                },
            },
            (payload: any, done: () => void) => this.validate(payload, done),
        );
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const permissions = this.reflector.get<string[]>(PERMISSIONS_METADATA_KEY, context.getHandler());
        if (this.configService.authOptions.disableAuth || !permissions) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        return this.authenticate(ctx.req, ctx.res);
    }

    async validate(payload: JwtPayload, done: (err: Error | null, user: any) => void) {
        const user = await this.authService.validateUser(payload.identifier);
        if (!user) {
            return done(new UnauthorizedException(), false);
        }
        done(null, user);
    }

    /**
     * Wraps the JwtStrategy.authenticate() call in a Promise, and also patches
     * the methods which it expects to exist because it is designed to run as
     * an Express middleware function.
     */
    private authenticate(request: Request, response: Response): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.strategy.fail = async info => {
                if (info instanceof TokenExpiredError) {
                    const currentAuthToken = this.extractAuthToken(request);
                    const currentRefreshToken = request.get(REFRESH_TOKEN_KEY);
                    if (currentAuthToken && currentRefreshToken) {
                        try {
                            const result = await this.authService.refreshTokens(
                                currentAuthToken,
                                currentRefreshToken,
                            );
                            if (result) {
                                // set the new token headers
                                response.set(AUTH_TOKEN_KEY, result.authToken);
                                response.set(REFRESH_TOKEN_KEY, result.refreshToken);
                                (request as any).user = result.user;
                                resolve(true);
                                return;
                            }
                        } catch (e) {
                            // fall through
                        }
                    }
                }
                resolve(false);
            };
            this.strategy.success = (user, info) => {
                (request as any).user = user;
                resolve(true);
            };
            this.strategy.error = err => {
                reject(err);
            };
            this.strategy.authenticate(request);
        });
    }

    /**
     * Extract the token from the 'Authorization: Bearer <token>' header
     */
    private extractAuthToken(req: Request): string | undefined {
        const authHeader = req.get('authorization');
        if (authHeader) {
            const matches = authHeader.match(/bearer\s+(.+)/i);
            if (matches && matches[1]) {
                return matches[1];
            }
        }
    }
}
