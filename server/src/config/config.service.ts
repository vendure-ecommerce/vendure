import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { LanguageCode } from 'shared/generated-types';
import { CustomFields } from 'shared/shared-types';
import { ConnectionOptions } from 'typeorm';

import { ReadOnlyRequired } from '../common/types/common-types';

import { AdjustmentActionConfig, AdjustmentConditionConfig } from './adjustment/adjustment-types';
import { AssetNamingStrategy } from './asset-naming-strategy/asset-naming-strategy';
import { AssetPreviewStrategy } from './asset-preview-strategy/asset-preview-strategy';
import { AssetStorageStrategy } from './asset-storage-strategy/asset-storage-strategy';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { AuthOptions, getConfig, VendureConfig } from './vendure-config';
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

    get channelTokenKey(): string {
        return this.activeConfig.channelTokenKey;
    }

    get defaultLanguageCode(): LanguageCode {
        return this.activeConfig.defaultLanguageCode;
    }

    get apiPath(): string {
        return this.activeConfig.apiPath;
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

    get assetNamingStrategy(): AssetNamingStrategy {
        return this.activeConfig.assetNamingStrategy;
    }

    get assetStorageStrategy(): AssetStorageStrategy {
        return this.activeConfig.assetStorageStrategy;
    }

    get assetPreviewStrategy(): AssetPreviewStrategy {
        return this.activeConfig.assetPreviewStrategy;
    }

    get dbConnectionOptions(): ConnectionOptions {
        return this.activeConfig.dbConnectionOptions;
    }

    get uploadMaxFileSize(): number {
        return this.activeConfig.uploadMaxFileSize;
    }

    get adjustmentConditions(): Array<AdjustmentConditionConfig<any>> {
        return this.activeConfig.adjustmentConditions;
    }

    get adjustmentActions(): Array<AdjustmentActionConfig<any>> {
        return this.activeConfig.adjustmentActions;
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
