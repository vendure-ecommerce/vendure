import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConnectionOptions } from 'typeorm';

import { DeepPartial } from '../../../shared/shared-types';
import { ReadOnlyRequired } from '../common/common-types';
import { LanguageCode } from '../locale/language-code';

import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { mergeConfig } from './merge-config';

export interface VendureConfig {
    /**
     * The default languageCode of the app.
     */
    defaultLanguageCode?: LanguageCode;
    /**
     * The path to the GraphQL API.
     */
    apiPath?: string;
    /**
     * Set the CORS handling for the server.
     */
    cors?: boolean | CorsOptions;
    /**
     * Which port the Vendure server should listen on.
     */
    port: number;
    /**
     * The secret used for signing each JWT used in authenticating users.
     * In production applications, this should not be stored as a string in
     * source control for security reasons, but may be loaded from an external
     * file not under source control, or from an environment variable, for example.
     * See https://stackoverflow.com/a/30090120/772859
     */
    jwtSecret: string;
    /**
     * Defines the strategy used for both storing the primary keys of entities
     * in the database, and the encoding & decoding of those ids when exposing
     * entities via the API. The default uses a simple auto-increment integer
     * strategy.
     */
    entityIdStrategy?: EntityIdStrategy<any>;
    /**
     * The connection options used by TypeORM to connect to the database.
     */
    dbConnectionOptions: ConnectionOptions;
}

const defaultConfig: ReadOnlyRequired<VendureConfig> = {
    defaultLanguageCode: LanguageCode.EN,
    port: 3000,
    cors: false,
    jwtSecret: 'secret',
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
export function getConfig(): ReadOnlyRequired<VendureConfig> {
    return activeConfig;
}
