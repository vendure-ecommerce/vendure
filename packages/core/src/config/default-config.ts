import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    DEFAULT_AUTH_TOKEN_HEADER_KEY,
    SUPER_ADMIN_USER_IDENTIFIER,
    SUPER_ADMIN_USER_PASSWORD,
} from '@vendure/common/lib/shared-constants';

import { InMemoryJobQueueStrategy } from '../job-queue/in-memory-job-queue-strategy';

import { DefaultAssetNamingStrategy } from './asset-naming-strategy/default-asset-naming-strategy';
import { NoAssetPreviewStrategy } from './asset-preview-strategy/no-asset-preview-strategy';
import { NoAssetStorageStrategy } from './asset-storage-strategy/no-asset-storage-strategy';
import { NativeAuthenticationStrategy } from './auth/native-authentication-strategy';
import { defaultCollectionFilters } from './catalog/default-collection-filters';
import { DefaultProductVariantPriceCalculationStrategy } from './catalog/default-product-variant-price-calculation-strategy';
import { DefaultStockDisplayStrategy } from './catalog/default-stock-display-strategy';
import { AutoIncrementIdStrategy } from './entity-id-strategy/auto-increment-id-strategy';
import { manualFulfillmentHandler } from './fulfillment/manual-fulfillment-handler';
import { DefaultLogger } from './logger/default-logger';
import { DefaultChangedPriceHandlingStrategy } from './order/default-changed-price-handling-strategy';
import { DefaultOrderItemPriceCalculationStrategy } from './order/default-order-item-price-calculation-strategy';
import { DefaultOrderPlacedStrategy } from './order/default-order-placed-strategy';
import { DefaultStockAllocationStrategy } from './order/default-stock-allocation-strategy';
import { MergeOrdersStrategy } from './order/merge-orders-strategy';
import { DefaultOrderCodeStrategy } from './order/order-code-strategy';
import { UseGuestStrategy } from './order/use-guest-strategy';
import { defaultPromotionActions, defaultPromotionConditions } from './promotion';
import { InMemorySessionCacheStrategy } from './session-cache/in-memory-session-cache-strategy';
import { defaultShippingCalculator } from './shipping-method/default-shipping-calculator';
import { defaultShippingEligibilityChecker } from './shipping-method/default-shipping-eligibility-checker';
import { DefaultTaxLineCalculationStrategy } from './tax/default-tax-line-calculation-strategy';
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
        adminListQueryLimit: 1000,
        adminApiValidationRules: [],
        shopApiPath: 'shop-api',
        shopApiPlayground: false,
        shopApiDebug: false,
        shopListQueryLimit: 100,
        shopApiValidationRules: [],
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
        cookieOptions: {
            secret: Math.random().toString(36).substr(3),
            httpOnly: true,
        },
        authTokenHeaderKey: DEFAULT_AUTH_TOKEN_HEADER_KEY,
        sessionDuration: '1y',
        sessionCacheStrategy: new InMemorySessionCacheStrategy(),
        sessionCacheTTL: 300,
        requireVerification: true,
        verificationTokenDuration: '7d',
        superadminCredentials: {
            identifier: SUPER_ADMIN_USER_IDENTIFIER,
            password: SUPER_ADMIN_USER_PASSWORD,
        },
        shopAuthenticationStrategy: [new NativeAuthenticationStrategy()],
        adminAuthenticationStrategy: [new NativeAuthenticationStrategy()],
        customPermissions: [],
    },
    catalogOptions: {
        collectionFilters: defaultCollectionFilters,
        productVariantPriceCalculationStrategy: new DefaultProductVariantPriceCalculationStrategy(),
        stockDisplayStrategy: new DefaultStockDisplayStrategy(),
    },
    entityIdStrategy: new AutoIncrementIdStrategy(),
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new NoAssetStorageStrategy(),
        assetPreviewStrategy: new NoAssetPreviewStrategy(),
        permittedFileTypes: ['image/*', 'video/*', 'audio/*', '.pdf'],
        uploadMaxFileSize: 20971520,
    },
    dbConnectionOptions: {
        timezone: 'Z',
        type: 'mysql',
    },
    promotionOptions: {
        promotionConditions: defaultPromotionConditions,
        promotionActions: defaultPromotionActions,
    },
    shippingOptions: {
        shippingEligibilityCheckers: [defaultShippingEligibilityChecker],
        shippingCalculators: [defaultShippingCalculator],
        customFulfillmentProcess: [],
        fulfillmentHandlers: [manualFulfillmentHandler],
    },
    orderOptions: {
        orderItemsLimit: 999,
        orderLineItemsLimit: 999,
        orderItemPriceCalculationStrategy: new DefaultOrderItemPriceCalculationStrategy(),
        mergeStrategy: new MergeOrdersStrategy(),
        checkoutMergeStrategy: new UseGuestStrategy(),
        process: [],
        stockAllocationStrategy: new DefaultStockAllocationStrategy(),
        orderCodeStrategy: new DefaultOrderCodeStrategy(),
        changedPriceHandlingStrategy: new DefaultChangedPriceHandlingStrategy(),
        orderPlacedStrategy: new DefaultOrderPlacedStrategy(),
    },
    paymentOptions: {
        paymentMethodEligibilityCheckers: [],
        paymentMethodHandlers: [],
        customPaymentProcess: [],
    },
    taxOptions: {
        taxZoneStrategy: new DefaultTaxZoneStrategy(),
        taxLineCalculationStrategy: new DefaultTaxLineCalculationStrategy(),
    },
    importExportOptions: {
        importAssetsDir: __dirname,
    },
    jobQueueOptions: {
        jobQueueStrategy: new InMemoryJobQueueStrategy(),
        activeQueues: [],
    },
    customFields: {
        Address: [],
        Administrator: [],
        Asset: [],
        Channel: [],
        Collection: [],
        Customer: [],
        Facet: [],
        FacetValue: [],
        Fulfillment: [],
        GlobalSettings: [],
        Order: [],
        OrderLine: [],
        Product: [],
        ProductOption: [],
        ProductOptionGroup: [],
        ProductVariant: [],
        User: [],
        ShippingMethod: [],
    },
    plugins: [],
};
