import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TransactionalConnection } from '../../connection/transactional-connection';
import { ApiKey } from '../../entity/api-key/api-key.entity';
import { User } from '../../entity/user/user.entity';

import { ApiKeyService } from './api-key.service';

describe('ApiKeyService', () => {
    let service: ApiKeyService;
    let connection: Partial<TransactionalConnection>;
    let passwordCipher: { hash: any };
    let sessionService: { invalidateSessionsByApiKeyId: any };

    const user = new User({ id: 'user-1' as any, identifier: 'svc-1' } as any);
    const apiKeyRepo = {
        save: vi.fn(),
        findOne: vi.fn(),
        find: vi.fn(),
        findAndCount: vi.fn(),
        update: vi.fn(),
    };
    const userRepo = {
        findOne: vi.fn(),
    };

    beforeEach(() => {
        apiKeyRepo.save.mockReset();
        apiKeyRepo.findOne.mockReset();
        apiKeyRepo.find.mockReset();
        apiKeyRepo.findAndCount.mockReset();
        apiKeyRepo.update.mockReset();
        userRepo.findOne.mockReset();

        connection = {
            getRepository: vi.fn((ctx: any, target: any) => {
                if (target === ApiKey) return apiKeyRepo;
                if (target === User) return userRepo;
                return apiKeyRepo;
            }),
            getEntityOrThrow: vi.fn(async (_ctx: any, entity: any, id: any) => {
                if (entity === User) {
                    return user;
                }
                if (entity === ApiKey) {
                    return new ApiKey({ id, user, name: 'Key A', status: 'active' } as any);
                }
                return {} as any;
            }),
        } as any;
        passwordCipher = { hash: vi.fn(async () => 'hashed-secret') };
        sessionService = { invalidateSessionsByApiKeyId: vi.fn(async () => 2) } as any;

        service = new ApiKeyService(connection as any, passwordCipher as any, sessionService as any);
        // Fix deterministic prefix for tests
        process.env.NODE_ENV = 'test';
    });

    it('create(): creates key and returns raw secret; enforces unique active name', async () => {
        // No duplicate
        apiKeyRepo.findOne.mockResolvedValueOnce(undefined);
        apiKeyRepo.save.mockImplementation(async (entity: any) => new ApiKey({ id: 'k1' as any, ...entity }));

        const result = await service.create({} as any, {
            userId: user.id as any,
            name: 'Key A',
        });
        expect(result.rawKey).toMatch(/^vk_/);
        expect(apiKeyRepo.save).toHaveBeenCalled();
        expect(passwordCipher.hash).toHaveBeenCalled();

        // Duplicate active name
        apiKeyRepo.findOne.mockResolvedValueOnce({ id: 'existing' });
        await expect(
            service.create({} as any, { userId: user.id as any, name: 'Key A' }),
        ).rejects.toBeTruthy();
    });

    it('rotate(): revokes old, invalidates sessions, creates new key', async () => {
        apiKeyRepo.save.mockImplementation(
            async (entity: any) => new ApiKey({ id: 'new' as any, ...entity }),
        );
        const result = await service.rotate({} as any, 'old-id' as any);
        expect(result.rawKey).toMatch(/^vk_/);
        expect(sessionService.invalidateSessionsByApiKeyId).toHaveBeenCalledWith({}, 'old-id');
    });

    it('revoke(): revokes key and invalidates sessions', async () => {
        apiKeyRepo.save.mockResolvedValue(undefined);
        const out = await service.revoke({} as any, 'id-1' as any);
        expect(out.status).toBe('revoked');
        expect(sessionService.invalidateSessionsByApiKeyId).toHaveBeenCalled();
    });
});
