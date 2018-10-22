import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { LanguageCode } from 'shared/generated-types';
import { CustomFields, DeepPartial } from 'shared/shared-types';
import { ConnectionOptions } from 'typeorm';

import { ReadOnlyRequired } from '../common/types/common-types';

import { AssetNamingStrategy } from './asset-naming-strategy/asset-naming-strategy';
import { AssetPreviewStrategy } from './asset-preview-strategy/asset-preview-strategy';
import { AssetStorageStrategy } from './asset-storage-strategy/asset-storage-strategy';
import { defaultConfig } from './default-config';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { mergeConfig } from './merge-config';
import { PromotionAction } from './promotion/promotion-action';
import { PromotionCondition } from './promotion/promotion-condition';
import { VendurePlugin } from './vendure-plugin/vendure-plugin';

export interface AuthOptions {
    /**
     * Disable authentication & permissions checks.
     * NEVER set the to true in production. It exists
     * only to aid certain development tasks.
     */
    disableAuth?: boolean;
    /**
     * Sets the method by which the session token is delivered and read.
     *
     * - "cookie": Upon login, a 'Set-Cookie' header will be returned to the client, setting a
     *   cookie containing the session token. A browser-based client (making requests with credentials)
     *   should automatically send the session cookie with each request.
     * - "bearer": Upon login, the token is returned in the response and should be then stored by the
     *   client app. Each request should include the header "Authorization: Bearer <token>".
     */
    tokenMethod?: 'cookie' | 'bearer';
    /**
     * The secret used for signing the session cookies for authenticated users. Only applies when
     * tokenMethod is set to "cookie".
     *
     * In production applications, this should not be stored as a string in
     * source control for security reasons, but may be loaded from an external
     * file not under source control, or from an environment variable, for example.
     * See https://stackoverflow.com/a/30090120/772859
     */
    sessionSecret?: string;
    /**
     * Sets the header property which will be used to send the auth token when using the "bearer" method.
     */
    authTokenHeaderKey?: string;
    /**
     * Session duration, i.e. the time which must elapse from the last authenticted request
     * after which the user must re-authenticate.
     *
     * Expressed as a string describing a time span
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
     */
    sessionDuration?: string | number;
}

export interface VendureConfig {
    /**
     * The name of the property which contains the token of the
     * active channel. This property can be included either in
     * the request header or as a query string.
     */
    channelTokenKey?: string;
    /**
     * The token for the default channel. If not specified, a token
     * will be randomly generated.
     */
    defaultChannelToken?: string | null;
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
     * Configuration for authorization.
     */
    authOptions: AuthOptions;
    /**
     * Defines the strategy used for both storing the primary keys of entities
     * in the database, and the encoding & decoding of those ids when exposing
     * entities via the API. The default uses a simple auto-increment integer
     * strategy.
     */
    entityIdStrategy?: EntityIdStrategy<any>;
    /**
     * Defines how asset files and preview images are named before being saved.
     */
    assetNamingStrategy?: AssetNamingStrategy;
    /**
     * Defines the strategy used for storing uploaded binary files. By default files are
     * persisted to the local file system.
     */
    assetStorageStrategy?: AssetStorageStrategy;
    /**
     * Defines the strategy used for creating preview images of uploaded assets. The default
     * strategy resizes images based on maximum dimensions and outputs a sensible default
     * preview image for other file types.
     */
    assetPreviewStrategy?: AssetPreviewStrategy;
    /**
     * The connection options used by TypeORM to connect to the database.
     */
    dbConnectionOptions: ConnectionOptions;
    /**
     * An array of conditions which can be used to construct Promotions
     */
    promotionConditions?: Array<PromotionCondition<any>>;
    /**
     * An array of actions which can be used to construct Promotions
     */
    promotionActions?: Array<PromotionAction<any>>;
    /**
     * Defines custom fields which can be used to extend the built-in entities.
     */
    customFields?: CustomFields;
    /**
     * The max file size in bytes for uploaded assets.
     */
    uploadMaxFileSize?: number;
    /**
     * Custom Express middleware for the server.
     */
    middleware?: Array<{ handler: RequestHandler; route: string }>;
    /**
     * An array of plugins.
     */
    plugins?: VendurePlugin[];
}

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
