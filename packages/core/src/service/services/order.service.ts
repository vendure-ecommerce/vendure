import { Injectable } from '@nestjs/common';
import {
    AddPaymentToOrderResult,
    ApplyCouponCodeResult,
    PaymentInput,
    PaymentMethodQuote,
    RemoveOrderItemsResult,
    SetOrderShippingMethodResult,
    UpdateOrderItemsResult,
} from '@vendure/common/lib/generated-shop-types';
import {
    AddFulfillmentToOrderResult,
    AddManualPaymentToOrderResult,
    AddNoteToOrderInput,
    AdjustmentType,
    CancelOrderInput,
    CancelOrderResult,
    CreateAddressInput,
    DeletionResponse,
    DeletionResult,
    FulfillOrderInput,
    HistoryEntryType,
    ManualPaymentInput,
    ModifyOrderInput,
    ModifyOrderResult,
    OrderLineInput,
    OrderListOptions,
    OrderProcessState,
    RefundOrderInput,
    RefundOrderResult,
    SettlePaymentResult,
    SettleRefundInput,
    ShippingMethodQuote,
    TransitionPaymentToStateResult,
    UpdateOrderNoteInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { RequestContextCacheService } from '../../cache/request-context-cache.service';
import { ErrorResultUnion, isGraphQlErrorResult } from '../../common/error/error-result';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import {
    AlreadyRefundedError,
    CancelActiveOrderError,
    EmptyOrderLineSelectionError,
    FulfillmentStateTransitionError,
    InsufficientStockOnHandError,
    ItemsAlreadyFulfilledError,
    ManualPaymentStateError,
    MultipleOrderError,
    NothingToRefundError,
    PaymentOrderMismatchError,
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
import { EntityRelationPaths, EntityRelations } from '../../common/index';
import { grossPriceOf, netPriceOf } from '../../common/tax-utils';
import { ListQueryOptions, PaymentMetadata } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Customer } from '../../entity/customer/customer.entity';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { Session } from '../../entity/index';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { OrderModification } from '../../entity/order-modification/order-modification.entity';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../entity/promotion/promotion.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { ShippingLine } from '../../entity/shipping-line/shipping-line.entity';
import { Allocation } from '../../entity/stock-movement/allocation.entity';
import { Surcharge } from '../../entity/surcharge/surcharge.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CouponCodeEvent } from '../../event-bus/index';
import { OrderEvent } from '../../event-bus/index';
import { OrderStateTransitionEvent } from '../../event-bus/index';
import { RefundStateTransitionEvent } from '../../event-bus/index';
import { OrderLineEvent } from '../../event-bus/index';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { FulfillmentState } from '../helpers/fulfillment-state-machine/fulfillment-state';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderCalculator } from '../helpers/order-calculator/order-calculator';
import { OrderMerger } from '../helpers/order-merger/order-merger';
import { OrderModifier } from '../helpers/order-modifier/order-modifier';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { OrderStateMachine } from '../helpers/order-state-machine/order-state-machine';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { ShippingCalculator } from '../helpers/shipping-calculator/shipping-calculator';
import { TranslatorService } from '../helpers/translator/translator.service';
import {
    orderItemsAreAllCancelled,
    orderItemsAreDelivered,
    orderItemsAreShipped,
    orderTotalIsCovered,
    totalCoveredByPayments,
} from '../helpers/utils/order-utils';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';
import { CountryService } from './country.service';
import { CustomerService } from './customer.service';
import { FulfillmentService } from './fulfillment.service';
import { HistoryService } from './history.service';
import { PaymentMethodService } from './payment-method.service';
import { PaymentService } from './payment.service';
import { ProductVariantService } from './product-variant.service';
import { PromotionService } from './promotion.service';
import { StockMovementService } from './stock-movement.service';

