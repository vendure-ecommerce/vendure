import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';

import { ApiType } from '../../api/common/get-api-type';
import { RequestContext } from '../../api/common/request-context';
import { InternalServerError } from '../../common/error/errors';
import { InvalidCredentialsError } from '../../common/error/generated-graphql-admin-errors';
import {
    InvalidCredentialsError as ShopInvalidCredentialsError,
    NotVerifiedError,
} from '../../common/error/generated-graphql-shop-errors';
import { AuthenticationStrategy } from '../../config/auth/authentication-strategy';
import {
    NativeAuthenticationData,
    NativeAuthenticationStrategy,
    NATIVE_AUTH_STRATEGY_NAME,
} from '../../config/auth/native-authentication-strategy';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { AttemptedLoginEvent } from '../../event-bus/events/attempted-login-event';
import { LoginEvent } from '../../event-bus/events/login-event';
import { LogoutEvent } from '../../event-bus/events/logout-event';

import { SessionService } from './session.service';

/**
 * @description
 * Contains methods relating to {@link Session}, {@link AuthenticatedSession} & {@link AnonymousSession} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class AuthService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private sessionService: SessionService,
        private eventBus: EventBus,
    ) {}

    /**
     * @description
     * Authenticates a user's credentials and if okay, creates a new {@link AuthenticatedSession}.
     */
    async authenticate(
        ctx: RequestContext,
        apiType: ApiType,
        authenticationMethod: string,
        authenticationData: any,
    ): Promise<AuthenticatedSession | InvalidCredentialsError | NotVerifiedError> {
        this.eventBus.publish(
            new AttemptedLoginEvent(
                ctx,
                authenticationMethod,
                authenticationMethod === NATIVE_AUTH_STRATEGY_NAME
                    ? (authenticationData as NativeAuthenticationData).username
                    : undefined,
            ),
        );
        const authenticationStrategy = this.getAuthenticationStrategy(apiType, authenticationMethod);
        const authenticateResult = await authenticationStrategy.authenticate(ctx, authenticationData);
        if (typeof authenticateResult === 'string') {
            return new InvalidCredentialsError(authenticateResult);
        }
        if (!authenticateResult) {
            return new InvalidCredentialsError('');
        }
        return this.createAuthenticatedSessionForUser(ctx, authenticateResult, authenticationStrategy.name);
    }

    async createAuthenticatedSessionForUser(
        ctx: RequestContext,
        user: User,
        authenticationStrategyName: string,
    ): Promise<AuthenticatedSession | NotVerifiedError> {
        if (!user.roles || !user.roles[0]?.channels) {
            const userWithRoles = await this.connection
                .getRepository(ctx, User)
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.roles', 'role')
                .leftJoinAndSelect('role.channels', 'channel')
                .where('user.id = :userId', { userId: user.id })
                .getOne();
            user.roles = userWithRoles?.roles || [];
        }

        if (this.configService.authOptions.requireVerification && !user.verified) {
            return new NotVerifiedError();
        }
        if (ctx.session && ctx.session.activeOrderId) {
            await this.sessionService.deleteSessionsByActiveOrderId(ctx, ctx.session.activeOrderId);
        }
        user.lastLogin = new Date();
        await this.connection.getRepository(ctx, User).save(user, { reload: false });
        const session = await this.sessionService.createNewAuthenticatedSession(
            ctx,
            user,
            authenticationStrategyName,
        );
        this.eventBus.publish(new LoginEvent(ctx, user));
        return session;
    }

    /**
     * @description
     * Verify the provided password against the one we have for the given user. Requires
     * the {@link NativeAuthenticationStrategy} to be configured.
     */
    async verifyUserPassword(
        ctx: RequestContext,
        userId: ID,
        password: string,
    ): Promise<boolean | InvalidCredentialsError | ShopInvalidCredentialsError> {
        const nativeAuthenticationStrategy = this.getAuthenticationStrategy(
            'shop',
            NATIVE_AUTH_STRATEGY_NAME,
        );
        const passwordMatches = await nativeAuthenticationStrategy.verifyUserPassword(ctx, userId, password);
        if (!passwordMatches) {
            return new InvalidCredentialsError('');
        }
        return true;
    }

    /**
     * @description
     * Deletes all sessions for the user associated with the given session token.
     */
    async destroyAuthenticatedSession(ctx: RequestContext, sessionToken: string): Promise<void> {
        const session = await this.connection.getRepository(ctx, AuthenticatedSession).findOne({
            where: { token: sessionToken },
            relations: ['user', 'user.authenticationMethods'],
        });

        if (session) {
            const authenticationStrategy = this.getAuthenticationStrategy(
                ctx.apiType,
                session.authenticationStrategy,
            );
            if (typeof authenticationStrategy.onLogOut === 'function') {
                await authenticationStrategy.onLogOut(ctx, session.user);
            }
            this.eventBus.publish(new LogoutEvent(ctx));
            return this.sessionService.deleteSessionsByUser(ctx, session.user);
        }
    }

    private getAuthenticationStrategy(
        apiType: ApiType,
        method: typeof NATIVE_AUTH_STRATEGY_NAME,
    ): NativeAuthenticationStrategy;
    private getAuthenticationStrategy(apiType: ApiType, method: string): AuthenticationStrategy;
    private getAuthenticationStrategy(apiType: ApiType, method: string): AuthenticationStrategy {
        const { authOptions } = this.configService;
        const strategies =
            apiType === 'admin'
                ? authOptions.adminAuthenticationStrategy
                : authOptions.shopAuthenticationStrategy;
        const match = strategies.find(s => s.name === method);
        if (!match) {
            throw new InternalServerError('error.unrecognized-authentication-strategy', { name: method });
        }
        return match;
    }
}
