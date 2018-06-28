import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConnectionOptions } from 'typeorm';
import { ReadOnlyRequired } from '../common/common-types';
import { EntityIdStrategy } from '../config/entity-id-strategy';
import { getConfig, VendureConfig } from '../config/vendure-config';
import { LanguageCode } from '../locale/language-code';

@Injectable()
export class ConfigService implements VendureConfig {
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

    get dbConnectionOptions(): ConnectionOptions {
        return this.activeConfig.dbConnectionOptions;
    }

    private activeConfig: ReadOnlyRequired<VendureConfig>;

    constructor() {
        this.activeConfig = getConfig();
    }
}
