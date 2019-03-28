import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import crypto from 'crypto';
import ms from 'ms';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { NotVerifiedError, UnauthorizedError } from '../../common/error/errors';
import { ConfigService } from '../../config/config.service';
import { Order } from '../../entity/order/order.entity';
import { AnonymousSession } from '../../entity/session/anonymous-session.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';

import { OrderService } from './order.service';

/**
 * The AuthService manages both authenticated and anonymous Sessions.
 */
@Injectable()
export class AuthService {
    private readonly sessionDurationInMs;

    constructor(
        @InjectConnection() private connection: Connection,
        private passwordCipher: PasswordCiper,
        private configService: ConfigService,
        private orderService: OrderService,
    ) {
        this.sessionDurationInMs = ms(this.configService.authOptions.sessionDuration);
    }

    /**
     * Authenticates a user's credentials and if okay, creates a new session.
     */
    async authenticate(
        ctx: RequestContext,
        identifier: string,
        password: string,
    ): Promise<AuthenticatedSession> {
        const user = await this.getUserFromIdentifier(identifier);
        const passwordMatches = await this.passwordCipher.check(password, user.passwordHash);
        if (!passwordMatches) {
            throw new UnauthorizedError();
        }
        if (this.configService.authOptions.requireVerification && !user.verified) {
            throw new NotVerifiedError();
        }
        // TODO: this line is commented out so that the same user may be logged
        // in more than once concurrently. At this time, it is needed in order
        // for the online demo to work properly, but it may be desirable to keep it
        // this way by design. See https://github.com/vendure-ecommerce/vendure/issues/53
        // await this.deleteSessionsByUser(user);

        if (ctx.session && ctx.session.activeOrder) {
            await this.deleteSessionsByActiveOrder(ctx.session && ctx.session.activeOrder);
        }
        const session = await this.createNewAuthenticatedSession(ctx, user);
        const newSession = await this.connection.getRepository(AuthenticatedSession).save(session);
        return newSession;
    }

    /**
     * Create an anonymous session.
     */
    async createAnonymousSession(): Promise<AnonymousSession> {
        const token = await this.generateSessionToken();
        const anonymousSessionDurationInMs = ms('1y');
        const session = new AnonymousSession({
            token,
            expires: this.getExpiryDate(anonymousSessionDurationInMs),
            invalidated: false,
        });
        // save the new session
        const newSession = await this.connection.getRepository(AnonymousSession).save(session);
        return newSession;
    }

    /**
     * Looks for a valid session with the given token and returns one if found.
     */
    async validateSession(token: string): Promise<Session | undefined> {
        const session = await this.connection.getRepository(Session).findOne({
            where: { token, invalidated: false },
            relations: ['user', 'user.roles', 'user.roles.channels', 'activeOrder'],
        });
        if (session && session.expires > new Date()) {
            await this.updateSessionExpiry(session);
            return session;
        }
    }

    async setActiveOrder<T extends Session>(session: T, order: Order): Promise<T> {
        session.activeOrder = order;
        return this.connection.getRepository(Session).save(session);
    }

    async unsetActiveOrder<T extends Session>(session: T): Promise<T> {
        if (session.activeOrder) {
            session.activeOrder = null;
            return this.connection.getRepository(Session).save(session);
        }
        return session;
    }

    /**
     * Deletes all existing sessions for the given user.
     */
    async deleteSessionsByUser(user: User): Promise<void> {
        await this.connection.getRepository(AuthenticatedSession).delete({ user });
    }

    /**
     * Deletes all existing sessions with the given activeOrder.
     */
    async deleteSessionsByActiveOrder(activeOrder: Order): Promise<void> {
        await this.connection.getRepository(Session).delete({ activeOrder });
    }

    /**
     * Deletes all sessions for the user associated with the given session token.
     */
    async deleteSessionByToken(token: string): Promise<void> {
        const session = await this.connection.getRepository(AuthenticatedSession).findOne({
            where: { token },
            relations: ['user'],
        });
        if (session) {
            return this.deleteSessionsByUser(session.user);
        }
    }

    private async createNewAuthenticatedSession(
        ctx: RequestContext,
        user: User,
    ): Promise<AuthenticatedSession> {
        const token = await this.generateSessionToken();
        const guestOrder =
            ctx.session && ctx.session.activeOrder
                ? await this.orderService.findOne(ctx, ctx.session.activeOrder.id)
                : undefined;
        const existingOrder = await this.orderService.getActiveOrderForUser(ctx, user.id);
        const activeOrder = await this.orderService.mergeOrders(ctx, user, guestOrder, existingOrder);
        return new AuthenticatedSession({
            token,
            user,
            activeOrder,
            expires: this.getExpiryDate(this.sessionDurationInMs),
            invalidated: false,
        });
    }

    private async getUserFromIdentifier(identifier: string): Promise<User> {
        const user = await this.connection.getRepository(User).findOne({
            where: { identifier },
            relations: ['roles', 'roles.channels'],
        });
        if (!user) {
            throw new UnauthorizedError();
        }
        return user;
    }

    /**
     * Generates a random session token.
     */
    private generateSessionToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(32, (err, buf) => {
                if (err) {
                    reject(err);
                }
                resolve(buf.toString('hex'));
            });
        });
    }

    /**
     * If we are over half way to the current session's expiry date, then we update it.
     *
     * This ensures that the session will not expire when in active use, but prevents us from
     * needing to run an update query on *every* request.
     */
    private async updateSessionExpiry(session: Session) {
        const now = new Date().getTime();
        if (session.expires.getTime() - now < this.sessionDurationInMs / 2) {
            await this.connection
                .getRepository(Session)
                .update({ id: session.id }, { expires: this.getExpiryDate(this.sessionDurationInMs) });
        }
    }

    /**
     * Returns a future expiry date according timeToExpireInMs in the future.
     */
    private getExpiryDate(timeToExpireInMs: number): Date {
        return new Date(Date.now() + timeToExpireInMs);
    }
}
