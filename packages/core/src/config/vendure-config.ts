import { DynamicModule, Type } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { PluginDefinition } from 'apollo-server-core';
import { ValidationContext } from 'graphql';
import { ConnectionOptions } from 'typeorm';

import { Middleware } from '../common';
import { PermissionDefinition } from '../common/permission-definition';
import { JobBufferStorageStrategy } from '../job-queue/job-buffer/job-buffer-storage-strategy';

import { AssetImportStrategy } from './asset-import-strategy/asset-import-strategy';
import { AssetNamingStrategy } from './asset-naming-strategy/asset-naming-strategy';
import { AssetPreviewStrategy } from './asset-preview-strategy/asset-preview-strategy';
import { AssetStorageStrategy } from './asset-storage-strategy/asset-storage-strategy';
import { AuthenticationStrategy } from './auth/authentication-strategy';
import { PasswordHashingStrategy } from './auth/password-hashing-strategy';
import { PasswordValidationStrategy } from './auth/password-validation-strategy';
import { CollectionFilter } from './catalog/collection-filter';
import { ProductVariantPriceCalculationStrategy } from './catalog/product-variant-price-calculation-strategy';
import { StockDisplayStrategy } from './catalog/stock-display-strategy';
import { CustomFields } from './custom-field/custom-field-types';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { EntityMetadataModifier } from './entity-metadata/entity-metadata-modifier';
import { CustomFulfillmentProcess } from './fulfillment/custom-fulfillment-process';
import { FulfillmentHandler } from './fulfillment/fulfillment-handler';
import { JobQueueStrategy } from './job-queue/job-queue-strategy';
import { VendureLogger } from './logger/vendure-logger';
import { ActiveOrderStrategy } from './order/active-order-strategy';
import { ChangedPriceHandlingStrategy } from './order/changed-price-handling-strategy';
import { CustomOrderProcess } from './order/custom-order-process';
import { OrderByCodeAccessStrategy } from './order/order-by-code-access-strategy';
import { OrderCodeStrategy } from './order/order-code-strategy';
import { OrderItemPriceCalculationStrategy } from './order/order-item-price-calculation-strategy';
import { OrderMergeStrategy } from './order/order-merge-strategy';
import { OrderPlacedStrategy } from './order/order-placed-strategy';
import { StockAllocationStrategy } from './order/stock-allocation-strategy';
import { CustomPaymentProcess } from './payment/custom-payment-process';
import { PaymentMethodEligibilityChecker } from './payment/payment-method-eligibility-checker';
import { PaymentMethodHandler } from './payment/payment-method-handler';
import { PromotionAction } from './promotion/promotion-action';
import { PromotionCondition } from './promotion/promotion-condition';
import { SessionCacheStrategy } from './session-cache/session-cache-strategy';
import { ShippingCalculator } from './shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from './shipping-method/shipping-eligibility-checker';
import { HealthCheckStrategy } from './system/health-check-strategy';
import { TaxLineCalculationStrategy } from './tax/tax-line-calculation-strategy';
import { TaxZoneStrategy } from './tax/tax-zone-strategy';

/**
 * @description
 * The ApiOptions define how the Vendure GraphQL APIs are exposed, as well as allowing the API layer
 * to be extended with middleware.
 *
 * @docsCategory configuration
 */
