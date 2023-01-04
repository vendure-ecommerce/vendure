import { HttpService } from '@nestjs/axios';
import { OrderService, RequestContext } from '@vendure/core';
export declare class FioBankService {
    private readonly httpService;
    private readonly orderService;
    private token;
    constructor(httpService: HttpService, orderService: OrderService);
    convertToDate(date: string): string;
    getTransactions(
        ctx: RequestContext,
        dateFrom: string,
        dateTo: string,
    ): Promise<
        Array<{
            id: string;
            cost: number;
            vs: string;
        }>
    >;
}
