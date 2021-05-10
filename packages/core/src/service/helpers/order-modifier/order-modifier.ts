import { Injectable } from '@nestjs/common';
import { ModifyOrderInput, ModifyOrderResult, RefundOrderInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
import { isGraphQlErrorResult, JustErrorResults } from '../../../common/error/error-result';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../../common/error/errors';
import {
    NoChangesSpecifiedError,
    OrderModificationStateError,
    RefundPaymentIdMissingError,
} from '../../../common/error/generated-graphql-admin-errors';
import {
    InsufficientStockError,
    NegativeQuantityError,
    OrderLimitError,
} from '../../../common/error/generated-graphql-shop-errors';
import { idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { OrderModification } from '../../../entity/order-modification/order-modification.entity';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Promotion } from '../../../entity/promotion/promotion.entity';
import { ShippingLine } from '../../../entity/shipping-line/shipping-line.entity';
import { Surcharge } from '../../../entity/surcharge/surcharge.entity';
import { CountryService } from '../../services/country.service';
import { PaymentService } from '../../services/payment.service';
import { ProductVariantService } from '../../services/product-variant.service';
import { StockMovementService } from '../../services/stock-movement.service';
import { TransactionalConnection } from '../../transaction/transactional-connection';
import { CustomFieldRelationService } from '../custom-field-relation/custom-field-relation.service';
import { OrderCalculator } from '../order-calculator/order-calculator';
import { patchEntity } from '../utils/patch-entity';
import { translateDeep } from '../utils/translate-entity';

/**
 * @description
 * This helper is responsible for modifying the contents of an Order.
 *
 * Note:
 * There is not a clear separation of concerns between the OrderService and this, since
 * the OrderService also contains some method which modify the Order (e.g. removeItemFromOrder).
 * So this helper was mainly extracted to isolate the huge `modifyOrder` method since the
 * OrderService was just growing too large. Future refactoring could improve the organization
 * of these Order-related methods into a more clearly-delineated set of classes.
 */
@Injectable()
export class OrderModifier {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private orderCalculator: OrderCalculator,
        private paymentService: PaymentService,
        private countryService: CountryService,
        private stockMovementService: StockMovementService,
        private productVariantService: ProductVariantService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    /**
     * Ensure that the ProductVariant has sufficient saleable stock to add the given
     * quantity to an Order.
     */
    async constrainQuantityToSaleable(
        ctx: RequestContext,
        variant: ProductVariant,
        quantity: number,
        existingQuantity = 0,
    ) {
        let correctedQuantity = quantity + existingQuantity;
        const saleableStockLevel = await this.productVariantService.getSaleableStockLevel(ctx, variant);
        if (saleableStockLevel < correctedQuantity) {
            correctedQuantity = Math.max(saleableStockLevel - existingQuantity, 0);
        }
        return correctedQuantity;
    }

    async getExistingOrderLine(
        ctx: RequestContext,
        order: Order,
        productVariantId: ID,
        customFields?: { [key: string]: any },
    ): Promise<OrderLine | undefined> {
        for (const line of order.lines) {
            const match =
                idsAreEqual(line.productVariant.id, productVariantId) &&
                (await this.customFieldsAreEqual(ctx, line, customFields, line.customFields));
            if (match) {
                return line;
            }
        }
    }

    /**
     * Returns the OrderLine to which a new OrderItem belongs, creating a new OrderLine
     * if no existing line is found.
     */
    async getOrCreateOrderLine(
        ctx: RequestContext,
        order: Order,
        productVariantId: ID,
        customFields?: { [key: string]: any },
    ) {
        const existingOrderLine = await this.getExistingOrderLine(ctx, order, productVariantId, customFields);
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
        await this.customFieldRelationService.updateRelations(ctx, OrderLine, { customFields }, orderLine);
        const lineWithRelations = await this.connection.getEntityOrThrow(ctx, OrderLine, orderLine.id, {
            relations: [
                'items',
                'taxCategory',
                'productVariant',
                'productVariant.productVariantPrices',
                'productVariant.taxCategory',
            ],
        });
        lineWithRelations.productVariant = translateDeep(
            await this.productVariantService.applyChannelPriceAndTax(lineWithRelations.productVariant, ctx),
            ctx.languageCode,
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
    async updateOrderLineQuantity(
        ctx: RequestContext,
        orderLine: OrderLine,
        quantity: number,
        order: Order,
    ): Promise<OrderLine> {
        const currentQuantity = orderLine.quantity;

        if (currentQuantity < quantity) {
            if (!orderLine.items) {
                orderLine.items = [];
            }
            const newOrderItems = [];
            for (let i = currentQuantity; i < quantity; i++) {
                newOrderItems.push(
                    new OrderItem({
                        listPrice: orderLine.productVariant.price,
                        listPriceIncludesTax: orderLine.productVariant.listPriceIncludesTax,
                        adjustments: [],
                        taxLines: [],
                        lineId: orderLine.id,
                    }),
                );
            }
            const { identifiers } = await this.connection
                .getRepository(ctx, OrderItem)
                .createQueryBuilder()
                .insert()
                .into(OrderItem)
                .values(newOrderItems)
                .execute();
            newOrderItems.forEach((item, i) => (item.id = identifiers[i].id));
            orderLine.items = await this.connection
                .getRepository(ctx, OrderItem)
                .find({ where: { line: orderLine } });
        } else if (quantity < currentQuantity) {
            if (order.active) {
                // When an Order is still active, it is fine to just delete
                // any OrderItems that are no longer needed
                const keepItems = orderLine.items.slice(0, quantity);
                const removeItems = orderLine.items.slice(quantity);
                orderLine.items = keepItems;
                await this.connection
                    .getRepository(ctx, OrderItem)
                    .createQueryBuilder()
                    .delete()
                    .whereInIds(removeItems.map(i => i.id))
                    .execute();
            } else {
                // When an Order is not active (i.e. Customer checked out), then we don't want to just
                // delete the OrderItems - instead we will cancel them
                const toSetAsCancelled = orderLine.items.filter(i => !i.cancelled).slice(quantity);
                const soldItems = toSetAsCancelled.filter(i => !!i.fulfillment);
                const allocatedItems = toSetAsCancelled.filter(i => !i.fulfillment);
                await this.stockMovementService.createCancellationsForOrderItems(ctx, soldItems);
                await this.stockMovementService.createReleasesForOrderItems(ctx, allocatedItems);
                toSetAsCancelled.forEach(i => (i.cancelled = true));
                await this.connection.getRepository(ctx, OrderItem).save(toSetAsCancelled, { reload: false });
            }
        }
        await this.connection.getRepository(ctx, OrderLine).save(orderLine);
        return orderLine;
    }

    async modifyOrder(
        ctx: RequestContext,
        input: ModifyOrderInput,
        order: Order,
    ): Promise<JustErrorResults<ModifyOrderResult> | { order: Order; modification: OrderModification }> {
        const { dryRun } = input;
        const modification = new OrderModification({
            order,
            note: input.note || '',
            orderItems: [],
            surcharges: [],
        });
        const initialTotalWithTax = order.totalWithTax;
        if (order.state !== 'Modifying') {
            return new OrderModificationStateError();
        }
        if (this.noChangesSpecified(input)) {
            return new NoChangesSpecifiedError();
        }
        const { orderItemsLimit } = this.configService.orderOptions;
        let currentItemsCount = summate(order.lines, 'quantity');
        const updatedOrderLineIds: ID[] = [];
        const refundInput: RefundOrderInput & { orderItems: OrderItem[] } = {
            lines: [],
            adjustment: 0,
            shipping: 0,
            paymentId: input.refund?.paymentId || '',
            reason: input.refund?.reason || input.note,
            orderItems: [],
        };

        for (const row of input.addItems ?? []) {
            const { productVariantId, quantity } = row;
            if (quantity < 0) {
                return new NegativeQuantityError();
            }

            const customFields = (row as any).customFields || {};
            const orderLine = await this.getOrCreateOrderLine(ctx, order, productVariantId, customFields);
            const correctedQuantity = await this.constrainQuantityToSaleable(
                ctx,
                orderLine.productVariant,
                quantity,
            );
            if (orderItemsLimit < currentItemsCount + correctedQuantity) {
                return new OrderLimitError(orderItemsLimit);
            } else {
                currentItemsCount += correctedQuantity;
            }
            if (correctedQuantity < quantity) {
                return new InsufficientStockError(correctedQuantity, order);
            }
            updatedOrderLineIds.push(orderLine.id);
            const initialQuantity = orderLine.quantity;
            await this.updateOrderLineQuantity(ctx, orderLine, initialQuantity + correctedQuantity, order);
            modification.orderItems.push(...orderLine.items.slice(initialQuantity));
        }

        for (const row of input.adjustOrderLines ?? []) {
            const { orderLineId, quantity } = row;
            if (quantity < 0) {
                return new NegativeQuantityError();
            }
            const orderLine = order.lines.find(line => idsAreEqual(line.id, orderLineId));
            if (!orderLine) {
                throw new UserInputError(`error.order-does-not-contain-line-with-id`, { id: orderLineId });
            }
            const initialLineQuantity = orderLine.quantity;
            let correctedQuantity = quantity;
            if (initialLineQuantity < quantity) {
                const additionalQuantity = await this.constrainQuantityToSaleable(
                    ctx,
                    orderLine.productVariant,
                    quantity - initialLineQuantity,
                );
                correctedQuantity = initialLineQuantity + additionalQuantity;
            }
            const resultingOrderTotalQuantity = currentItemsCount + correctedQuantity - orderLine.quantity;
            if (orderItemsLimit < resultingOrderTotalQuantity) {
                return new OrderLimitError(orderItemsLimit);
            } else {
                currentItemsCount += correctedQuantity;
            }
            if (correctedQuantity < quantity) {
                return new InsufficientStockError(correctedQuantity, order);
            } else {
                const customFields = (row as any).customFields;
                if (customFields) {
                    patchEntity(orderLine, { customFields });
                }
                await this.updateOrderLineQuantity(ctx, orderLine, quantity, order);
                if (correctedQuantity < initialLineQuantity) {
                    const qtyDelta = initialLineQuantity - correctedQuantity;
                    refundInput.lines.push({
                        orderLineId: orderLine.id,
                        quantity,
                    });
                    const cancelledOrderItems = orderLine.items.filter(i => i.cancelled).slice(0, qtyDelta);
                    refundInput.orderItems.push(...cancelledOrderItems);
                    modification.orderItems.push(...cancelledOrderItems);
                } else {
                    const addedOrderItems = orderLine.items
                        .filter(i => !i.cancelled)
                        .slice(initialLineQuantity);
                    modification.orderItems.push(...addedOrderItems);
                }
            }
            updatedOrderLineIds.push(orderLine.id);
        }

        for (const surchargeInput of input.surcharges ?? []) {
            const taxLines =
                surchargeInput.taxRate != null
                    ? [
                          {
                              taxRate: surchargeInput.taxRate,
                              description: surchargeInput.taxDescription || '',
                          },
                      ]
                    : [];
            const surcharge = await this.connection.getRepository(ctx, Surcharge).save(
                new Surcharge({
                    sku: surchargeInput.sku || '',
                    description: surchargeInput.description,
                    listPrice: surchargeInput.price,
                    listPriceIncludesTax: surchargeInput.priceIncludesTax,
                    taxLines,
                    order,
                }),
            );
            order.surcharges.push(surcharge);
            modification.surcharges.push(surcharge);
            if (surcharge.priceWithTax < 0) {
                refundInput.adjustment += Math.abs(surcharge.priceWithTax);
            }
        }
        if (input.surcharges?.length) {
            await this.connection.getRepository(ctx, Order).save(order, { reload: false });
        }

        if (input.updateShippingAddress) {
            order.shippingAddress = {
                ...order.shippingAddress,
                ...input.updateShippingAddress,
            };
            if (input.updateShippingAddress.countryCode) {
                const country = await this.countryService.findOneByCode(
                    ctx,
                    input.updateShippingAddress.countryCode,
                );
                order.shippingAddress.country = country.name;
            }
            await this.connection.getRepository(ctx, Order).save(order, { reload: false });
            modification.shippingAddressChange = input.updateShippingAddress;
        }

        if (input.updateBillingAddress) {
            order.billingAddress = {
                ...order.billingAddress,
                ...input.updateBillingAddress,
            };
            if (input.updateBillingAddress.countryCode) {
                const country = await this.countryService.findOneByCode(
                    ctx,
                    input.updateBillingAddress.countryCode,
                );
                order.billingAddress.country = country.name;
            }
            await this.connection.getRepository(ctx, Order).save(order, { reload: false });
            modification.billingAddressChange = input.updateBillingAddress;
        }

        const updatedOrderLines = order.lines.filter(l => updatedOrderLineIds.includes(l.id));
        const promotions = await this.connection.getRepository(ctx, Promotion).find({
            where: { enabled: true, deletedAt: null },
            order: { priorityScore: 'ASC' },
        });
        await this.orderCalculator.applyPriceAdjustments(ctx, order, promotions, updatedOrderLines, {
            recalculateShipping: input.options?.recalculateShipping,
        });

        const orderCustomFields = (input as any).customFields;
        if (orderCustomFields) {
            patchEntity(order, { customFields: orderCustomFields });
        }

        if (dryRun) {
            return { order, modification };
        }

        // Create the actual modification and commit all changes
        const newTotalWithTax = order.totalWithTax;
        const delta = newTotalWithTax - initialTotalWithTax;
        if (delta < 0) {
            if (!input.refund) {
                return new RefundPaymentIdMissingError();
            }
            const existingPayments = await this.getOrderPayments(ctx, order.id);
            const payment = existingPayments.find(p => idsAreEqual(p.id, input.refund?.paymentId));
            if (payment) {
                const refund = await this.paymentService.createRefund(
                    ctx,
                    refundInput,
                    order,
                    refundInput.orderItems,
                    payment,
                );
                if (!isGraphQlErrorResult(refund)) {
                    modification.refund = refund;
                } else {
                    throw new InternalServerError(refund.message);
                }
            }
        }

        modification.priceChange = delta;
        const createdModification = await this.connection
            .getRepository(ctx, OrderModification)
            .save(modification);
        await this.connection.getRepository(ctx, Order).save(order);
        await this.connection.getRepository(ctx, OrderItem).save(modification.orderItems, { reload: false });
        await this.connection.getRepository(ctx, ShippingLine).save(order.shippingLines, { reload: false });
        return { order, modification: createdModification };
    }

    private noChangesSpecified(input: ModifyOrderInput): boolean {
        const noChanges =
            !input.adjustOrderLines?.length &&
            !input.addItems?.length &&
            !input.surcharges?.length &&
            !input.updateShippingAddress &&
            !input.updateBillingAddress &&
            !(input as any).customFields;
        return noChanges;
    }

    private getOrderPayments(ctx: RequestContext, orderId: ID): Promise<Payment[]> {
        return this.connection.getRepository(ctx, Payment).find({
            relations: ['refunds'],
            where: {
                order: { id: orderId } as any,
            },
        });
    }

    private async customFieldsAreEqual(
        ctx: RequestContext,
        orderLine: OrderLine,
        inputCustomFields: { [key: string]: any } | null | undefined,
        existingCustomFields?: { [key: string]: any },
    ): Promise<boolean> {
        if (inputCustomFields == null && typeof existingCustomFields === 'object') {
            // A null value for an OrderLine customFields input is the equivalent
            // of every property of an existing customFields object being null.
            return Object.values(existingCustomFields).every(v => v === null);
        }
        const customFieldDefs = this.configService.customFields.OrderLine;

        const customFieldRelations = customFieldDefs.filter(d => d.type === 'relation');
        let lineWithCustomFieldRelations: OrderLine | undefined;
        if (customFieldRelations.length) {
            // for relation types, we need to actually query the DB and check if there is an
            // existing entity assigned.
            lineWithCustomFieldRelations = await this.connection
                .getRepository(ctx, OrderLine)
                .findOne(orderLine.id, {
                    relations: customFieldRelations.map(r => `customFields.${r.name}`),
                });
        }

        for (const def of customFieldDefs) {
            const key = def.name;
            const existingValue = existingCustomFields?.[key];
            if (existingValue !== undefined) {
                const valuesMatch =
                    JSON.stringify(inputCustomFields?.[key]) === JSON.stringify(existingValue);
                const undefinedMatchesNull = existingValue === null && inputCustomFields?.[key] === undefined;
                if (!valuesMatch && !undefinedMatchesNull) {
                    return false;
                }
            } else if (def.type === 'relation') {
                const inputId = `${key}Id`;
                const inputValue = inputCustomFields?.[inputId];
                // tslint:disable-next-line:no-non-null-assertion
                const existingRelation = (lineWithCustomFieldRelations!.customFields as any)[key];
                if (inputValue && inputValue !== existingRelation?.id) {
                    return false;
                }
            }
        }
        return true;
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
}
