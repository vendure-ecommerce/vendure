import { HttpModule } from '@nestjs/axios';
import { OnApplicationBootstrap } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import { VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';

import { FioBankResolver } from './fio-bank.resolver';
import { FioBankService } from './fio-bank.service';
import { FIOBankPluginOptions } from './types';

const schemaExtension = gql`
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
@VendurePlugin({
    imports: [
        HttpModule,
        // PluginCommonModule
    ],
    providers: [FioBankService],
    adminApiExtensions: {
        schema: schemaExtension,
        resolvers: [FioBankResolver],
    },
})
export class FioBankPlugin implements OnApplicationBootstrap {
    private static options: FIOBankPluginOptions;
    /* tslint:disable:no-empty */
    /** @internal */
    constructor() {}
    static init(): Type<FioBankPlugin> {
        return FioBankPlugin;
    }
    /* tslint:disable:no-empty */
    /** @internal */
    onApplicationBootstrap(): void | Promise<void> {}
}
