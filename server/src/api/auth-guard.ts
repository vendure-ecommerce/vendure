import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable } from 'rxjs';

import { JwtPayload } from '../common/types/auth-types';
import { ConfigService } from '../config/config.service';
import { User } from '../entity/user/user.entity';
import { AuthService } from '../service/auth.service';

/**
 * A guard which uses passport.js & the passport-jwt strategy to authenticate incoming GraphQL requests.
 * At this time, the Nest AuthGuard is not working with Apollo Server 2, see https://github.com/nestjs/graphql/issues/48
 *
 * If the above issue is fixed, it may make sense to switch to the Nest AuthGuard.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    strategy: any;

    constructor(private configService: ConfigService, private authService: AuthService) {
        this.strategy = new Strategy(
            {
                secretOrKey: configService.jwtSecret,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                // TODO: make this configurable. See https://github.com/vendure-ecommerce/vendure/issues/16
                jsonWebTokenOptions: {
                    expiresIn: '2 days',
                },
            },
            (payload: any, done: () => void) => this.validate(payload, done),
        );
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.configService.disableAuth) {
            return true;
        }
        const ctx = GqlExecutionContext.create(context).getContext();
        return this.authenticate(ctx.req);
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
    private authenticate(request: any): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.strategy.fail = info => {
                resolve(false);
            };
            this.strategy.success = (user, info) => {
                request.user = user;
                resolve(true);
            };
            this.strategy.error = err => {
                reject(err);
            };
            this.strategy.authenticate(request);
        });
    }
}