export interface ApiOptions {
    /**
     * @description
     * Set the hostname of the server. If not set, the server will be available on localhost.
     *
     * @default ''
     */
    hostname?: string;
    /**
     * @description
     * Which port the Vendure server should listen on.
     *
     * @default 3000
     */
    port: number;
    /**
     * @description
     * The path to the admin GraphQL API.
     *
     * @default 'admin-api'
     */
    adminApiPath?: string;
    /**
     * @description
     * The path to the shop GraphQL API.
     *
     * @default 'shop-api'
     */
    shopApiPath?: string;
    /**
     * @description
     * The playground config to the admin GraphQL API
     * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
     *
     * @default false
     */
    adminApiPlayground?: boolean | any;
    /**
     * @description
     * The playground config to the shop GraphQL API
     * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
     *
     * @default false
     */
    shopApiPlayground?: boolean | any;
    /**
     * @description
     * The debug config to the admin GraphQL API
     * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
     *
     * @default false
     */
    adminApiDebug?: boolean;
    /**
     * @description
     * The debug config to the shop GraphQL API
     * [ApolloServer playground](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#constructoroptions-apolloserver).
     *
     * @default false
     */
    shopApiDebug?: boolean;
    /**
     * @description
     * The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
     * this is the upper limit of the `take` input option.
     *
     * @default 100
     */
    shopListQueryLimit?: number;
    /**
     * @description
     * The maximum number of items that may be returned by a query which returns a `PaginatedList` response. In other words,
     * this is the upper limit of the `take` input option.
     *
     * @default 1000
     */
    adminListQueryLimit?: number;
    /**
     * @description
     * Custom functions to use as additional validation rules when validating the schema for the admin GraphQL API
     * [ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
     *
     * @default []
     */
    adminApiValidationRules?: Array<(context: ValidationContext) => any>;
    /**
     * @description
     * Custom functions to use as additional validation rules when validating the schema for the shop GraphQL API
     * [ApolloServer validation rules](https://www.apollographql.com/docs/apollo-server/api/apollo-server/#validationrules).
     *
     * @default []
     */
    shopApiValidationRules?: Array<(context: ValidationContext) => any>;
    /**
     * @description
     * The name of the property which contains the token of the
     * active channel. This property can be included either in
     * the request header or as a query string.
     *
     * @default 'vendure-token'
     */
    channelTokenKey?: string;
    /**
     * @description
     * Set the CORS handling for the server. See the [express CORS docs](https://github.com/expressjs/cors#configuration-options).
     *
     * @default { origin: true, credentials: true }
     */
    cors?: boolean | CorsOptions;
    /**
     * @description
     * Custom Express or NestJS middleware for the server.
     *
     * @default []
     */
    middleware?: Middleware[];
    /**
     * @description
     * Custom [ApolloServerPlugins](https://www.apollographql.com/docs/apollo-server/integrations/plugins/) which
     * allow the extension of the Apollo Server, which is the underlying GraphQL server used by Vendure.
     *
     * Apollo plugins can be used e.g. to perform custom data transformations on incoming operations or outgoing
     * data.
     *
     * @default []
     */
    apolloServerPlugins?: PluginDefinition[];
    /**
     * @description
     * Controls whether introspection of the GraphQL APIs is enabled. For production, it is recommended to disable
     * introspection, since exposing your entire schema can allow an attacker to trivially learn all operations
     * and much more easily find any potentially exploitable queries.
     *
     * **Note:** when introspection is disabled, tooling which relies on it for things like autocompletion
     * will not work.
     *
     * @example
     * ```TypeScript
     * {
     *   introspection: process.env.NODE_ENV !== 'production'
     * }
     * ```
     *
     * @default true
     * @since 1.5.0
     */
    introspection?: boolean;
}

/**
 * @description
 * Options for the handling of the cookies used to track sessions (only applicable if
 * `authOptions.tokenMethod` is set to `'cookie'`). These options are passed directly
 * to the Express [cookie-session middleware](https://github.com/expressjs/cookie-session).
 *
 * @docsCategory auth
 */
export interface CookieOptions {
    /**
     * @description
     * The name of the cookie to set.
     *
     * @default 'session'
     */
    name?: string;

    /**
     * @description
     * The secret used for signing the session cookies for authenticated users. Only applies
     * tokenMethod is set to 'cookie'.
     *
     * In production applications, this should not be stored as a string in
     * source control for security reasons, but may be loaded from an external
     * file not under source control, or from an environment variable, for example.
     *
     * @default (random character string)
     */
    secret?: string;

    /**
     * @description
     * a string indicating the path of the cookie.
     *
     * @default '/'
     */
    path?: string;

    /**
     * @description
     * a string indicating the domain of the cookie (no default).
     */
    domain?: string;

    /**
     * @description
     * a boolean or string indicating whether the cookie is a "same site" cookie (false by default). This can be set to 'strict',
     * 'lax', 'none', or true (which maps to 'strict').
     *
     * @default false
     */
    sameSite?: 'strict' | 'lax' | 'none' | boolean;

    /**
     * @description
     * a boolean indicating whether the cookie is only to be sent over HTTPS (false by default for HTTP, true by default for HTTPS).
     */
    secure?: boolean;

    /**
     * @description
     * a boolean indicating whether the cookie is only to be sent over HTTPS (use this if you handle SSL not in your node process).
     */
    secureProxy?: boolean;

