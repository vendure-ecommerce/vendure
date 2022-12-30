import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { OrderService, RequestContext } from '@vendure/core';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class FioBankService {
    private token: string;

    constructor(
        private readonly httpService: HttpService, // private readonly orderService: OrderService
    ) {
        this.token = 'kitrmALlpCjsI1rVYayRBbGqeTG1w9ncIZPYOisT7lP6GnTdEt6qK7mCJ4tyHYKA';
    }

    convertToDate(date: string) {
        const dateT = new Date(date);
        return `${dateT.getFullYear()}-${('00' + (dateT.getUTCMonth() + 1)).slice(-2)}-${(
            '00' + dateT.getUTCDate()
        ).slice(-2)}`;
    }

    async getTransactions(ctx: RequestContext, dateFrom: string, dateTo: string) {
        const config = {
            method: 'get',
            url: `https://www.fio.cz/ib_api/rest/periods/${this.token}/${this.convertToDate(
                dateFrom,
            )}/${this.convertToDate(dateTo)}/transactions.json`,
        };

        const res = await lastValueFrom(this.httpService.request(config).pipe(map(data => data.data)));
        const dataApi = [];
        for (const transaction of res.accountStatement.transactionList.transaction) {
            const order = {
                id: '',
                cost: 0,
                vs: '',
            };

            for (const [key, obj] of Object.entries(transaction)) {
                if (!obj) continue;
                const { value, name } = obj as any;
                if (name === 'Objem') {
                    order.cost = value;
                } else if (name === 'ID pohybu') {
                    order.id = String(value);
                } else if (name === 'VS') {
                    order.vs = value;
                }
            }
            dataApi.push(order);
        }

        return dataApi;
    }
}
