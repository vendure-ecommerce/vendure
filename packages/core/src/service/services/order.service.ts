import { Injectable } from '@nestjs/common';
import {
    AddPaymentToOrderResult,
    ApplyCouponCodeResult,
    PaymentInput,
    RemoveOrderItemsResult,
    SetOrderShippingMethodResult,
    UpdateOrderItemsResult,
} from '@vendure/common/lib/generated-shop-types';
import {
    AddFulfillmentToOrderResult,
    AddNoteToOrderInput,
    CancelOrderInput,
    CancelOrderResult,
    CreateAddressInput,
    DeletionResponse,
    DeletionResult,
    FulfillOrderInput,
    HistoryEntryType,
    OrderLineInput,
    OrderProcessState,
    RefundOrderInput,
    RefundOrderResult,
    SettlePaymentResult,
    SettleRefundInput,
    ShippingMethodQuote,
    UpdateOrderNoteInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import { EntityNotFoundError, UserInputError } from '../../common/error/errors';
import {
    AlreadyRefundedError,
    CancelActiveOrderError,
    EmptyOrderLineSelectionError,
    FulfillmentStateTransitionError,
    InsufficientStockOnHandError,
    ItemsAlreadyFulfilledError,
    MultipleOrderError,
    NothingToRefundError,
    PaymentOrderMismatchError,
    PaymentStateTransitionError,
    QuantityTooGreatError,
    RefundOrderStateError,
    SettlePaymentError,
} from '../../common/error/generated-graphql-admin-errors';
import {
    IneligibleShippingMethodError,
    InsufficientStockError,
    NegativeQuantityError,
    OrderLimitError,
    OrderModificationError,
    OrderPaymentStateError,
    OrderStateTransitionError,
    PaymentDeclinedError,
    PaymentFailedError,
} from '../../common/error/generated-graphql-shop-errors';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { ListQueryOptions, PaymentMetadata } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Customer } from '../../entity/customer/customer.entity';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { ShippingLine } from '../../entity/shipping-line/shipping-line.entity';
import { Surcharge } from '../../entity/surcharge/surcharge.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { OrderStateTransitionEvent } from '../../event-bus/events/order-state-transition-event';
import { PaymentStateTransitionEvent } from '../../event-bus/events/payment-state-transition-event';
import { RefundStateTransitionEvent } from '../../event-bus/events/refund-state-transition-event';
import { FulfillmentState } from '../helpers/fulfillment-state-machine/fulfillment-state';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { OrderMerger } from '../helpers/order-merger/order-merger';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { OrderStateMachine } from '../helpers/order-state-machine/order-state-machine';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import {
    orderItemsAreAllCancelled,
    orderItemsAreDelivered,
    orderItemsAreShipped,
    orderTotalIsCovered,
} from '../helpers/utils/order-utils';
import { patchEntity } from '../helpers/utils/patch-entity';
import { translateDeep } from '../helpers/utils/translate-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';
import { CountryService } from './country.service';
import { CustomerService } from './customer.service';
import { FulfillmentService } from './fulfillment.service';
import { HistoryService } from './history.service';
import { PaymentMethodService } from './payment-method.service';
import { ProductVariantService } from './product-variant.service';
import { PromotionService } from './promotion.service';
import { StockMovementService } from './stock-movement.service';

@Injectable()
export class OrderService {
    constructor(
        private connection: TransactionalConnection,
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
        private fulfillmentService: FulfillmentService,
        private listQueryBuilder: ListQueryBuilder,
        private stockMovementService: StockMovementService,
        private refundStateMachine: RefundStateMachine,
        private historyService: HistoryService,
        private promotionService: PromotionService,
        private eventBus: EventBus,
        private channelService: ChannelService,
    ) {}

    getOrderProcessStates(): OrderProcessState[] {
        return Object.entries(this.orderStateMachine.config.transitions).map(([name, { to }]) => ({
            name,
            to,
        })) as OrderProcessState[];
    }

