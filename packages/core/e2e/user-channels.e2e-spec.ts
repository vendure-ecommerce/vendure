import { CurrencyCode, LanguageCode } from '@vendure/common/lib/generated-types';
import { Channel, TransactionalConnection, User } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { channelFragment } from './graphql/fragments-admin';
import { FragmentOf } from './graphql/graphql-admin';
import { createChannelDocument } from './graphql/shared-definitions';

/**
 * Users can be assigned Channels directly. When they have any, those Channels replace the
 * Channels of their Roles.
 */
describe('User-level channels', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());

    const channelGuard: ErrorResultGuard<FragmentOf<typeof channelFragment>> = createErrorResultGuard(
        input => !!input.defaultLanguageCode,
    );

    const createChannel = async (code: string) => {
        const { createChannel: result } = await adminClient.query(createChannelDocument, {
            input: {
                code,
                token: `${code}-token`,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.GBP,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        });
        channelGuard.assertSuccess(result);
        return result;
    };

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('entity', () => {
        it('persists channels on a user and removes the link when the channel is deleted', async () => {
            const created = await createChannel('entity-channel');
            const channel = { id: Number(created.id.replace('T_', '')) };
            const connection = server.app.get(TransactionalConnection).rawConnection;
            const userRepo = connection.getRepository(User);

            const user = await userRepo.save(
                new User({ identifier: 'entity-user@test.com', verified: true, channels: [{ id: channel.id }] }),
            );
            const loaded = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['channels'] });
            expect(loaded.channels.map(c => c.code)).toEqual(['entity-channel']);

            await connection.getRepository(Channel).delete({ id: channel.id });

            const reloaded = await userRepo.findOneOrFail({ where: { id: user.id }, relations: ['channels'] });
            expect(reloaded.channels).toEqual([]);
        });
    });
});
