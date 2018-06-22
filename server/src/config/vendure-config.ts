import { ConnectionOptions } from 'typeorm';
import { LanguageCode } from '../locale/language-code';
import { AutoIncrementIdStrategy } from './auto-increment-id-strategy';
import { EntityIdStrategy } from './entity-id-strategy';

export interface VendureConfig {
    defaultLanguageCode: LanguageCode;
    entityIdStrategy: EntityIdStrategy<any>;
    connectionOptions: ConnectionOptions;
}

const defaultConfig: VendureConfig = {
    defaultLanguageCode: LanguageCode.EN,
    entityIdStrategy: new AutoIncrementIdStrategy(),
    connectionOptions: {
        type: 'mysql',
    },
};

let activeConfig = defaultConfig;

export function setConfig(userConfig: Partial<VendureConfig>): void {
    activeConfig = Object.assign({}, defaultConfig, userConfig);
}

export function getConfig(): VendureConfig {
    return activeConfig;
}

export function getEntityIdStrategy(): EntityIdStrategy {
    return getConfig().entityIdStrategy;
}
