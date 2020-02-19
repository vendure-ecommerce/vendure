import { InjectConnection } from '@nestjs/typeorm';
import { PaymentInput } from '@vendure/common/lib/generated-shop-types';
import {
    AddNoteToOrderInput,
    CancelOrderInput,
    CreateAddressInput,
    FulfillOrderInput,
    HistoryEntryType,
    OrderLineInput,
    RefundOrderInput,
    SettleRefundInput,
    ShippingMethodQuote,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import {
    EntityNotFoundError,
    IllegalOperationError,
    InternalServerError,
    OrderItemsLimitError,
    UserInputError,
} from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Customer } from '../../entity/customer/customer.entity';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { OrderStateTransitionEvent } from '../../event-bus/events/order-state-transition-event';
import { PaymentStateTransitionEvent } from '../../event-bus/events/payment-state-transition-event';
import { RefundStateTransitionEvent } from '../../event-bus/events/refund-state-transition-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { OrderMerger } from '../helpers/order-merger/order-merger';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { OrderStateMachine } from '../helpers/order-state-machine/order-state-machine';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { translateDeep } from '../helpers/utils/translate-entity';

import { CountryService } from './country.service';
import { CustomerService } from './customer.service';
import { HistoryService } from './history.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductVariantService } from './product-variant.service';
import { PromotionService } from './promotion.service';
import { StockMovementService } from './stock-movement.service';