    /**
     * @description
     * a boolean indicating whether the cookie is only to be sent over HTTP(S), and not made available to client JavaScript (true by default).
     *
     * @default true
     */
    httpOnly?: boolean;

    /**
     * @description
     * a boolean indicating whether the cookie is to be signed (true by default). If this is true, another cookie of the same name with the .sig
     * suffix appended will also be sent, with a 27-byte url-safe base64 SHA1 value representing the hash of cookie-name=cookie-value against the
     * first Keygrip key. This signature key is used to detect tampering the next time a cookie is received.
     */
    signed?: boolean;

    /**
     * @description
     * a boolean indicating whether to overwrite previously set cookies of the same name (true by default). If this is true, all cookies set during
     * the same request with the same name (regardless of path or domain) are filtered out of the Set-Cookie header when setting this cookie.
     */
    overwrite?: boolean;
}

/**
 * @description
 * The AuthOptions define how authentication and authorization is managed.
 *
 * @docsCategory auth
 * */
export interface AuthOptions {
    /**
     * @description
     * Disable authentication & permissions checks.
     * NEVER set the to true in production. It exists
     * only to aid certain development tasks.
     *
     * @default false
     */
    disableAuth?: boolean;
    /**
     * @description
     * Sets the method by which the session token is delivered and read.
     *
     * * 'cookie': Upon login, a 'Set-Cookie' header will be returned to the client, setting a
     *   cookie containing the session token. A browser-based client (making requests with credentials)
     *   should automatically send the session cookie with each request.
     * * 'bearer': Upon login, the token is returned in the response and should be then stored by the
     *   client app. Each request should include the header `Authorization: Bearer <token>`.
     *
     * Note that if the bearer method is used, Vendure will automatically expose the configured
     * `authTokenHeaderKey` in the server's CORS configuration (adding `Access-Control-Expose-Headers: vendure-auth-token`
     * by default).
     *
     * From v1.2.0 it is possible to specify both methods as a tuple: `['cookie', 'bearer']`.
     *
     * @default 'cookie'
     */
    tokenMethod?: 'cookie' | 'bearer' | ReadonlyArray<'cookie' | 'bearer'>;
    /**
     * @description
     * Options related to the handling of cookies when using the 'cookie' tokenMethod.
     */
    cookieOptions?: CookieOptions;
    /**
     * @description
     * Sets the header property which will be used to send the auth token when using the 'bearer' method.
     *
     * @default 'vendure-auth-token'
     */
    authTokenHeaderKey?: string;
    /**
     * @description
     * Session duration, i.e. the time which must elapse from the last authenticated request
     * after which the user must re-authenticate.
     *
     * Expressed as a string describing a time span per
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
     *
     * @default '1y'
     */
    sessionDuration?: string | number;
    /**
     * @description
     * This strategy defines how sessions will be cached. By default, sessions are cached using a simple
     * in-memory caching strategy which is suitable for development and low-traffic, single-instance
     * deployments.
     *
     * @default InMemorySessionCacheStrategy
     */
    sessionCacheStrategy?: SessionCacheStrategy;
    /**
     * @description
     * The "time to live" of a given item in the session cache. This determines the length of time (in seconds)
     * that a cache entry is kept before being considered "stale" and being replaced with fresh data
     * taken from the database.
     *
     * @default 300
     */
    sessionCacheTTL?: number;
    /**
     * @description
     * Determines whether new User accounts require verification of their email address.
     *
     * If set to "true", when registering via the `registerCustomerAccount` mutation, one should *not* set the
     * `password` property - doing so will result in an error. Instead, the password is set at a later stage
     * (once the email with the verification token has been opened) via the `verifyCustomerAccount` mutation.
     *
     * @default true
     */
    requireVerification?: boolean;
    /**
     * @description
     * Sets the length of time that a verification token is valid for, after which the verification token must be refreshed.
     *
     * Expressed as a string describing a time span per
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: `60`, `'2 days'`, `'10h'`, `'7d'`
     *
     * @default '7d'
     */
    verificationTokenDuration?: string | number;
    /**
     * @description
     * Configures the credentials to be used to create a superadmin
     */
    superadminCredentials?: SuperadminCredentials;
    /**
     * @description
     * Configures one or more AuthenticationStrategies which defines how authentication
     * is handled in the Shop API.
     * @default NativeAuthenticationStrategy
     */
    shopAuthenticationStrategy?: AuthenticationStrategy[];
    /**
     * @description
     * Configures one or more AuthenticationStrategy which defines how authentication
     * is handled in the Admin API.
     * @default NativeAuthenticationStrategy
     */
    adminAuthenticationStrategy?: AuthenticationStrategy[];
    /**
     * @description
     * Allows custom Permissions to be defined, which can be used to restrict access to custom
     * GraphQL resolvers defined in plugins.
     *
     * @default []
     */
    customPermissions?: PermissionDefinition[];
    /**
     * @description
     * Allows you to customize the way passwords are hashed when using the {@link NativeAuthenticationStrategy}.
     *
     * @default BcryptPasswordHashingStrategy
     * @since 1.3.0
     */
    passwordHashingStrategy?: PasswordHashingStrategy;
    /**
     * @description
     * Allows you to set a custom policy for passwords when using the {@link NativeAuthenticationStrategy}.
     * By default, it uses the {@link DefaultPasswordValidationStrategy}, which will impose a minimum length
     * of four characters. To improve security for production, you are encouraged to specify a more strict
     * policy, which you can do like this:
     *
     * @example
     * ```ts
     * {
     *   passwordValidationStrategy: new DefaultPasswordValidationStrategy({
     *     // Minimum eight characters, at least one letter and one number
     *     regexp: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
     *   }),
     * }
     * ```
     *
     * @since 1.5.0
     * @default DefaultPasswordValidationStrategy
     */
    passwordValidationStrategy?: PasswordValidationStrategy;
}

