import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID } from '@vendure/common/lib/shared-types';
import crypto from 'crypto';
import ms from 'ms';
import { Connection, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { AuthenticationStrategy } from '../../config/auth/authentication-strategy';
import { ConfigService } from '../../config/config.service';
import { CachedSession, SessionCacheStrategy } from '../../config/session-cache/session-cache-strategy';
import { Channel } from '../../entity/channel/channel.entity';
import { Order } from '../../entity/order/order.entity';
import { Role } from '../../entity/role/role.entity';
import { AnonymousSession } from '../../entity/session/anonymous-session.entity';
import { AuthenticatedSession } from '../../entity/session/authenticated-session.entity';
import { Session } from '../../entity/session/session.entity';
import { User } from '../../entity/user/user.entity';
import { getUserChannelsPermissions } from '../helpers/utils/get-user-channels-permissions';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { OrderService } from './order.service';

@Injectable()
export class SessionService implements EntitySubscriberInterface {
    private sessionCacheStrategy: SessionCacheStrategy;
    private readonly sessionDurationInMs: number;

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

    afterInsert(event: InsertEvent<any>): Promise<any> | void {
        this.clearSessionCacheOnDataChange(event);
    }

    afterRemove(event: RemoveEvent<any>): Promise<any> | void {
        this.clearSessionCacheOnDataChange(event);
    }

    afterUpdate(event: UpdateEvent<any>): Promise<any> | void {
        this.clearSessionCacheOnDataChange(event);
    }

    private async clearSessionCacheOnDataChange(
        event: InsertEvent<any> | RemoveEvent<any> | UpdateEvent<any>,
    ) {
        if (event.entity) {
            // If a Channel or Role changes, potentially all the cached permissions in the
            // session cache will be wrong, so we just clear the entire cache. It should however
            // be a very rare occurrence in normal operation, once initial setup is complete.
            if (event.entity instanceof Channel || event.entity instanceof Role) {
                await this.sessionCacheStrategy.clear();
            }
        }
    }

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
        const authenticatedSession = await this.connection.getRepository(AuthenticatedSession).save(
            new AuthenticatedSession({
                token,
                user,
                activeOrder,
                authenticationStrategy: authenticationStrategyName,
                expires: this.getExpiryDate(this.sessionDurationInMs),
                invalidated: false,
            }),
        );
        await this.sessionCacheStrategy.set(this.serializeSession(authenticatedSession));
        return authenticatedSession;
    }

    /**
     * Create an anonymous session.
     */
    async createAnonymousSession(): Promise<CachedSession> {
        const token = await this.generateSessionToken();
        const anonymousSessionDurationInMs = ms('1y');
        const session = new AnonymousSession({
            token,
            expires: this.getExpiryDate(anonymousSessionDurationInMs),
            invalidated: false,
        });
        // save the new session
        const newSession = await this.connection.getRepository(AnonymousSession).save(session);
        const serializedSession = this.serializeSession(newSession);
        await this.sessionCacheStrategy.set(serializedSession);
        return serializedSession;
    }

    async getSessionFromToken(sessionToken: string): Promise<CachedSession | undefined> {
        let serializedSession = await this.sessionCacheStrategy.get(sessionToken);
        const stale = !!(serializedSession && serializedSession.cacheExpiry < new Date().getTime() / 1000);
        const expired = !!(serializedSession && serializedSession.expires < new Date());
        if (!serializedSession || stale || expired) {
            const session = await this.findSessionByToken(sessionToken);
            if (session) {
                serializedSession = this.serializeSession(session);
                await this.sessionCacheStrategy.set(serializedSession);
                return serializedSession;
            } else {
                return;
            }
        }
        return serializedSession;
    }

    serializeSession(session: AuthenticatedSession | AnonymousSession): CachedSession {
        const expiry =
            Math.floor(new Date().getTime() / 1000) + this.configService.authOptions.sessionCacheTTL;
        const serializedSession: CachedSession = {
            cacheExpiry: expiry,
            id: session.id,
            token: session.token,
            expires: session.expires,
            activeOrderId: session.activeOrderId,
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
     * Looks for a valid session with the given token and returns one if found.
     */
    private async findSessionByToken(token: string): Promise<Session | undefined> {
        const session = await this.connection
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

    async setActiveOrder(serializedSession: CachedSession, order: Order): Promise<CachedSession> {
        const session = await this.connection
            .getRepository(Session)
            .findOne(serializedSession.id, { relations: ['user', 'user.roles', 'user.roles.channels'] });
        if (session) {
            session.activeOrder = order;
            await this.connection.getRepository(Session).save(session, { reload: false });
            const updatedSerializedSession = this.serializeSession(session);
            await this.sessionCacheStrategy.set(updatedSerializedSession);
            return updatedSerializedSession;
        }
        return serializedSession;
    }

    async unsetActiveOrder(serializedSession: CachedSession): Promise<CachedSession> {
        if (serializedSession.activeOrderId) {
            const session = await this.connection
                .getRepository(Session)
                .findOne(serializedSession.id, { relations: ['user', 'user.roles', 'user.roles.channels'] });
            if (session) {
                session.activeOrder = null;
                await this.connection.getRepository(Session).save(session);
                const updatedSerializedSession = this.serializeSession(session);
                await this.configService.authOptions.sessionCacheStrategy.set(updatedSerializedSession);
                return updatedSerializedSession;
            }
        }
        return serializedSession;
    }

    /**
     * Deletes all existing sessions for the given user.
     */
    async deleteSessionsByUser(user: User): Promise<void> {
        const userSessions = await this.connection
            .getRepository(AuthenticatedSession)
            .find({ where: { user } });
        await this.connection.getRepository(AuthenticatedSession).remove(userSessions);
        for (const session of userSessions) {
            await this.sessionCacheStrategy.delete(session.token);
        }
    }

    /**
     * Deletes all existing sessions with the given activeOrder.
     */
    async deleteSessionsByActiveOrderId(activeOrderId: ID): Promise<void> {
        const sessions = await this.connection.getRepository(Session).find({ where: { activeOrderId } });
        await this.connection.getRepository(Session).remove(sessions);
        for (const session of sessions) {
            await this.sessionCacheStrategy.delete(session.token);
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
            await this.connection
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