export class OrderService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private productVariantService: ProductVariantService,
        private customerService: CustomerService,
        private countryService: CountryService,
        private orderCalculator: OrderCalculator,
        private shippingCalculator: ShippingCalculator,
        private orderStateMachine: OrderStateMachine,
        private orderMerger: OrderMerger,
        private paymentStateMachine: PaymentStateMachine,
        private paymentMethodService: PaymentMethodService,
        private listQueryBuilder: ListQueryBuilder,
        private stockMovementService: StockMovementService,
        private refundStateMachine: RefundStateMachine,
        private historyService: HistoryService,
        private promotionService: PromotionService,
        private eventBus: EventBus,
    ) {}

    findAll(ctx: RequestContext, options?: ListQueryOptions<Order>): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, { relations: ['lines', 'customer', 'lines.productVariant'] })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(ctx: RequestContext, orderId: ID): Promise<Order | undefined> {
        const order = await this.connection
            .getRepository(Order)
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.lines', 'lines')
            .leftJoinAndSelect('lines.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.taxCategory', 'prodVariantTaxCategory')
            .leftJoinAndSelect('productVariant.productVariantPrices', 'prices')
            .leftJoinAndSelect('productVariant.translations', 'translations')
            .leftJoinAndSelect('lines.featuredAsset', 'featuredAsset')
            .leftJoinAndSelect('lines.items', 'items')
            .leftJoinAndSelect('items.fulfillment', 'fulfillment')
            .leftJoinAndSelect('lines.taxCategory', 'lineTaxCategory')
            .where('order.id = :orderId', { orderId })
            .addOrderBy('lines.createdAt', 'ASC')
            .addOrderBy('items.createdAt', 'ASC')
            .getOne();
        if (order) {
            order.lines.forEach(line => {
                line.productVariant = translateDeep(
                    this.productVariantService.applyChannelPriceAndTax(line.productVariant, ctx),
                    ctx.languageCode,
                );
            });
            return order;
        }
    }

    async findOneByCode(ctx: RequestContext, orderCode: string): Promise<Order | undefined> {
        const order = await this.connection.getRepository(Order).findOne({
            relations: ['customer'],
            where: {
                code: orderCode,
            },
        });
        return order;
    }

    async findByCustomerId(
        ctx: RequestContext,
        customerId: ID,
        options?: ListQueryOptions<Order>,
    ): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, {
                relations: ['lines', 'lines.productVariant', 'lines.productVariant.options', 'customer'],
            })
            .andWhere('order.customer.id = :customerId', { customerId })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                items.forEach(item => {
                    item.lines.forEach(line => {
                        line.productVariant = translateDeep(line.productVariant, ctx.languageCode, [
                            'options',
                        ]);
                    });
                });
                return {
                    items,
                    totalItems,
                };
            });
    }

    getOrderPayments(orderId: ID): Promise<Payment[]> {
        return this.connection.getRepository(Payment).find({
            where: {
                order: { id: orderId } as any,
            },
        });
    }

    async getRefundOrderItems(refundId: ID): Promise<OrderItem[]> {
        const refund = await getEntityOrThrow(this.connection, Refund, refundId, {
            relations: ['orderItems'],
        });
        return refund.orderItems;
    }

    getPaymentRefunds(paymentId: ID): Promise<Refund[]> {
        return this.connection.getRepository(Refund).find({
            where: {
                paymentId,
            },
        });
    }

    async getActiveOrderForUser(ctx: RequestContext, userId: ID): Promise<Order | undefined> {
        const customer = await this.customerService.findOneByUserId(userId);
        if (customer) {
            const activeOrder = await this.connection.getRepository(Order).findOne({
                where: {
                    customer,
                    active: true,
                },
            });
            if (activeOrder) {
                return this.findOne(ctx, activeOrder.id);
            }
        }
    }

    async create(ctx: RequestContext, userId?: ID): Promise<Order> {
        const newOrder = new Order({
            code: await this.configService.orderOptions.generateOrderCode(ctx),
            state: this.orderStateMachine.getInitialState(),
            lines: [],
            couponCodes: [],
            shippingAddress: {},
            billingAddress: {},
            pendingAdjustments: [],
            subTotal: 0,
            subTotalBeforeTax: 0,
            currencyCode: ctx.channel.currencyCode,
        });
        if (userId) {
            const customer = await this.customerService.findOneByUserId(userId);
            if (customer) {
                newOrder.customer = customer;
            }
        }
        return this.connection.getRepository(Order).save(newOrder);
    }

    async addItemToOrder(
        ctx: RequestContext,
        orderId: ID,
        productVariantId: ID,
        quantity: number,
        customFields?: { [key: string]: any },
    ): Promise<Order> {
        this.assertQuantityIsPositive(quantity);
        const order = await this.getOrderOrThrow(ctx, orderId);
        this.assertAddingItemsState(order);
        this.assertNotOverOrderItemsLimit(order, quantity);
        const productVariant = await this.getProductVariantOrThrow(ctx, productVariantId);
        let orderLine = order.lines.find(line => {
            return (
                idsAreEqual(line.productVariant.id, productVariantId) &&
                JSON.stringify(line.customFields) === JSON.stringify(customFields)
            );
        });

        if (!orderLine) {
            const newLine = this.createOrderLineFromVariant(productVariant, customFields);
            orderLine = await this.connection.getRepository(OrderLine).save(newLine);
            order.lines.push(orderLine);
            await this.connection.getRepository(Order).save(order, { reload: false });
        }
        return this.adjustOrderLine(ctx, order, orderLine.id, orderLine.quantity + quantity);
    }

    async adjustOrderLine(
        ctx: RequestContext,
        orderIdOrOrder: ID | Order,
        orderLineId: ID,
        quantity?: number | null,
        customFields?: { [key: string]: any },
    ): Promise<Order> {
        const order =
            orderIdOrOrder instanceof Order
                ? orderIdOrOrder
                : await this.getOrderOrThrow(ctx, orderIdOrOrder);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        this.assertAddingItemsState(order);
        if (quantity != null) {
            this.assertQuantityIsPositive(quantity);
            const currentQuantity = orderLine.quantity;
            this.assertNotOverOrderItemsLimit(order, quantity - currentQuantity);
            if (currentQuantity < quantity) {
                if (!orderLine.items) {
                    orderLine.items = [];
                }
                const productVariant = orderLine.productVariant;
                for (let i = currentQuantity; i < quantity; i++) {
                    const orderItem = await this.connection.getRepository(OrderItem).save(
                        new OrderItem({
                            unitPrice: productVariant.price,
                            pendingAdjustments: [],
                            unitPriceIncludesTax: productVariant.priceIncludesTax,
                            taxRate: productVariant.priceIncludesTax
                                ? productVariant.taxRateApplied.value
                                : 0,
                        }),
                    );
                    orderLine.items.push(orderItem);
                }
            } else if (quantity < currentQuantity) {
                orderLine.items = orderLine.items.slice(0, quantity);
            }
        }
        if (customFields != null) {
            orderLine.customFields = customFields;
        }
        await this.connection.getRepository(OrderLine).save(orderLine, { reload: false });
        return this.applyPriceAdjustments(ctx, order, orderLine);
    }

    async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderLineId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        this.assertAddingItemsState(order);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        order.lines = order.lines.filter(line => !idsAreEqual(line.id, orderLineId));
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        await this.connection.getRepository(OrderLine).remove(orderLine);
        return updatedOrder;
    }

    async applyCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.couponCodes.includes(couponCode)) {
            return order;
        }
        const promotion = await this.promotionService.validateCouponCode(
            couponCode,
            order.customer && order.customer.id,
        );
        order.couponCodes.push(couponCode);
        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: order.id,
            type: HistoryEntryType.ORDER_COUPON_APPLIED,
            data: { couponCode, promotionId: promotion.id },
        });
        return this.applyPriceAdjustments(ctx, order);
    }

    async removeCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.couponCodes.includes(couponCode)) {
            order.couponCodes = order.couponCodes.filter(cc => cc !== couponCode);
            await this.historyService.createHistoryEntryForOrder({
                ctx,
                orderId: order.id,
                type: HistoryEntryType.ORDER_COUPON_REMOVED,
                data: { couponCode },
            });
            return this.applyPriceAdjustments(ctx, order);
        } else {
            return order;
        }
    }

    async getOrderPromotions(orderId: ID): Promise<Promotion[]> {
        const order = await getEntityOrThrow(this.connection, Order, orderId, {
            relations: ['promotions'],
        });
        return order.promotions || [];
    }

    getNextOrderStates(order: Order): OrderState[] {
        return this.orderStateMachine.getNextStates(order);
    }

    async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        order.shippingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        return this.connection.getRepository(Order).save(order);
    }

    async getEligibleShippingMethods(ctx: RequestContext, orderId: ID): Promise<ShippingMethodQuote[]> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, order);
        return eligibleMethods.map(eligible => ({
            id: eligible.method.id as string,
            price: eligible.result.price,
            priceWithTax: eligible.result.priceWithTax,
            description: eligible.method.description,
            metadata: eligible.result.metadata,
        }));
    }

    async setShippingMethod(ctx: RequestContext, orderId: ID, shippingMethodId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        this.assertAddingItemsState(order);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, order);
        const selectedMethod = eligibleMethods.find(m => idsAreEqual(m.method.id, shippingMethodId));
        if (!selectedMethod) {
            throw new UserInputError(`error.shipping-method-unavailable`);
        }
        order.shippingMethod = selectedMethod.method;
        await this.connection.getRepository(Order).save(order, { reload: false });
        await this.applyPriceAdjustments(ctx, order);
        return this.connection.getRepository(Order).save(order);
    }

    async transitionToState(ctx: RequestContext, orderId: ID, state: OrderState): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const fromState = order.state;
        await this.orderStateMachine.transition(ctx, order, state);
        await this.connection.getRepository(Order).save(order, { reload: false });
        this.eventBus.publish(new OrderStateTransitionEvent(fromState, state, ctx, order));
        return order;
    }

    async addPaymentToOrder(ctx: RequestContext, orderId: ID, input: PaymentInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.state !== 'ArrangingPayment') {
            throw new IllegalOperationError(`error.payment-may-only-be-added-in-arrangingpayment-state`);
        }
        const payment = await this.paymentMethodService.createPayment(
            ctx,
            order,
            input.method,
            input.metadata,
        );

        const existingPayments = await this.getOrderPayments(orderId);
        order.payments = [...existingPayments, payment];
        await this.connection.getRepository(Order).save(order, { reload: false });

        if (payment.state === 'Error') {
            throw new InternalServerError(payment.errorMessage);
        }

        function totalIsCovered(state: PaymentState): boolean {
            return (
                order.payments.filter(p => p.state === state).reduce((sum, p) => sum + p.amount, 0) ===
                order.total
            );
        }

        if (totalIsCovered('Settled')) {
            return this.transitionToState(ctx, orderId, 'PaymentSettled');
        }
        if (totalIsCovered('Authorized')) {
            return this.transitionToState(ctx, orderId, 'PaymentAuthorized');
        }
        return order;
    }

    async settlePayment(ctx: RequestContext, paymentId: ID): Promise<Payment> {
        const payment = await getEntityOrThrow(this.connection, Payment, paymentId, { relations: ['order'] });
        const settlePaymentResult = await this.paymentMethodService.settlePayment(payment, payment.order);
        if (settlePaymentResult.success) {
            const fromState = payment.state;
            const toState = 'Settled';
            await this.paymentStateMachine.transition(ctx, payment.order, payment, toState);
            payment.metadata = { ...payment.metadata, ...settlePaymentResult.metadata };
            await this.connection.getRepository(Payment).save(payment, { reload: false });
            this.eventBus.publish(
                new PaymentStateTransitionEvent(fromState, toState, ctx, payment, payment.order),
            );
            if (payment.amount === payment.order.total) {
                await this.transitionToState(ctx, payment.order.id, 'PaymentSettled');
            }
        }
        return payment;
    }

    async createFulfillment(ctx: RequestContext, input: FulfillOrderInput) {
        if (
            !input.lines ||
            input.lines.length === 0 ||
            input.lines.reduce((total, line) => total + line.quantity, 0) === 0
        ) {
            throw new UserInputError('error.create-fulfillment-nothing-to-fulfill');
        }
        const { items, orders } = await this.getOrdersAndItemsFromLines(
            input.lines,
            i => !i.fulfillment,
            'error.create-fulfillment-items-already-fulfilled',
        );

        for (const order of orders) {
            if (order.state !== 'PaymentSettled' && order.state !== 'PartiallyFulfilled') {
                throw new IllegalOperationError('error.create-fulfillment-orders-must-be-settled');
            }
        }

        const fulfillment = await this.connection.getRepository(Fulfillment).save(
            new Fulfillment({
                trackingCode: input.trackingCode,
                method: input.method,
                orderItems: items,
            }),
        );

        for (const order of orders) {
            await this.historyService.createHistoryEntryForOrder({
                ctx,
                orderId: order.id,
                type: HistoryEntryType.ORDER_FULLFILLMENT,
                data: {
                    fulfillmentId: fulfillment.id,
                },
            });
            const orderWithFulfillments = await this.connection.getRepository(Order).findOne(order.id, {
                relations: ['lines', 'lines.items', 'lines.items.fulfillment'],
            });
            if (!orderWithFulfillments) {
                throw new InternalServerError('error.could-not-find-order');
            }
            const allOrderItemsFulfilled = orderWithFulfillments.lines
                .reduce((orderItems, line) => [...orderItems, ...line.items], [] as OrderItem[])
                .filter(orderItem => !orderItem.cancelled)
                .every(orderItem => {
                    return !!orderItem.fulfillment;
                });
            if (allOrderItemsFulfilled) {
                await this.transitionToState(ctx, order.id, 'Fulfilled');
            } else {
                await this.transitionToState(ctx, order.id, 'PartiallyFulfilled');
            }
        }
        return fulfillment;
    }

    async getOrderFulfillments(order: Order): Promise<Fulfillment[]> {
        let lines: OrderLine[];
        if (
            order.lines &&
            order.lines[0] &&
            order.lines[0].items &&
            order.lines[0].items[0].fulfillment !== undefined
        ) {
            lines = order.lines;
        } else {
            lines = await this.connection.getRepository(OrderLine).find({
                where: {
                    order: order.id,
                },
                relations: ['items', 'items.fulfillment'],
            });
        }
        const items = lines.reduce((acc, l) => [...acc, ...l.items], [] as OrderItem[]);
        return unique(items.map(i => i.fulfillment).filter(notNullOrUndefined), 'id');
    }

    async getFulfillmentOrderItems(id: ID): Promise<OrderItem[]> {
        const fulfillment = await getEntityOrThrow(this.connection, Fulfillment, id, {
            relations: ['orderItems'],
        });
        return fulfillment.orderItems;
    }

    async cancelOrder(ctx: RequestContext, input: CancelOrderInput): Promise<Order> {
        let allOrderItemsCancelled = false;
        if (input.lines != null) {
            allOrderItemsCancelled = await this.cancelOrderByOrderLines(ctx, input, input.lines);
        } else {
            allOrderItemsCancelled = await this.cancelOrderById(ctx, input);
        }
        if (allOrderItemsCancelled) {
            await this.transitionToState(ctx, input.orderId, 'Cancelled');
        }
        return assertFound(this.findOne(ctx, input.orderId));
    }

    private async cancelOrderById(ctx: RequestContext, input: CancelOrderInput): Promise<boolean> {
        const order = await this.getOrderOrThrow(ctx, input.orderId);
        if (order.state === 'AddingItems' || order.state === 'ArrangingPayment') {
            return true;
        } else {
            const lines: OrderLineInput[] = order.lines.map(l => ({
                orderLineId: l.id as string,
                quantity: l.quantity,
            }));
            return this.cancelOrderByOrderLines(ctx, input, lines);
        }
    }

    private async cancelOrderByOrderLines(
        ctx: RequestContext,
        input: CancelOrderInput,
        lines: OrderLineInput[],
    ): Promise<boolean> {
        if (lines.length === 0 || lines.reduce((total, line) => total + line.quantity, 0) === 0) {
            throw new UserInputError('error.cancel-order-lines-nothing-to-cancel');
        }
        const { items, orders } = await this.getOrdersAndItemsFromLines(
            lines,
            i => !i.cancelled,
            'error.cancel-order-lines-quantity-too-high',
        );
        if (1 < orders.length) {
            throw new IllegalOperationError('error.order-lines-must-belong-to-same-order');
        }
        const order = orders[0];
        if (!idsAreEqual(order.id, input.orderId)) {
            throw new IllegalOperationError('error.order-lines-must-belong-to-same-order');
        }
        if (order.state === 'AddingItems' || order.state === 'ArrangingPayment') {
            throw new IllegalOperationError('error.cancel-order-lines-invalid-order-state', {
                state: order.state,
            });
        }

        // Perform the cancellation
        await this.stockMovementService.createCancellationsForOrderItems(items);
        items.forEach(i => (i.cancelled = true));
        await this.connection.getRepository(OrderItem).save(items, { reload: false });

        const orderWithItems = await this.connection.getRepository(Order).findOne(order.id, {
            relations: ['lines', 'lines.items'],
        });
        if (!orderWithItems) {
            throw new InternalServerError('error.could-not-find-order');
        }
        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: order.id,
            type: HistoryEntryType.ORDER_CANCELLATION,
            data: {
                orderItemIds: items.map(i => i.id),
                reason: input.reason || undefined,
            },
        });
        const allOrderItemsCancelled = orderWithItems.lines
            .reduce((orderItems, line) => [...orderItems, ...line.items], [] as OrderItem[])
            .every(orderItem => orderItem.cancelled);
        return allOrderItemsCancelled;
    }

    async refundOrder(ctx: RequestContext, input: RefundOrderInput): Promise<Refund> {
        if (
            (!input.lines ||
                input.lines.length === 0 ||
                input.lines.reduce((total, line) => total + line.quantity, 0) === 0) &&
            input.shipping === 0
        ) {
            throw new UserInputError('error.refund-order-lines-nothing-to-refund');
        }
        const { items, orders } = await this.getOrdersAndItemsFromLines(
            input.lines,
            i => !i.cancelled,
            'error.refund-order-lines-quantity-too-high',
        );
        if (1 < orders.length) {
            throw new IllegalOperationError('error.order-lines-must-belong-to-same-order');
        }
        const payment = await getEntityOrThrow(this.connection, Payment, input.paymentId, {
            relations: ['order'],
        });
        if (orders && orders.length && !idsAreEqual(payment.order.id, orders[0].id)) {
            throw new IllegalOperationError('error.refund-order-payment-lines-mismatch');
        }
        const order = payment.order;
        if (
            order.state === 'AddingItems' ||
            order.state === 'ArrangingPayment' ||
            order.state === 'PaymentAuthorized'
        ) {
            throw new IllegalOperationError('error.refund-order-lines-invalid-order-state', {
                state: order.state,
            });
        }
        if (items.some(i => !!i.refundId)) {
            throw new IllegalOperationError('error.refund-order-item-already-refunded');
        }

        return await this.paymentMethodService.createRefund(ctx, input, order, items, payment);
    }

    async settleRefund(ctx: RequestContext, input: SettleRefundInput): Promise<Refund> {
        const refund = await getEntityOrThrow(this.connection, Refund, input.id, {
            relations: ['payment', 'payment.order'],
        });
        refund.transactionId = input.transactionId;
        const fromState = refund.state;
        const toState = 'Settled';
        await this.refundStateMachine.transition(ctx, refund.payment.order, refund, toState);
        await this.connection.getRepository(Refund).save(refund);
        this.eventBus.publish(
            new RefundStateTransitionEvent(fromState, toState, ctx, refund, refund.payment.order),
        );
        return refund;
    }

    async addCustomerToOrder(ctx: RequestContext, orderId: ID, customer: Customer): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.customer && !idsAreEqual(order.customer.id, customer.id)) {
            throw new IllegalOperationError(`error.order-already-has-customer`);
        }
        order.customer = customer;
        await this.connection.getRepository(Order).save(order, { reload: false });
        // Check that any applied couponCodes are still valid now that
        // we know the Customer.
        if (order.couponCodes) {
            let codesRemoved = false;
            for (const couponCode of order.couponCodes.slice()) {
                try {
                    await this.promotionService.validateCouponCode(couponCode, customer.id);
                } catch (err) {
                    order.couponCodes = order.couponCodes.filter(c => c !== couponCode);
                    codesRemoved = true;
                }
            }
            if (codesRemoved) {
                return this.applyPriceAdjustments(ctx, order);
            }
        }
        return order;
    }

    async addNoteToOrder(ctx: RequestContext, input: AddNoteToOrderInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, input.id);
        await this.historyService.createHistoryEntryForOrder(
            {
                ctx,
                orderId: order.id,
                type: HistoryEntryType.ORDER_NOTE,
                data: {
                    note: input.note,
                },
            },
            input.isPublic,
        );
        return order;
    }

    /**
     * When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
     * we need to reconcile the contents of the two orders.
     */
    async mergeOrders(
        ctx: RequestContext,
        user: User,
        guestOrder?: Order,
        existingOrder?: Order,
    ): Promise<Order | undefined> {
        if (guestOrder && guestOrder.customer) {
            // In this case the "guest order" is actually an order of an existing Customer,
            // so we do not want to merge at all. See https://github.com/vendure-ecommerce/vendure/issues/263
            return existingOrder;
        }
        const mergeResult = await this.orderMerger.merge(guestOrder, existingOrder);
        const { orderToDelete, linesToInsert } = mergeResult;
        let { order } = mergeResult;
        if (orderToDelete) {
            await this.connection.getRepository(Order).delete(orderToDelete.id);
        }
        if (order && linesToInsert) {
            for (const line of linesToInsert) {
                order = await this.addItemToOrder(ctx, order.id, line.productVariantId, line.quantity);
            }
        }
        const customer = await this.customerService.findOneByUserId(user.id);
        if (order && customer) {
            order.customer = customer;
            await this.connection.getRepository(Order).save(order, { reload: false });
        }
        return order;
    }

    private async getOrderOrThrow(ctx: RequestContext, orderId: ID): Promise<Order> {
        const order = await this.findOne(ctx, orderId);
        if (!order) {
            throw new EntityNotFoundError('Order', orderId);
        }
        return order;
    }

    private async getProductVariantOrThrow(
        ctx: RequestContext,
        productVariantId: ID,
    ): Promise<ProductVariant> {
        const productVariant = await this.productVariantService.findOne(ctx, productVariantId);
        if (!productVariant) {
            throw new EntityNotFoundError('ProductVariant', productVariantId);
        }
        return productVariant;
    }

    private getOrderLineOrThrow(order: Order, orderLineId: ID): OrderLine {
        const orderItem = order.lines.find(line => idsAreEqual(line.id, orderLineId));
        if (!orderItem) {
            throw new UserInputError(`error.order-does-not-contain-line-with-id`, { id: orderLineId });
        }
        return orderItem;
    }

    private createOrderLineFromVariant(
        productVariant: ProductVariant,
        customFields?: { [key: string]: any },
    ): OrderLine {
        return new OrderLine({
            productVariant,
            taxCategory: productVariant.taxCategory,
            featuredAsset: productVariant.product.featuredAsset,
            customFields,
        });
    }

    /**
     * Throws if quantity is negative.
     */
    private assertQuantityIsPositive(quantity: number) {
        if (quantity < 0) {
            throw new IllegalOperationError(`error.order-item-quantity-must-be-positive`, { quantity });
        }
    }

    /**
     * Throws if the Order is not in the "AddingItems" state.
     */
    private assertAddingItemsState(order: Order) {
        if (order.state !== 'AddingItems') {
            throw new IllegalOperationError(`error.order-contents-may-only-be-modified-in-addingitems-state`);
        }
    }

    /**
     * Throws if adding the given quantity would take the total order items over the
     * maximum limit specified in the config.
     */
    private assertNotOverOrderItemsLimit(order: Order, quantityToAdd: number) {
        const currentItemsCount = order.lines.reduce((count, line) => count + line.quantity, 0);
        const { orderItemsLimit } = this.configService.orderOptions;
        if (orderItemsLimit < currentItemsCount + quantityToAdd) {
            throw new OrderItemsLimitError(orderItemsLimit);
        }
    }

    /**
     * Applies promotions, taxes and shipping to the Order.
     */
    private async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        updatedOrderLine?: OrderLine,
    ): Promise<Order> {
        const promotions = await this.connection.getRepository(Promotion).find({
            where: { enabled: true, deletedAt: null },
            order: { priorityScore: 'ASC' },
        });
        const updatedItems = await this.orderCalculator.applyPriceAdjustments(
            ctx,
            order,
            promotions,
            updatedOrderLine,
        );
        await this.connection.getRepository(Order).save(order, { reload: false });
        await this.connection.getRepository(OrderItem).save(updatedItems, { reload: false });
        return order;
    }

    private async getOrdersAndItemsFromLines(
        orderLinesInput: OrderLineInput[],
        itemMatcher: (i: OrderItem) => boolean,
        noMatchesError: string,
    ): Promise<{ orders: Order[]; items: OrderItem[] }> {
        const orders = new Map<ID, Order>();
        const items = new Map<ID, OrderItem>();

        const lines = await this.connection
            .getRepository(OrderLine)
            .findByIds(orderLinesInput.map(l => l.orderLineId), {
                relations: ['order', 'items', 'items.fulfillment'],
                order: { id: 'ASC' },
            });
        for (const line of lines) {
            const inputLine = orderLinesInput.find(l => idsAreEqual(l.orderLineId, line.id));
            if (!inputLine) {
                continue;
            }
            const order = line.order;
            if (!orders.has(order.id)) {
                orders.set(order.id, order);
            }
            const matchingItems = line.items.sort((a, b) => (a.id < b.id ? -1 : 1)).filter(itemMatcher);
            if (matchingItems.length < inputLine.quantity) {
                throw new IllegalOperationError(noMatchesError);
            }
            matchingItems.slice(0, inputLine.quantity).forEach(item => {
                items.set(item.id, item);
            });
        }
        return {
            orders: Array.from(orders.values()),
            items: Array.from(items.values()),
        };
    }
}
