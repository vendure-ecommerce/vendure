import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    HistoryEntryListOptions,
    HistoryEntryType,
    UpdateAddressInput,
    UpdateCustomerInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Administrator } from '../../entity/administrator/administrator.entity';
import { CustomerHistoryEntry } from '../../entity/history-entry/customer-history-entry.entity';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { OrderHistoryEntry } from '../../entity/history-entry/order-history-entry.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { RefundState } from '../helpers/refund-state-machine/refund-state';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';

import { AdministratorService } from './administrator.service';

export type CustomerHistoryEntryData = {
    [HistoryEntryType.CUSTOMER_REGISTERED]: {};
    [HistoryEntryType.CUSTOMER_VERIFIED]: {};
    [HistoryEntryType.CUSTOMER_DETAIL_UPDATED]: {
        input: UpdateCustomerInput;
    };
    [HistoryEntryType.CUSTOMER_ADDRESS_CREATED]: {
        address: string;
    };
    [HistoryEntryType.CUSTOMER_ADDED_TO_GROUP]: {
        groupName: string;
    };
    [HistoryEntryType.CUSTOMER_REMOVED_FROM_GROUP]: {
        groupName: string;
    };
    [HistoryEntryType.CUSTOMER_ADDRESS_UPDATED]: {
        address: string;
        input: UpdateAddressInput;
    };
    [HistoryEntryType.CUSTOMER_ADDRESS_DELETED]: {
        address: string;
    };
    [HistoryEntryType.CUSTOMER_PASSWORD_UPDATED]: {};
    [HistoryEntryType.CUSTOMER_PASSWORD_RESET_REQUESTED]: {};
    [HistoryEntryType.CUSTOMER_PASSWORD_RESET_VERIFIED]: {};
    [HistoryEntryType.CUSTOMER_EMAIL_UPDATE_REQUESTED]: {
        oldEmailAddress: string;
        newEmailAddress: string;
    };
    [HistoryEntryType.CUSTOMER_EMAIL_UPDATE_VERIFIED]: {
        oldEmailAddress: string;
        newEmailAddress: string;
    };
    [HistoryEntryType.CUSTOMER_NOTE]: {
        note: string;
    };
};

export type OrderHistoryEntryData = {
    [HistoryEntryType.ORDER_STATE_TRANSITION]: {
        from: OrderState;
        to: OrderState;
    };
    [HistoryEntryType.ORDER_PAYMENT_TRANSITION]: {
        paymentId: ID;
        from: PaymentState;
        to: PaymentState;
    };
    [HistoryEntryType.ORDER_FULLFILLMENT]: {
        fulfillmentId: ID;
    };
    [HistoryEntryType.ORDER_CANCELLATION]: {
        orderItemIds: ID[];
        reason?: string;
    };
    [HistoryEntryType.ORDER_REFUND_TRANSITION]: {
        refundId: ID;
        from: RefundState;
        to: RefundState;
        reason?: string;
    };
    [HistoryEntryType.ORDER_NOTE]: {
        note: string;
    };
    [HistoryEntryType.ORDER_COUPON_APPLIED]: {
        couponCode: string;
        promotionId: ID;
    };
    [HistoryEntryType.ORDER_COUPON_REMOVED]: {
        couponCode: string;
    };
};

export interface CreateCustomerHistoryEntryArgs<T extends keyof CustomerHistoryEntryData> {
    customerId: ID;
    ctx: RequestContext;
    type: T;
    data: CustomerHistoryEntryData[T];
}

export interface CreateOrderHistoryEntryArgs<T extends keyof OrderHistoryEntryData> {
    orderId: ID;
    ctx: RequestContext;
    type: T;
    data: OrderHistoryEntryData[T];
}

export interface UpdateOrderHistoryEntryArgs<T extends keyof OrderHistoryEntryData> {
    entryId: ID;
    ctx: RequestContext;
    type: T;
    isPublic?: boolean;
    data?: OrderHistoryEntryData[T];
}

export interface UpdateCustomerHistoryEntryArgs<T extends keyof CustomerHistoryEntryData> {
    entryId: ID;
    ctx: RequestContext;
    type: T;
    data?: CustomerHistoryEntryData[T];
}

/**
 * The HistoryService is reponsible for creating and retrieving HistoryEntry entities.
 */
