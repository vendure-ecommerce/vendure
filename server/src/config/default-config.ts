import { LanguageCode } from '../../../shared/generated-types';
import { API_PATH, API_PORT } from '../../../shared/shared-constants';
import { CustomFields } from '../../../shared/shared-types';
import { ReadOnlyRequired } from '../common/types/common-types';

import { DefaultAssetNamingStrategy } from './asset-naming-strategy/default-asset-naming-strategy';
import { NoAssetPreviewStrategy } from './asset-preview-strategy/no-asset-preview-strategy';
import { NoAssetStorageStrategy } from './asset-storage-strategy/no-asset-storage-strategy';
import { NoopEmailGenerator } from './email/noop-email-generator';
import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { MergeOrdersStrategy } from './order-merge-strategy/merge-orders-strategy';
import { UseGuestStrategy } from './order-merge-strategy/use-guest-strategy';
import { defaultPromotionActions } from './promotion/default-promotion-actions';
import { defaultPromotionConditions } from './promotion/default-promotion-conditions';
import { defaultShippingCalculator } from './shipping-method/default-shipping-calculator';
import { defaultShippingEligibilityChecker } from './shipping-method/default-shipping-eligibility-checker';
import { VendureConfig } from './vendure-config';

/**
 * The default configuration settings which are used if not explicitly overridden in the bootstrap() call.
 */
export const defaultConfig: ReadOnlyRequired<VendureConfig> = {
    channelTokenKey: 'vendure-token',
    defaultChannelToken: null,
    defaultLanguageCode: LanguageCode.en,
    hostname: '',
    port: API_PORT,
    cors: {
        origin: true,
        credentials: true,
    },
    silent: false,
    authOptions: {
        disableAuth: false,
        tokenMethod: 'cookie',
        sessionSecret: 'session-secret',
        authTokenHeaderKey: 'vendure-auth-token',
        sessionDuration: '7d',
        requireVerification: true,
        verificationTokenDuration: '7d',
    },
    apiPath: API_PATH,
    entityIdStrategy: new AutoIncrementIdStrategy(),
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new NoAssetStorageStrategy(),
        assetPreviewStrategy: new NoAssetPreviewStrategy(),
        uploadMaxFileSize: 20971520,
    },
    dbConnectionOptions: {
        type: 'mysql',
    },
    promotionOptions: {
        promotionConditions: defaultPromotionConditions,
        promotionActions: defaultPromotionActions,
    },
    shippingOptions: {
        shippingEligibilityCheckers: [defaultShippingEligibilityChecker],
        shippingCalculators: [defaultShippingCalculator],
    },
    orderProcessOptions: {},
    orderMergeOptions: {
        mergeStrategy: new MergeOrdersStrategy(),
        checkoutMergeStrategy: new UseGuestStrategy(),
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    emailOptions: {
        emailTemplatePath: __dirname,
        emailTypes: {},
        generator: new NoopEmailGenerator(),
        transport: {
            type: 'none',
        },
    },
    importExportOptions: {
        importAssetsDir: __dirname,
    },
    customFields: {
        Address: [],
        Customer: [],
        Facet: [],
        FacetValue: [],
        Product: [],
        ProductCategory: [],
        ProductOption: [],
        ProductOptionGroup: [],
        ProductVariant: [],
        User: [],
    } as ReadOnlyRequired<CustomFields>,
    middleware: [],
    plugins: [],
};
