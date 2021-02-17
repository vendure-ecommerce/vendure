import { Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { ConfigurableOperationDef } from '../common/configurable-operation';
import { Injector } from '../common/injector';
import { InjectableStrategy } from '../common/types/injectable-strategy';
import { ProcessContext } from '../process-context/process-context';

import { ConfigService } from './config.service';

@Module({
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(
        private configService: ConfigService,
        private moduleRef: ModuleRef,
        private processContext: ProcessContext,
    ) {}

    async onApplicationBootstrap() {
        if (this.runInjectableStrategyLifecycleHooks()) {
            await this.initInjectableStrategies();
            await this.initConfigurableOperations();
        }
    }

    async onApplicationShutdown(signal?: string) {
        if (this.runInjectableStrategyLifecycleHooks()) {
            await this.destroyInjectableStrategies();
            await this.destroyConfigurableOperations();
        }
    }

    /**
     * The lifecycle hooks of the configured strategies should be run if we are on the main
     * server process _or_ if we are on the worker running independently of the main process.
     */
    private runInjectableStrategyLifecycleHooks(): boolean {
        return (
            this.processContext.isServer ||
            (this.processContext.isWorker && !this.configService.workerOptions.runInMainProcess)
        );
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
        const { adminAuthenticationStrategy, shopAuthenticationStrategy } = this.configService.authOptions;
        const { taxZoneStrategy } = this.configService.taxOptions;
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        const {
            mergeStrategy,
            checkoutMergeStrategy,
            orderItemPriceCalculationStrategy,
            process,
            orderCodeStrategy,
            stockAllocationStrategy,
        } = this.configService.orderOptions;
        const { customFulfillmentProcess } = this.configService.shippingOptions;
        const { customPaymentProcess } = this.configService.paymentOptions;
        const { entityIdStrategy } = this.configService;
        return [
            ...adminAuthenticationStrategy,
            ...shopAuthenticationStrategy,
            assetNamingStrategy,
            assetPreviewStrategy,
            assetStorageStrategy,
            taxZoneStrategy,
            jobQueueStrategy,
            mergeStrategy,
            checkoutMergeStrategy,
            orderCodeStrategy,
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
