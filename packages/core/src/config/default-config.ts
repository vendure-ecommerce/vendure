import { Transport } from '@nestjs/microservices';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { DEFAULT_AUTH_TOKEN_HEADER_KEY } from '@vendure/common/lib/shared-constants';

import { generatePublicId } from '../common/generate-public-id';
import { InMemoryJobQueueStrategy } from '../job-queue/in-memory-job-queue-strategy';

import { DefaultAssetNamingStrategy } from './asset-naming-strategy/default-asset-naming-strategy';
import { NoAssetPreviewStrategy } from './asset-preview-strategy/no-asset-preview-strategy';
import { NoAssetStorageStrategy } from './asset-storage-strategy/no-asset-storage-strategy';
import { defaultCollectionFilters } from './collection/default-collection-filters';
import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { DefaultLogger } from './logger/default-logger';
import { TypeOrmLogger } from './logger/typeorm-logger';
import { MergeOrdersStrategy } from './order-merge-strategy/merge-orders-strategy';
import { UseGuestStrategy } from './order-merge-strategy/use-guest-strategy';
import { defaultPromotionActions } from './promotion/default-promotion-actions';
import { defaultPromotionConditions } from './promotion/default-promotion-conditions';
import { defaultShippingCalculator } from './shipping-method/default-shipping-calculator';
import { defaultShippingEligibilityChecker } from './shipping-method/default-shipping-eligibility-checker';
import { DefaultTaxCalculationStrategy } from './tax/default-tax-calculation-strategy';
import { DefaultTaxZoneStrategy } from './tax/default-tax-zone-strategy';
import { RuntimeVendureConfig } from './vendure-config';

/**
 * @description
 * The default configuration settings which are used if not explicitly overridden in the bootstrap() call.
 *
 * @docsCategory configuration
 */
export const defaultConfig: RuntimeVendureConfig = {
    defaultChannelToken: null,
    defaultLanguageCode: LanguageCode.en,
    logger: new DefaultLogger(),
    apiOptions: {
        hostname: '',
        port: 3000,
        adminApiPath: 'admin-api',
        adminApiPlayground: false,
        adminApiDebug: false,
        shopApiPath: 'shop-api',
        shopApiPlayground: false,
        shopApiDebug: false,
        channelTokenKey: 'vendure-token',
        cors: {
            origin: true,
            credentials: true,
        },
        middleware: [],
        apolloServerPlugins: [],
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: 'cookie',
        sessionSecret: 'session-secret',
        authTokenHeaderKey: DEFAULT_AUTH_TOKEN_HEADER_KEY,
        sessionDuration: '7d',
        requireVerification: true,
        verificationTokenDuration: '7d',
    },
    catalogOptions: {
        collectionFilters: defaultCollectionFilters,
    },
    entityIdStrategy: new AutoIncrementIdStrategy(),
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new NoAssetStorageStrategy(),
        assetPreviewStrategy: new NoAssetPreviewStrategy(),
        uploadMaxFileSize: 20971520,
    },
    dbConnectionOptions: {
        timezone: 'Z',
        type: 'mysql',
        logger: new TypeOrmLogger(),
    },
    promotionOptions: {
        promotionConditions: defaultPromotionConditions,
        promotionActions: defaultPromotionActions,
    },
    shippingOptions: {
        shippingEligibilityCheckers: [defaultShippingEligibilityChecker],
        shippingCalculators: [defaultShippingCalculator],
    },
    orderOptions: {
        orderItemsLimit: 999,
        mergeStrategy: new MergeOrdersStrategy(),
        checkoutMergeStrategy: new UseGuestStrategy(),
        process: {},
        generateOrderCode: () => generatePublicId(),
    },
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    taxOptions: {
        taxZoneStrategy: new DefaultTaxZoneStrategy(),
        taxCalculationStrategy: new DefaultTaxCalculationStrategy(),
    },
    importExportOptions: {
        importAssetsDir: __dirname,
    },
    workerOptions: {
        runInMainProcess: false,
        transport: Transport.TCP,
        options: {
            port: 3020,
        },
    },
    jobQueueOptions: {
        jobQueueStrategy: new InMemoryJobQueueStrategy(),
        pollInterval: 200,
    },
    customFields: {
        Address: [],
        Collection: [],
        Customer: [],
        Facet: [],
        FacetValue: [],
        GlobalSettings: [],
        Order: [],
        OrderLine: [],
        Product: [],
        ProductOption: [],
        ProductOptionGroup: [],
        ProductVariant: [],
        User: [],
    },
    plugins: [],
};
