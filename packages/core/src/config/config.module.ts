import { Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigurableOperationDef } from '../common/configurable-operation';
import { Injector } from '../common/injector';
import { InjectableStrategy } from '../common/types/injectable-strategy';

import { ConfigService } from './config.service';

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(private configService: ConfigService, private moduleRef: ModuleRef) {}

    async onApplicationBootstrap() {
        await this.initInjectableStrategies();
        await this.initConfigurableOperations();
    }

    async onApplicationShutdown(signal?: string) {
        await this.destroyInjectableStrategies();
        await this.destroyConfigurableOperations();
    }

    private async initInjectableStrategies() {
        const injector = new Injector(this.moduleRef);
        for (const strategy of this.getInjectableStrategies()) {
            if (typeof strategy.init === 'function') {
                await strategy.init(injector);
            }
        }
    }

    private async destroyInjectableStrategies() {
        for (const strategy of this.getInjectableStrategies()) {
            if (typeof strategy.destroy === 'function') {
                await strategy.destroy();
            }
        }
    }

    private async initConfigurableOperations() {
        const injector = new Injector(this.moduleRef);
        for (const operation of this.getConfigurableOperations()) {
            await operation.init(injector);
        }
    }

    private async destroyConfigurableOperations() {
        for (const operation of this.getConfigurableOperations()) {
            await operation.destroy();
        }
    }

    private getInjectableStrategies(): InjectableStrategy[] {
        const {
            assetNamingStrategy,
            assetPreviewStrategy,
            assetStorageStrategy,
        } = this.configService.assetOptions;
        const {
            productVariantPriceCalculationStrategy,
            stockDisplayStrategy,
        } = this.configService.catalogOptions;
        const {
            adminAuthenticationStrategy,
            shopAuthenticationStrategy,
            sessionCacheStrategy,
        } = this.configService.authOptions;
        const { taxZoneStrategy } = this.configService.taxOptions;
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const {
            mergeStrategy,
            checkoutMergeStrategy,
            orderItemPriceCalculationStrategy,
            process,
            orderCodeStrategy,
            orderByCodeAccessStrategy,
            stockAllocationStrategy,
        } = this.configService.orderOptions;
        const { customFulfillmentProcess } = this.configService.shippingOptions;
        const { customPaymentProcess } = this.configService.paymentOptions;
        const { entityIdStrategy } = this.configService;
        return [
            ...adminAuthenticationStrategy,
            ...shopAuthenticationStrategy,
            sessionCacheStrategy,
            assetNamingStrategy,
            assetPreviewStrategy,
            assetStorageStrategy,
            taxZoneStrategy,
            jobQueueStrategy,
            mergeStrategy,
            checkoutMergeStrategy,
            orderCodeStrategy,
            orderByCodeAccessStrategy,
            entityIdStrategy,
            productVariantPriceCalculationStrategy,
            orderItemPriceCalculationStrategy,
            ...process,
            ...customFulfillmentProcess,
            ...customPaymentProcess,
            stockAllocationStrategy,
            stockDisplayStrategy,
        ];
    }

    private getConfigurableOperations(): Array<ConfigurableOperationDef<any>> {
        const { paymentMethodHandlers, paymentMethodEligibilityCheckers } = this.configService.paymentOptions;
        const { collectionFilters } = this.configService.catalogOptions;
        const { promotionActions, promotionConditions } = this.configService.promotionOptions;
        const {
            shippingCalculators,
            shippingEligibilityCheckers,
            fulfillmentHandlers,
        } = this.configService.shippingOptions;
        return [
            ...(paymentMethodEligibilityCheckers || []),
            ...paymentMethodHandlers,
            ...collectionFilters,
            ...(promotionActions || []),
            ...(promotionConditions || []),
            ...(shippingCalculators || []),
            ...(shippingEligibilityCheckers || []),
            ...(fulfillmentHandlers || []),
        ];
    }
}
