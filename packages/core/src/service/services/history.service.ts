import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { HistoryEntryListOptions, HistoryEntryType } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList, Type } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { HistoryEntry } from '../../entity/history-entry/history-entry.entity';
import { OrderHistoryEntry } from '../../entity/history-entry/order-history-entry.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { OrderState } from '../helpers/order-state-machine/order-state';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { RefundState } from '../helpers/refund-state-machine/refund-state';

import { AdministratorService } from './administrator.service';

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
};

export interface CreateOrderHistoryEntryArgs<T extends keyof OrderHistoryEntryData> {
    orderId: ID;
    ctx: RequestContext;
    type: T;
    data: OrderHistoryEntryData[T];
}

/**
 * The HistoryService is reponsible for creating and retrieving HistoryEntry entities.
 */
@Injectable()
export class HistoryService {
    constructor(@InjectConnection() private connection: Connection,
                private administratorService: AdministratorService,
                private listQueryBuilder: ListQueryBuilder) {}

    async getHistoryForOrder(orderId: ID, options?: HistoryEntryListOptions): Promise<PaginatedList<OrderHistoryEntry>> {
        return this.listQueryBuilder.build(HistoryEntry as any as Type<OrderHistoryEntry>, options, {
            where: {
                order: { id: orderId } as any,
            },
            relations: ['administrator'],
        }).getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    async createHistoryEntryForOrder<T extends keyof OrderHistoryEntryData>(args: CreateOrderHistoryEntryArgs<T>): Promise<OrderHistoryEntry> {
        const {ctx, data, orderId, type} = args;
        const administrator = ctx.activeUserId ? await this.administratorService.findOneByUserId(ctx.activeUserId) : undefined;
        const entry = new OrderHistoryEntry({
            type,
            // TODO: figure out which should be public and not
            isPublic: true,
            data: data as any,
            order: { id: orderId },
            administrator,
        });
        return this.connection.getRepository(OrderHistoryEntry).save(entry);
    }
}
