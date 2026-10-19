/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ID } from '@vendure/common/lib/shared-types';
import {
    EventBus,
    idsAreEqual,
    LanguageCode,
    mergeConfig,
    Order,
    OrderLineEvent,
    OrderService,
    PromotionCondition,
    PromotionOrderAction,
    RequestContextService,
    TransactionalConnection,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import path from 'path';
import { EntitySubscriberInterface } from 'typeorm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { FragmentOf } from './graphql/graphql-shop';
import { createPromotionDocument } from './graphql/shared-definitions';
import {
    addItemToOrderDocument,
    adjustItemQuantityDocument,
    setShippingAddressDocument,
    testOrderFragment,
} from './graphql/shop-definitions';

/**
 * How long a request which should be waiting for the Order lock is given to finish anyway.
 */
const LOCK_WAIT_PROBE_MS = 1000;

/**
 * Resolves `true` if the promise settles within {@link LOCK_WAIT_PROBE_MS}.
 */
function finishesWithinProbe(promise: Promise<unknown>): Promise<boolean> {
    return Promise.race([
        promise.then(() => true),
        new Promise<boolean>(resolve => setTimeout(() => resolve(false), LOCK_WAIT_PROBE_MS)),
    ]);
}

let heldOrder: { orderId: ID; reached: () => void; released: Promise<void> } | undefined;

/**
 * Holds the next repricing of the given Order at the point where its Promotion conditions are
 * checked, which is after the Order row is locked and its Surcharges are reloaded, and before its
 * totals are saved. Resolves `reached` once the repricing is held; call `release` to let it go on.
 */
function holdRepricing(orderId: ID) {
    let reached!: () => void;
    let release!: () => void;
    const reachedPromise = new Promise<void>(resolve => (reached = resolve));
    heldOrder = { orderId, reached, released: new Promise<void>(resolve => (release = resolve)) };
    return { reached: reachedPromise, release };
}

const holdCondition = new PromotionCondition({
    code: 'e2e_5332_hold',
    description: [{ languageCode: LanguageCode.en, value: 'Holds the repricing of one Order' }],
    args: {},
    check: async (_ctx, order) => {
        const current = heldOrder;
        if (current && idsAreEqual(order.id, current.orderId)) {
            heldOrder = undefined;
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
                promotionConditions: [holdCondition],
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
                conditions: [{ code: holdCondition.code, arguments: [] }],
                actions: [{ code: noopAction.code, arguments: [] }],
                translations: [{ languageCode: LanguageCode.en, name: 'Hold' }],
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    async function createOrder() {
        await shopClient.asAnonymousUser();
        const { addItemToOrder } = await shopClient.query(addItemToOrderDocument, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        shopOrderGuard.assertSuccess(addItemToOrder);
        return {
            orderId: +addItemToOrder.id.replace('T_', ''),
            orderCode: addItemToOrder.code,
            orderLineId: addItemToOrder.lines[0].id,
        };
    }

    async function expectTotalsToIncludeSurcharge(orderId: number) {
        const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
        const order = await server.app.get(OrderService).findOne(ctx, orderId);
        expect(order!.lines[0].quantity).toBe(2);
        expect(order!.surcharges.map(s => s.listPrice)).toEqual([-500]);
        const expectedSubTotal = order!.lines.reduce((sum, l) => sum + l.proratedLinePrice, 0) - 500;
        expect(order!.subTotal).toBe(expectedSubTotal);
    }

    /**
     * Resolves when the given Order is next loaded from the database, by any request.
     */
    function onNextLoadOfOrder(orderId: number): Promise<void> {
        const subscribers = server.app.get(TransactionalConnection).rawConnection.subscribers;
        return new Promise(resolve => {
            const subscriber: EntitySubscriberInterface = {
                afterLoad: entity => {
                    if (entity instanceof Order && idsAreEqual(entity.id, orderId)) {
                        subscribers.splice(subscribers.indexOf(subscriber), 1);
                        resolve();
                    }
                },
            };
            subscribers.push(subscriber);
        });
    }

    async function addLoyaltySurcharge(orderId: number) {
        const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
        return server.app.get(OrderService).addSurchargeToOrder(ctx, orderId, {
            description: 'Loyalty discount',
            listPrice: -500,
        });
    }

    // Row locks are not supported by SQLite or sql.js, which run one transaction at a time.
    it.skipIf(!process.env.DB || process.env.DB === 'sqljs')(
        'includes a Surcharge added while another request is repricing the Order',
        async () => {
            const { orderId, orderLineId } = await createOrder();

            // Request 1 changes the line quantity and is held after it has reloaded the
            // Surcharges, before it saves the totals.
            const hold = holdRepricing(orderId);
            const adjustment = shopClient.query(adjustItemQuantityDocument, { orderLineId, quantity: 2 });
            await hold.reached;

            // Request 2 adds a Surcharge. It must wait for request 1 to commit, otherwise request 1
            // would overwrite its totals with ones which exclude the Surcharge.
            const addSurcharge = addLoyaltySurcharge(orderId);
            const finishedWhileHeld = await finishesWithinProbe(addSurcharge);
            hold.release();
            shopOrderGuard.assertSuccess((await adjustment).adjustOrderLine);
            await addSurcharge;

            expect(finishedWhileHeld).toBe(false);
            await expectTotalsToIncludeSurcharge(orderId);
        },
    );

    // Targets MySQL and MariaDB, where a plain read returns the snapshot taken at the first read of
    // the transaction. Request 2 below reads the Order before it waits for the lock, so its reload of
    // the Surcharges must still see the one which request 1 commits meanwhile. On Postgres every
    // statement reads the latest committed rows, so this passes regardless.
    it.skipIf(!process.env.DB || process.env.DB === 'sqljs')(
        'includes a Surcharge committed while the request was waiting for the Order lock',
        async () => {
            const { orderId, orderCode, orderLineId } = await createOrder();

            // Request 1 adds a Surcharge and is held while repricing, holding the Order lock.
            const hold = holdRepricing(orderId);
            const addSurcharge = addLoyaltySurcharge(orderId);
            await hold.reached;

            // Request 2 publishes its OrderLineEvent after it has loaded the Order, which is when
            // its snapshot is taken. Only then is request 1 allowed to commit.
            let markLoaded!: () => void;
            const loaded = new Promise<void>(resolve => (markLoaded = resolve));
            server.app.get(EventBus).registerBlockingEventHandler({
                id: 'e2e-5332-signal-order-loaded',
                event: OrderLineEvent,
                handler: event => {
                    if (event.order.code === orderCode) {
                        markLoaded();
                    }
                },
            });
            const adjustment = shopClient.query(adjustItemQuantityDocument, { orderLineId, quantity: 2 });
            await loaded;
            const finishedWhileHeld = await finishesWithinProbe(adjustment);
            hold.release();
            await addSurcharge;
            const { adjustOrderLine } = await adjustment;
            shopOrderGuard.assertSuccess(adjustOrderLine);

            expect(finishedWhileHeld).toBe(false);
            await expectTotalsToIncludeSurcharge(orderId);
            expect(adjustOrderLine.subTotal).toBe(
                adjustOrderLine.lines.reduce((sum, l) => sum + l.linePrice, 0) - 500,
            );
        },
    );

    // Targets MySQL and MariaDB like the previous test. `setShippingAddress` loads the Order, then
    // updates the Order row, then reprices. A plain read after that update returns the transaction's
    // own new row, so the reprice must not compare against one to decide whether its snapshot is
    // stale.
    it.skipIf(!process.env.DB || process.env.DB === 'sqljs')(
        'includes a Surcharge committed while setShippingAddress was waiting for the Order lock',
        async () => {
            const { orderId } = await createOrder();

            const hold = holdRepricing(orderId);
            const addSurcharge = addLoyaltySurcharge(orderId);
            await hold.reached;

            // The request's snapshot is taken when it loads the Order, before request 1 commits.
            const orderLoaded = onNextLoadOfOrder(orderId);
            const setAddress = shopClient.query(setShippingAddressDocument, {
                input: { streetLine1: '1 Test Street', countryCode: 'AT' },
            });
            await orderLoaded;
            hold.release();
            await addSurcharge;
            await setAddress;

            const ctx = await server.app.get(RequestContextService).create({ apiType: 'admin' });
            const order = await server.app.get(OrderService).findOne(ctx, orderId);
            expect(order!.shippingAddress.streetLine1).toBe('1 Test Street');
            expect(order!.surcharges.map(s => s.listPrice)).toEqual([-500]);
            const expectedSubTotal = order!.lines.reduce((sum, l) => sum + l.proratedLinePrice, 0) - 500;
            expect(order!.subTotal).toBe(expectedSubTotal);
        },
    );
});
