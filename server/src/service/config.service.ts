import { Injectable } from '@nestjs/common';
import { ConnectionOptions } from 'typeorm';
import { EntityIdStrategy } from '../config/entity-id-strategy';
import { getConfig, VendureConfig } from '../config/vendure-config';
import { LanguageCode } from '../locale/language-code';

@Injectable()
export class ConfigService implements VendureConfig {
    get defaultLanguageCode(): LanguageCode {
        return this.activeConfig.defaultLanguageCode;
    }

    get entityIdStrategy(): EntityIdStrategy {
        return this.activeConfig.entityIdStrategy;
    }

    get connectionOptions(): ConnectionOptions {
        return this.activeConfig.connectionOptions;
    }

    private activeConfig: VendureConfig;

    constructor() {
        this.activeConfig = getConfig();
    }
}
