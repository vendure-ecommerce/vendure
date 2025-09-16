import 'reflect-metadata';
import { describe, expect, it } from 'vitest';

import { PERMISSIONS_METADATA_KEY } from '../../decorators/allow.decorator';

import { ApiKeyResolver } from './api-key.resolver';

describe('ApiKeyResolver permissions', () => {
    it('guards apiKeys query with ReadServiceAccount', () => {
        const meta = Reflect.getMetadata(
            PERMISSIONS_METADATA_KEY,
            (ApiKeyResolver.prototype as any).apiKeys,
        ) as string[];
        expect(meta).toBeTruthy();
        expect(meta).toContain('ReadServiceAccount');
    });

    it('guards createApiKey mutation with CreateServiceAccount', () => {
        const meta = Reflect.getMetadata(
            PERMISSIONS_METADATA_KEY,
            (ApiKeyResolver.prototype as any).createApiKey,
        ) as string[];
        expect(meta).toBeTruthy();
        expect(meta).toContain('CreateServiceAccount');
    });

    it('guards rotate/revoke/invalidate with UpdateServiceAccount', () => {
        for (const method of ['rotateApiKey', 'revokeApiKey', 'invalidateApiKeySessions'] as const) {
            const meta = Reflect.getMetadata(
                PERMISSIONS_METADATA_KEY,
                (ApiKeyResolver.prototype as any)[method],
            ) as string[];
            expect(meta).toBeTruthy();
            expect(meta).toContain('UpdateServiceAccount');
        }
    });
});
