import { HttpService } from '@nestjs/axios';
import { RequestContext } from '@vendure/core';
export declare class FioBankService {
    private readonly httpService;
    private token;
    constructor(httpService: HttpService);
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
