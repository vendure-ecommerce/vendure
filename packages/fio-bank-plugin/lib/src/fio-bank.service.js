"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioBankService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const core_1 = require("@vendure/core");
const rxjs_1 = require("rxjs");
let FioBankService = class FioBankService {
    constructor(httpService, orderService) {
        this.httpService = httpService;
        this.orderService = orderService;
        this.token = process.env.FIO_BANK_TOKEN;
    }
    convertToDate(date) {
        const dateT = new Date(date);
        return `${dateT.getFullYear()}-${('00' + (dateT.getUTCMonth() + 1)).slice(-2)}-${('00' + dateT.getUTCDate()).slice(-2)}`;
    }
    async getTransactions(ctx, dateFrom, dateTo) {
        const config = {
            method: 'get',
            url: `https://www.fio.cz/ib_api/rest/periods/${this.token}/${this.convertToDate(dateFrom)}/${this.convertToDate(dateTo)}/transactions.json`,
        };
        const res = await rxjs_1.lastValueFrom(this.httpService.request(config).pipe(rxjs_1.map(data => data.data)));
        const dataApi = [];
        for (const transaction of res.accountStatement.transactionList.transaction) {
            const order = {
                id: '',
                cost: 0,
                vs: '',
            };
            for (const [key, obj] of Object.entries(transaction)) {
                if (!obj)
                    continue;
                const { value, name } = obj;
                if (name === 'Objem') {
                    order.cost = value;
                }
                else if (name === 'ID pohybu') {
                    order.id = value;
                }
                else if (name === 'VS') {
                    order.vs = value;
                }
            }
            if (order.vs) {
                const orderDB = await this.orderService.findOne(ctx, 2);
                console.log(orderDB === null || orderDB === void 0 ? void 0 : orderDB.totalWithTax);
                if (orderDB && orderDB.totalWithTax === order.cost) {
                    await this.orderService.addPaymentToOrder(ctx, order.vs, {
                        method: "bank fio",
                        metadata: {}
                    });
                }
            }
            dataApi.push(order);
        }
        return dataApi;
    }
};
FioBankService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        core_1.OrderService])
], FioBankService);
exports.FioBankService = FioBankService;
//# sourceMappingURL=fio-bank.service.js.map