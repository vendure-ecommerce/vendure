import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiKeyAdminAuthStrategy } from './api-key-admin-auth.strategy';

describe('ApiKeyAdminAuthStrategy', () => {
    let strategy: ApiKeyAdminAuthStrategy;
    const apiKeyService = {
        validateRawKey: vi.fn(),
        markUsed: vi.fn(),
    };
    const injector = {
        get: () => apiKeyService,
    } as any;

    beforeEach(async () => {
        strategy = new ApiKeyAdminAuthStrategy();
        await strategy.init(injector);
        apiKeyService.validateRawKey.mockReset();
        apiKeyService.markUsed.mockReset();
    });

    it('authenticate returns false on invalid key', async () => {
        apiKeyService.validateRawKey.mockResolvedValue(false);
        const ctx: any = {};
        const res = await strategy.authenticate(ctx, { key: 'bad' });
        expect(res).toBe(false);
    });

    it('authenticate sets ctx.__apiKeyId and returns user on success', async () => {
        const user = { id: 'u1' } as any;
        apiKeyService.validateRawKey.mockResolvedValue({
            administrator: { user },
            apiKey: { id: 'k1' },
        });
        const ctx: any = {};
        const res = await strategy.authenticate(ctx, { key: 'vk_test_abc' });
        expect(res).toBe(user);
        expect(ctx.__apiKeyId).toBe('k1');
    });
});
