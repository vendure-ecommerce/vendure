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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var FioBankPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FioBankPlugin = void 0;
const axios_1 = require("@nestjs/axios");
const core_1 = require("@vendure/core");
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const fio_bank_resolver_1 = require("./fio-bank.resolver");
const fio_bank_service_1 = require("./fio-bank.service");
const schemaExtension = graphql_tag_1.default `
    extend type Mutation {
        getTransactions(from: DateTime!, to: DateTime!): [OrderMessage!]!
    }

    type OrderMessage {
        id: String!
        cost: String!
        vs: String!
    }

    type InfoMessage {
        accountId: String!
        bankId: String!
        currency: String!
        iban: String!
        bic: String!
        openingBalance: Int!
        closingBalance: Int!
    }
`;
let FioBankPlugin = FioBankPlugin_1 = class FioBankPlugin {
    /* tslint:disable:no-empty */
    /** @internal */
    constructor() { }
    static init() {
        return FioBankPlugin_1;
    }
    /* tslint:disable:no-empty */
    /** @internal */
    onApplicationBootstrap() { }
};
FioBankPlugin = FioBankPlugin_1 = __decorate([
    core_1.VendurePlugin({
        imports: [
            axios_1.HttpModule,
            core_1.PluginCommonModule
        ],
        providers: [fio_bank_service_1.FioBankService, core_1.OrderService],
        adminApiExtensions: {
            schema: schemaExtension,
            resolvers: [fio_bank_resolver_1.FioBankResolver],
        },
    }),
    __metadata("design:paramtypes", [])
], FioBankPlugin);
exports.FioBankPlugin = FioBankPlugin;
//# sourceMappingURL=plugin.js.map