@Injectable()
export class HistoryService {
    constructor(
        @InjectConnection() private connection: Connection,
        private administratorService: AdministratorService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async getHistoryForOrder(
        orderId: ID,
        publicOnly: boolean,
        options?: HistoryEntryListOptions,
    ): Promise<PaginatedList<OrderHistoryEntry>> {
        return this.listQueryBuilder
            .build((HistoryEntry as any) as Type<OrderHistoryEntry>, options, {
                where: {
                    order: { id: orderId } as any,
                    ...(publicOnly ? { isPublic: true } : {}),
                },
                relations: ['administrator'],
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async createHistoryEntryForOrder<T extends keyof OrderHistoryEntryData>(
        args: CreateOrderHistoryEntryArgs<T>,
        isPublic = true,
    ): Promise<OrderHistoryEntry> {
        const { ctx, data, orderId, type } = args;
        const administrator = await this.getAdministratorFromContext(ctx);
        const entry = new OrderHistoryEntry({
            type,
            isPublic,
            data: data as any,
            order: { id: orderId },
            administrator,
        });
        return this.connection.getRepository(OrderHistoryEntry).save(entry);
    }

    async getHistoryForCustomer(
        customerId: ID,
        publicOnly: boolean,
        options?: HistoryEntryListOptions,
    ): Promise<PaginatedList<CustomerHistoryEntry>> {
        return this.listQueryBuilder
            .build((HistoryEntry as any) as Type<CustomerHistoryEntry>, options, {
                where: {
                    customer: { id: customerId } as any,
                    ...(publicOnly ? { isPublic: true } : {}),
                },
                relations: ['administrator'],
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async createHistoryEntryForCustomer<T extends keyof CustomerHistoryEntryData>(
        args: CreateCustomerHistoryEntryArgs<T>,
        isPublic = false,
    ): Promise<CustomerHistoryEntry> {
        const { ctx, data, customerId, type } = args;
        const administrator = await this.getAdministratorFromContext(ctx);
        const entry = new CustomerHistoryEntry({
            type,
            isPublic,
            data: data as any,
            customer: { id: customerId },
            administrator,
        });
        return this.connection.getRepository(CustomerHistoryEntry).save(entry);
    }

    async updateOrderHistoryEntry<T extends keyof OrderHistoryEntryData>(
        ctx: RequestContext,
        args: UpdateOrderHistoryEntryArgs<T>,
    ) {
        const entry = await getEntityOrThrow(this.connection, OrderHistoryEntry, args.entryId, {
            where: { type: args.type },
        });

        if (args.data) {
            entry.data = args.data;
        }
        if (typeof args.isPublic === 'boolean') {
            entry.isPublic = args.isPublic;
        }
        const administrator = await this.getAdministratorFromContext(ctx);
        if (administrator) {
            entry.administrator = administrator;
        }
        return this.connection.getRepository(OrderHistoryEntry).save(entry);
    }

    async deleteOrderHistoryEntry(id: ID): Promise<void> {
        const entry = await getEntityOrThrow(this.connection, OrderHistoryEntry, id);
        await this.connection.getRepository(OrderHistoryEntry).remove(entry);
    }

    async updateCustomerHistoryEntry<T extends keyof CustomerHistoryEntryData>(
        ctx: RequestContext,
        args: UpdateCustomerHistoryEntryArgs<T>,
    ) {
        const entry = await getEntityOrThrow(this.connection, CustomerHistoryEntry, args.entryId, {
            where: { type: args.type },
        });

        if (args.data) {
            entry.data = args.data;
        }
        const administrator = await this.getAdministratorFromContext(ctx);
        if (administrator) {
            entry.administrator = administrator;
        }
        return this.connection.getRepository(CustomerHistoryEntry).save(entry);
    }

    async deleteCustomerHistoryEntry(id: ID): Promise<void> {
        const entry = await getEntityOrThrow(this.connection, CustomerHistoryEntry, id);
        await this.connection.getRepository(CustomerHistoryEntry).remove(entry);
    }

    private async getAdministratorFromContext(ctx: RequestContext): Promise<Administrator | undefined> {
        const administrator = ctx.activeUserId
            ? await this.administratorService.findOneByUserId(ctx.activeUserId)
            : undefined;
        return administrator;
    }
}