/**
 * @docsCategory orders
 * @docsPage OrderOptions
 * */
export interface OrderOptions {
    /**
     * @description
     * The maximum number of individual items allowed in a single order. This option exists
     * to prevent excessive resource usage when dealing with very large orders. For example,
     * if an order contains a million items, then any operations on that order (modifying a quantity,
     * adding or removing an item) will require Vendure to loop through all million items
     * to perform price calculations against active promotions and taxes. This can have a significant
     * performance impact for very large values.
     *
     * Attempting to exceed this limit will cause Vendure to throw a {@link OrderItemsLimitError}.
     *
     * @default 999
     */
    orderItemsLimit?: number;
    /**
     * @description
     * The maximum number of items allowed per order line. This option is an addition
     * on the `orderItemsLimit` for more granular control. Note `orderItemsLimit` is still
     * important in order to prevent excessive resource usage.
     *
     * Attempting to exceed this limit will cause Vendure to throw a {@link OrderItemsLimitError}.
     *
     * @default 999
     */
    orderLineItemsLimit?: number;
    /**
     * @description
     * Defines the logic used to calculate the unit price of an OrderItem when adding an
     * item to an Order.
     *
     * @default DefaultPriceCalculationStrategy
     */
    orderItemPriceCalculationStrategy?: OrderItemPriceCalculationStrategy;
    /**
     * @description
     * Allows the definition of custom states and transition logic for the order process state machine.
     * Takes an array of objects implementing the {@link CustomOrderProcess} interface.
     *
     * @default []
     */
    process?: Array<CustomOrderProcess<any>>;
    /**
     * @description
     * Determines the point of the order process at which stock gets allocated.
     *
     * @default DefaultStockAllocationStrategy
     */
    stockAllocationStrategy?: StockAllocationStrategy;
    /**
     * @description
     * Defines the strategy used to merge a guest Order and an existing Order when
     * signing in.
     *
     * @default MergeOrdersStrategy
     */
    mergeStrategy?: OrderMergeStrategy;
    /**
     * @description
     * Defines the strategy used to merge a guest Order and an existing Order when
     * signing in as part of the checkout flow.
     *
     * @default UseGuestStrategy
     */
    checkoutMergeStrategy?: OrderMergeStrategy;
    /**
     * @description
     * Allows a user-defined function to create Order codes. This can be useful when
     * integrating with existing systems. By default, Vendure will generate a 16-character
     * alphanumeric string.
     *
     * Note: when using a custom function for Order codes, bear in mind the database limit
     * for string types (e.g. 255 chars for a varchar field in MySQL), and also the need
     * for codes to be unique.
     *
     * @default DefaultOrderCodeStrategy
     */
    orderCodeStrategy?: OrderCodeStrategy;
    /**
     * @description
     * Defines the strategy used to check if and how an Order may be retrieved via the orderByCode query.
     *
     * The default strategy permits permanent access to the Customer owning the Order and anyone
     * within 2 hours after placing the Order.
     *
     * @since 1.1.0
     * @default DefaultOrderByCodeAccessStrategy
     */
    orderByCodeAccessStrategy?: OrderByCodeAccessStrategy;
    /**
     * @description
     * Defines how we handle the situation where an OrderItem exists in an Order, and
     * then later on another is added but in the mean time the price of the ProductVariant has changed.
     *
     * By default, the latest price will be used. Any price changes resulting from using a newer price
     * will be reflected in the GraphQL `OrderLine.unitPrice[WithTax]ChangeSinceAdded` field.
     *
     * @default DefaultChangedPriceHandlingStrategy
     */
    changedPriceHandlingStrategy?: ChangedPriceHandlingStrategy;
    /**
     * @description
     * Defines the point of the order process at which the Order is set as "placed".
     *
     * @default DefaultOrderPlacedStrategy
     */
    orderPlacedStrategy?: OrderPlacedStrategy;
    /**
     * @description
     * Defines the strategy used to determine the active Order when interacting with Shop API operations
     * such as `activeOrder` and `addItemToOrder`. By default, the strategy uses the active Session.
     *
     * Note that if multiple strategies are defined, they will be checked in order and the first one that
     * returns an Order will be used.
     *
     * @since 1.9.0
     * @default DefaultActiveOrderStrategy
     */
    activeOrderStrategy?: ActiveOrderStrategy | ActiveOrderStrategy[];
}

