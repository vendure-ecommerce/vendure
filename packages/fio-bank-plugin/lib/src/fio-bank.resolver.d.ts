import { RequestContext } from '@vendure/core';

import { FioBankService } from './fio-bank.service';
import { MutationGetTransactions } from './types/generated-types';
export declare class OrderMessage {
    id: string;
    cost: number;
    vs: string;
}
export declare class FioBankResolver {
    private readonly fioBankService;
    constructor(fioBankService: FioBankService);
    getTransactions(ctx: RequestContext, args: MutationGetTransactions): Promise<OrderMessage[]>;
}
