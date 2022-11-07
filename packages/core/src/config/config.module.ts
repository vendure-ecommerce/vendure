import { Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { ConfigurableOperationDef } from '../common/configurable-operation';
import { Injector } from '../common/injector';
import { InjectableStrategy } from '../common/types/injectable-strategy';

import { resetConfig } from './config-helpers';
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
        /**
         * When the application shuts down, we reset the activeConfig to the default. Usually this is
         * redundant, as the app shutdown would normally coincide with the process ending. However, in some
         * circumstances, such as when running migrations immediately followed by app bootstrap, the activeConfig
         * will persist between these two applications and mutations e.g. to the CustomFields will result in
         * hard-to-debug errors. So resetting is a precaution against this scenario.
         */
        resetConfig();
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
        const { assetNamingStrategy, assetPreviewStrategy, assetStorageStrategy } =
            this.configService.assetOptions;
        const { productVariantPriceCalculationStrategy, stockDisplayStrategy } =
            this.configService.catalogOptions;
        const {
            adminAuthenticationStrategy,
            shopAuthenticationStrategy,
            sessionCacheStrategy,
            passwordHashingStrategy,
            passwordValidationStrategy,
        } = this.configService.authOptions;
        const { taxZoneStrategy } = this.configService.taxOptions;
        const { jobQueueStrategy, jobBufferStorageStrategy } = this.configService.jobQueueOptions;
        const {
            mergeStrategy,
            checkoutMergeStrategy,
            orderItemPriceCalculationStrategy,
            process,
            orderCodeStrategy,
            orderByCodeAccessStrategy,
            stockAllocationStrategy,
            activeOrderStrategy,
        } = this.configService.orderOptions;
        const { customFulfillmentProcess } = this.configService.shippingOptions;
        const { customPaymentProcess } = this.configService.paymentOptions;
        const { entityIdStrategy: entityIdStrategyDeprecated } = this.configService;
        const { entityIdStrategy } = this.configService.entityOptions;
        const { healthChecks } = this.configService.systemOptions;
        const { assetImportStrategy } = this.configService.importExportOptions;
        return [
            ...adminAuthenticationStrategy,
            ...shopAuthenticationStrategy,
            sessionCacheStrategy,
            passwordHashingStrategy,
            passwordValidationStrategy,
            assetNamingStrategy,
            assetPreviewStrategy,
            assetStorageStrategy,
            taxZoneStrategy,
            jobQueueStrategy,
            jobBufferStorageStrategy,
            mergeStrategy,
            checkoutMergeStrategy,
            orderCodeStrategy,
            orderByCodeAccessStrategy,
            entityIdStrategyDeprecated,
            ...[entityIdStrategy].filter(notNullOrUndefined),
            productVariantPriceCalculationStrategy,
            orderItemPriceCalculationStrategy,
            ...process,
            ...customFulfillmentProcess,
            ...customPaymentProcess,
            stockAllocationStrategy,
            stockDisplayStrategy,
            ...healthChecks,
            assetImportStrategy,
            ...(Array.isArray(activeOrderStrategy) ? activeOrderStrategy : [activeOrderStrategy]),
        ];
    }

    private getConfigurableOperations(): Array<ConfigurableOperationDef<any>> {
        const { paymentMethodHandlers, paymentMethodEligibilityCheckers } = this.configService.paymentOptions;
        const { collectionFilters } = this.configService.catalogOptions;
        const { promotionActions, promotionConditions } = this.configService.promotionOptions;
        const { shippingCalculators, shippingEligibilityCheckers, fulfillmentHandlers } =
            this.configService.shippingOptions;
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