/**
 * @description
 * The AssetOptions define how assets (images and other files) are named and stored, and how preview images are generated.
 *
 * **Note**: If you are using the `AssetServerPlugin`, it is not necessary to configure these options.
 *
 * @docsCategory assets
 * */
export interface AssetOptions {
    /**
     * @description
     * Defines how asset files and preview images are named before being saved.
     *
     * @default DefaultAssetNamingStrategy
     */
    assetNamingStrategy?: AssetNamingStrategy;
    /**
     * @description
     * Defines the strategy used for storing uploaded binary files.
     *
     * @default NoAssetStorageStrategy
     */
    assetStorageStrategy?: AssetStorageStrategy;
    /**
     * @description
     * Defines the strategy used for creating preview images of uploaded assets.
     *
     * @default NoAssetPreviewStrategy
     */
    assetPreviewStrategy?: AssetPreviewStrategy;
    /**
     * @description
     * An array of the permitted file types that may be uploaded as Assets. Each entry
     * should be in the form of a valid
     * [unique file type specifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)
     * i.e. either a file extension (".pdf") or a mime type ("image/*", "audio/mpeg" etc.).
     *
     * @default image, audio, video MIME types plus PDFs
     */
    permittedFileTypes?: string[];
    /**
     * @description
     * The max file size in bytes for uploaded assets.
     *
     * @default 20971520
     */
    uploadMaxFileSize?: number;
}

/**
 * @description
 * Options related to products and collections.
 *
 * @docsCategory configuration
 */
export interface CatalogOptions {
    /**
     * @description
     * Allows custom {@link CollectionFilter}s to be defined.
     *
     * @default defaultCollectionFilters
     */
    collectionFilters?: Array<CollectionFilter<any>>;
    /**
     * @description
     * Defines the strategy used for calculating the price of ProductVariants based
     * on the Channel settings and active tax Zone.
     *
     * @default DefaultTaxCalculationStrategy
     */
    productVariantPriceCalculationStrategy?: ProductVariantPriceCalculationStrategy;
    /**
     * @description
     * Defines how the `ProductVariant.stockLevel` value is obtained. It is usually not desirable
     * to directly expose stock levels over a public API, as this could be considered a leak of
     * sensitive information. However, the storefront will usually want to display _some_ indication
     * of whether a given ProductVariant is in stock. The default StockDisplayStrategy will
     * display "IN_STOCK", "OUT_OF_STOCK" or "LOW_STOCK" rather than exposing the actual saleable
     * stock level.
     *
     * @default DefaultStockDisplayStrategy
     */
    stockDisplayStrategy?: StockDisplayStrategy;
}

