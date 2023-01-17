import { OnApplicationBootstrap } from '@nestjs/common';
import {
    Channel,
    ChannelService,
    configureDefaultOrderProcess,
    LanguageCode,
    PaymentMethod,
    PaymentMethodService,
    PluginCommonModule,
    RequestContextService,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';

import { multivendorOrderProcess } from './config/mv-order-process';
import { MultivendorSellerStrategy } from './config/mv-order-seller-strategy';
import { multivendorPaymentMethodHandler } from './config/mv-payment-handler';
import { MultivendorShippingLineAssignmentStrategy } from './config/mv-shipping-line-assignment-strategy';
import { CONNECTED_PAYMENT_METHOD_CODE } from './constants';

@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => {
        config.customFields.Seller.push({
            name: 'connectedAccountId',
            label: [{ languageCode: LanguageCode.en, value: 'Connected account ID' }],
            description: [
                { languageCode: LanguageCode.en, value: 'The ID used to process connected payments' },
            ],
            type: 'string',
            public: false,
        });
        config.paymentOptions.paymentMethodHandlers.push(multivendorPaymentMethodHandler);

        const customDefaultOrderProcess = configureDefaultOrderProcess({
            checkFulfillmentStates: false,
        });
        config.orderOptions.process = [customDefaultOrderProcess, multivendorOrderProcess];
        config.orderOptions.orderSellerStrategy = new MultivendorSellerStrategy();
        config.shippingOptions.shippingLineAssignmentStrategy =
            new MultivendorShippingLineAssignmentStrategy();
        return config;
    },
})
export class MultivendorPlugin implements OnApplicationBootstrap {
    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private requestContextService: RequestContextService,
        private paymentMethodService: PaymentMethodService,
    ) {}

    async onApplicationBootstrap() {
        await this.ensureConnectedPaymentMethodExists();
    }

    private async ensureConnectedPaymentMethodExists() {
        const paymentMethod = await this.connection.rawConnection.getRepository(PaymentMethod).findOne({
            where: {
                code: CONNECTED_PAYMENT_METHOD_CODE,
            },
        });
        if (!paymentMethod) {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const allChannels = await this.connection.getRepository(ctx, Channel).find();
            const createdPaymentMethod = await this.paymentMethodService.create(ctx, {
                code: CONNECTED_PAYMENT_METHOD_CODE,
                name: 'Connected Payments',
                enabled: true,
                handler: {
                    code: multivendorPaymentMethodHandler.code,
                    arguments: [],
                },
            });
            await this.channelService.assignToChannels(
                ctx,
                PaymentMethod,
                createdPaymentMethod.id,
                allChannels.map(c => c.id),
            );
        }
    }
}
