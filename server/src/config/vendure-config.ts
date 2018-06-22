import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConnectionOptions } from 'typeorm';
import { DeepPartial } from '../common/common-types';
import { LanguageCode } from '../locale/language-code';
import { AutoIncrementIdStrategy } from './auto-increment-id-strategy';
import { EntityIdStrategy } from './entity-id-strategy';
import { mergeConfig } from './merge-config';

export interface VendureConfig {
    /**
     * The default languageCode of the app.
     */
    defaultLanguageCode: LanguageCode;
    /**
     * The path to the GraphQL API.
     */
    apiPath: string;
    /**
     * Set the CORS handling for the server.
     */
    cors: boolean | CorsOptions;
    /**
     * Which port the Vendure server should listen on.
     */
    port: number;
    /**
     * Defines the strategy used for both storing the primary keys of entities
     * in the database, and the encoding & decoding of those ids when exposing
     * entities via the API. The default uses a simple auto-increment integer
     * strategy.
     */
    entityIdStrategy: EntityIdStrategy<any>;
    /**
     * The connection options used by TypeORM to connect to the database.
     */
    dbConnectionOptions: ConnectionOptions;
}

const defaultConfig: VendureConfig = {
    defaultLanguageCode: LanguageCode.EN,
    port: 3000,
    cors: false,
    apiPath: '/api',
    entityIdStrategy: new AutoIncrementIdStrategy(),
    dbConnectionOptions: {
        type: 'mysql',
    },
};

let activeConfig = defaultConfig;

/**
 * Override the default config by merging in the supplied values. Should only be used prior to
 * bootstrapping the app.
 */
export function setConfig(userConfig: DeepPartial<VendureConfig>): void {
    activeConfig = mergeConfig(activeConfig, userConfig);
}

/**
 * Returns the app config object. In general this function should only be
 * used before bootstrapping the app. In all other contexts, the {@link ConfigService}
 * should be used to access config settings.
 */
export function getConfig(): VendureConfig {
    return activeConfig;
}
