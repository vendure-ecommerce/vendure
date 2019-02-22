import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { ConnectionOptions } from 'typeorm';

import { LanguageCode } from '../../../shared/generated-types';
import { CustomFields } from '../../../shared/shared-types';
import { ReadOnlyRequired } from '../common/types/common-types';

import { getConfig } from './config-helpers';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import {
    AssetOptions,
    AuthOptions,
    EmailOptions,
    ImportExportOptions,
    OrderMergeOptions,
    OrderProcessOptions,
    PaymentOptions,
    PromotionOptions,
    ShippingOptions,
    TaxOptions,
    VendureConfig,
} from './vendure-config';
import { VendurePlugin } from './vendure-plugin/vendure-plugin';

@Injectable()
export class ConfigService implements VendureConfig {
    private activeConfig: ReadOnlyRequired<VendureConfig>;

    constructor() {
        this.activeConfig = getConfig();
        if (this.activeConfig.authOptions.disableAuth) {
            // tslint:disable-next-line
            console.warn(
                'WARNING: auth has been disabled. This should never be the case for a production system!',
            );
        }
    }

    get authOptions(): Required<AuthOptions> {
        return this.activeConfig.authOptions as Required<AuthOptions>;
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

    get orderMergeOptions(): OrderMergeOptions {
        return this.activeConfig.orderMergeOptions;
    }

    get orderProcessOptions(): OrderProcessOptions<any> {
        return this.activeConfig.orderProcessOptions;
    }

    get paymentOptions(): PaymentOptions {
        return this.activeConfig.paymentOptions;
    }

    get taxOptions(): TaxOptions {
        return this.activeConfig.taxOptions;
    }

    get emailOptions(): Required<EmailOptions<any>> {
        return this.activeConfig.emailOptions as Required<EmailOptions<any>>;
    }

    get importExportOptions(): Required<ImportExportOptions> {
        return this.activeConfig.importExportOptions as Required<ImportExportOptions>;
    }

    get customFields(): CustomFields {
        return this.activeConfig.customFields;
    }

    get middleware(): Array<{ handler: RequestHandler; route: string }> {
        return this.activeConfig.middleware;
    }

    get plugins(): VendurePlugin[] {
        return this.activeConfig.plugins;
    }
}