/**
 * @docsCategory promotions
 */
export interface PromotionOptions {
    /**
     * @description
     * An array of conditions which can be used to construct Promotions
     */
    promotionConditions?: Array<PromotionCondition<any>>;
    /**
     * @description
     * An array of actions which can be used to construct Promotions
     */
    promotionActions?: Array<PromotionAction<any>>;
}

/**
 * @docsCategory shipping
 * */
export interface ShippingOptions {
    /**
     * @description
     * An array of available ShippingEligibilityCheckers for use in configuring ShippingMethods
     */
    shippingEligibilityCheckers?: Array<ShippingEligibilityChecker<any>>;
    /**
     * @description
     * An array of available ShippingCalculators for use in configuring ShippingMethods
     */
    shippingCalculators?: Array<ShippingCalculator<any>>;

    /**
     * @description
     * Allows the definition of custom states and transition logic for the fulfillment process state machine.
     * Takes an array of objects implementing the {@link CustomFulfillmentProcess} interface.
     */
    customFulfillmentProcess?: Array<CustomFulfillmentProcess<any>>;

    /**
     * @description
     * An array of available FulfillmentHandlers.
     */
    fulfillmentHandlers?: Array<FulfillmentHandler<any>>;
}

/**
 * @description
 * These credentials will be used to create the Superadmin user & administrator
 * when Vendure first bootstraps.
 *
 * @docsCategory auth
 */
export interface SuperadminCredentials {
    /**
     * @description
     * The identifier to be used to create a superadmin account
     * @default 'superadmin'
     */
    identifier: string;

    /**
     * @description
     * The password to be used to create a superadmin account
     * @default 'superadmin'
     */
    password: string;
}

/**
 * @description
 * Defines payment-related options in the {@link VendureConfig}.
 *
 * @docsCategory payment
 * */
export interface PaymentOptions {
    /**
     * @description
     * Defines which {@link PaymentMethodHandler}s are available when configuring
     * {@link PaymentMethod}s
     */
    paymentMethodHandlers: PaymentMethodHandler[];
    /**
     * @description
     * Defines which {@link PaymentMethodEligibilityChecker}s are available when configuring
     * {@link PaymentMethod}s
     */
    paymentMethodEligibilityCheckers?: PaymentMethodEligibilityChecker[];
    /**
     * @description
     * Allows the definition of custom states and transition logic for the payment process state machine.
     * Takes an array of objects implementing the {@link CustomPaymentProcess} interface.
     */
    customPaymentProcess?: Array<CustomPaymentProcess<any>>;
}

/**
 * @docsCategory tax
 *
 * */
export interface TaxOptions {
    /**
     * @description
     * Defines the strategy used to determine the applicable Zone used in tax calculations.
     *
     * @default DefaultTaxZoneStrategy
     */
    taxZoneStrategy?: TaxZoneStrategy;
    /**
     * @description
     * Defines the strategy used to calculate the TaxLines added to OrderItems.
     *
     * @default DefaultTaxLineCalculationStrategy
     */
    taxLineCalculationStrategy?: TaxLineCalculationStrategy;
}

/**
 * @description
 * Options related to importing & exporting data.
 *
 * @docsCategory import-export
 */
export interface ImportExportOptions {
    /**
     * @description
     * The directory in which assets to be imported are located.
     *
     * @default __dirname
     */
    importAssetsDir?: string;
    /**
     * @description
     * This strategy determines how asset files get imported based on the path given in the
     * import CSV or via the {@link AssetImporter} `getAssets()` method.
     *
     * @since 1.7.0
     */
    assetImportStrategy?: AssetImportStrategy;
}

/**
 * @description
 * Options related to the built-in job queue.
 *
 * @docsCategory JobQueue
 */
