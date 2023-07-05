import {
    bootstrapWorker,
    CustomerService,
    isGraphQlErrorResult,
    Logger,
    OrderService,
    ProductVariantService,
    RequestContextService,
    ShippingMethodService,
    TransactionalConnection,
} from '@vendure/core';
import dayjs from 'dayjs';

import { devConfig } from '../dev-config';

const loggerCtx = 'DataSync script';

generatePastOrders()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));

const DAYS_TO_COVER = 30;

// This script generates a large number of past Orders over the past <DAYS_TO_COVER> days.
// It is useful for testing scenarios where there are a large number of Orders in the system.
async function generatePastOrders() {
    const { app } = await bootstrapWorker(devConfig);
    const requestContextService = app.get(RequestContextService);
    const orderService = app.get(OrderService);
    const customerService = app.get(CustomerService);
    const productVariantService = app.get(ProductVariantService);
    const shippingMethodService = app.get(ShippingMethodService);
    const connection = app.get(TransactionalConnection);

    const ctx = await requestContextService.create({
        apiType: 'shop',
    });
    const ctxAdmin = await requestContextService.create({
        apiType: 'admin',
    });

    const { items: variants } = await productVariantService.findAll(ctxAdmin, { take: 500 });
    const { items: customers } = await customerService.findAll(ctxAdmin, { take: 500 }, ['user']);

    for (let i = DAYS_TO_COVER; i > 0; i--) {
        const numberOfOrders = Math.floor(Math.random() * 10) + 5;
        Logger.info(
            `Generating ${numberOfOrders} orders for ${dayjs().subtract(i, 'day').format('YYYY-MM-DD')}`,
        );
        for (let j = 0; j < numberOfOrders; j++) {
            const customer = getRandomItem(customers);
            if (!customer.user) {
                continue;
            }
            const order = await orderService.create(ctx, customer.user.id);
            const result = await orderService.addItemToOrder(
                ctx,
                order.id,
                getRandomItem(variants).id,
                Math.floor(Math.random() * 3) + 1,
            );
            if (isGraphQlErrorResult(result)) {
                Logger.error(result.message);
                continue;
            }
            const eligibleShippingMethods = await orderService.getEligibleShippingMethods(ctx, order.id);
            await orderService.setShippingMethod(ctx, order.id, [getRandomItem(eligibleShippingMethods).id]);
            const transitionResult = await orderService.transitionToState(ctx, order.id, 'ArrangingPayment');
            if (isGraphQlErrorResult(transitionResult)) {
                Logger.error(transitionResult.message);
                continue;
            }

            const eligiblePaymentMethods = await orderService.getEligiblePaymentMethods(ctx, order.id);
            const paymentResult = await orderService.addPaymentToOrder(ctx, order.id, {
                method: getRandomItem(eligiblePaymentMethods).code,
                metadata: {},
            });
            if (isGraphQlErrorResult(paymentResult)) {
                Logger.error(paymentResult.message);
                continue;
            }
            const randomHourOfDay = Math.floor(Math.random() * 24);
            const placedAt = dayjs().subtract(i, 'day').startOf('day').add(randomHourOfDay, 'hour').toDate();
            await connection.getRepository(ctx, 'Order').update(order.id, {
                orderPlacedAt: placedAt,
            });
        }
    }
}

// get random item from array
function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}
