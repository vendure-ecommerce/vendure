import { LanguageCode } from 'shared/generated-types';
import { API_PATH, API_PORT } from 'shared/shared-constants';
import { CustomFields } from 'shared/shared-types';

import { ReadOnlyRequired } from '../common/types/common-types';

import { defaultAdjustmentActions } from './adjustment/default-adjustment-actions';
import { defaultAdjustmentConditions } from './adjustment/default-adjustment-conditions';
import { DefaultAssetNamingStrategy } from './asset-naming-strategy/default-asset-naming-strategy';
import { NoAssetPreviewStrategy } from './asset-preview-strategy/no-asset-preview-strategy';
import { NoAssetStorageStrategy } from './asset-storage-strategy/no-asset-storage-strategy';
import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { VendureConfig } from './vendure-config';

/**
 * The default configuration settings which are used if not explicitly overridden in the bootstrap() call.
 */
export const defaultConfig: ReadOnlyRequired<VendureConfig> = {
    channelTokenKey: 'vendure-token',
    defaultChannelToken: null,
    defaultLanguageCode: LanguageCode.en,
    port: API_PORT,
    cors: {
        origin: true,
        credentials: true,
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: 'cookie',
        sessionSecret: 'session-secret',
        authTokenHeaderKey: 'vendure-auth-token',
        sessionDuration: '7d',
    },
    apiPath: API_PATH,
    entityIdStrategy: new AutoIncrementIdStrategy(),
    assetNamingStrategy: new DefaultAssetNamingStrategy(),
    assetStorageStrategy: new NoAssetStorageStrategy(),
    assetPreviewStrategy: new NoAssetPreviewStrategy(),
    dbConnectionOptions: {
        type: 'mysql',
    },
    uploadMaxFileSize: 20971520,
    adjustmentConditions: defaultAdjustmentConditions,
    adjustmentActions: defaultAdjustmentActions,
    customFields: {
        Address: [],
        Customer: [],
        Facet: [],
        FacetValue: [],
        Product: [],
        ProductOption: [],
        ProductOptionGroup: [],
        ProductVariant: [],
        User: [],
    } as ReadOnlyRequired<CustomFields>,
    middleware: [],
    plugins: [],
};
