/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ID } from '@vendure/common/lib/shared-types';
import {
    idsAreEqual,
    LanguageCode,
    mergeConfig,
    OrderService,
    PromotionCondition,
    PromotionOrderAction,
    RequestContextService,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { FragmentOf } from './graphql/graphql-shop';
import { createPromotionDocument } from './graphql/shared-definitions';
import {
    addItemToOrderDocument,
    adjustItemQuantityDocument,
    testOrderFragment,
} from './graphql/shop-definitions';

/**
 * Holds the repricing of one Order at the point where its Promotion conditions are checked,
 * which is after the Order row is locked and its Surcharges are reloaded, and before its totals
 * are saved. The test uses it to run a second transaction in that window.
 */
let gate: { orderId: ID; reached: () => void; released: Promise<void> } | undefined;

const gateCondition = new PromotionCondition({
    code: 'e2e_5332_gate',
    description: [{ languageCode: LanguageCode.en, value: 'Holds the repricing of one Order' }],
    args: {},
    check: async (_ctx, order) => {
        const current = gate;
        if (current && idsAreEqual(order.id, current.orderId)) {
            gate = undefined;
            current.reached();
            await current.released;
        }
        return false;
    },
});

const noopAction = new PromotionOrderAction({
    code: 'e2e_5332_noop',
    description: [{ languageCode: LanguageCode.en, value: 'Does nothing' }],
    args: {},
    execute: () => 0,
});

// https://github.com/vendurehq/vendure/issues/5332
describe('Order Surcharges under concurrent repricing', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            promotionOptions: {
                promotionConditions: [gateCondition],
                promotionActions: [noopAction],
            },
        }),
    );

    type ShopOrderFragment = FragmentOf<typeof testOrderFragment>;
    const shopOrderGuard: ErrorResultGuard<ShopOrderFragment> = createErrorResultGuard(
        input => !!input.lines,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
        await adminClient.query(createPromotionDocument, {
            input: {
                enabled: true,
                conditions: [{ code: gateCondition.code, arguments: [] }],
                actions: [{ code: noopAction.code, arguments: [] }],
                translations: [{ languageCode: LanguageCode.en, name: 'Gate' }],
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    // Row locks are not supported by SQLite or sql.js, which run one transaction at a time.
    it.skipIf(!process.env.DB || process.env.DB === 'sqljs')(
        'includes a Surcharge added while another request is repricing the Order',
        async () => {
            await shopClient.asAnonymousUser();
            const { addItemToOrder } = await shopClient.query(addItemToOrderDocument, {
                productVariantId: 'T_1',
                quantity: 1,
            });
            shopOrderGuard.assertSuccess(addItemToOrder);
            const orderId = +addItemToOrder.id.replace('T_', '');

            let reached!: () => void;
            let release!: () => void;
            const reachedGate = new Promise<void>(resolve => (reached = resolve));
            gate = { orderId, reached, released: new Promise<void>(resolve => (release = resolve)) };

            // Request 1 changes the line quantity and is held after it has reloaded the
            // Surcharges, before it saves the totals.
            const adjustment = shopClient.query(adjustItemQuantityDocument, {
                orderLineId: addItemToOrder.lines[0].id,
                quantity: 2,
            });
            await reachedGate;

            // Request 2 adds a Surcharge in its own transaction. It must wait for request 1 to
            // commit, otherwise request 1 would overwrite its totals with ones which exclude it.
            const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
            const orderService = server.app.get(OrderService);
            const addSurcharge = orderService.addSurchargeToOrder(ctx, orderId, {
                description: 'Loyalty discount',
                listPrice: -500,
            });
            const finishedWhileHeld = await Promise.race([
                addSurcharge.then(() => true),
                new Promise<boolean>(resolve => setTimeout(() => resolve(false), 1000)),
            ]);
            release();
            const { adjustOrderLine } = await adjustment;
            shopOrderGuard.assertSuccess(adjustOrderLine);
            await addSurcharge;

            expect(finishedWhileHeld).toBe(false);
            const order = await orderService.findOne(ctx, orderId);
            expect(order!.lines[0].quantity).toBe(2);
            expect(order!.surcharges.map(s => s.listPrice)).toEqual([-500]);
            const expectedSubTotal = order!.lines.reduce((sum, l) => sum + l.proratedLinePrice, 0) - 500;
            expect(order!.subTotal).toBe(expectedSubTotal);
        },
    );
});