    findAll(ctx: RequestContext, options?: ListQueryOptions<Order>): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, {
                relations: ['lines', 'customer', 'lines.productVariant', 'channels'],
                channelId: ctx.channelId,
                ctx,
            })
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
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .leftJoin('order.channels', 'channel')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.shippingLines', 'shippingLines')
            .leftJoinAndSelect('order.surcharges', 'surcharges')
            .leftJoinAndSelect('customer.user', 'user')
            .leftJoinAndSelect('order.lines', 'lines')
            .leftJoinAndSelect('lines.productVariant', 'productVariant')
            .leftJoinAndSelect('productVariant.taxCategory', 'prodVariantTaxCategory')
            .leftJoinAndSelect('productVariant.productVariantPrices', 'prices')
            .leftJoinAndSelect('productVariant.translations', 'translations')
            .leftJoinAndSelect('lines.featuredAsset', 'featuredAsset')
            .leftJoinAndSelect('lines.items', 'items')
            .leftJoinAndSelect('items.fulfillments', 'fulfillments')
            .leftJoinAndSelect('lines.taxCategory', 'lineTaxCategory')
            .where('order.id = :orderId', { orderId })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId })
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
        const order = await this.connection.getRepository(ctx, Order).findOne({
            relations: ['customer'],
            where: {
                code: orderCode,
            },
        });
        return order ? this.findOne(ctx, order.id) : undefined;
    }

    async findByCustomerId(
        ctx: RequestContext,
        customerId: ID,
        options?: ListQueryOptions<Order>,
    ): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, {
                relations: [
                    'lines',
                    'lines.items',
                    'lines.productVariant',
                    'lines.productVariant.options',
                    'customer',
                    'channels',
                    'shippingLines',
                ],
                channelId: ctx.channelId,
                ctx,
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

    getOrderPayments(ctx: RequestContext, orderId: ID): Promise<Payment[]> {
        return this.connection.getRepository(ctx, Payment).find({
            where: {
                order: { id: orderId } as any,
            },
        });
    }

    async getRefundOrderItems(ctx: RequestContext, refundId: ID): Promise<OrderItem[]> {
        const refund = await this.connection.getEntityOrThrow(ctx, Refund, refundId, {
            relations: ['orderItems'],
        });
        return refund.orderItems;
    }

    getPaymentRefunds(ctx: RequestContext, paymentId: ID): Promise<Refund[]> {
        return this.connection.getRepository(ctx, Refund).find({
            where: {
                paymentId,
            },
        });
    }

    async getActiveOrderForUser(ctx: RequestContext, userId: ID): Promise<Order | undefined> {
        const customer = await this.customerService.findOneByUserId(ctx, userId);
        if (customer) {
            const activeOrder = await this.connection
                .getRepository(ctx, Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.channels', 'channel', 'channel.id = :channelId', {
                    channelId: ctx.channelId,
                })
                .leftJoinAndSelect('order.customer', 'customer')
                .leftJoinAndSelect('order.shippingLines', 'shippingLines')
                .where('active = :active', { active: true })
                .andWhere('order.customer.id = :customerId', { customerId: customer.id })
                .orderBy('order.createdAt', 'DESC')
                .getOne();
            if (activeOrder) {
                return this.findOne(ctx, activeOrder.id);
            }
        }
    }

    async create(ctx: RequestContext, userId?: ID): Promise<Order> {
        const newOrder = new Order({
            code: await this.configService.orderOptions.orderCodeStrategy.generate(ctx),
            state: this.orderStateMachine.getInitialState(),
            lines: [],
            surcharges: [],
            couponCodes: [],
            shippingAddress: {},
            billingAddress: {},
            subTotal: 0,
            subTotalWithTax: 0,
            currencyCode: ctx.channel.currencyCode,
        });
        if (userId) {
            const customer = await this.customerService.findOneByUserId(ctx, userId);
            if (customer) {
                newOrder.customer = customer;
            }
        }
        this.channelService.assignToCurrentChannel(newOrder, ctx);
        const order = await this.connection.getRepository(ctx, Order).save(newOrder);
        const transitionResult = await this.transitionToState(ctx, order.id, 'AddingItems');
        if (isGraphQlErrorResult(transitionResult)) {
            // this should never occur, so we will throw rather than return
            throw transitionResult;
        }
        return transitionResult;
    }

    async updateCustomFields(ctx: RequestContext, orderId: ID, customFields: any) {
        let order = await this.getOrderOrThrow(ctx, orderId);
        order = patchEntity(order, { customFields });
        return this.connection.getRepository(ctx, Order).save(order);
    }

    /**
     * Adds an OrderItem to the Order, either creating a new OrderLine or
     * incrementing an existing one.
     */
    async addItemToOrder(
        ctx: RequestContext,
        orderId: ID,
        productVariantId: ID,
        quantity: number,
        customFields?: { [key: string]: any },
    ): Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError =
            this.assertQuantityIsPositive(quantity) ||
            this.assertAddingItemsState(order) ||
            this.assertNotOverOrderItemsLimit(order, quantity);
        if (validationError) {
            return validationError;
        }
        const orderLine = await this.getOrCreateItemOrderLine(ctx, order, productVariantId, customFields);
        const correctedQuantity = await this.constrainQuantityToSaleable(
            ctx,
            orderLine.productVariant,
            quantity,
        );
        if (correctedQuantity === 0) {
            return new InsufficientStockError(correctedQuantity, order);
        }
        await this.updateOrderLineQuantity(ctx, orderLine, orderLine.quantity + correctedQuantity, order);
        const quantityWasAdjustedDown = correctedQuantity < quantity;
        const updatedOrder = await this.applyPriceAdjustments(ctx, order, orderLine);
        if (quantityWasAdjustedDown) {
            return new InsufficientStockError(correctedQuantity, updatedOrder);
        } else {
            return updatedOrder;
        }
    }

    /**
     * Adjusts the quantity of an existing OrderLine
     */
    async adjustOrderLine(
        ctx: RequestContext,
        orderId: ID,
        orderLineId: ID,
        quantity: number,
        customFields?: { [key: string]: any },
    ): Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        const validationError =
            this.assertAddingItemsState(order) ||
            this.assertQuantityIsPositive(quantity) ||
            this.assertNotOverOrderItemsLimit(order, quantity - orderLine.quantity);
        if (validationError) {
            return validationError;
        }
        if (customFields != null) {
            orderLine.customFields = customFields;
        }
        const correctedQuantity = await this.constrainQuantityToSaleable(
            ctx,
            orderLine.productVariant,
            quantity,
        );
        if (correctedQuantity === 0) {
            order.lines = order.lines.filter(l => !idsAreEqual(l.id, orderLine.id));
            await this.connection.getRepository(ctx, OrderLine).remove(orderLine);
        } else {
            await this.updateOrderLineQuantity(ctx, orderLine, quantity, order);
        }
        const quantityWasAdjustedDown = correctedQuantity < quantity;
        const updatedOrder = await this.applyPriceAdjustments(ctx, order, orderLine);
        if (quantityWasAdjustedDown) {
            return new InsufficientStockError(correctedQuantity, updatedOrder);
        } else {
            return updatedOrder;
        }
    }

    async removeItemFromOrder(
        ctx: RequestContext,
        orderId: ID,
        orderLineId: ID,
    ): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError = this.assertAddingItemsState(order);
        if (validationError) {
            return validationError;
        }
        const orderLine = this.getOrderLineOrThrow(order, orderLineId);
        order.lines = order.lines.filter(line => !idsAreEqual(line.id, orderLineId));
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        await this.connection.getRepository(ctx, OrderLine).remove(orderLine);
        return updatedOrder;
    }

    async removeAllItemsFromOrder(
        ctx: RequestContext,
        orderId: ID,
    ): Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError = this.assertAddingItemsState(order);
        if (validationError) {
            return validationError;
        }
        await this.connection.getRepository(ctx, OrderLine).remove(order.lines);
        order.lines = [];
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        return updatedOrder;
    }

    async addSurchargeToOrder(
        ctx: RequestContext,
        orderId: ID,
        surchargeInput: Partial<Omit<Surcharge, 'id' | 'createdAt' | 'updatedAt' | 'order'>>,
    ): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const surcharge = await this.connection.getRepository(ctx, Surcharge).save(
            new Surcharge({
                taxLines: [],
                sku: '',
                listPriceIncludesTax: ctx.channel.pricesIncludeTax,
                order,
                ...surchargeInput,
            }),
        );
        order.surcharges.push(surcharge);
        const updatedOrder = await this.applyPriceAdjustments(ctx, order);
        return updatedOrder;
    }

    async removeSurchargeFromOrder(ctx: RequestContext, orderId: ID, surchargeId: ID): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const surcharge = await this.connection.getEntityOrThrow(ctx, Surcharge, surchargeId);
        if (order.surcharges.find(s => idsAreEqual(s.id, surcharge.id))) {
            order.surcharges = order.surcharges.filter(s => !idsAreEqual(s.id, surchargeId));
            const updatedOrder = await this.applyPriceAdjustments(ctx, order);
            await this.connection.getRepository(ctx, Surcharge).remove(surcharge);
            return updatedOrder;
        } else {
            return order;
        }
    }

    async applyCouponCode(
        ctx: RequestContext,
        orderId: ID,
        couponCode: string,
    ): Promise<ErrorResultUnion<ApplyCouponCodeResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.couponCodes.includes(couponCode)) {
            return order;
        }
        const validationResult = await this.promotionService.validateCouponCode(
            ctx,
            couponCode,
            order.customer && order.customer.id,
        );
        if (isGraphQlErrorResult(validationResult)) {
            return validationResult;
        }
        order.couponCodes.push(couponCode);
        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: order.id,
            type: HistoryEntryType.ORDER_COUPON_APPLIED,
            data: { couponCode, promotionId: validationResult.id },
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

    async getOrderPromotions(ctx: RequestContext, orderId: ID): Promise<Promotion[]> {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            channelId: ctx.channelId,
            relations: ['promotions'],
        });
        return order.promotions || [];
    }

    getNextOrderStates(order: Order): ReadonlyArray<OrderState> {
        return this.orderStateMachine.getNextStates(order);
    }

    async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        order.shippingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        return this.connection.getRepository(ctx, Order).save(order);
    }

    async setBillingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        order.billingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        return this.connection.getRepository(ctx, Order).save(order);
    }

    async getEligibleShippingMethods(ctx: RequestContext, orderId: ID): Promise<ShippingMethodQuote[]> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const eligibleMethods = await this.shippingCalculator.getEligibleShippingMethods(ctx, order);
        return eligibleMethods.map(eligible => {
            const { price, taxRate, priceIncludesTax, metadata } = eligible.result;
            return {
                id: eligible.method.id,
                price: priceIncludesTax ? netPriceOf(price, taxRate) : price,
                priceWithTax: priceIncludesTax ? price : grossPriceOf(price, taxRate),
                description: eligible.method.description,
                name: eligible.method.name,
                metadata,
            };
        });
    }

    async setShippingMethod(
        ctx: RequestContext,
        orderId: ID,
        shippingMethodId: ID,
    ): Promise<ErrorResultUnion<SetOrderShippingMethodResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const validationError = this.assertAddingItemsState(order);
        if (validationError) {
            return validationError;
        }
        const shippingMethod = await this.shippingCalculator.getMethodIfEligible(
            ctx,
            order,
            shippingMethodId,
        );
        if (!shippingMethod) {
            return new IneligibleShippingMethodError();
        }
        let shippingLine: ShippingLine | undefined = order.shippingLines[0];
        if (shippingLine) {
            shippingLine.shippingMethod = shippingMethod;
        } else {
            shippingLine = await this.connection.getRepository(ctx, ShippingLine).save(
                new ShippingLine({
                    shippingMethod,
                    order,
                    adjustments: [],
                    listPrice: 0,
                    listPriceIncludesTax: ctx.channel.pricesIncludeTax,
                    taxLines: [],
                }),
            );
            order.shippingLines = [shippingLine];
        }
        await this.connection.getRepository(ctx, ShippingLine).save(shippingLine);
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        await this.applyPriceAdjustments(ctx, order);
        return this.connection.getRepository(ctx, Order).save(order);
    }

    async transitionToState(
        ctx: RequestContext,
        orderId: ID,
        state: OrderState,
    ): Promise<Order | OrderStateTransitionError> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        order.payments = await this.getOrderPayments(ctx, orderId);
        const fromState = order.state;
        try {
            await this.orderStateMachine.transition(ctx, order, state);
        } catch (e) {
            const transitionError = ctx.translate(e.message, { fromState, toState: state });
            return new OrderStateTransitionError(transitionError, fromState, state);
        }
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        this.eventBus.publish(new OrderStateTransitionEvent(fromState, state, ctx, order));
        return order;
    }

    async transitionFulfillmentToState(
        ctx: RequestContext,
        fulfillmentId: ID,
        state: FulfillmentState,
    ): Promise<Fulfillment | FulfillmentStateTransitionError> {
        const result = await this.fulfillmentService.transitionToState(ctx, fulfillmentId, state);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const { fulfillment, fromState, toState, orders } = result;
        await Promise.all(
            orders.map(order => this.handleFulfillmentStateTransitByOrder(ctx, order, fromState, toState)),
        );
        return fulfillment;
    }

    private async handleFulfillmentStateTransitByOrder(
        ctx: RequestContext,
        order: Order,
        fromState: FulfillmentState,
        toState: FulfillmentState,
    ): Promise<void> {
        const nextOrderStates = this.getNextOrderStates(order);

        const transitionOrderIfStateAvailable = (state: OrderState) =>
            nextOrderStates.includes(state) && this.transitionToState(ctx, order.id, state);

        if (toState === 'Shipped') {
            const orderWithFulfillment = await this.getOrderWithFulfillments(ctx, order.id);
            if (orderItemsAreShipped(orderWithFulfillment)) {
                await transitionOrderIfStateAvailable('Shipped');
            } else {
                await transitionOrderIfStateAvailable('PartiallyShipped');
            }
        }
        if (toState === 'Delivered') {
            const orderWithFulfillment = await this.getOrderWithFulfillments(ctx, order.id);
            if (orderItemsAreDelivered(orderWithFulfillment)) {
                await transitionOrderIfStateAvailable('Delivered');
            } else {
                await transitionOrderIfStateAvailable('PartiallyDelivered');
            }
        }
    }
    /**
     * Returns the OrderLine to which a new OrderItem belongs, creating a new OrderLine
     * if no existing line is found.
     */
    private async getOrCreateItemOrderLine(
        ctx: RequestContext,
        order: Order,
        productVariantId: ID,
        customFields?: { [key: string]: any },
    ) {
        const existingOrderLine = order.lines.find(line => {
            return (
                idsAreEqual(line.productVariant.id, productVariantId) &&
                this.customFieldsAreEqual(customFields, line.customFields)
            );
        });
        if (existingOrderLine) {
            return existingOrderLine;
        }

        const productVariant = await this.getProductVariantOrThrow(ctx, productVariantId);
        const orderLine = await this.connection.getRepository(ctx, OrderLine).save(
            new OrderLine({
                productVariant,
                taxCategory: productVariant.taxCategory,
                featuredAsset: productVariant.product.featuredAsset,
                customFields,
            }),
        );
        const lineWithRelations = await this.connection.getEntityOrThrow(ctx, OrderLine, orderLine.id, {
            relations: [
                'items',
                'taxCategory',
                'productVariant',
                'productVariant.productVariantPrices',
                'productVariant.taxCategory',
            ],
        });
        lineWithRelations.productVariant = this.productVariantService.applyChannelPriceAndTax(
            lineWithRelations.productVariant,
            ctx,
        );
        order.lines.push(lineWithRelations);
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        return lineWithRelations;
    }

    /**
     * Updates the quantity of an OrderLine, taking into account the available saleable stock level.
     * Returns the actual quantity that the OrderLine was updated to (which may be less than the
     * `quantity` argument if insufficient stock was available.
     */
    private async updateOrderLineQuantity(
        ctx: RequestContext,
        orderLine: OrderLine,
        quantity: number,
        order: Order,
    ): Promise<OrderLine> {
        const currentQuantity = orderLine.quantity;
        const { orderItemPriceCalculationStrategy } = this.configService.orderOptions;

        if (currentQuantity < quantity) {
            if (!orderLine.items) {
                orderLine.items = [];
            }
            const productVariant = orderLine.productVariant;
            const { price, priceIncludesTax } = await orderItemPriceCalculationStrategy.calculateUnitPrice(
                ctx,
                productVariant,
                orderLine.customFields || {},
            );
            const taxRate = productVariant.taxRateApplied;
            for (let i = currentQuantity; i < quantity; i++) {
                const orderItem = await this.connection.getRepository(ctx, OrderItem).save(
                    new OrderItem({
                        listPrice: price,
                        listPriceIncludesTax: priceIncludesTax,
                        adjustments: [],
                        taxLines: [],
                    }),
                );
                orderLine.items.push(orderItem);
            }
        } else if (quantity < currentQuantity) {
            const keepItems = orderLine.items.slice(0, quantity);
            const removeItems = orderLine.items.slice(quantity);
            orderLine.items = keepItems;
            await this.connection.getRepository(ctx, OrderItem).remove(removeItems);
        }
        await this.connection.getRepository(ctx, OrderLine).save(orderLine);
        return orderLine;
    }

    /**
     * Ensure that the ProductVariant has sufficient saleable stock to add the given
     * quantity to an Order.
     */
    private async constrainQuantityToSaleable(
        ctx: RequestContext,
        variant: ProductVariant,
        quantity: number,
    ) {
        let correctedQuantity = quantity;
        const saleableStockLevel = await this.productVariantService.getSaleableStockLevel(ctx, variant);
        if (saleableStockLevel < correctedQuantity) {
            correctedQuantity = Math.max(saleableStockLevel, 0);
        }
        return correctedQuantity;
    }

    async addPaymentToOrder(
        ctx: RequestContext,
        orderId: ID,
        input: PaymentInput,
    ): Promise<ErrorResultUnion<AddPaymentToOrderResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.state !== 'ArrangingPayment') {
            return new OrderPaymentStateError();
        }
        const payment = await this.paymentMethodService.createPayment(
            ctx,
            order,
            input.method,
            input.metadata,
        );

        const existingPayments = await this.getOrderPayments(ctx, orderId);
        order.payments = [...existingPayments, payment];
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });

        if (payment.state === 'Error') {
            return new PaymentFailedError(payment.errorMessage || '');
        }
        if (payment.state === 'Declined') {
            return new PaymentDeclinedError(payment.errorMessage || '');
        }

        if (orderTotalIsCovered(order, 'Settled')) {
            return this.transitionToState(ctx, orderId, 'PaymentSettled');
        }
        if (orderTotalIsCovered(order, 'Authorized')) {
            return this.transitionToState(ctx, orderId, 'PaymentAuthorized');
        }
        return order;
    }

    async settlePayment(
        ctx: RequestContext,
        paymentId: ID,
    ): Promise<ErrorResultUnion<SettlePaymentResult, Payment>> {
        const payment = await this.connection.getEntityOrThrow(ctx, Payment, paymentId, {
            relations: ['order'],
        });
        const settlePaymentResult = await this.paymentMethodService.settlePayment(
            ctx,
            payment,
            payment.order,
        );
        if (settlePaymentResult.success) {
            const fromState = payment.state;
            const toState = 'Settled';
            try {
                await this.paymentStateMachine.transition(ctx, payment.order, payment, toState);
            } catch (e) {
                const transitionError = ctx.translate(e.message, { fromState, toState });
                return new PaymentStateTransitionError(transitionError, fromState, toState);
            }
            payment.metadata = this.mergePaymentMetadata(payment.metadata, settlePaymentResult.metadata);
            await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
            this.eventBus.publish(
                new PaymentStateTransitionEvent(fromState, toState, ctx, payment, payment.order),
            );
            const orderTotalSettled = payment.amount === payment.order.totalWithTax;
            if (
                orderTotalSettled &&
                this.orderStateMachine.canTransition(payment.order.state, 'PaymentSettled')
            ) {
                const orderTransitionResult = await this.transitionToState(
                    ctx,
                    payment.order.id,
                    'PaymentSettled',
                );
                if (isGraphQlErrorResult(orderTransitionResult)) {
                    return orderTransitionResult;
                }
            }
        } else {
            payment.errorMessage = settlePaymentResult.errorMessage;
            payment.metadata = this.mergePaymentMetadata(payment.metadata, settlePaymentResult.metadata);
            await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
            return new SettlePaymentError(settlePaymentResult.errorMessage || '');
        }
        return payment;
    }

    async createFulfillment(
        ctx: RequestContext,
        input: FulfillOrderInput,
    ): Promise<ErrorResultUnion<AddFulfillmentToOrderResult, Fulfillment>> {
        if (
            !input.lines ||
            input.lines.length === 0 ||
            input.lines.length === 0 ||
            summate(input.lines, 'quantity') === 0
        ) {
            return new EmptyOrderLineSelectionError();
        }
        const ordersAndItems = await this.getOrdersAndItemsFromLines(
            ctx,
            input.lines,
            i => !i.fulfillment && !i.cancelled,
        );
        if (!ordersAndItems) {
            return new ItemsAlreadyFulfilledError();
        }
        const stockCheckResult = await this.ensureSufficientStockForFulfillment(ctx, input);
        if (isGraphQlErrorResult(stockCheckResult)) {
            return stockCheckResult;
        }

        const fulfillment = await this.fulfillmentService.create(
            ctx,
            ordersAndItems.orders,
            ordersAndItems.items,
            input.handler,
        );
        if (isGraphQlErrorResult(fulfillment)) {
            return fulfillment;
        }

        await this.stockMovementService.createSalesForOrder(ctx, ordersAndItems.items);

        for (const order of ordersAndItems.orders) {
            await this.historyService.createHistoryEntryForOrder({
                ctx,
                orderId: order.id,
                type: HistoryEntryType.ORDER_FULFILLMENT,
                data: {
                    fulfillmentId: fulfillment.id,
                },
            });
        }
        const result = await this.fulfillmentService.transitionToState(ctx, fulfillment.id, 'Pending');
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        return result.fulfillment;
    }

    private async ensureSufficientStockForFulfillment(
        ctx: RequestContext,
        input: FulfillOrderInput,
    ): Promise<InsufficientStockOnHandError | undefined> {
        const lines = await this.connection.getRepository(ctx, OrderLine).findByIds(
            input.lines.map(l => l.orderLineId),
            { relations: ['productVariant'] },
        );

        for (const line of lines) {
            // tslint:disable-next-line:no-non-null-assertion
            const lineInput = input.lines.find(l => idsAreEqual(l.orderLineId, line.id))!;
            const fulfillableStockLevel = await this.productVariantService.getFulfillableStockLevel(
                ctx,
                line.productVariant,
            );
            if (fulfillableStockLevel < lineInput.quantity) {
                const productVariant = translateDeep(line.productVariant, ctx.languageCode);
                return new InsufficientStockOnHandError(
                    productVariant.id as string,
                    productVariant.name,
                    productVariant.stockOnHand,
                );
            }
        }
    }

    async getOrderFulfillments(ctx: RequestContext, order: Order): Promise<Fulfillment[]> {
        let lines: OrderLine[];
        if (order.lines?.[0].items?.[0]?.fulfillments !== undefined) {
            lines = order.lines;
        } else {
            lines = await this.connection.getRepository(ctx, OrderLine).find({
                where: {
                    order: order.id,
                },
                relations: ['items', 'items.fulfillments'],
            });
        }
        const items = lines.reduce((acc, l) => [...acc, ...l.items], [] as OrderItem[]);
        const fulfillments = items.reduce((acc, i) => [...acc, ...i.fulfillments], [] as Fulfillment[]);
        return unique(fulfillments, 'id');
    }

    async getOrderSurcharges(ctx: RequestContext, orderId: ID): Promise<Surcharge[]> {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            channelId: ctx.channelId,
            relations: ['surcharges'],
        });
        return order.surcharges || [];
    }

    async cancelOrder(
        ctx: RequestContext,
        input: CancelOrderInput,
    ): Promise<ErrorResultUnion<CancelOrderResult, Order>> {
        let allOrderItemsCancelled = false;
        const cancelResult =
            input.lines != null
                ? await this.cancelOrderByOrderLines(ctx, input, input.lines)
                : await this.cancelOrderById(ctx, input);

        if (isGraphQlErrorResult(cancelResult)) {
            return cancelResult;
        } else {
            allOrderItemsCancelled = cancelResult;
        }

        if (allOrderItemsCancelled) {
            const transitionResult = await this.transitionToState(ctx, input.orderId, 'Cancelled');
            if (isGraphQlErrorResult(transitionResult)) {
                return transitionResult;
            }
        }
        return assertFound(this.findOne(ctx, input.orderId));
    }

    private async cancelOrderById(ctx: RequestContext, input: CancelOrderInput) {
        const order = await this.getOrderOrThrow(ctx, input.orderId);
        if (order.state === 'AddingItems' || order.state === 'ArrangingPayment') {
            return true;
        } else {
            const lines: OrderLineInput[] = order.lines.map(l => ({
                orderLineId: l.id,
                quantity: l.quantity,
            }));
            return this.cancelOrderByOrderLines(ctx, input, lines);
        }
    }

    private async cancelOrderByOrderLines(
        ctx: RequestContext,
        input: CancelOrderInput,
        lines: OrderLineInput[],
    ) {
        if (lines.length === 0 || summate(lines, 'quantity') === 0) {
            return new EmptyOrderLineSelectionError();
        }
        const ordersAndItems = await this.getOrdersAndItemsFromLines(ctx, lines, i => !i.cancelled);
        if (!ordersAndItems) {
            return new QuantityTooGreatError();
        }
        if (1 < ordersAndItems.orders.length) {
            return new MultipleOrderError();
        }
        const { orders, items } = ordersAndItems;
        const order = orders[0];
        if (!idsAreEqual(order.id, input.orderId)) {
            return new MultipleOrderError();
        }
        if (order.state === 'AddingItems' || order.state === 'ArrangingPayment') {
            return new CancelActiveOrderError(order.state);
        }
        const fullOrder = await this.findOne(ctx, order.id);

        const soldItems = items.filter(i => !!i.fulfillment);
        const allocatedItems = items.filter(i => !i.fulfillment);
        await this.stockMovementService.createCancellationsForOrderItems(ctx, soldItems);
        await this.stockMovementService.createReleasesForOrderItems(ctx, allocatedItems);
        items.forEach(i => (i.cancelled = true));
        await this.connection.getRepository(ctx, OrderItem).save(items, { reload: false });

        const orderWithItems = await this.connection.getEntityOrThrow(ctx, Order, order.id, {
            relations: ['lines', 'lines.items'],
        });
        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: order.id,
            type: HistoryEntryType.ORDER_CANCELLATION,
            data: {
                orderItemIds: items.map(i => i.id),
                reason: input.reason || undefined,
            },
        });
        return orderItemsAreAllCancelled(orderWithItems);
    }

    async refundOrder(
        ctx: RequestContext,
        input: RefundOrderInput,
    ): Promise<ErrorResultUnion<RefundOrderResult, Refund>> {
        if (
            (!input.lines || input.lines.length === 0 || summate(input.lines, 'quantity') === 0) &&
            input.shipping === 0
        ) {
            return new NothingToRefundError();
        }
        const ordersAndItems = await this.getOrdersAndItemsFromLines(ctx, input.lines, i => !i.cancelled);
        if (!ordersAndItems) {
            return new QuantityTooGreatError();
        }
        const { orders, items } = ordersAndItems;
        if (1 < orders.length) {
            return new MultipleOrderError();
        }
        const payment = await this.connection.getEntityOrThrow(ctx, Payment, input.paymentId, {
            relations: ['order'],
        });
        if (orders && orders.length && !idsAreEqual(payment.order.id, orders[0].id)) {
            return new PaymentOrderMismatchError();
        }
        const order = payment.order;
        if (
            order.state === 'AddingItems' ||
            order.state === 'ArrangingPayment' ||
            order.state === 'PaymentAuthorized'
        ) {
            return new RefundOrderStateError(order.state);
        }
        const alreadyRefunded = items.find(i => !!i.refundId);
        if (alreadyRefunded) {
            return new AlreadyRefundedError(alreadyRefunded.refundId as string);
        }

        return await this.paymentMethodService.createRefund(ctx, input, order, items, payment);
    }

    async settleRefund(ctx: RequestContext, input: SettleRefundInput): Promise<Refund> {
        const refund = await this.connection.getEntityOrThrow(ctx, Refund, input.id, {
            relations: ['payment', 'payment.order'],
        });
        refund.transactionId = input.transactionId;
        const fromState = refund.state;
        const toState = 'Settled';
        await this.refundStateMachine.transition(ctx, refund.payment.order, refund, toState);
        await this.connection.getRepository(ctx, Refund).save(refund);
        this.eventBus.publish(
            new RefundStateTransitionEvent(fromState, toState, ctx, refund, refund.payment.order),
        );
        return refund;
    }

    async addCustomerToOrder(ctx: RequestContext, orderId: ID, customer: Customer): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        order.customer = customer;
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        // Check that any applied couponCodes are still valid now that
        // we know the Customer.
        if (order.couponCodes) {
            let codesRemoved = false;
            for (const couponCode of order.couponCodes.slice()) {
                const validationResult = await this.promotionService.validateCouponCode(
                    ctx,
                    couponCode,
                    customer.id,
                );
                if (isGraphQlErrorResult(validationResult)) {
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

    async updateOrderNote(ctx: RequestContext, input: UpdateOrderNoteInput): Promise<HistoryEntry> {
        return this.historyService.updateOrderHistoryEntry(ctx, {
            type: HistoryEntryType.ORDER_NOTE,
            data: input.note ? { note: input.note } : undefined,
            isPublic: input.isPublic ?? undefined,
            ctx,
            entryId: input.noteId,
        });
    }

    async deleteOrderNote(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        try {
            await this.historyService.deleteOrderHistoryEntry(ctx, id);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
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
        const mergeResult = await this.orderMerger.merge(ctx, guestOrder, existingOrder);
        const { orderToDelete, linesToInsert } = mergeResult;
        let { order } = mergeResult;
        if (orderToDelete) {
            await this.connection.getRepository(ctx, Order).delete(orderToDelete.id);
        }
        if (order && linesToInsert) {
            const orderId = order.id;
            for (const line of linesToInsert) {
                const result = await this.addItemToOrder(ctx, orderId, line.productVariantId, line.quantity);
                if (!isGraphQlErrorResult(result)) {
                    order = result;
                }
            }
        }
        const customer = await this.customerService.findOneByUserId(ctx, user.id);
        if (order && customer) {
            order.customer = customer;
            await this.connection.getRepository(ctx, Order).save(order, { reload: false });
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

    /**
     * Returns error if quantity is negative.
     */
    private assertQuantityIsPositive(quantity: number) {
        if (quantity < 0) {
            return new NegativeQuantityError();
        }
    }

    /**
     * Returns error if the Order is not in the "AddingItems" state.
     */
    private assertAddingItemsState(order: Order) {
        if (order.state !== 'AddingItems') {
            return new OrderModificationError();
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
            return new OrderLimitError(orderItemsLimit);
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
        const promotions = await this.connection.getRepository(ctx, Promotion).find({
            where: { enabled: true, deletedAt: null },
            order: { priorityScore: 'ASC' },
        });
        const updatedItems = await this.orderCalculator.applyPriceAdjustments(
            ctx,
            order,
            promotions,
            updatedOrderLine,
        );
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        await this.connection.getRepository(ctx, OrderItem).save(updatedItems, { reload: false });
        await this.connection.getRepository(ctx, ShippingLine).save(order.shippingLines, { reload: false });
        return order;
    }

    private async getOrderWithFulfillments(ctx: RequestContext, orderId: ID): Promise<Order> {
        return await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            relations: ['lines', 'lines.items', 'lines.items.fulfillments'],
        });
    }

    private customFieldsAreEqual(
        inputCustomFields: { [key: string]: any } | null | undefined,
        existingCustomFields?: { [key: string]: any },
    ): boolean {
        if (inputCustomFields == null && typeof existingCustomFields === 'object') {
            // A null value for an OrderLine customFields input is the equivalent
            // of every property of an existing customFields object being null.
            return Object.values(existingCustomFields).every(v => v === null);
        }
        return JSON.stringify(inputCustomFields) === JSON.stringify(existingCustomFields);
    }

    private async getOrdersAndItemsFromLines(
        ctx: RequestContext,
        orderLinesInput: OrderLineInput[],
        itemMatcher: (i: OrderItem) => boolean,
    ): Promise<{ orders: Order[]; items: OrderItem[] } | false> {
        const orders = new Map<ID, Order>();
        const items = new Map<ID, OrderItem>();

        const lines = await this.connection.getRepository(ctx, OrderLine).findByIds(
            orderLinesInput.map(l => l.orderLineId),
            {
                relations: ['order', 'items', 'items.fulfillments', 'order.channels'],
                order: { id: 'ASC' },
            },
        );
        for (const line of lines) {
            const inputLine = orderLinesInput.find(l => idsAreEqual(l.orderLineId, line.id));
            if (!inputLine) {
                continue;
            }
            const order = line.order;
            if (!order.channels.some(channel => channel.id === ctx.channelId)) {
                throw new EntityNotFoundError('Order', order.id);
            }
            if (!orders.has(order.id)) {
                orders.set(order.id, order);
            }
            const matchingItems = line.items.sort((a, b) => (a.id < b.id ? -1 : 1)).filter(itemMatcher);
            if (matchingItems.length < inputLine.quantity) {
                return false;
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

    private mergePaymentMetadata(m1: PaymentMetadata, m2?: PaymentMetadata): PaymentMetadata {
        if (!m2) {
            return m1;
        }
        const merged = { ...m1, ...m2 };
        if (m1.public && m1.public) {
            merged.public = { ...m1.public, ...m2.public };
        }
        return merged;
    }
}
