import { Injectable } from '@nestjs/common';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import crypto from 'crypto';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { getConfig } from '../../config/config-helpers';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Administrator } from '../../entity/administrator/administrator.entity';
import { ApiKey } from '../../entity/api-key/api-key.entity';
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
    ) {}

    /** List keys for an Administrator. @since 3.5.0 */
    async listByAdministrator(
        ctx: RequestContext,
        administratorId: ID,
        options?: ListQueryOptions<ApiKey>,
    ): Promise<PaginatedList<ApiKey>> {
        const qb = this.listQueryBuilder.build(ApiKey, options, {
            where: { administrator: { id: administratorId as any } },
            ctx,
        });
        const [items, totalItems] = await qb.getManyAndCount();
        return { items, totalItems };
    }

    /** Create a new key and return its raw value once. @since 3.5.0 */
    async create(
        ctx: RequestContext,
        input: { administratorId: ID; name: string; expiresAt?: Date | null; notes?: string | null },
    ): Promise<{ apiKey: ApiKey; rawKey: string }> {
        const administrator = await this.connection.getEntityOrThrow(
            ctx,
            Administrator,
            input.administratorId,
        );
        // Enforce unique key name per Administrator for active keys
        const existing = await this.connection.getRepository(ctx, ApiKey).findOne({
            where: {
                administrator: { id: administrator.id as any },
                name: input.name,
                status: 'active',
            },
        });
        if (existing) {
            throw new UserInputError('error.api-key-name-already-exists');
        }
        const { rawKey, prefix } = await this.generateRawKey();
        const keyHash = await this.passwordCipher.hash(rawKey);
        const apiKey = await this.connection.getRepository(ctx, ApiKey).save(
            new ApiKey({
                administrator,
                name: input.name,
                prefix,
                keyHash,
                status: 'active',
                expiresAt: input.expiresAt ?? null,
                notes: input.notes ?? null,
            }),
        );
        // Never log rawKey. Caller is responsible to display it once.
        return { apiKey, rawKey };
    }

    /** Rotate: mint a new key, revoke the old, invalidate sessions. @since 3.5.0 */
    async rotate(ctx: RequestContext, id: ID): Promise<{ apiKey: ApiKey; rawKey: string }> {
        const current = await this.connection.getEntityOrThrow(ctx, ApiKey, id, {
            relations: ['administrator'],
        });
        if (current.status === 'revoked') {
            throw new UserInputError('error.cannot-rotate-revoked-key');
        }
        // Revoke current
        current.status = 'revoked';
        current.revokedAt = new Date();
        await this.connection.getRepository(ctx, ApiKey).save(current, { reload: false });
        await this.invalidateSessionsForKey(ctx, current.id);

        // Create new
        const { rawKey, prefix } = await this.generateRawKey();
        const keyHash = await this.passwordCipher.hash(rawKey);
        const newKey = await this.connection.getRepository(ctx, ApiKey).save(
            new ApiKey({
                administrator: current.administrator,
                name: current.name,
                prefix,
                keyHash,
                status: 'active',
                expiresAt: current.expiresAt ?? null,
                notes: current.notes ?? null,
            }),
        );
        return { apiKey: newKey, rawKey };
    }

    /** Revoke and invalidate sessions. @since 3.5.0 */
    async revoke(ctx: RequestContext, id: ID): Promise<ApiKey> {
        const key = await this.connection.getEntityOrThrow(ctx, ApiKey, id);
        key.status = 'revoked';
        key.revokedAt = new Date();
        await this.connection.getRepository(ctx, ApiKey).save(key, { reload: false });
        await this.invalidateSessionsForKey(ctx, id);
        return key;
    }

    /** Validate a presented raw key. @since 3.5.0 */
    async validateRawKey(
        ctx: RequestContext,
        rawKey: string,
    ): Promise<{ administrator: Administrator; apiKey: ApiKey } | false> {
        // Ensure we never log the raw secret
        const prefix = this.detectPrefix(rawKey);
        const now = new Date();
        const candidates = await this.connection.getRepository(ctx, ApiKey).find({
            where: { prefix, status: 'active' },
            relations: [
                'administrator',
                'administrator.user',
                'administrator.user.roles',
                'administrator.user.roles.channels',
            ],
        });
        for (const candidate of candidates) {
            if (candidate.expiresAt && candidate.expiresAt < now) {
                continue;
            }
            const ok = await this.passwordCipher.check(rawKey, candidate.keyHash);
            if (ok) {
                // Best-effort last-used update
                void this.markUsed(ctx, candidate.id);
                return { administrator: candidate.administrator, apiKey: candidate };
            }
        }
        return false;
    }

    /** Record last-used timestamp (async, best-effort). @since 3.5.0 */
    async markUsed(ctx: RequestContext, apiKeyId: ID) {
        await this.connection.getRepository(ctx, ApiKey).update({ id: apiKeyId }, { lastUsedAt: new Date() });
    }

    /** Invalidate all sessions minted from a key. @since 3.5.0 */
    async invalidateSessionsForKey(ctx: RequestContext, apiKeyId: ID): Promise<number> {
        return this.sessionService.invalidateSessionsByApiKeyId(ctx, apiKeyId);
    }

    private async generateRawKey(): Promise<{ rawKey: string; prefix: string }> {
        const env = process.env.NODE_ENV;
        const { live, test } = this.getConfiguredPrefixes();
        const prefix = env === 'production' ? live : test;
        // 32 bytes -> 43 url-safe chars
        const secret = crypto.randomBytes(32).toString('base64url');
        return { rawKey: `${prefix}${secret}`, prefix };
    }

    private detectPrefix(rawKey: string): string {
        // Prefer exact extraction based on known secret length (43 base64url chars)
        const SECRET_LEN = 43;
        if (rawKey.length > SECRET_LEN) {
            return rawKey.slice(0, rawKey.length - SECRET_LEN);
        }
        // Fallback to configured prefixes
        const { live, test } = this.getConfiguredPrefixes();
        if (live && rawKey.startsWith(live)) return live;
        if (test && rawKey.startsWith(test)) return test;
        // Final fallback to historical defaults
        if (rawKey.startsWith('vk_live_')) return 'vk_live_';
        if (rawKey.startsWith('vk_test_')) return 'vk_test_';
        return 'vk_live_';
    }

    private getConfiguredPrefixes(): { live: string; test: string } {
        const cfg: any = getConfig() as any;
        const opt = cfg?.authOptions?.adminApiKey?.prefix;
        if (typeof opt === 'string') {
            return { live: opt, test: opt };
        }
        return opt ?? { live: 'vk_live_', test: 'vk_test_' };
    }
}
