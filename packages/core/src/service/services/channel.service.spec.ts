import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { beforeEach, describe, expect, it } from 'vitest';

import { RequestContext } from '../../api/common/request-context';
import { TRANSACTION_MANAGER_KEY } from '../../common/constants';
import { Channel } from '../../entity/channel/channel.entity';

import { ChannelService } from './channel.service';

/**
 * Unit tests for the per-process Channel cache (#988). Each test counts the queries which reach
 * the repository, and which RequestContext they ran through.
 */

const channels = [
    new Channel({ id: 1, code: DEFAULT_CHANNEL_CODE, token: 'default-token' }),
    new Channel({ id: 2, code: 'second', token: 'second-token' }),
];

const queries: Array<{ ctx: RequestContext | undefined; where?: any }> = [];

function getRepository(ctx: RequestContext | undefined) {
    return {
        count: () => {
            queries.push({ ctx });
            return Promise.resolve(channels.length);
        },
        findOne: ({ where }: any) => {
            queries.push({ ctx, where });
            return Promise.resolve(
                channels.find(c => (where.token ? c.token === where.token : c.code === where.code)) ?? null,
            );
        },
    };
}

function tokenQueries(token: string) {
    return queries.filter(q => q.where?.token === token);
}

function transactionalContext() {
    const ctx = RequestContext.empty();
    (ctx as any)[TRANSACTION_MANAGER_KEY] = {};
    return ctx;
}

describe('ChannelService cache', () => {
    let service: ChannelService;
    let onChannelEvent: () => void;

    beforeEach(() => {
        queries.length = 0;
        const eventBus = {
            ofType: () => ({ subscribe: (fn: () => void) => (onChannelEvent = fn) }),
        };
        service = new ChannelService(
            { getRepository } as any,
            { entityOptions: { channelCacheTtl: 30_000 } } as any,
            {} as any,
            {} as any,
            eventBus as any,
            {} as any,
        );
    });

    it('queries a known token once', async () => {
        await service.getChannelFromToken('second-token');
        await service.getChannelFromToken('second-token');

        expect(tokenQueries('second-token')).toHaveLength(1);
    });

    it('queries an unknown token once', async () => {
        await expect(service.getChannelFromToken('unknown')).rejects.toThrow('error.channel-not-found');
        await expect(service.getChannelFromToken('unknown')).rejects.toThrow('error.channel-not-found');

        expect(tokenQueries('unknown')).toHaveLength(1);
    });

    it('shares one query between concurrent lookups of the same token', async () => {
        await Promise.all([
            service.getChannelFromToken('second-token'),
            service.getChannelFromToken('second-token'),
        ]);

        expect(tokenQueries('second-token')).toHaveLength(1);
    });

    it('loads a miss inside a transaction through that transaction without storing it', async () => {
        const ctx = transactionalContext();

        await service.getChannelFromToken(ctx, 'second-token');
        expect(tokenQueries('second-token')).toEqual([{ ctx, where: { token: 'second-token' } }]);

        await service.getChannelFromToken('second-token');
        expect(tokenQueries('second-token')).toHaveLength(2);
        expect(tokenQueries('second-token')[1].ctx).toBeUndefined();
    });

    it('uses a cached Channel inside a transaction', async () => {
        await service.getChannelFromToken('second-token');
        await service.getChannelFromToken(transactionalContext(), 'second-token');

        expect(tokenQueries('second-token')).toHaveLength(1);
    });

    it('ignores a cached miss inside a transaction', async () => {
        await expect(service.getChannelFromToken('second-token-later')).rejects.toThrow();
        channels.push(new Channel({ id: 3, code: 'later', token: 'second-token-later' }));
        try {
            const channel = await service.getChannelFromToken(transactionalContext(), 'second-token-later');
            expect(channel.id).toBe(3);
        } finally {
            channels.pop();
        }
    });

    it('clears the cache when a ChannelEvent is published', async () => {
        await service.getChannelFromToken('second-token');
        onChannelEvent();
        await service.getChannelFromToken('second-token');

        expect(tokenQueries('second-token')).toHaveLength(2);
    });
});
