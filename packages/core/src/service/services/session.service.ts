import { Injectable } from '@nestjs/common';
import { ID } from '@vendure/common/lib/shared-types';
import crypto from 'crypto';
import ms from 'ms';
import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { ConfigService } from '../../config/config.service';
import { CachedSession, SessionCacheStrategy } from '../../config/session-cache/session-cache-strategy';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { Order } from '../../entity/order/order.entity';
import { Role } from '../../entity/role/role.entity';
import { AnonymousSession } from '../../entity/session/anonymous-session.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { getUserChannelsPermissions } from '../helpers/utils/get-user-channels-permissions';

import { OrderService } from './order.service';

/**
 * @description
 * Contains methods relating to {@link Session} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class SessionService implements EntitySubscriberInterface {
    private sessionCacheStrategy: SessionCacheStrategy;
    private readonly sessionDurationInMs: number;
    private readonly sessionCacheTimeoutMs = 50;

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private orderService: OrderService,
    ) {
        this.sessionCacheStrategy = this.configService.authOptions.sessionCacheStrategy;
        this.sessionDurationInMs = ms(this.configService.authOptions.sessionDuration as string);
        // This allows us to register this class as a TypeORM Subscriber while also allowing
        // the injection on dependencies. See https://docs.nestjs.com/techniques/database#subscribers
        this.connection.rawConnection.subscribers.push(this);
    }

    /** @internal */
    async afterInsert(event: InsertEvent<any>): Promise<any> {
        await this.clearSessionCacheOnDataChange(event);
    }

    /** @internal */
    async afterRemove(event: RemoveEvent<any>): Promise<any> {
        await this.clearSessionCacheOnDataChange(event);
    }

    /** @internal */
    async afterUpdate(event: UpdateEvent<any>): Promise<any> {
        await this.clearSessionCacheOnDataChange(event);
    }

    private async clearSessionCacheOnDataChange(
        event: InsertEvent<any> | RemoveEvent<any> | UpdateEvent<any>,
    ) {
        if (event.entity) {
            // If a Channel or Role changes, potentially all the cached permissions in the
            // session cache will be wrong, so we just clear the entire cache. It should however
            // be a very rare occurrence in normal operation, once initial setup is complete.
            if (event.entity instanceof Channel || event.entity instanceof Role) {
                await this.withTimeout(this.sessionCacheStrategy.clear());
            }
        }
    }

    /**
     * @description
     * Creates a new {@link AuthenticatedSession}. To be used after successful authentication.
     */
    async createNewAuthenticatedSession(
        ctx: RequestContext,
        user: User,
        authenticationStrategyName: string,
    ): Promise<AuthenticatedSession> {
        const token = await this.generateSessionToken();
        const guestOrder =
            ctx.session && ctx.session.activeOrderId
                ? await this.orderService.findOne(ctx, ctx.session.activeOrderId)
                : undefined;
        const existingOrder = await this.orderService.getActiveOrderForUser(ctx, user.id);
        const activeOrder = await this.orderService.mergeOrders(ctx, user, guestOrder, existingOrder);
        const authenticatedSession = await this.connection.getRepository(ctx, AuthenticatedSession).save(
            new AuthenticatedSession({
                token,
                user,
                activeOrder,
                authenticationStrategy: authenticationStrategyName,
                expires: this.getExpiryDate(this.sessionDurationInMs),
                invalidated: false,
            }),
        );
        await this.withTimeout(this.sessionCacheStrategy.set(this.serializeSession(authenticatedSession)));
        return authenticatedSession;
    }

    /**
     * @description
     * Create an {@link AnonymousSession} and caches it using the configured {@link SessionCacheStrategy},
     * and returns the cached session object.
     */
    async createAnonymousSession(): Promise<CachedSession> {
        const token = await this.generateSessionToken();
        const session = new AnonymousSession({
            token,
            expires: this.getExpiryDate(this.sessionDurationInMs),
            invalidated: false,
        });
        // save the new session
        const newSession = await this.connection.rawConnection.getRepository(AnonymousSession).save(session);
        const serializedSession = this.serializeSession(newSession);
        await this.withTimeout(this.sessionCacheStrategy.set(serializedSession));
        return serializedSession;
    }

    /**
     * @description
     * Returns the cached session object matching the given session token.
     */
    async getSessionFromToken(sessionToken: string): Promise<CachedSession | undefined> {
        let serializedSession = await this.withTimeout(this.sessionCacheStrategy.get(sessionToken));
        const stale = !!(serializedSession && serializedSession.cacheExpiry < new Date().getTime() / 1000);
        const expired = !!(serializedSession && serializedSession.expires < new Date());
        if (!serializedSession || stale || expired) {
            const session = await this.findSessionByToken(sessionToken);
            if (session) {
                serializedSession = this.serializeSession(session);
                await this.withTimeout(this.sessionCacheStrategy.set(serializedSession));
                return serializedSession;
            } else {
                return;
            }
        }
        return serializedSession;
    }

    /**
     * @description
     * Serializes a {@link Session} instance into a simplified plain object suitable for caching.
     */
    serializeSession(session: AuthenticatedSession | AnonymousSession): CachedSession {
        const expiry =
            Math.floor(new Date().getTime() / 1000) + this.configService.authOptions.sessionCacheTTL;
        const serializedSession: CachedSession = {
            cacheExpiry: expiry,
            id: session.id,
            token: session.token,
            expires: session.expires,
            activeOrderId: session.activeOrderId,
            activeChannelId: session.activeChannelId,
        };
        if (this.isAuthenticatedSession(session)) {
            serializedSession.authenticationStrategy = session.authenticationStrategy;
            const { user } = session;
            serializedSession.user = {
                id: user.id,
                identifier: user.identifier,
                verified: user.verified,
                channelPermissions: getUserChannelsPermissions(user),
            };
        }
        return serializedSession;
    }

    /**
     * If the session cache is taking longer than say 50ms then something is wrong - it is supposed to
     * be very fast after all! So we will return undefined and let the request continue without a cached session.
     */
    private withTimeout<T>(maybeSlow: Promise<T> | T): Promise<T | undefined> {
        return Promise.race([
            new Promise<undefined>(resolve =>
                setTimeout(() => resolve(undefined), this.sessionCacheTimeoutMs),
            ),
            maybeSlow,
        ]);
    }

    /**
     * Looks for a valid session with the given token and returns one if found.
     */
    private async findSessionByToken(token: string): Promise<Session | undefined> {
        const session = await this.connection.rawConnection
            .getRepository(Session)
            .createQueryBuilder('session')
            .leftJoinAndSelect('session.user', 'user')
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.channels', 'channels')
            .where('session.token = :token', { token })
            .andWhere('session.invalidated = false')
            .getOne();

        if (session && session.expires > new Date()) {
            await this.updateSessionExpiry(session);
            return session;
        }
    }

    /**
     * @description
     * Sets the `activeOrder` on the given cached session object and updates the cache.
     */
    async setActiveOrder(
        ctx: RequestContext,
        serializedSession: CachedSession,
        order: Order,
    ): Promise<CachedSession> {
        const session = await this.connection.getRepository(ctx, Session).findOne({
            where: { id: serializedSession.id },
            relations: ['user', 'user.roles', 'user.roles.channels'],
        });
        if (session) {
            session.activeOrder = order;
            await this.connection.getRepository(ctx, Session).save(session, { reload: false });
            const updatedSerializedSession = this.serializeSession(session);
            await this.withTimeout(this.sessionCacheStrategy.set(updatedSerializedSession));
            return updatedSerializedSession;
        }
        return serializedSession;
    }

    /**
     * @description
     * Clears the `activeOrder` on the given cached session object and updates the cache.
     */
    async unsetActiveOrder(ctx: RequestContext, serializedSession: CachedSession): Promise<CachedSession> {
        if (serializedSession.activeOrderId) {
            const session = await this.connection.getRepository(ctx, Session).findOne({
                where: { id: serializedSession.id },
                relations: ['user', 'user.roles', 'user.roles.channels'],
            });
            if (session) {
                session.activeOrder = null;
                await this.connection.getRepository(ctx, Session).save(session);
                const updatedSerializedSession = this.serializeSession(session);
                await this.configService.authOptions.sessionCacheStrategy.set(updatedSerializedSession);
                return updatedSerializedSession;
            }
        }
        return serializedSession;
    }

    /**
     * @description
     * Sets the `activeChannel` on the given cached session object and updates the cache.
     */
    async setActiveChannel(serializedSession: CachedSession, channel: Channel): Promise<CachedSession> {
        const session = await this.connection.rawConnection.getRepository(Session).findOne({
            where: { id: serializedSession.id },
            relations: ['user', 'user.roles', 'user.roles.channels'],
        });
        if (session) {
            session.activeChannel = channel;
            await this.connection.rawConnection.getRepository(Session).save(session, { reload: false });
            const updatedSerializedSession = this.serializeSession(session);
            await this.withTimeout(this.sessionCacheStrategy.set(updatedSerializedSession));
            return updatedSerializedSession;
        }
        return serializedSession;
    }

    /**
     * @description
     * Deletes all existing sessions for the given user.
     */
    async deleteSessionsByUser(ctx: RequestContext, user: User): Promise<void> {
        const userSessions = await this.connection
            .getRepository(ctx, AuthenticatedSession)
            .find({ where: { user: { id: user.id } } });
        await this.connection.getRepository(ctx, AuthenticatedSession).remove(userSessions);
        for (const session of userSessions) {
            await this.withTimeout(this.sessionCacheStrategy.delete(session.token));
        }
    }

    /**
     * @description
     * Deletes all existing sessions with the given activeOrder.
     */
    async deleteSessionsByActiveOrderId(ctx: RequestContext, activeOrderId: ID): Promise<void> {
        const sessions = await this.connection.getRepository(ctx, Session).find({ where: { activeOrderId } });
        await this.connection.getRepository(ctx, Session).remove(sessions);
        for (const session of sessions) {
            await this.withTimeout(this.sessionCacheStrategy.delete(session.token));
        }
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
            const newExpiryDate = this.getExpiryDate(this.sessionDurationInMs);
            session.expires = newExpiryDate;
            await this.connection.rawConnection
                .getRepository(Session)
                .update({ id: session.id }, { expires: newExpiryDate });
        }
    }

    /**
     * Returns a future expiry date according timeToExpireInMs in the future.
     */
    private getExpiryDate(timeToExpireInMs: number): Date {
        return new Date(Date.now() + timeToExpireInMs);
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

    private isAuthenticatedSession(session: Session): session is AuthenticatedSession {
        return session.hasOwnProperty('user');
    }
}
