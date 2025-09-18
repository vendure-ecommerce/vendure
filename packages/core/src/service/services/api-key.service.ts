import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import crypto from 'crypto';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { ApiKey } from '../../entity/api-key/api-key.entity';
import { User } from '../../entity/user/user.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { PasswordCipher } from '../helpers/password-cipher/password-cipher';

import { SessionService } from './session.service';

/**
 * CRUD and validation for Admin API keys.
 * Generates raw secrets, stores only hashes, and coordinates session invalidation.
 * @since 3.5.0
 */
@Injectable()
export class ApiKeyService {
    constructor(
        private readonly connection: TransactionalConnection,
        private readonly passwordCipher: PasswordCipher,
        private readonly sessionService: SessionService,
        private readonly listQueryBuilder: ListQueryBuilder,
        private readonly configService: ConfigService,
    ) {}

    // listByAdministrator removed; use listByUser instead.

    /** List keys for a User. @since 3.5.0 */
    async listByUser(
        ctx: RequestContext,
        userId: ID,
        options?: ListQueryOptions<ApiKey>,
    ): Promise<PaginatedList<ApiKey>> {
        const qb = this.listQueryBuilder.build(ApiKey, options, {
            where: { user: { id: userId as any } },
            ctx,
        });
        const [items, totalItems] = await qb.getManyAndCount();
        return { items, totalItems };
    }

    /** Create a new key and return its raw value once. @since 3.5.0 */
    async create(
        ctx: RequestContext,
        input: { userId: ID; name: string; expiresAt: Date; notes?: string | null },
    ): Promise<{ apiKey: ApiKey; rawKey: string }> {
        const user = await this.connection.getEntityOrThrow(ctx, User, input.userId);
        // Enforce unique key name per User for active keys
        const existing = await this.connection.getRepository(ctx, ApiKey).findOne({
            where: {
                user: { id: user.id as any },
                name: input.name,
                status: 'active',
            },
        });
        if (existing) {
            throw new UserInputError('error.api-key-name-already-exists');
        }
        const rawKey = await this.generateRawKey();
        const keyHash = await this.passwordCipher.hash(rawKey);
        const lookupHash = this.fingerprint(rawKey);
        const apiKey = await this.connection.getRepository(ctx, ApiKey).save(
            new ApiKey({
                user,
                name: input.name,
                keyHash,
                lookupHash,
                status: 'active',
                expiresAt: input.expiresAt,
                notes: input.notes ?? null,
                scope: 'admin',
            }),
        );
        // Never log rawKey. Caller is responsible to display it once.
        return { apiKey, rawKey };
    }

    /** Rotate: mint a new key, revoke the old, invalidate sessions. @since 3.5.0 */
    async rotate(ctx: RequestContext, id: ID): Promise<{ apiKey: ApiKey; rawKey: string }> {
        const current = await this.connection.getEntityOrThrow(ctx, ApiKey, id);
        if (current.status !== 'active') {
            throw new UserInputError('error.api-key-not-active');
        }
        // Revoke current
        current.status = 'revoked';
        current.revokedAt = new Date();
        await this.connection.getRepository(ctx, ApiKey).save(current, { reload: false });
        await this.invalidateSessionsForKey(ctx, current.id);

        // Create new
        const rawKey = await this.generateRawKey();
        const keyHash = await this.passwordCipher.hash(rawKey);
        const lookupHash = this.fingerprint(rawKey);
        const newKey = await this.connection.getRepository(ctx, ApiKey).save(
            new ApiKey({
                user: current.user,
                name: current.name,
                keyHash,
                lookupHash,
                status: 'active',
                expiresAt: current.expiresAt,
                notes: current.notes ?? null,
                scope: current.scope ?? 'admin',
            }),
        );
        return { apiKey: newKey, rawKey };
    }

    /** Revoke and invalidate sessions. @since 3.5.0 */
    async revoke(ctx: RequestContext, id: ID): Promise<ApiKey> {
        const key = await this.connection.getEntityOrThrow(ctx, ApiKey, id);
        if (key.status !== 'active') {
            throw new UserInputError('error.api-key-not-active');
        }
        key.status = 'revoked';
        key.revokedAt = new Date();
        await this.connection.getRepository(ctx, ApiKey).save(key, { reload: false });
        await this.invalidateSessionsForKey(ctx, id);
        return key;
    }

    /** Validate a presented raw key. @since 3.5.0 */
    async verifyRawKey(
        ctx: RequestContext,
        rawKey: string,
    ): Promise<{ user: import('../../entity/user/user.entity').User; apiKey: ApiKey } | false> {
        // Ensure we never log the raw secret
        const now = new Date();
        const lookupHash = this.fingerprint(rawKey);
        const candidate = await this.connection.getRepository(ctx, ApiKey).findOne({
            where: { lookupHash, status: 'active' },
            relations: ['user', 'user.roles', 'user.roles.channels'],
        });
        if (!candidate) {
            return false;
        }
        if (candidate.expiresAt && candidate.expiresAt < now) {
            return false;
        }
        const ok = await this.passwordCipher.check(rawKey, candidate.keyHash);
        if (!ok) {
            return false;
        }
        // Best-effort last-used update
        void this.markUsed(ctx, candidate.id);
        return { user: candidate.user, apiKey: candidate };
    }

    /** Record last-used timestamp (async, best-effort). @since 3.5.0 */
    async markUsed(ctx: RequestContext, apiKeyId: ID) {
        await this.connection.getRepository(ctx, ApiKey).update({ id: apiKeyId }, { lastUsedAt: new Date() });
    }

    /** Invalidate all sessions minted from a key. @since 3.5.0 */
    async invalidateSessionsForKey(ctx: RequestContext, apiKeyId: ID): Promise<number> {
        const key = await this.connection
            .getRepository(ctx, ApiKey)
            .findOne({ where: { id: apiKeyId as any } });
        if (!key) {
            return 0;
        }
        if (key.status !== 'active') {
            throw new UserInputError('error.api-key-not-active');
        }
        return this.sessionService.invalidateSessionsByApiKeyId(ctx, apiKeyId);
    }

    /** Permanently delete a key if it belongs to the current user; also invalidate sessions. */
    async delete(
        ctx: RequestContext,
        id: ID,
    ): Promise<{ result: 'DELETED' | 'NOT_DELETED'; message?: string }> {
        const key = await this.connection.getRepository(ctx, ApiKey).findOne({ where: { id: id as any } });
        if (!key) {
            return { result: 'NOT_DELETED', message: 'Key not found' };
        }
        if (!ctx.activeUserId || String(key.user?.id ?? '') !== String(ctx.activeUserId)) {
            return { result: 'NOT_DELETED', message: 'Not authorized to delete this key' };
        }
        await this.invalidateSessionsForKey(ctx, id);
        await this.connection.getRepository(ctx, ApiKey).remove(key);
        return { result: 'DELETED' };
    }

    private async generateRawKey(): Promise<string> {
        const strategy = this.configService.authOptions.apiKey?.generationStrategy;
        if (strategy) {
            const raw = await strategy.generate();
            return raw;
        }
        // Fallback default: single vk_ prefix
        const secret = crypto.randomBytes(32).toString('base64url');
        return `vk_${secret}`;
    }

    private fingerprint(rawKey: string): string {
        const strategy = this.configService.authOptions.apiKey?.generationStrategy;
        if (strategy) {
            return strategy.fingerprint(rawKey);
        }
        // Fallback to SHA-256
        return crypto.createHash('sha256').update(rawKey).digest('hex');
    }
}