export interface JobQueueOptions {
    /**
     * @description
     * Defines how the jobs in the queue are persisted and accessed.
     *
     * @default InMemoryJobQueueStrategy
     */
    jobQueueStrategy?: JobQueueStrategy;
    jobBufferStorageStrategy?: JobBufferStorageStrategy;
    /**
     * @description
     * Defines the queues that will run in this process.
     * This can be used to configure only certain queues to run in this process.
     * If its empty all queues will be run. Note: this option is primarily intended
     * to apply to the Worker process. Jobs will _always_ get published to the queue
     * regardless of this setting, but this setting determines whether they get
     * _processed_ or not.
     */
    activeQueues?: string[];
    /**
     * @description
     * When set to `true`, a health check will be run on the worker. This is done by
     * adding a `check-worker-health` job to the job queue, which, when successfully
     * processed by the worker, indicates that it is healthy.
     *
     * **Important Note:** This health check is unreliable and can be affected by
     * existing long running jobs, see [this issue](https://github.com/vendure-ecommerce/vendure/issues/1112)
     * for further details. For this reason, the health check will be removed entirely in the next major version.
     *
     * @since 1.3.0
     * @default false
     */
    enableWorkerHealthCheck?: boolean;
    /**
     * @description
     * Prefixes all job queue names with the passed string. This is useful with multiple deployments
     * in cloud environments using services such as Amazon SQS or Google Cloud Tasks.
     *
     * For example, we might have a staging and a production deployment in the same account/project and
     * each one will need its own task queue. We can achieve this with a prefix.
     *
     * @since 1.5.0
     */
    prefix?: string;
}

/**
 * @description
 * Options relating to the internal handling of entities.
 *
 * @since 1.3.0
 * @docsCategory configuration
 * @docsPage EntityOptions
 * @docsWeight 0
 */
export interface EntityOptions {
    /**
     * @description
     * Defines the strategy used for both storing the primary keys of entities
     * in the database, and the encoding & decoding of those ids when exposing
     * entities via the API. The default uses a simple auto-increment integer
     * strategy.
     *
     * {{% alert "warning" %}}
     * Note: changing from an integer-based strategy to a uuid-based strategy
     * on an existing Vendure database will lead to problems with broken foreign-key
     * references. To change primary key types like this, you'll need to start with
     * a fresh database.
     * {{% /alert %}}
     *
     * @since 1.3.0
     * @default AutoIncrementIdStrategy
     */
    entityIdStrategy?: EntityIdStrategy<any>;
    /**
     * @description
     * Channels get cached in-memory as they are accessed very frequently. This
     * setting determines how long the cache lives (in ms) until it is considered stale and
     * refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
     * smaller value here will prevent data inconsistencies between instances.
     *
     * @since 1.3.0
     * @default 30000
     */
    channelCacheTtl?: number;
    /**
     * @description
     * Zones get cached in-memory as they are accessed very frequently. This
     * setting determines how long the cache lives (in ms) until it is considered stale and
     * refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
     * smaller value here will prevent data inconsistencies between instances.
     *
     * @since 1.3.0
     * @default 30000
     */
    zoneCacheTtl?: number;
    /**
     * @description
     * TaxRates get cached in-memory as they are accessed very frequently. This
     * setting determines how long the cache lives (in ms) until it is considered stale and
     * refreshed. For multi-instance deployments (e.g. serverless, load-balanced), a
     * smaller value here will prevent data inconsistencies between instances.
     *
     * @since 1.9.0
     * @default 30000
     */
    taxRateCacheTtl?: number;
    /**
     * @description
     * Allows the metadata of the built-in TypeORM entities to be manipulated. This allows you
     * to do things like altering data types, adding indices etc. This is an advanced feature
     * which should be used with some caution as it will result in DB schema changes. For examples
     * see {@link EntityMetadataModifier}.
     *
     * @since 1.6.0
     * @default []
     */
    metadataModifiers?: EntityMetadataModifier[];
}

/**
 * @description
 * Options relating to system functions.
 *
 * @since 1.6.0
 * @docsCategory configuration
 */
export interface SystemOptions {
    /**
     * @description
     * Defines an array of {@link HealthCheckStrategy} instances which are used by the `/health` endpoint to verify
     * that any critical systems which the Vendure server depends on are also healthy.
     *
     * @default [TypeORMHealthCheckStrategy]
     * @since 1.6.0
     */
    healthChecks?: HealthCheckStrategy[];
}

/**
 * @description
 * All possible configuration options are defined by the
 * [`VendureConfig`](https://github.com/vendure-ecommerce/vendure/blob/master/server/src/config/vendure-config.ts) interface.
 *
 * @docsCategory configuration
 * */
