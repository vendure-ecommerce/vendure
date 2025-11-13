/**
 * @description
 * ORM-agnostic adapter interface for Order entity operations.
 * This abstraction allows switching between TypeORM and Prisma implementations.
 *
 * @since 3.6.0
 */

import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

export interface OrderFilterInput {
    active?: boolean;
    state?: string;
    customerId?: string;
    code?: string;
}

export interface OrderListOptions {
    skip?: number;
    take?: number;
    filter?: OrderFilterInput;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface CreateOrderInput {
    code: string;
    state: string;
    active?: boolean;
    type?: string;
    customerId?: string | null;
    currencyCode: string;
    subTotal: number;
    subTotalWithTax: number;
    shipping?: number;
    shippingWithTax?: number;
    taxZoneId?: string | null;
    couponCodes?: string[];
    shippingAddressId?: string | null;
    billingAddressId?: string | null;
    customFields?: Record<string, any>;
}

export interface UpdateOrderInput {
    state?: string;
    active?: boolean;
    orderPlacedAt?: Date | null;
    subTotal?: number;
    subTotalWithTax?: number;
    shipping?: number;
    shippingWithTax?: number;
    couponCodes?: string[];
    customFields?: Record<string, any>;
}

export interface AddOrderLineInput {
    productVariantId: string;
    quantity: number;
    unitPrice: number;
    unitPriceWithTax: number;
    taxCategoryId?: string;
}

export interface UpdateOrderLineInput {
    quantity?: number;
    unitPrice?: number;
    unitPriceWithTax?: number;
}

export interface AddPaymentInput {
    method: string;
    amount: number;
    state: string;
    transactionId?: string;
    metadata?: Record<string, any>;
}

export interface AddShippingLineInput {
    shippingMethodId: string;
    listPrice: number;
    listPriceIncludesTax: boolean;
    price: number;
    priceWithTax: number;
}

/**
 * ORM-agnostic Order adapter interface
 */
export interface IOrderOrmAdapter {
    /**
     * Find a single order by ID
     */
    findOne(id: ID, includeRelations?: boolean): Promise<Order | undefined>;

    /**
     * Find an order by code
     */
    findByCode(code: string): Promise<Order | undefined>;

    /**
     * Find all orders for a customer
     */
    findByCustomerId(
        customerId: ID,
        options?: { skip?: number; take?: number },
    ): Promise<PaginatedList<Order>>;

    /**
     * Find all orders with pagination
     */
    findAll(options?: OrderListOptions): Promise<PaginatedList<Order>>;

    /**
     * Create a new order
     */
    create(data: CreateOrderInput): Promise<Order>;

    /**
     * Update an existing order
     */
    update(id: ID, data: UpdateOrderInput): Promise<Order>;

    /**
     * Transition order state
     */
    transitionState(id: ID, newState: string): Promise<Order>;

    /**
     * Add a line to an order
     */
    addLine(orderId: ID, data: AddOrderLineInput): Promise<OrderLine>;

    /**
     * Update an order line
     */
    updateLine(lineId: ID, data: UpdateOrderLineInput): Promise<OrderLine>;

    /**
     * Remove a line from an order
     */
    removeLine(lineId: ID): Promise<void>;

    /**
     * Get all lines for an order
     */
    getLines(orderId: ID): Promise<OrderLine[]>;

    /**
     * Add a payment to an order
     */
    addPayment(orderId: ID, data: AddPaymentInput): Promise<any>;

    /**
     * Add a shipping line to an order
     */
    addShippingLine(orderId: ID, data: AddShippingLineInput): Promise<any>;

    /**
     * Add order to a channel
     */
    addToChannel(orderId: ID, channelId: ID): Promise<void>;

    /**
     * Remove order from a channel
     */
    removeFromChannel(orderId: ID, channelId: ID): Promise<void>;
}
