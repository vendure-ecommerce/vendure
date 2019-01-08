import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RequestHandler } from 'express';
import { Observable } from 'rxjs';
import { ConnectionOptions } from 'typeorm';

import { LanguageCode } from '../../../shared/generated-types';
import { CustomFields } from '../../../shared/shared-types';
import { Transitions } from '../common/finite-state-machine';
import { Order } from '../entity/order/order.entity';
import { OrderState } from '../service/helpers/order-state-machine/order-state';

import { AssetNamingStrategy } from './asset-naming-strategy/asset-naming-strategy';
import { AssetPreviewStrategy } from './asset-preview-strategy/asset-preview-strategy';
import { AssetStorageStrategy } from './asset-storage-strategy/asset-storage-strategy';
import { EmailGenerator, EmailTypes } from './email/email-options';
import { EmailTransportOptions } from './email/email-transport-options';
import { EntityIdStrategy } from './entity-id-strategy/entity-id-strategy';
import { OrderMergeStrategy } from './order-merge-strategy/order-merge-strategy';
import { PaymentMethodHandler } from './payment-method/payment-method-handler';
import { PromotionAction } from './promotion/promotion-action';
import { PromotionCondition } from './promotion/promotion-condition';
import { ShippingCalculator } from './shipping-method/shipping-calculator';
import { ShippingEligibilityChecker } from './shipping-method/shipping-eligibility-checker';
import { TaxCalculationStrategy } from './tax/tax-calculation-strategy';
import { TaxZoneStrategy } from './tax/tax-zone-strategy';
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
    /**
     * Determines whether new User accounts require verification of their email address.
     */
    requireVerification?: boolean;
    /**
     * Sets the length of time that a verification token is valid for.
     *
     * Expressed as a string describing a time span
     * [zeit/ms](https://github.com/zeit/ms.js).  Eg: 60, "2 days", "10h", "7d"
     */
    verificationTokenDuration?: string | number;
}

export interface OrderProcessOptions<T extends string> {
    /**
     * Define how the custom states fit in with the default order
     * state transitions.
     */
    transtitions?: Partial<Transitions<T | OrderState>>;
    /**
     * Define logic to run before a state tranition takes place. Returning
     * false will prevent the transition from going ahead.
     */
    onTransitionStart?(
        fromState: T,
        toState: T,
        data: { order: Order },
    ): boolean | Promise<boolean> | Observable<boolean> | void;
    /**
     * Define logic to run after a state transition has taken place.
     */
    onTransitionEnd?(fromState: T, toState: T, data: { order: Order }): void;
    /**
     * Define a custom error handler function for transition errors.
     */
    onError?(fromState: T, toState: T, message?: string): void;
}

export interface OrderMergeOptions {
    /**
     * Defines the strategy used to merge a guest Order and an existing Order when
     * signing in.
     */
    mergeStrategy: OrderMergeStrategy;
    /**
     * Defines the strategy used to merge a guest Order and an existing Order when
     * signing in as part of the checkout flow.
     */
    checkoutMergeStrategy: OrderMergeStrategy;
}

export interface AssetOptions {
    /**
     * Defines how asset files and preview images are named before being saved.
     */
    assetNamingStrategy: AssetNamingStrategy;
    /**
     * Defines the strategy used for storing uploaded binary files. By default files are
     * persisted to the local file system.
     */
    assetStorageStrategy: AssetStorageStrategy;
    /**
     * Defines the strategy used for creating preview images of uploaded assets. The default
     * strategy resizes images based on maximum dimensions and outputs a sensible default
     * preview image for other file types.
     */
    assetPreviewStrategy: AssetPreviewStrategy;
    /**
     * The max file size in bytes for uploaded assets.
     */
    uploadMaxFileSize?: number;
}

export interface PromotionOptions {
    /**
     * An array of conditions which can be used to construct Promotions
     */
    promotionConditions?: Array<PromotionCondition<any>>;
    /**
     * An array of actions which can be used to construct Promotions
     */
    promotionActions?: Array<PromotionAction<any>>;
}

export interface ShippingOptions {
    /**
     * An array of available ShippingEligibilityCheckers for use in configuring ShippingMethods
     */
    shippingEligibilityCheckers?: Array<ShippingEligibilityChecker<any>>;
    /**
     * An array of available ShippingCalculator for use in configuring ShippingMethods
     */
    shippingCalculators?: Array<ShippingCalculator<any>>;
}

export interface EmailOptions<EmailType extends string> {
    /**
     * Path to the email template files.
     */
    emailTemplatePath: string;
    /**
     * Configuration for the creation and templating of each email type
     */
    emailTypes?: EmailTypes<EmailType>;
    /**
     * The EmailGenerator uses the EmailContext and template to generate the email body
     */
    generator?: EmailGenerator;
    /**
     * Configuration for the transport (email sending) method
     */
    transport: EmailTransportOptions;
}

export interface PaymentOptions {
    /**
     * An array of payment methods with which to process payments.
     */
    paymentMethodHandlers: Array<PaymentMethodHandler<any>>;
}

export interface TaxOptions {
    /**
     * Defines the strategy used to determine the applicable Zone used in tax calculations.
     */
    taxZoneStrategy: TaxZoneStrategy;
    /**
     * Defines the strategy used for calculating taxes.
     */
    taxCalculationStrategy: TaxCalculationStrategy;
}

export interface ImportExportOptions {
    /**
     * The directory in which assets to be imported are located.
     */
    importAssetsDir?: string;
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
     * Set the hostname of the server.
     */
    hostname?: string;
    /**
     * Which port the Vendure server should listen on.
     */
    port: number;
    /**
     * When set to true, no application logging will be output to the console.
     */
    silent?: boolean;
    /**
     * Configuration for authorization.
     */
    authOptions: AuthOptions;
    /**
     * Configuration for the handling of Assets.
     */
    assetOptions?: AssetOptions;
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
    /**
     * Configures the Conditions and Actions available when creating Promotions.
     */
    promotionOptions?: PromotionOptions;
    /**
     * Configures the available checkers and calculators for ShippingMethods.
     */
    shippingOptions?: ShippingOptions;
    /**
     * Defines custom fields which can be used to extend the built-in entities.
     */
    customFields?: CustomFields;
    /**
     * Defines custom states in the order process finite state machine.
     */
    orderProcessOptions?: OrderProcessOptions<any>;
    /**
     * Define the strategies governing how Orders are merged when an existing
     * Customer signs in.
     */
    orderMergeOptions?: OrderMergeOptions;
    /**
     * Configures available payment processing methods.
     */
    paymentOptions: PaymentOptions;
    /**
     * Configures how taxes are calculated on products.
     */
    taxOptions?: TaxOptions;
    /**
     * Configures the handling of transactional emails.
     */
    emailOptions?: EmailOptions<any>;
    /**
     * Configuration settings for data import and export.
     */
    importExportOptions?: ImportExportOptions;
    /**
     * Custom Express middleware for the server.
     */
    middleware?: Array<{ handler: RequestHandler; route: string }>;
    /**
     * An array of plugins.
     */
    plugins?: VendurePlugin[];
}
