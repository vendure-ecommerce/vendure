import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LanguageCode } from 'shared/generated-types';
import { CustomFields } from 'shared/shared-types';
import { ConnectionOptions } from 'typeorm';

import { ReadOnlyRequired } from '../common/types/common-types';

import { AssetPreviewStrategy } from './asset-preview-strategy/asset-preview-strategy';
import { AssetStorageStrategy } from './asset-storage-strategy/asset-storage-strategy';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { getConfig, VendureConfig } from './vendure-config';

@Injectable()
export class ConfigService implements VendureConfig {
    get disableAuth(): boolean {
        return this.activeConfig.disableAuth;
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

    get jwtSecret(): string {
        return this.activeConfig.jwtSecret;
    }

    get entityIdStrategy(): EntityIdStrategy {
        return this.activeConfig.entityIdStrategy;
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

    get customFields(): CustomFields {
        return this.activeConfig.customFields;
    }

    private activeConfig: ReadOnlyRequired<VendureConfig>;

    constructor() {
        this.activeConfig = getConfig();
        if (this.activeConfig.disableAuth) {
            // tslint:disable-next-line
            console.warn(
                'WARNING: auth has been disabled. This should never be the case for a production system!',
            );
        }
    }
}