export interface VendureConfig {
    /**
     * @description
     * Configuration for the GraphQL APIs, including hostname, port, CORS settings,
     * middleware etc.
     */
    apiOptions: ApiOptions;
    /**
     * @description
     * Configuration for the handling of Assets.
     */
    assetOptions?: AssetOptions;
    /**
     * @description
     * Configuration for authorization.
     */
    authOptions: AuthOptions;
    /**
     * @description
     * Configuration for Products and Collections.
     */
    catalogOptions?: CatalogOptions;
    /**
     * @description
     * Defines custom fields which can be used to extend the built-in entities.
     *
     * @default {}
     */
    customFields?: CustomFields;
    /**
     * @description
     * The connection options used by TypeORM to connect to the database.
     * See the [TypeORM documentation](https://typeorm.io/#/connection-options) for a
     * full description of all available options.
     */
    dbConnectionOptions: ConnectionOptions;
    /**
     * @description
     * The token for the default channel. If not specified, a token
     * will be randomly generated.
     *
     * @default null
     */
    defaultChannelToken?: string | null;
    /**
     * @description
     * The default languageCode of the app.
     *
     * @default LanguageCode.en
     */
    defaultLanguageCode?: LanguageCode;
    /**
     * @description
     * Defines the strategy used for both storing the primary keys of entities
     * in the database, and the encoding & decoding of those ids when exposing
     * entities via the API. The default uses a simple auto-increment integer
     * strategy.
     *
     * @deprecated Use entityOptions.entityIdStrategy instead
     * @default AutoIncrementIdStrategy
     */
    entityIdStrategy?: EntityIdStrategy<any>;
    entityOptions?: EntityOptions;
    /**
     * @description
     * Configuration settings for data import and export.
     */
    importExportOptions?: ImportExportOptions;
    /**
     * @description
     * Configuration settings governing how orders are handled.
     */
    orderOptions?: OrderOptions;
    /**
     * @description
     * Configures available payment processing methods.
     */
    paymentOptions: PaymentOptions;
    /**
     * @description
     * An array of plugins.
     *
     * @default []
     */
    plugins?: Array<DynamicModule | Type<any>>;
    /**
     * @description
     * Configures the Conditions and Actions available when creating Promotions.
     */
    promotionOptions?: PromotionOptions;
    /**
     * @description
     * Configures the available checkers and calculators for ShippingMethods.
     */
    shippingOptions?: ShippingOptions;
    /**
     * @description
     * Provide a logging service which implements the {@link VendureLogger} interface.
     * Note that the logging of SQL queries is controlled separately by the
     * `dbConnectionOptions.logging` property.
     *
     * @default DefaultLogger
     */
    logger?: VendureLogger;
    /**
     * @description
     * Configures how taxes are calculated on products.
     */
    taxOptions?: TaxOptions;
    /**
     * @description
     * Configures how the job queue is persisted and processed.
     */
    jobQueueOptions?: JobQueueOptions;
    /**
     * @description
     * Configures system options
     *
     * @since 1.6.0
     */
    systemOptions?: SystemOptions;
}

/**
 * @description
 * This interface represents the VendureConfig object available at run-time, i.e. the user-supplied
 * config values have been merged with the {@link defaultConfig} values.
 *
 * @docsCategory configuration
 */
export interface RuntimeVendureConfig extends Required<VendureConfig> {
    apiOptions: Required<ApiOptions>;
    assetOptions: Required<AssetOptions>;
    authOptions: Required<AuthOptions>;
    catalogOptions: Required<CatalogOptions>;
    customFields: Required<CustomFields>;
    entityOptions: Required<Omit<EntityOptions, 'entityIdStrategy'>> & EntityOptions;
    importExportOptions: Required<ImportExportOptions>;
    jobQueueOptions: Required<JobQueueOptions>;
    orderOptions: Required<OrderOptions>;
    promotionOptions: Required<PromotionOptions>;
    shippingOptions: Required<ShippingOptions>;
    taxOptions: Required<TaxOptions>;
    systemOptions: Required<SystemOptions>;
}

type DeepPartialSimple<T> = {
    [P in keyof T]?:
        | null
        | (T[P] extends Array<infer U>
              ? Array<DeepPartialSimple<U>>
              : T[P] extends ReadonlyArray<infer X>
              ? ReadonlyArray<DeepPartialSimple<X>>
              : T[P] extends Type<any>
              ? T[P]
              : DeepPartialSimple<T[P]>);
};

export type PartialVendureConfig = DeepPartialSimple<VendureConfig>;
