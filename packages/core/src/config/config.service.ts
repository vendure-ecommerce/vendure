import { DynamicModule, Injectable, Type } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PluginDefinition } from 'apollo-server-core';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';

import { getConfig } from './config-helpers';
import { CustomFields } from './custom-field/custom-field-types';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { Logger, VendureLogger } from './logger/vendure-logger';
import {
    AssetOptions,
    AuthOptions,
    ImportExportOptions,
    JobQueueOptions,
    OrderOptions,
    PaymentOptions,
    PromotionOptions,
    RuntimeVendureConfig,
    ShippingOptions,
    TaxOptions,
    VendureConfig,
    WorkerOptions,
} from './vendure-config';

@Injectable()
export class ConfigService implements VendureConfig {
    private activeConfig: RuntimeVendureConfig;

    constructor() {
        this.activeConfig = getConfig();
        if (this.activeConfig.authOptions.disableAuth) {
            // tslint:disable-next-line
            Logger.warn('Auth has been disabled. This should never be the case for a production system!');
        }
    }

    get authOptions(): Required<AuthOptions> {
        return this.activeConfig.authOptions;
    }

    get defaultChannelToken(): string | null {
        return this.activeConfig.defaultChannelToken;
    }

    get channelTokenKey(): string {
        return this.activeConfig.channelTokenKey;
    }

    get defaultLanguageCode(): LanguageCode {
        return this.activeConfig.defaultLanguageCode;
    }

    get adminApiPath(): string {
        return this.activeConfig.adminApiPath;
    }

    get shopApiPath(): string {
        return this.activeConfig.shopApiPath;
    }

    get port(): number {
        return this.activeConfig.port;
    }

    get cors(): boolean | CorsOptions {
        return this.activeConfig.cors;
    }

    get entityIdStrategy(): EntityIdStrategy {
        return this.activeConfig.entityIdStrategy;
    }

    get assetOptions(): AssetOptions {
        return this.activeConfig.assetOptions;
    }

    get dbConnectionOptions(): ConnectionOptions {
        return this.activeConfig.dbConnectionOptions;
    }

    get promotionOptions(): PromotionOptions {
        return this.activeConfig.promotionOptions;
    }

    get shippingOptions(): ShippingOptions {
        return this.activeConfig.shippingOptions;
    }

    get orderOptions(): Required<OrderOptions> {
        return this.activeConfig.orderOptions as Required<OrderOptions>;
    }

    get paymentOptions(): PaymentOptions {
        return this.activeConfig.paymentOptions;
    }

    get taxOptions(): TaxOptions {
        return this.activeConfig.taxOptions;
    }

    get importExportOptions(): Required<ImportExportOptions> {
        return this.activeConfig.importExportOptions;
    }

    get customFields(): Required<CustomFields> {
        return this.activeConfig.customFields;
    }

    get middleware(): Array<{ handler: RequestHandler; route: string }> {
        return this.activeConfig.middleware;
    }

    get apolloServerPlugins(): PluginDefinition[] {
        return this.activeConfig.apolloServerPlugins;
    }

    get plugins(): Array<DynamicModule | Type<any>> {
        return this.activeConfig.plugins;
    }

    get logger(): VendureLogger {
        return this.activeConfig.logger;
    }

    get workerOptions(): WorkerOptions {
        return this.activeConfig.workerOptions;
    }

    get jobQueueOptions(): Required<JobQueueOptions> {
        return this.activeConfig.jobQueueOptions;
    }
}