/**
 * @description
 * Contains methods relating to {@link Order} entities.
 *
 * @docsCategory services
 */
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
        private paymentService: PaymentService,
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
        private orderModifier: OrderModifier,
        private customFieldRelationService: CustomFieldRelationService,
        private requestCache: RequestContextCacheService,
        private translator: TranslatorService,
    ) {}

    /**
     * @description
     * Returns an array of all the configured states and transitions of the order process. This is
     * based on the default order process plus all configured {@link CustomOrderProcess} objects
     * defined in the {@link OrderOptions} `process` array.
     */
    getOrderProcessStates(): OrderProcessState[] {
        return Object.entries(this.orderStateMachine.config.transitions).map(([name, { to }]) => ({
            name,
            to,
        })) as OrderProcessState[];
    }

    findAll(
        ctx: RequestContext,
        options?: OrderListOptions,
        relations?: RelationPaths<Order>,
    ): Promise<PaginatedList<Order>> {
        return this.listQueryBuilder
            .build(Order, options, {
                ctx,
                relations: relations ?? [
                    'lines',
                    'customer',
                    'lines.productVariant',
                    'lines.items',
                    'channels',
                    'shippingLines',
                ],
                channelId: ctx.channelId,
                customPropertyMap: {
                    customerLastName: 'customer.lastName',
                },
            })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    async findOne(
        ctx: RequestContext,
        orderId: ID,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const qb = this.connection.getRepository(ctx, Order).createQueryBuilder('order');
        const effectiveRelations = relations ?? [
            'channels',
            'customer',
            'customer.user',
            'lines',
            'lines.items',
            'lines.items.fulfillments',
            'lines.productVariant',
            'lines.productVariant.taxCategory',
            'lines.productVariant.productVariantPrices',
            'lines.productVariant.translations',
            'lines.featuredAsset',
            'lines.taxCategory',
            'shippingLines',
            'surcharges',
        ];
        if (
            relations &&
            effectiveRelations.includes('lines.productVariant') &&
            !effectiveRelations.includes('lines.productVariant.taxCategory')
        ) {
            effectiveRelations.push('lines.productVariant.taxCategory');
        }
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: effectiveRelations,
        });
        qb.leftJoin('order.channels', 'channel')
            .where('order.id = :orderId', { orderId })
            .andWhere('channel.id = :channelId', { channelId: ctx.channelId });
        if (effectiveRelations.includes('lines') && effectiveRelations.includes('lines.items')) {
            qb.addOrderBy('order__lines.createdAt', 'ASC').addOrderBy('order__lines__items.createdAt', 'ASC');
        }

        // tslint:disable-next-line:no-non-null-assertion
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, qb.expressionMap.mainAlias!.metadata);

        const order = await qb.getOne();
        if (order) {
            if (effectiveRelations.includes('lines.productVariant')) {
                for (const line of order.lines) {
                    line.productVariant = this.translator.translate(
                        await this.productVariantService.applyChannelPriceAndTax(
                            line.productVariant,
                            ctx,
                            order,
                        ),
                        ctx
                    );
                }
            }
            return order;
        }
    }

    async findOneByCode(
        ctx: RequestContext,
        orderCode: string,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const order = await this.connection.getRepository(ctx, Order).findOne({
            relations: ['customer'],
            where: {
                code: orderCode,
            },
        });
        return order ? this.findOne(ctx, order.id, relations) : undefined;
    }

    async findOneByOrderLineId(
        ctx: RequestContext,
        orderLineId: ID,
        relations?: RelationPaths<Order>,
    ): Promise<Order | undefined> {
        const order = await this.connection
            .getRepository(ctx, Order)
            .createQueryBuilder('order')
            .innerJoin('order.lines', 'line', 'line.id = :orderLineId', { orderLineId })
            .getOne();

        return order ? this.findOne(ctx, order.id, relations) : undefined;
    }

    async findByCustomerId(
        ctx: RequestContext,
        customerId: ID,
        options?: ListQueryOptions<Order>,
        relations?: RelationPaths<Order>,
    ): Promise<PaginatedList<Order>> {
        const effectiveRelations = (
            relations ?? ['lines', 'lines.items', 'customer', 'channels', 'shippingLines']
        ).filter(
            r =>
                // Don't join productVariant because it messes with the
                // price calculation in certain edge-case field resolver scenarios
                !r.includes('productVariant'),
        );
        return this.listQueryBuilder
            .build(Order, options, {
                relations: relations ?? ['lines', 'lines.items', 'customer', 'channels', 'shippingLines'],
                channelId: ctx.channelId,
                ctx,
            })
            .andWhere('order.customer.id = :customerId', { customerId })
            .getManyAndCount()
            .then(([items, totalItems]) => {
                return {
                    items,
                    totalItems,
                };
            });
    }

    /**
     * @description
     * Returns all {@link Payment} entities associated with the Order.
     */
    getOrderPayments(ctx: RequestContext, orderId: ID): Promise<Payment[]> {
        return this.connection.getRepository(ctx, Payment).find({
            relations: ['refunds'],
            where: {
                order: { id: orderId } as any,
            },
        });
    }

    /**
     * @description
     * Returns all OrderItems associated with the given {@link Refund}.
     */
    async getRefundOrderItems(ctx: RequestContext, refundId: ID): Promise<OrderItem[]> {
        const refund = await this.connection.getEntityOrThrow(ctx, Refund, refundId, {
            relations: ['orderItems'],
        });
        return refund.orderItems;
    }

    /**
     * @description
     * Returns an array of any {@link OrderModification} entities associated with the Order.
     */
    getOrderModifications(ctx: RequestContext, orderId: ID): Promise<OrderModification[]> {
        return this.connection.getRepository(ctx, OrderModification).find({
            where: {
                order: orderId,
            },
            relations: ['orderItems', 'payment', 'refund', 'surcharges'],
        });
    }

    /**
     * @description
     * Returns any {@link Refund}s associated with a {@link Payment}.
     */
    getPaymentRefunds(ctx: RequestContext, paymentId: ID): Promise<Refund[]> {
        return this.connection.getRepository(ctx, Refund).find({
            where: {
                paymentId,
            },
        });
    }

    /**
     * @description
     * Returns any Order associated with the specified User's Customer account
     * that is still in the `active` state.
     */
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
                .where('order.active = :active', { active: true })
                .andWhere('order.customer.id = :customerId', { customerId: customer.id })
                .orderBy('order.createdAt', 'DESC')
                .getOne();
            if (activeOrder) {
                return this.findOne(ctx, activeOrder.id);
            }
        }
    }

    /**
     * @description
     * Creates a new, empty Order. If a `userId` is passed, the Order will get associated with that
     * User's Customer account.
     */
    async create(ctx: RequestContext, userId?: ID): Promise<Order> {
        const newOrder = new Order({
            code: await this.configService.orderOptions.orderCodeStrategy.generate(ctx),
            state: this.orderStateMachine.getInitialState(),
            lines: [],
            surcharges: [],
            couponCodes: [],
            modifications: [],
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
        await this.channelService.assignToCurrentChannel(newOrder, ctx);
        const order = await this.connection.getRepository(ctx, Order).save(newOrder);
        this.eventBus.publish(new OrderEvent(ctx, order, 'created'));
        const transitionResult = await this.transitionToState(ctx, order.id, 'AddingItems');
        if (isGraphQlErrorResult(transitionResult)) {
            // this should never occur, so we will throw rather than return
            throw transitionResult;
        }
        return transitionResult;
    }

    /**
     * @description
     * Updates the custom fields of an Order.
     */
    async updateCustomFields(ctx: RequestContext, orderId: ID, customFields: any) {
        let order = await this.getOrderOrThrow(ctx, orderId);
        order = patchEntity(order, { customFields });
        await this.customFieldRelationService.updateRelations(ctx, Order, { customFields }, order);
        const updatedOrder = await this.connection.getRepository(ctx, Order).save(order);
        this.eventBus.publish(new OrderEvent(ctx, updatedOrder, 'updated'));
        return updatedOrder;
    }

    /**
     * @description
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
        const existingOrderLine = await this.orderModifier.getExistingOrderLine(
            ctx,
            order,
            productVariantId,
            customFields,
        );
        const validationError =
            this.assertQuantityIsPositive(quantity) ||
            this.assertAddingItemsState(order) ||
            this.assertNotOverOrderItemsLimit(order, quantity) ||
            this.assertNotOverOrderLineItemsLimit(existingOrderLine, quantity);
        if (validationError) {
            return validationError;
        }
        const variant = await this.connection.getEntityOrThrow(ctx, ProductVariant, productVariantId, {
            relations: ['product'],
            where: {
                enabled: true,
                deletedAt: null,
            },
        });
        if (variant.product.enabled === false) {
            throw new EntityNotFoundError('ProductVariant', productVariantId);
        }
        const correctedQuantity = await this.orderModifier.constrainQuantityToSaleable(
            ctx,
            variant,
            quantity,
            existingOrderLine?.quantity,
        );
        if (correctedQuantity === 0) {
            return new InsufficientStockError(correctedQuantity, order);
        }
        const orderLine = await this.orderModifier.getOrCreateOrderLine(
            ctx,
            order,
            productVariantId,
            customFields,
        );
        if (correctedQuantity < quantity) {
            const newQuantity = (existingOrderLine ? existingOrderLine?.quantity : 0) + correctedQuantity;
            await this.orderModifier.updateOrderLineQuantity(ctx, orderLine, newQuantity, order);
        } else {
            await this.orderModifier.updateOrderLineQuantity(ctx, orderLine, correctedQuantity, order);
        }
        const quantityWasAdjustedDown = correctedQuantity < quantity;
        const updatedOrder = await this.applyPriceAdjustments(ctx, order, [orderLine]);
        if (quantityWasAdjustedDown) {
            return new InsufficientStockError(correctedQuantity, updatedOrder);
        } else {
            return updatedOrder;
        }
    }

    /**
     * @description
     * Adjusts the quantity and/or custom field values of an existing OrderLine.
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
            this.assertNotOverOrderItemsLimit(order, quantity - orderLine.quantity) ||
            this.assertNotOverOrderLineItemsLimit(orderLine, quantity - orderLine.quantity);
        if (validationError) {
            return validationError;
        }
        if (customFields != null) {
            orderLine.customFields = customFields;
            await this.customFieldRelationService.updateRelations(
                ctx,
                OrderLine,
                { customFields },
                orderLine,
            );
        }
        const correctedQuantity = await this.orderModifier.constrainQuantityToSaleable(
            ctx,
            orderLine.productVariant,
            quantity,
        );
        let updatedOrderLines = [orderLine];
        if (correctedQuantity === 0) {
            order.lines = order.lines.filter(l => !idsAreEqual(l.id, orderLine.id));
            await this.connection.getRepository(ctx, OrderLine).remove(orderLine);
            this.eventBus.publish(new OrderLineEvent(ctx, order, orderLine, 'deleted'));
            updatedOrderLines = [];
        } else {
            await this.orderModifier.updateOrderLineQuantity(ctx, orderLine, correctedQuantity, order);
        }
        const quantityWasAdjustedDown = correctedQuantity < quantity;
        const updatedOrder = await this.applyPriceAdjustments(ctx, order, updatedOrderLines);
        if (quantityWasAdjustedDown) {
            return new InsufficientStockError(correctedQuantity, updatedOrder);
        } else {
            return updatedOrder;
        }
    }

    /**
     * @description
     * Removes the specified OrderLine from the Order.
     */
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
        this.eventBus.publish(new OrderLineEvent(ctx, order, orderLine, 'deleted'));
        return updatedOrder;
    }

    /**
     * @description
     * Removes all OrderLines from the Order.
     */
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

    /**
     * @description
     * Adds a {@link Surcharge} to the Order.
     */
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

    /**
     * @description
     * Removes a {@link Surcharge} from the Order.
     */
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

    /**
     * @description
     * Applies a coupon code to the Order, which should be a valid coupon code as specified in the configuration
     * of an active {@link Promotion}.
     */
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
        this.eventBus.publish(new CouponCodeEvent(ctx, couponCode, orderId, 'assigned'));
        return this.applyPriceAdjustments(ctx, order);
    }

    /**
     * @description
     * Removes a coupon code from the Order.
     */
    async removeCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (order.couponCodes.includes(couponCode)) {
            // When removing a couponCode which has triggered an Order-level discount
            // we need to make sure we persist the changes to the adjustments array of
            // any affected OrderItems.
            const affectedOrderItems = order.lines
                .reduce((items, l) => [...items, ...l.items], [] as OrderItem[])
                .filter(
                    i =>
                        i.adjustments.filter(a => a.type === AdjustmentType.DISTRIBUTED_ORDER_PROMOTION)
                            .length,
                );
            order.couponCodes = order.couponCodes.filter(cc => cc !== couponCode);
            await this.historyService.createHistoryEntryForOrder({
                ctx,
                orderId: order.id,
                type: HistoryEntryType.ORDER_COUPON_REMOVED,
                data: { couponCode },
            });
            this.eventBus.publish(new CouponCodeEvent(ctx, couponCode, orderId, 'removed'));
            const result = await this.applyPriceAdjustments(ctx, order);
            await this.connection.getRepository(ctx, OrderItem).save(affectedOrderItems);
            return result;
        } else {
            return order;
        }
    }

    /**
     * @description
     * Returns all {@link Promotion}s associated with an Order. A Promotion only gets associated with
     * and Order once the order has been placed (see {@link OrderPlacedStrategy}).
     */
    async getOrderPromotions(ctx: RequestContext, orderId: ID): Promise<Promotion[]> {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            channelId: ctx.channelId,
            relations: ['promotions'],
        });
        return order.promotions || [];
    }

    /**
     * @description
     * Returns the next possible states that the Order may transition to.
     */
    getNextOrderStates(order: Order): ReadonlyArray<OrderState> {
        return this.orderStateMachine.getNextStates(order);
    }

    /**
     * @description
     * Sets the shipping address for the Order.
     */
    async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        order.shippingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        await this.connection.getRepository(ctx, Order).save(order);
        // Since a changed ShippingAddress could alter the activeTaxZone,
        // we will remove any cached activeTaxZone so it can be re-calculated
        // as needed.
        this.requestCache.set(ctx, 'activeTaxZone', undefined);
        return this.applyPriceAdjustments(ctx, order, order.lines);
    }

    /**
     * @description
     * Sets the billing address for the Order.
     */
    async setBillingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput): Promise<Order> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        const country = await this.countryService.findOneByCode(ctx, input.countryCode);
        order.billingAddress = { ...input, countryCode: input.countryCode, country: country.name };
        await this.connection.getRepository(ctx, Order).save(order);
        // Since a changed ShippingAddress could alter the activeTaxZone,
        // we will remove any cached activeTaxZone so it can be re-calculated
        // as needed.
        this.requestCache.set(ctx, 'activeTaxZone', undefined);
        return this.applyPriceAdjustments(ctx, order, order.lines);
    }

    /**
     * @description
     * Returns an array of quotes stating which {@link ShippingMethod}s may be applied to this Order.
     * This is determined by the configured {@link ShippingEligibilityChecker} of each ShippingMethod.
     *
     * The quote also includes a price for each method, as determined by the configured
     * {@link ShippingCalculator} of each eligible ShippingMethod.
     */
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
                code: eligible.method.code,
                metadata,
                customFields: eligible.method.customFields,
            };
        });
    }

    /**
     * @description
     * Returns an array of quotes stating which {@link PaymentMethod}s may be used on this Order.
     */
    async getEligiblePaymentMethods(ctx: RequestContext, orderId: ID): Promise<PaymentMethodQuote[]> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        return this.paymentMethodService.getEligiblePaymentMethods(ctx, order);
    }

    /**
     * @description
     * Sets the ShippingMethod to be used on this Order.
     */
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

    /**
     * @description
     * Transitions the Order to the given state.
     */
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

    /**
     * @description
     * Transitions a Fulfillment to the given state and then transitions the Order state based on
     * whether all Fulfillments of the Order are shipped or delivered.
     */
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
        if (toState === 'Cancelled') {
            await this.stockMovementService.createCancellationsForOrderItems(ctx, fulfillment.orderItems);
            const lines = await this.groupOrderItemsIntoLines(ctx, fulfillment.orderItems);
            await this.stockMovementService.createAllocationsForOrderLines(ctx, lines);
        }
        await Promise.all(
            orders.map(order => this.handleFulfillmentStateTransitByOrder(ctx, order, fromState, toState)),
        );
        return fulfillment;
    }

    /**
     * @description
     * Allows the Order to be modified, which allows several aspects of the Order to be changed:
     *
     * * Changes to OrderLine quantities
     * * New OrderLines being added
     * * Arbitrary {@link Surcharge}s being added
     * * Shipping or billing address changes
     *
     * Setting the `dryRun` input property to `true` will apply all changes, including updating the price of the
     * Order, except history entry and additional payment actions.
     *
     * __Using dryRun option, you must wrap function call in transaction manually.__
     *
     */
    async modifyOrder(
        ctx: RequestContext,
        input: ModifyOrderInput,
    ): Promise<ErrorResultUnion<ModifyOrderResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, input.orderId);
        const result = await this.orderModifier.modifyOrder(ctx, input, order);

        if (isGraphQlErrorResult(result)) {
            return result;
        }

        if (input.dryRun) {
            return result.order;
        }

        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: input.orderId,
            type: HistoryEntryType.ORDER_MODIFIED,
            data: {
                modificationId: result.modification.id,
            },
        });
        return this.getOrderOrThrow(ctx, input.orderId);
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
     * @description
     * Transitions the given {@link Payment} to a new state. If the order totalWithTax price is then
     * covered by Payments, the Order state will be automatically transitioned to `PaymentSettled`
     * or `PaymentAuthorized`.
     */
    async transitionPaymentToState(
        ctx: RequestContext,
        paymentId: ID,
        state: PaymentState,
    ): Promise<ErrorResultUnion<TransitionPaymentToStateResult, Payment>> {
        const result = await this.paymentService.transitionToState(ctx, paymentId, state);
        if (isGraphQlErrorResult(result)) {
            return result;
        }
        const order = await this.findOne(ctx, result.order.id);
        if (order) {
            order.payments = await this.getOrderPayments(ctx, order.id);
            await this.transitionOrderIfTotalIsCovered(ctx, order);
        }
        return result;
    }

    /**
     * @description
     * Adds a new Payment to the Order. If the Order totalWithTax is covered by Payments, then the Order
     * state will get automatically transitioned to the `PaymentSettled` or `PaymentAuthorized` state.
     */
    async addPaymentToOrder(
        ctx: RequestContext,
        orderId: ID,
        input: PaymentInput,
    ): Promise<ErrorResultUnion<AddPaymentToOrderResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, orderId);
        if (!this.canAddPaymentToOrder(order)) {
            return new OrderPaymentStateError();
        }
        order.payments = await this.getOrderPayments(ctx, order.id);
        const amountToPay = order.totalWithTax - totalCoveredByPayments(order);
        const payment = await this.paymentService.createPayment(
            ctx,
            order,
            amountToPay,
            input.method,
            input.metadata,
        );

        if (isGraphQlErrorResult(payment)) {
            return payment;
        }

        const existingPayments = await this.getOrderPayments(ctx, orderId);
        order.payments = [...existingPayments, payment];
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });

        if (payment.state === 'Error') {
            return new PaymentFailedError(payment.errorMessage || '');
        }
        if (payment.state === 'Declined') {
            return new PaymentDeclinedError(payment.errorMessage || '');
        }

        return this.transitionOrderIfTotalIsCovered(ctx, order);
    }

    /**
     * @description
     * We can add a Payment to the order if:
     * 1. the Order is in the `ArrangingPayment` state or
     * 2. the Order's current state can transition to `PaymentAuthorized` and `PaymentSettled`
     */
    private canAddPaymentToOrder(order: Order): boolean {
        if (order.state === 'ArrangingPayment') {
            return true;
        }
        const canTransitionToPaymentAuthorized = this.orderStateMachine.canTransition(
            order.state,
            'PaymentAuthorized',
        );
        const canTransitionToPaymentSettled = this.orderStateMachine.canTransition(
            order.state,
            'PaymentSettled',
        );
        return canTransitionToPaymentAuthorized && canTransitionToPaymentSettled;
    }

    private async transitionOrderIfTotalIsCovered(
        ctx: RequestContext,
        order: Order,
    ): Promise<Order | OrderStateTransitionError> {
        const orderId = order.id;
        if (orderTotalIsCovered(order, 'Settled') && order.state !== 'PaymentSettled') {
            return this.transitionToState(ctx, orderId, 'PaymentSettled');
        }
        if (orderTotalIsCovered(order, ['Authorized', 'Settled']) && order.state !== 'PaymentAuthorized') {
            return this.transitionToState(ctx, orderId, 'PaymentAuthorized');
        }
        return order;
    }

    /**
     * @description
     * This method is used after modifying an existing completed order using the `modifyOrder()` method. If the modifications
     * cause the order total to increase (such as when adding a new OrderLine), then there will be an outstanding charge to
     * pay.
     *
     * This method allows you to add a new Payment and assumes the actual processing has been done manually, e.g. in the
     * dashboard of your payment provider.
     */
    async addManualPaymentToOrder(
        ctx: RequestContext,
        input: ManualPaymentInput,
    ): Promise<ErrorResultUnion<AddManualPaymentToOrderResult, Order>> {
        const order = await this.getOrderOrThrow(ctx, input.orderId);
        if (order.state !== 'ArrangingAdditionalPayment' && order.state !== 'ArrangingPayment') {
            return new ManualPaymentStateError();
        }
        const existingPayments = await this.getOrderPayments(ctx, order.id);
        order.payments = existingPayments;
        const amount = order.totalWithTax - totalCoveredByPayments(order);
        const modifications = await this.getOrderModifications(ctx, order.id);
        const unsettledModifications = modifications.filter(m => !m.isSettled);
        if (0 < unsettledModifications.length) {
            const outstandingModificationsTotal = summate(unsettledModifications, 'priceChange');
            if (outstandingModificationsTotal !== amount) {
                throw new InternalServerError(
                    `The outstanding order amount (${amount}) should equal the unsettled OrderModifications total (${outstandingModificationsTotal})`,
                );
            }
        }

        const payment = await this.paymentService.createManualPayment(ctx, order, amount, input);
        order.payments.push(payment);
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        for (const modification of unsettledModifications) {
            modification.payment = payment;
            await this.connection.getRepository(ctx, OrderModification).save(modification);
        }
        return order;
    }

    /**
     * @description
     * Settles a payment by invoking the {@link PaymentMethodHandler}'s `settlePayment()` method. Automatically
     * transitions the Order state if all Payments are settled.
     */
    async settlePayment(
        ctx: RequestContext,
        paymentId: ID,
    ): Promise<ErrorResultUnion<SettlePaymentResult, Payment>> {
        const payment = await this.paymentService.settlePayment(ctx, paymentId);
        if (!isGraphQlErrorResult(payment)) {
            if (payment.state !== 'Settled') {
                return new SettlePaymentError(payment.errorMessage || '');
            }
            const order = await this.findOne(ctx, payment.order.id);
            if (order) {
                order.payments = await this.getOrderPayments(ctx, order.id);
                const orderTransitionResult = await this.transitionOrderIfTotalIsCovered(ctx, order);
                if (isGraphQlErrorResult(orderTransitionResult)) {
                    return orderTransitionResult;
                }
            }
        }
        return payment;
    }

    /**
     * @description
     * Creates a new Fulfillment associated with the given Order and OrderItems.
     */
    async createFulfillment(
        ctx: RequestContext,
        input: FulfillOrderInput,
    ): Promise<ErrorResultUnion<AddFulfillmentToOrderResult, Fulfillment>> {
        if (!input.lines || input.lines.length === 0 || summate(input.lines, 'quantity') === 0) {
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
                const productVariant = this.translator.translate(line.productVariant, ctx);
                return new InsufficientStockOnHandError(
                    productVariant.id as string,
                    productVariant.name,
                    productVariant.stockOnHand,
                );
            }
        }
    }

    /**
     * @description
     * Returns an array of all Fulfillments associated with the Order.
     */
    async getOrderFulfillments(ctx: RequestContext, order: Order): Promise<Fulfillment[]> {
        let lines: OrderLine[];
        if (order.lines?.[0]?.items?.[0]?.fulfillments !== undefined) {
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
        const fulfillments = items.reduce(
            (acc, i) => [...acc, ...(i.fulfillments || [])],
            [] as Fulfillment[],
        );
        return unique(fulfillments, 'id');
    }

    /**
     * @description
     * Returns an array of all Surcharges associated with the Order.
     */
    async getOrderSurcharges(ctx: RequestContext, orderId: ID): Promise<Surcharge[]> {
        const order = await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            channelId: ctx.channelId,
            relations: ['surcharges'],
        });
        return order.surcharges || [];
    }

    /**
     * @description
     * Cancels an Order by transitioning it to the `Cancelled` state. If stock is being tracked for the ProductVariants
     * in the Order, then new {@link StockMovement}s will be created to correct the stock levels.
     */
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
        if (order.active) {
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
        if (order.active) {
            return new CancelActiveOrderError(order.state);
        }
        const fullOrder = await this.findOne(ctx, order.id);

        const soldItems = items.filter(i => !!i.fulfillment);
        const allocatedItems = await this.getAllocatedItems(ctx, items);
        await this.stockMovementService.createCancellationsForOrderItems(ctx, soldItems);
        await this.stockMovementService.createReleasesForOrderItems(ctx, allocatedItems);
        items.forEach(i => (i.cancelled = true));
        await this.connection.getRepository(ctx, OrderItem).save(items, { reload: false });

        const orderWithItems = await this.connection.getEntityOrThrow(ctx, Order, order.id, {
            relations: ['lines', 'lines.items', 'surcharges', 'shippingLines'],
        });
        if (input.cancelShipping === true) {
            for (const shippingLine of orderWithItems.shippingLines) {
                shippingLine.adjustments.push({
                    adjustmentSource: 'CANCEL_ORDER',
                    type: AdjustmentType.OTHER,
                    description: 'shipping cancellation',
                    amount: -shippingLine.discountedPriceWithTax,
                });
                this.connection.getRepository(ctx, ShippingLine).save(shippingLine, { reload: false });
            }
        }
        // Update totals after cancellation
        this.orderCalculator.calculateOrderTotals(orderWithItems);
        await this.connection.getRepository(ctx, Order).save(orderWithItems, { reload: false });

        await this.historyService.createHistoryEntryForOrder({
            ctx,
            orderId: order.id,
            type: HistoryEntryType.ORDER_CANCELLATION,
            data: {
                orderItemIds: items.map(i => i.id),
                reason: input.reason || undefined,
                shippingCancelled: !!input.cancelShipping,
            },
        });

        return orderItemsAreAllCancelled(orderWithItems);
    }

    private async getAllocatedItems(ctx: RequestContext, items: OrderItem[]): Promise<OrderItem[]> {
        const allocatedItems: OrderItem[] = [];
        const allocationMap = new Map<ID, Allocation | false>();
        for (const item of items) {
            let allocation = allocationMap.get(item.lineId);
            if (!allocation) {
                allocation = await this.connection
                    .getRepository(ctx, Allocation)
                    .createQueryBuilder('allocation')
                    .where('allocation.orderLine = :lineId', { lineId: item.lineId })
                    .getOne();
                allocationMap.set(item.lineId, allocation || false);
            }
            if (allocation && !item.fulfillment) {
                allocatedItems.push(item);
            }
        }
        return allocatedItems;
    }

    /**
     * @description
     * Creates a {@link Refund} against the order and in doing so invokes the `createRefund()` method of the
     * {@link PaymentMethodHandler}.
     */
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
        const ordersAndItems = await this.getOrdersAndItemsFromLines(
            ctx,
            input.lines,
            i => i.refund?.state !== 'Settled',
        );
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
        const alreadyRefunded = items.find(
            i => i.refund?.state === 'Pending' || i.refund?.state === 'Settled',
        );
        if (alreadyRefunded) {
            return new AlreadyRefundedError(alreadyRefunded.refundId as string);
        }

        return await this.paymentService.createRefund(ctx, input, order, items, payment);
    }

    /**
     * @description
     * Settles a Refund by transitioning it to the `Settled` state.
     */
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

    /**
     * @description
     * Associates a Customer with the Order.
     */
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

    /**
     * @description
     * Creates a new "ORDER_NOTE" type {@link OrderHistoryEntry} in the Order's history timeline.
     */
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
     * @description
     * Deletes an Order, ensuring that any Sessions that reference this Order are dereferenced before deletion.
     *
     * @since 1.5.0
     */
    async deleteOrder(ctx: RequestContext, orderOrId: ID | Order) {
        const orderToDelete =
            orderOrId instanceof Order
                ? orderOrId
                : await this.connection
                      .getRepository(ctx, Order)
                      .findOneOrFail(orderOrId, { relations: ['lines'] });
        // If there is a Session referencing the Order to be deleted, we must first remove that
        // reference in order to avoid a foreign key error. See https://github.com/vendure-ecommerce/vendure/issues/1454
        const sessions = await this.connection
            .getRepository(ctx, Session)
            .find({ where: { activeOrderId: orderToDelete.id } });
        if (sessions.length) {
            await this.connection
                .getRepository(ctx, Session)
                .update(sessions.map(s => s.id) as string[], { activeOrder: null });
        }

        // TODO: v2 - Will not be needed after adding `{ onDelete: 'CASCADE' }` constraint to ShippingLine.order
        for (const shippingLine of orderToDelete.shippingLines) {
            await this.connection.getRepository(ctx, ShippingLine).delete(shippingLine.id);
        }
        await this.connection.getRepository(ctx, Order).delete(orderToDelete.id);
    }

    /**
     * @description
     * When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
     * we need to reconcile the contents of the two orders.
     *
     * The logic used to do the merging is specified in the {@link OrderOptions} `mergeStrategy` config setting.
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
        const { orderToDelete, linesToInsert, linesToDelete, linesToModify } = mergeResult;
        let { order } = mergeResult;
        if (orderToDelete) {
            await this.deleteOrder(ctx, orderToDelete);
        }
        if (order && linesToInsert) {
            const orderId = order.id;
            for (const line of linesToInsert) {
                const result = await this.addItemToOrder(
                    ctx,
                    orderId,
                    line.productVariantId,
                    line.quantity,
                    line.customFields,
                );
                if (!isGraphQlErrorResult(result)) {
                    order = result;
                }
            }
        }
        if (order && linesToModify) {
            const orderId = order.id;
            for (const line of linesToModify) {
                const result = await this.adjustOrderLine(
                    ctx,
                    orderId,
                    line.orderLineId,
                    line.quantity,
                    line.customFields,
                );
                if (!isGraphQlErrorResult(result)) {
                    order = result;
                }
            }
        }
        if (order && linesToDelete) {
            const orderId = order.id;
            for (const line of linesToDelete) {
                const result = await this.removeItemFromOrder(ctx, orderId, line.orderLineId);
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

    private getOrderLineOrThrow(order: Order, orderLineId: ID): OrderLine {
        const orderLine = order.lines.find(line => idsAreEqual(line.id, orderLineId));
        if (!orderLine) {
            throw new UserInputError(`error.order-does-not-contain-line-with-id`, { id: orderLineId });
        }
        return orderLine;
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
        const currentItemsCount = summate(order.lines, 'quantity');
        const { orderItemsLimit } = this.configService.orderOptions;
        if (orderItemsLimit < currentItemsCount + quantityToAdd) {
            return new OrderLimitError(orderItemsLimit);
        }
    }

    /**
     * Throws if adding the given quantity would exceed the maximum allowed
     * quantity for one order line.
     */
    private assertNotOverOrderLineItemsLimit(orderLine: OrderLine | undefined, quantityToAdd: number) {
        const currentQuantity = orderLine?.quantity || 0;
        const { orderLineItemsLimit } = this.configService.orderOptions;
        if (orderLineItemsLimit < currentQuantity + quantityToAdd) {
            return new OrderLimitError(orderLineItemsLimit);
        }
    }

    /**
     * @description
     * Applies promotions, taxes and shipping to the Order. If the `updatedOrderLines` argument is passed in,
     * then all of those OrderLines will have their prices re-calculated using the configured {@link OrderItemPriceCalculationStrategy}.
     */
    async applyPriceAdjustments(
        ctx: RequestContext,
        order: Order,
        updatedOrderLines?: OrderLine[],
    ): Promise<Order> {
        if (updatedOrderLines?.length) {
            const { orderItemPriceCalculationStrategy, changedPriceHandlingStrategy } =
                this.configService.orderOptions;
            for (const updatedOrderLine of updatedOrderLines) {
                const variant = await this.productVariantService.applyChannelPriceAndTax(
                    updatedOrderLine.productVariant,
                    ctx,
                    order,
                );
                let priceResult = await orderItemPriceCalculationStrategy.calculateUnitPrice(
                    ctx,
                    variant,
                    updatedOrderLine.customFields || {},
                );
                const initialListPrice =
                    updatedOrderLine.items.find(i => i.initialListPrice != null)?.initialListPrice ??
                    priceResult.price;
                if (initialListPrice !== priceResult.price) {
                    priceResult = await changedPriceHandlingStrategy.handlePriceChange(
                        ctx,
                        priceResult,
                        updatedOrderLine.items,
                    );
                }
                for (const item of updatedOrderLine.items) {
                    if (item.initialListPrice == null) {
                        item.initialListPrice = initialListPrice;
                    }
                    item.listPrice = priceResult.price;
                    item.listPriceIncludesTax = priceResult.priceIncludesTax;
                }
            }
        }

        const promotions = await this.connection
            .getRepository(ctx, Promotion)
            .createQueryBuilder('promotion')
            .leftJoin('promotion.channels', 'channel')
            .where('channel.id = :channelId', { channelId: ctx.channelId })
            .andWhere('promotion.deletedAt IS NULL')
            .andWhere('promotion.enabled = :enabled', { enabled: true })
            .orderBy('promotion.priorityScore', 'ASC')
            .getMany();

        const updatedItems = await this.orderCalculator.applyPriceAdjustments(
            ctx,
            order,
            promotions,
            updatedOrderLines ?? [],
        );
        const updateFields: Array<keyof OrderItem> = [
            'initialListPrice',
            'listPrice',
            'listPriceIncludesTax',
            'adjustments',
            'taxLines',
        ];
        await this.connection
            .getRepository(ctx, OrderItem)
            .createQueryBuilder()
            .insert()
            .into(OrderItem, [...updateFields, 'id', 'lineId'])
            .values(updatedItems)
            .orUpdate({
                conflict_target: ['id'],
                overwrite: updateFields,
            })
            .updateEntity(false)
            .execute();
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        await this.connection.getRepository(ctx, ShippingLine).save(order.shippingLines, { reload: false });
        return order;
    }

    private async getOrderWithFulfillments(ctx: RequestContext, orderId: ID): Promise<Order> {
        return await this.connection.getEntityOrThrow(ctx, Order, orderId, {
            relations: ['lines', 'lines.items', 'lines.items.fulfillments'],
        });
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
                relations: ['order', 'items', 'items.fulfillments', 'order.channels', 'items.refund'],
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
            matchingItems
                .slice(0)
                .sort((a, b) =>
                    // sort the OrderItems so that those without Fulfillments come first, as
                    // it makes sense to cancel these prior to cancelling fulfilled items.
                    !a.fulfillment && b.fulfillment ? -1 : a.fulfillment && !b.fulfillment ? 1 : 0,
                )
                .slice(0, inputLine.quantity)
                .forEach(item => {
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

    private async groupOrderItemsIntoLines(
        ctx: RequestContext,
        orderItems: OrderItem[],
    ): Promise<Array<{ orderLine: OrderLine; quantity: number }>> {
        const orderLineIdQuantityMap = new Map<ID, number>();
        for (const item of orderItems) {
            const quantity = orderLineIdQuantityMap.get(item.lineId);
            if (quantity == null) {
                orderLineIdQuantityMap.set(item.lineId, 1);
            } else {
                orderLineIdQuantityMap.set(item.lineId, quantity + 1);
            }
        }
        const orderLines = await this.connection
            .getRepository(ctx, OrderLine)
            .findByIds([...orderLineIdQuantityMap.keys()], {
                relations: ['productVariant'],
            });
        return orderLines.map(orderLine => ({
            orderLine,
            // tslint:disable-next-line:no-non-null-assertion
            quantity: orderLineIdQuantityMap.get(orderLine.id)!,
        }));
    }
}
